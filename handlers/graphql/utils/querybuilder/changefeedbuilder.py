import copy
from collections import OrderedDict
from dataclasses import dataclass
from typing import Dict, Mapping, Any, Set, List, Tuple
from deepdictiterator import deep_iterator
from graphql import ResolveInfo
from functools import reduce
from handlers.graphql.utils.querybuilder.get_fields import get_fields
from handlers.graphql.utils.querybuilder.subscriptionwaiter import SubscriptionWaiter, QueueItem
from xenadapter.xenobject import XenObject
import asyncio

@dataclass
class Value:
    data: Any

@dataclass
class DependencyNode:
    parent : Any
    id : str
    path : tuple
    value : Value
    children : Dict[str, List[Any]] #key - dep name, value - DependencyNode list (not any)




def deep_get(dictionary : dict, keys):
    def reducer(object, key):
        if isinstance(object, dict):
            return object.get(key)
        elif isinstance(object, list):
            return [reducer(item, key) for item in object]
        elif object is None:
            return None
        else:
            raise ValueError(object)

    return reduce(reducer, keys, dictionary)

def deep_set(dictionary : dict, key, value):
    if not key:
        dictionary.clear()
        dictionary.update(value)
        return
    key_list = list(key)
    while True:
        current_key = key_list.pop(0)
        if  key_list:
            if current_key not in dictionary:
                dictionary[current_key] = {}
        else:
            dictionary[current_key] = value
            break
        dictionary = dictionary[current_key]


class ChangefeedBuilder:
    def __init__(self, info : ResolveInfo, main_id=None):
        self.root_nodes = Dict[str, DependencyNode]

        self.tasks : Dict[str, asyncio.Task] = {}
        self.entries : OrderedDict[tuple, bool] = OrderedDict()
        self.current_values : Dict[str, Value] = {}
        self.queue = asyncio.Queue()
        self.current_value = {}
        self.old_value = {}
        self.current_change_type = None
        self.fields = get_fields(info)
        self.dependencies = set() # Objects that are not loaded yet
        xentype : XenObject = self.fields.get('_xenobject_type_')
        is_list = self.fields.get('_list_')
        if not xentype:
            raise TypeError("_xenobject_type_ is not present in fields")

        self.main_waiter = SubscriptionWaiter(xentype.db_table_name, self.fields.keys(), main_id, self.queue, ())
        self.populate_entries(self.fields, ())



    def populate_entries(self, fields, path):
        '''
        The key set determines path that have subqueries attached.
        :param fields:
        :param path:
        :return:
        '''
        if fields['_xenobject_type_']:
            self.entries[path] = fields['_list_']
            for field in sorted(fields):
                if field in ('_list_', '_xenobject_type_'):
                    continue
                new_path = (*path, field)
                self.populate_entries(fields[field], new_path)


    def add_worker(self, id, dependency_type):
        if not id in self.tasks:
            self.tasks[id] = asyncio.create_task(
                        SubscriptionWaiter(dependency_type.db_table_name, None,
                                           id, self.queue, None).wait_for_changes())




    def add_dependency(self, path, name,  depended_id, dependency_id, dependency_type):
        visit_queue = list(self.root_nodes)
        visit_depth_queue = list(path)
        while visit_queue:
            node : DependencyNode = visit_queue.pop(0)
            if node.path == path and node.id == depended_id:
                my_path = (*path, name)
                self.add_worker(dependency_id, dependency_type)
                node.children[name].append(DependencyNode(
                    parent=node,  id=dependency_id, path=my_path, children={}))
                break
            if visit_depth_queue: # Depth's not enough
                next_name = visit_depth_queue.pop(0)
                visit_queue.extend(node.children[next_name])






    def remove_dependency(self, path, name,  depended_id, dependency_id):
        pass

    def update(self, path, new_val):
        '''
        Update current data; recreate subtasks if needed.
        :param path:
        :param new_val:
        :return:
        '''
        id = new_val['ref']
        update_fields = dict(deep_get(self.fields,  path))
        xen_type = update_fields.pop("_xenobject_type_")
        is_list = update_fields.pop("_list_")


        # iterate through update_fields
        if update_fields:
            old_val = self.current_values.get(id, None)
            for k, v in update_fields.items():
                full_k = (*path, k)
                if full_k == path:
                    continue # we know we need to update us

                if not (isinstance(v, Mapping) and v['_xenobject_type_']): # No subqueries here
                    continue

                # Compare new and previous value at key
                new_val_k = deep_get(new_val, (k,))
                old_val_k = deep_get(old_val.data, (k, ))
                need_update = False
                if v['_list_']:
                    new_val_k = set(new_val_k)
                    old_val_k = set() if not old_val_k else set(old_val_k)
                    to_add = new_val_k.difference(old_val_k)
                    to_remove = old_val_k.difference(new_val_k)
                    print(f"add  {v['_xenobject_type_']} dependency {to_add}")
                    for item in to_add:
                        self.add_dependency(path, k,  id,  item)
                    for item in to_remove:
                        self.remove_dependency(path, k,  id, item)



                else:
                    if new_val_k != old_val_k:
                        need_update = True
                        self.add_dependency(path, id, item)
                        print(f"add  {v['_xenobject_type_']} dependency {new_val_k}")
                        if old_val_k in self.dependencies:
                            self.remove_dependency(path, id, item)



                self.cancel_task(full_k)
                fields = list(filter(lambda key: key not in ('_xenobject_type_', '_list_'), v))

                self.tasks[] = asyncio.create_task(
                        SubscriptionWaiter(v['_xenobject_type_'].db_table_name, fields,
                                           new_val_k, self.queue, full_k).wait_for_changes())
        if is_list:
            if path not in self.current_values:
                self.current_values[path] = {}
            self.current_values[path][new_val['ref']] = new_val
        else:
            self.current_values[path] = new_val

        if path != ():
            print(f"remove {new_val['ref']}")
            self.dependencies.remove(new_val['ref'])



    def cancel_task(self, path):
        '''
        Invalidate task's value and cancel it
        :param path:
        :return:
        '''
        if path in self.current_values:
            del self.current_values[path]
        if path in self.tasks:
            self.tasks[path].cancel()


    async def yield_values(self):
        main_task = asyncio.create_task(self.main_waiter.wait_for_changes())
        while True:
            try:
                item : QueueItem = await self.queue.get()
                if item.path == ():
                    self.current_change_type = item.data['type']
                else:
                    self.current_change_type = 'change'

                if self.current_change_type == 'remove':
                    yield {
                        "type": self.current_change_type,
                        "old_val": self.old_value
                    }
                    continue
                elif self.current_change_type == 'initial': # initialize
                    for task in self.tasks.values():
                        task.cancel()
                    self.tasks = {}

                self.update(item.path, item.data['new_val'])
                if self.dependencies:
                    print(f"Incomplete object received, waiting for the rest: {self.dependencies}")
                    continue

                # Iterate through self.current_values and create a dictionary out of it

                for key, is_list in self.entries.items():
                    if is_list: # Those are contained in a key-value store with key being the ref.
                        deep_set(self.current_value, key, self.current_values[key].values())
                    else: # Those are contained as is.
                        deep_set(self.current_value, key, self.current_values[key])

                if self.current_change_type == 'initial':
                    yield {
                        "type": "initial",
                        "new_val": self.current_value
                    }
                else:
                    yield {
                        "type" : self.current_change_type,
                        "old_val" : self.old_value,
                        "new_val" : self.current_value
                    }
                self.old_value = copy.deepcopy(self.current_value)
            except asyncio.CancelledError:
                return




















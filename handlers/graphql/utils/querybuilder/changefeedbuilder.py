import copy
from collections import OrderedDict, Collection
from dataclasses import dataclass
from typing import Dict, Mapping, Any, Set, List, Tuple, Optional, Union
from graphql import ResolveInfo
from functools import reduce

from connman import ReDBConnection
from handlers.graphql.utils.querybuilder.get_fields import get_fields
import asyncio
import  constants.re as re
import jsonpath_rw
from jsonpath_rw import Fields, Slice



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
    '''
    Build a sophisticated changefeed and put its results in asyncio.Queue
    It works by traversing GraphQL ResolveInfo AST and finding out dependencies of
    sophisticated GraphQL query ("ref" fields).
    It then queries RethinkDB, finds the values of "ref" fields found out in previous step and waits for
    one of DB objects represented by these values to change. If something changes, it reruns the query.

    '''
    def __init__(self, id : Optional[Union[str, Collection]], info : ResolveInfo, queue: asyncio.Queue = None,  status="initial"):
        '''

        :param queue: Queue to put results into. If None, yield_values acts as generator
        :param id:  Object ID (ref) to query. If many, query many objects. If None, query ALL objects. NB: Don't subscribe to ALL objects as all we want is to send one object at a time
        :param info:  GraphQL ResolveInfo field
        :param status: status of 1st change to be put in query: one of ("initial", "add")
        NB: DO NOT SUBSCRIBE WITH id=None!!! Subscription needs to send one update at a time, i.e. not a list.
         Use a queue parameter instead. Create many ChangefeedBuilder objects that put updates into same queue.
         Using id=None with run_query only is fine.
        '''
        self.fields = get_fields(info)
        self.id = id
        self.status = status
        self.paths = {} # Key - JSONPath expression, value - database table name. Contains dependent paths
        self.queue = queue
        self.query = self.build_query()

    def build_query(self):

        query = [f"re.db.table('{self.fields['_xenobject_type_'].db_table_name}')"]
        if isinstance(self.id, str):
            query.append(f".get('{self.id}')")
        elif isinstance(self.id, Collection):
            query.append(".get_all(")
            query.append(','.join((f"'{item}'" for item in self.id)))


        def add_fields(fields, prefix=""):
            '''
            Populates self.paths - JSONPath expressions for gathering dependent refs
            and nonlocal query variable to  ReQL query string for this subscription

            :param fields: subdict of self.fields to be processed
            :param prefix: JSONPath of these fields
            '''
            nonlocal query

            self.paths[prefix + 'ref'] = fields['_xenobject_type_']
            _fields = [field for field in fields if field not in ('_xenobject_type_', '_list_')]
            if 'ref' not in _fields:
                _fields.append('ref')
            #query.append(".pluck(")
            #query.append(",".join((f"'{item}'" for item in _fields)))
            #query.append(")")
            for item in _fields:
                if item == 'ref':
                    continue
                xentype = fields[item]['_xenobject_type_']
                if xentype:
                    new_prefix = ''.join((prefix, item))

                    if fields[item]['_list_']:
                        query.append(f".merge(lambda value: {{'{item}': re.db.table('{xentype.db_table_name}')" \
                          f".get_all(re.r.args(value['{item}'])).coerce_to('array')")
                        add_fields(fields[item], prefix=''.join((new_prefix, "[*].")))
                        query.append("})")
                    else:
                        query.append(f".merge(lambda value: {{'{item}': re.db.table('{xentype.db_table_name}')" \
                            f".get(value['{item}'])")
                        add_fields(fields[item], prefix=''.join((new_prefix, '.')))
                        query.append("})")

        add_fields(self.fields)
        query = ''.join(query)
        return eval(query)

    def run_query(self, connection=None):
        if isinstance(self.id, str):
            query = self.query
        else:
            query = self.query.coerce_to('array')

        if connection:
            return query.run(connection)

        return query.run()



    async def yield_values(self):
        '''
        Asynchronous iterable yielding value based on changes of that query
        :return: if self.queue is None, it yields values itself, performing as async generator.
        Else it puts changes into self.queue
        '''
        while True:
            try:
                async with ReDBConnection().get_async_connection() as conn:
                    value = await  self.query.run(conn)
                    if not value:
                        item  = {
                            "type": "remove",
                            "old_val": { "ref" : self.id}
                            }

                        if self.queue:
                            await self.queue.put(item)
                        else:
                            yield item
                        return
                    else:
                        item = {
                            "type": self.status,
                            "new_val": value
                        }
                        if self.queue:
                            await self.queue.put(item)
                        else:
                            yield item

                    # Find out all dependent refs
                    waiter_query_info = [(xenobject.db_table_name, [match.value  for match in
                                                                    jsonpath_rw.parse(path).find(value)]
                                          )
                                         for path, xenobject in self.paths.items()]
                    # Create a waiter query
                    waiter_query = re.db.table(waiter_query_info[0][0]).get_all(*waiter_query_info[0][1])
                    i = 1
                    while i < len(waiter_query_info):
                        waiter_query = waiter_query.union(re.db.table(waiter_query[i][0]).get_all(*waiter_query_info[i][1]))

                    cursor = await waiter_query.changes().run()
                    # await waiter
                    await cursor.next()
                    # Awaited, run main query again
                    self.status = "change"
            except asyncio.CancelledError:
                return





















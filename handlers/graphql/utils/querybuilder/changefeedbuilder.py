import copy
from collections import OrderedDict
from dataclasses import dataclass
from typing import Dict, Mapping, Any, Set, List, Tuple
from graphql import ResolveInfo
from functools import reduce
from handlers.graphql.utils.querybuilder.get_fields import get_fields
from handlers.graphql.utils.querybuilder.subscriptionwaiter import SubscriptionWaiter, QueueItem
from xenadapter.xenobject import XenObject
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
    def __init__(self, id : str, info : ResolveInfo, status="initial"):
        self.fields = get_fields(info)
        self.id = id
        self.build_query()
        self.status = status
        self.paths = {} # Key - JSONPath expression, value - database table name. Contains dependent paths

    def build_query(self):
        query = f"re.db.table({self.fields['_xenobject_type_'].db_table_name}).get({self.id})"


        def add_fields(fields, prefix=None):
            '''
            Populates self.paths - JSONPath expressions for gathering dependent refs
            and nonlocal query variable to  ReQL query string for this subscription

            :param fields: subdict of self.fields to be processed
            :param prefix: JSONPath of these fields
            '''
            nonlocal query

            self.paths[prefix.child(Fields('ref')) if prefix else Fields('ref')] = fields['_xenobject_type_'].db_table_name
            _fields = [field for field in fields if field not in ('_xenobject_type_', '_list_')]
            if 'ref' not in _fields:
                _fields.append('ref')
            query += f".pluck({','.join(_fields)})"
            for item in _fields:
                xentype = fields[item]['_xenobject_type_']
                if xentype:
                    if not prefix:
                        prefix = Fields(item)
                    else:
                        prefix = prefix.child(Fields(item))


                    if fields[item]['_list_']:
                        query  += f".merge(lambda value: {{'{item}': re.db.table('{xentype.db_table_name}')" \
                            f".get_all(re.r.args(value['{item}']))"

                        add_fields(fields[item], prefix=prefix.child(Slice("*")))
                        query += ".coerce_to('array')})"
                    else:
                        query += f".merge(lambda value: {{'{item}': re.db.table('{xentype.db_table_name}')" \
                            f".get(value['{item}'])"
                        add_fields(fields[item], prefix=prefix)
                        query += "})"

        add_fields(self.fields)
        self.query = eval(query)


    async def yield_values(self):
        '''
        Asynchronous iterable yielding value based on changes of that query
        :return:
        '''
        while True:
            try:
                value = self.query.run()
                if not value:
                    yield {
                        "type": "remove",
                        "old_val": { "ref" : self.id}
                    }
                    return
                else:
                    yield {
                        "type": self.status,
                        "new_val": {
                            value
                        }
                    }

                # Find out all dependent refs

                # Create a waiter query

                # await waiter

                # Awaited, run main query again
                self.status = "change"
            except asyncio.CancelledError:
                return




















from collections import OrderedDict, Collection
from typing import Dict, Mapping, Any, Set, List, Tuple, Optional, Union
from graphql import ResolveInfo
from functools import reduce

from rethinkdb.errors import ReqlNonExistenceError

from connman import ReDBConnection
import asyncio
import  constants.re as re
import jsonpath_rw


from handlers.graphql.utils.querybuilder.querybuilder import QueryBuilder


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
    def __init__(self, id : Optional[Union[str, Collection]], info : ResolveInfo, queue: asyncio.Queue = None,  status="initial", additional_string = None, select_subfield=None):
        '''

        :param queue: Queue to put results into. If None, yield_values acts as generator
        :param id:  Object ID (ref) to query. If many, query many objects. If None, query ALL objects. NB: Don't subscribe to ALL objects as all we want is to send one object at a time
        :param info:  GraphQL ResolveInfo field
        :param status: status of 1st change to be put in query: one of ("initial", "add")
        NB: DO NOT SUBSCRIBE WITH id=None!!! Subscription needs to send one update at a time, i.e. not a list.
         Use a queue parameter instead. Create many ChangefeedBuilder objects that put updates into same queue.
         :param additional_string Add string to query. This may be used to support filtering, etc. NB: Don't use with subscriptions.
         :param select_subfield. A list representing path to subfield that is supposed to be analyzed in info
        '''
        self.queue = queue
        self.builder = QueryBuilder(id, info, info.context.user_authenticator, additional_string, select_subfield)
        self.status = status

    def __repr__(self):
        f"ChangefeedBuilder: {self.builder}, status: {self.status}{', with Queue' if self.queue else ''}"
    async def yield_values(self):
        '''
        Asynchronous iterable yielding value based on changes of that query
        :return:
        '''
        while True:
            try:
                async with ReDBConnection().get_async_connection() as conn:
                    try:
                        value = await self.builder.run_query(conn)
                    except ReqlNonExistenceError as e:
                        value = None
                    if not value:
                        item  = {
                            "type": "remove",
                            "old_val": { "ref" : self.builder.id}
                            }
                        yield item
                        return
                    else:
                        item = {
                            "type": self.status,
                            "new_val": value
                        }
                        yield item

                    # Find out all dependent refs
                    deleted = await self.wait_for_change(conn, value)
                    if deleted:
                        yield deleted
                        if isinstance(self.builder.id, str):
                            return

            except asyncio.CancelledError:
                return

    async def put_values_in_queue(self):
        '''
        Just like yield_values, but for self.queue
        :return:
        '''
        while True:
            try:
                async with ReDBConnection().get_async_connection() as conn:
                    value = await self.builder.query.run(conn)
                    if not value:
                        item  = {
                            "type": "remove",
                            "old_val": { "ref" : self.builder.id}
                            }
                        await self.queue.put(item)
                        return
                    else:
                        item = {
                            "type": self.status,
                            "new_val": value
                        }
                        await self.queue.put(item)

                    # Find out all dependent refs
                    deleted = await self.wait_for_change(conn, value)
                    if deleted:
                        await self.queue.put(deleted)
                        if isinstance(self.builder.id, str):
                            return
            except asyncio.CancelledError:
                return

    async def wait_for_change(self, conn, value):
        waiter_query_info = [(xenobject.db_table_name, [match.value for match in
                                                        jsonpath_rw.parse(path).find(value)]
                              )
                             for path, xenobject in self.builder.paths.items()]
        # Create a waiter query
        waiter_query = re.db.table(waiter_query_info[0][0]).get_all(*waiter_query_info[0][1])
        i = 1
        while i < len(waiter_query_info):
            waiter_query = waiter_query.union(re.db.table(waiter_query_info[i][0]).get_all(*waiter_query_info[i][1]))
            i += 1
        cursor = await waiter_query.changes(include_types=True).run(conn)
        # await waiter
        try:
            change = await cursor.next()
        except ReqlNonExistenceError:  # Report removal if it has already been deleted
            old_ref = self.builder.id[0] if isinstance(self.builder.id, Collection) else self.builder.id
            return {
                "type" : "remove",
                "old_val" : { "ref" : old_ref }
            }

        # Awaited, run main query again
        if change['type'] == 'remove':
            old_ref = change['old_val']['ref']
            if isinstance(self.builder.id, Collection) and old_ref in self.builder.id:
                self.builder.id = list(filter(lambda item: item != old_ref, self.builder.id))
            return {
                            "type": "remove",
                            "old_val": { "ref" : old_ref}
            }

        self.status = "change"

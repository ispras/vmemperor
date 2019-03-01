import asyncio
from collections import Collection
from dataclasses import dataclass
from typing import Mapping

from asn1crypto.core import Any
from rethinkdb.errors import ReqlTimeoutError

import constants.re as re
from connman import ReDBConnection


@dataclass
class QueueItem:
    data: Mapping
    path: Collection

class SubscriptionWaiter:
    def __init__(self, table, fields, ids, queue : asyncio.Queue, path : Collection):
        '''
        This class pushes updates from its query to specified asyncio queue.
        if path is falsy, i.e. none or empty tuple then  return whole changefeed (i.e. with value and type)
        if path is truthy then it's a subquery: return value

        :param table:
        :param fields:
        :param ids:
        :param queue:
        :param path:
        '''
        self.table = table
        self.fields = fields
        self.ids = ids
        self.need_restart = True
        self.queue : asyncio.Queue = queue
        self.path = path
        self.initial = True
        self.data_ready = False

    def build_query(self):
        query = re.db.table(self.table)
        if self.ids is not None:
            if isinstance(self.ids, str):
                query = query.get_all(self.ids)
            elif isinstance(self.ids, Collection):
                query = query.get_all(*self.ids)
            else:
                raise TypeError(self.ids)

        if self.fields:
            if not 'ref' in self.fields:
                query = query.pluck(*self.fields, 'ref')
            query = query.pluck(*self.fields)

        query = query.changes(include_types=True, include_initial=self.initial)
        return query

    #def build_result(self, return_value):
    #    if not self.path:
    #        return QueueItem(data=return_value, path=self.path)

    #    if return_value['type'] == 'remove':
    #        return None
    #    value = return_value['new_val']
    #    path = list(self.path)

    #    result = {}
    #    current_result = result
    #    while True:
    #       element = path.pop()
    #        if not path:
    #            current_result[element] = value
    #            return QueueItem(data )
    #        else:
    #            current_result[element] = {}

    #       current_result = current_result[element]


    async def wait_for_changes(self):
        from rethinkdb import RethinkDB
        r = RethinkDB()
        r.set_loop_type("asyncio")
        async with ReDBConnection().get_async_connection() as conn:
            query = self.build_query()
            changes = await query.run(conn)
            while True:
                self.need_restart = False
                try:
                    change = await changes.next()
                except asyncio.CancelledError:
                    return

                self.data_ready = True
                if self.need_restart:
                    break
                if not change:
                    break
                await self.queue.put(QueueItem(data=change, path=self.path))













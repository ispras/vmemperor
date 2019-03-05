import asyncio
from typing import Dict

import graphene
from graphene import ObjectType
from graphql import ResolveInfo
from rethinkdb import RethinkDB
from rx import Observable
from enum import Enum
import constants.re as re
from connman import ReDBConnection
from handlers.graphql.utils.querybuilder.changefeedbuilder import ChangefeedBuilder
from handlers.graphql.utils.querybuilder.get_fields import get_fields


class Change(graphene.Enum):
    Initial = 'initial'
    Add = 'add'
    Remove = 'remove'
    Change = 'change'


def str_to_changetype(s: str) -> Change:
    if s == 'initial':
        return Change.Initial
    elif s == 'add':
        return Change.Add
    elif s == 'remove':
        return Change.Remove
    elif s == 'change':
        return Change.Change
    else:
        raise ValueError(f"No such ChangeType: {s}")


async def create_single_changefeeds(queue: asyncio.Queue, info: ResolveInfo, table_name : str, additional_string: str = None):
     async with ReDBConnection().get_async_connection() as conn:
        tasks : Dict[str, asyncio.Task] = {}
        try:
            table = re.db.table(table_name)
            changes = await table.pluck('ref').changes(include_types=True, include_initial=True).run(conn)
            while True:
                change = await changes.next()
                if not change:
                    break
                if change['type'] == 'remove':
                    value = change['old_val']
                    task = tasks.pop(value['ref'])
                    if not task.done():
                        task.cancel()


                elif change['type'] == 'change':
                    print(f"Ref change?: {change}")
                    continue
                else:
                    value = change['new_val']
                    builder = ChangefeedBuilder(id=value['ref'],
                                                info=info,
                                                queue=queue,
                                                additional_string=additional_string,
                                                select_subfield=['value']) # { value : {...} <-- this is what we need in info

                    tasks[value['ref']] = asyncio.create_task(builder.put_values_in_queue())

        except asyncio.CancelledError:
            for task  in tasks.values():
                task.cancel()
            return
        except Exception as e:
            import sentry_sdk
            sentry_sdk.capture_exception(e)
            return


def MakeSubscriptionWithChangeType(_class : type) -> type:
    return type(f'{_class.__name__}sSubscription',
                (ObjectType, ),
                {
                    'change_type': graphene.Field(Change, required=True, description="Change type"),
                    'value': graphene.Field(_class, required=True)
                })

def MakeSubscription(_class : type) -> type:
    '''
    Creates a subscription type for resolve_item_by_pkey
    This is suitable when one wants to subscribe to changes for one particular item
    :param _class:
    :return:
    '''
    #return type(f'{_class.__name__}Subscription',
    #            (ObjectType, ),
    #            {
    #                _class.__name__: graphene.Field(_class)
    #            })
    return _class


def resolve_item_by_key(item_class: type,  table_name : str, key_name:str = 'ref'):
    """
    Returns an asynchronous function that resolves every change in RethinkDB table with item with said primary key
    If item is deleted or does not exist, returns null in place of an item
    :param item_class: A GraphQL object type that has the same shape as  a table
    :param table: a RethinkDB table to retrieve updates from
    :return: function that returns Observable. Works with asyncio
    """
    def resolve_item(root, info, **args) -> Observable:
        '''
        Create a field with MakeSubscription(type)
        :param root:
        :param info:
        :param args:
        :return:
        '''
        async def iterable_to_item():
            key = args.get(key_name, None)
            if not key:
                yield None
                return
            builder = ChangefeedBuilder(key, info)

            async for change in builder.yield_values():
                if not change:
                    break
                if change['type'] == 'remove' or change['new_val'] is None:
                    yield None
                    continue
                else:
                    value = change['new_val']

                yield value

        return Observable.from_future(iterable_to_item())
    return resolve_item


def resolve_all_items_changes(item_class: type,   table_name : str):
    """
    Returns an asynchronous function that resolves every change in RethinkDB table

    :param item_class:  GraphQL object type that has same shape as a table
    :param table: RethinkDB table
    :return:
    """
    def resolve_items(root, info) -> Observable:
        '''
        Returns subscription updates with the following shape:
        {
         changeType: one of Initial, Add, Mod, Remove
         value: of type item_class
        }
        Create a field with MakeSubscriptionWithChangeType(type)
        :param info:
        :return:
        '''

        async def iterable_to_items():
            queue = asyncio.Queue()
            creator_task = asyncio.create_task(create_single_changefeeds(queue, info, table_name))
            try:
                while True:
                    change = await queue.get()
                    if change['type'] == 'remove':
                        value = change['old_val']
                    else:
                        value = change['new_val']
                    yield MakeSubscriptionWithChangeType(item_class)(change_type=str_to_changetype(change['type']),
                                                                     value=value)
            except asyncio.CancelledError:
                creator_task.cancel()
                return

        return Observable.from_future(iterable_to_items())
    return resolve_items

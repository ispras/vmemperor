import asyncio
from dataclasses import dataclass
from typing import Dict, Type

import graphene
from graphene import ObjectType
from graphene.types.resolver import dict_resolver
from graphql import ResolveInfo
from rethinkdb import RethinkDB
from rethinkdb.errors import ReqlOpFailedError
from rx import Observable
from enum import Enum
import constants.re as re
from authentication import BasicAuthenticator
from connman import ReDBConnection
from handlers.graphql.types.deleted import Deleted
from handlers.graphql.utils.querybuilder.changefeedbuilder import ChangefeedBuilder
from handlers.graphql.utils.querybuilder.get_fields import get_fields
from xenadapter.xenobject import XenObject
from xenadapter.aclxenobject import ACLXenObject


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


@dataclass
class TaskCounter:
    task : asyncio.Task
    count = 1


async def create_single_changefeeds(queue: asyncio.Queue, info: ResolveInfo, user_authenticator : BasicAuthenticator, xenobject_type: Type[XenObject], additional_string: str = None):
     async with ReDBConnection().get_async_connection() as conn:
        tasks: Dict[str, TaskCounter] = {}

        try:
            if not user_authenticator or user_authenticator.is_admin() or not issubclass(xenobject_type, ACLXenObject):
                table = re.db.table(xenobject_type.db_table_name)
            else:
                table = re.db.table(f'{xenobject_type.db_table_name}_user')

            changes = await table.pluck('ref').changes(include_types=True, include_initial=True).run(conn)
            while True:
                try:
                    change = await changes.next()
                except ReqlOpFailedError:
                    return
                if not change:
                    break
                if change['type'] == 'remove':
                    value = change['old_val']
                    task_counter = tasks[value['ref']]
                    task_counter.count -= 1
                    if task_counter.count == 0:
                        if not task_counter.task.done():
                            task_counter.task.cancel()
                        await queue.put({
                            'type': 'remove',
                            'old_val':
                                {
                                    'ref' : value['ref']
                                }
                        })
                        del tasks[value['ref']]


                elif change['type'] == 'change':
                    print(f"Ref change?: {change}")
                    continue
                else:
                    value = change['new_val']
                    builder = ChangefeedBuilder(id=value['ref'],
                                                info=info,
                                                queue=queue,
                                                additional_string=additional_string,
                                                select_subfield=['value'],  # { value : {...} <-- this is what we need in info
                                                status=change['type'])
                    if not value['ref'] in tasks:
                        tasks[value['ref']] = TaskCounter(task=asyncio.create_task(builder.put_values_in_queue()))
                    else:
                        tasks[value['ref']].count += 1



        except asyncio.CancelledError:
            for task_counter in tasks.values():
                task_counter.task.cancel()
            return
        except Exception as e:
            import sentry_sdk
            sentry_sdk.capture_exception(e)
            return


def MakeSubscriptionWithChangeType(_class : type) -> type:
    """
    Create a subscription type with change tracking. If an object is deleted and it's a XenObject, only its ref is returned
    :param _class: GraphQL type to track changes on
    :return: GraphQL Union type: _class OR Deleted
    """
    class Meta:
        types = (_class, Deleted, )


    change_type = type(f'{_class.__name__}OrDeleted', (graphene.Union, ), {
                        "Meta": Meta,
                    })
    class Meta:
        default_resolver = dict_resolver
    return type(f'{_class.__name__}sSubscription',
                (ObjectType, ),
                {
                    'change_type': graphene.Field(Change, required=True, description="Change type"),
                    'value': graphene.Field(change_type, required=True),
                    'Meta': Meta
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


def resolve_xen_item_by_key(key_name:str = 'ref'):
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


def resolve_all_xen_items_changes(item_class: type):
    """
    Returns an asynchronous function that resolves every change in RethinkDB table

    :param item_class:  GraphQL object type that has same shape as a table
    :param table: RethinkDB table
    :param with_user_table: This table has corresponding user table and user should get only its own objects
    :return:
    """
    def resolve_items(root, info : ResolveInfo) -> Observable:
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
            fields_for_return_type = get_fields(info, ['value'])
            xenobject_type = fields_for_return_type['_xenobject_type_']
            queue = asyncio.Queue()
            authenticator = info.context.user_authenticator
            creator_task = asyncio.create_task(create_single_changefeeds(queue, info, authenticator, xenobject_type))
            try:
                while True:
                    change = await queue.get()
                    if change['type'] == 'remove':
                        value = change['old_val']
                        value['__typename'] = 'Deleted'
                    else:
                        value = change['new_val']
                        value['__typename'] = item_class.__name__
                    yield dict(change_type=str_to_changetype(change['type']),
                               value=value)
            except asyncio.CancelledError:
                creator_task.cancel()
                return

        return Observable.from_future(iterable_to_items())
    return resolve_items

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
            async with ReDBConnection().get_async_connection() as conn:
                key = args.get(key_name, None)
                if not key:
                    yield None
                    return
                table = re.db.table(table_name)
                changes = await table.get_all(key) \
                                     .pluck(*item_class._meta.fields)\
                                     .changes(include_types=True, include_initial=True).run(conn)
                while True:
                    change = await changes.next()
                    if not change:
                        break
                    if change['type'] == 'remove' or change['new_val'] is None:
                        yield None
                        continue
                    else:
                        value = change['new_val']

                    yield item_class(**value)

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
            async with ReDBConnection().get_async_connection() as conn:
                table = re.db.table(table_name)
                changes = await table.pluck(*item_class._meta.fields.keys()).changes(include_types=True, include_initial=True).run(conn)
                while True:
                    change = await changes.next()
                    if not change:
                        break
                    if change['type'] == 'remove':
                        value = change['old_val']
                    else:
                        value = change['new_val']

                    value = item_class(**value)
                    yield MakeSubscriptionWithChangeType(item_class)(change_type=str_to_changetype(change['type']),
                                                                     value=value)

        return Observable.from_future(iterable_to_items())
    return resolve_items

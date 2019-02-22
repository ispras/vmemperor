import graphene
from graphene import ObjectType
from rethinkdb import RethinkDB
from rx import Observable
from enum import Enum
import constants.re as re
from connman import ReDBConnection


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

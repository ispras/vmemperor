from functools import reduce

from graphql import ResolveInfo

from authentication import with_default_authentication
from constants import re as re
from handlers.graphql.graphql_handler import ContextProtocol
from handlers.graphql.types.objecttype import ObjectType
from handlers.graphql.utils.paging import do_paging
from handlers.graphql.utils.querybuilder.get_fields import underscore
from handlers.graphql.utils.querybuilder.querybuilder import QueryBuilder
from handlers.graphql.utils.type import get_xentype, check_access_of_return_value


def resolve_table(graphql_type : ObjectType, table_name : str):

    @with_default_authentication
    def resolver(root, info, *args, **kwargs):
        '''

        :param root:
        :param info:
        :param kwargs: Optional keyword arguments for pagination: "page" and "page_size"

        :return:
        '''

        query = re.db.table(table_name).coerce_to('array')

        if 'page' in kwargs:
            if 'page_size' in kwargs:
                query = do_paging(query, kwargs['page'], kwargs['page_size'])
            else:
                query = do_paging(query, kwargs['page'])

        records = query.run()
        return records

    return resolver


def resolve_from_root(root, info : ResolveInfo, **kwargs):
    if not info.field_name:
        raise ValueError("Cannot find field_name")

    def reducer(object, key):
        key = underscore(key)  # our JS-optimized api is camelCase while python api is under_score
        if isinstance(object, dict):
            return object.get(key)
        elif isinstance(object, list):
            return [reducer(item, key) for item in object]
        elif object is None:
            return None
        else:
            raise ValueError(object)

    return reduce(reducer, [info.field_name], root)


def resolve_one():
    '''
    Use this method to resolve one XenObject that appears in tables as its uuid under its name
    :param field_name: root's field name to use (by default - this class' name)
    :return resolver for one object that either gets one named argument ref or
    gets ref from root's field named after XenObject class, e.g. for VM it will be
    root.VM
    :param index - table's index to use. OVERRIDE WITH CARE, internally we use refs as links between docs, so to use with linked field, call
    resolve_one(index='ref'). Default is resolving via uuid, as uuid is a primary key there
    :sa handlers/graphql/resolvers directory - they use index='ref' and load object classes in them to avoid circular dependencies
    '''



    from handlers.graphql.resolvers import with_connection

    @with_connection
    @with_default_authentication
    def resolver(root, info : ResolveInfo, **kwargs):
        type : "XenObject"  = get_xentype(info.return_type)
        ctx : ContextProtocol = info.context
        if not root:
            builder = QueryBuilder(id=kwargs['ref'], info=info)
            ret = builder.run_query()
        else:
            ret = resolve_from_root(root, info, **kwargs)

        return check_access_of_return_value(ctx, ret, type)

    return resolver



def resolve_many():
    '''
       Use this method to many one XenObject that appears in tables as their  uuids under its name
       :param cls: XenObject class
       :param graphql_type: graphene type
       :return resolver for many object that either gets one named argument uuids with list of uuids or
       gets uuids from root's field named after XenObject class in plural form , e.g. for VM it will be
       root.VMs

       If user does not have access for one of these objects, returns None in its place
       '''

    from handlers.graphql.resolvers import with_connection
    @with_connection
    @with_default_authentication
    def resolver(root, info, **kwargs):
        type : "XenObject"  = get_xentype(info.return_type)
        ctx : ContextProtocol = info.context
        if not 'refs' in kwargs:
            ret = resolve_from_root(root, info, **kwargs)
        else:
            refs = kwargs['refs']
            builder = QueryBuilder(id=refs, info=info)
            ret = builder.run_query()

        return [check_access_of_return_value(ctx, item, type) for item in ret]

    return resolver

def resolve_all():
    '''
    Resolves all objects belonging to a user
    :param cls:

    :return:
    '''
    from handlers.graphql.resolvers import with_connection

    @with_connection
    @with_default_authentication
    def resolver(root, info, **kwargs):
        '''

        :param root:
        :param info:
        :param kwargs: Optional keyword arguments for pagination: "page" and "page_size"

        :return:
        '''
        builder = QueryBuilder(id=None, user_authenticator=info.context.user_authenticator, info=info)
        return builder.run_query()

    return resolver

from functools import reduce

from graphql import ResolveInfo

from authentication import with_default_authentication
from constants import re as re
from handlers.graphql.types.objecttype import ObjectType
from handlers.graphql.utils.paging import do_paging
from handlers.graphql.utils.querybuilder.get_fields import underscore


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
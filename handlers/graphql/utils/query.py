from authentication import with_default_authentication
from constants import re as re
from handlers.graphql.types.objecttype import ObjectType
from handlers.graphql.utils.paging import do_paging


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
        return [graphql_type(**record) for record in records]

    return resolver
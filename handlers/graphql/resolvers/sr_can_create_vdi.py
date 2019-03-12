from authentication import with_default_authentication
from handlers.graphql.resolvers import with_connection
from handlers.graphql.utils.querybuilder.querybuilder import QueryBuilder


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
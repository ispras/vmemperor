from authentication import with_default_authentication
from handlers.graphql.utils.querybuilder.querybuilder import QueryBuilder


def resolve_tasks():
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
        :param kwargs:
        start_date: Start of date range when task was created
        end_date: End of date range when task was created
        :return:
        '''
        start_date = kwargs.get('start_date')
        end_date = kwargs.get('end_date')
        builder = QueryBuilder(id=None, user_authenticator=info.context.user_authenticator, info=info)
        # patch builder.query
        if start_date and end_date:
            builder.query = builder.query.filter(lambda item: start_date < item['created'] < end_date)
        elif start_date:
            builder.query = builder.query.filter(lambda item: start_date < item['created'])
        elif end_date:
            builder.query = builder.query.filter(lambda item: item['created'] < end_date)
        return builder.run_query()

    return resolver
import graphene

from handlers.graphql.resolvers.user import userType, resolve_user


class GAccessEntry(graphene.Interface):
    user_id = graphene.Field(userType, required=True, resolver=resolve_user(field_name='user_id'))

import graphene

from handlers.graphql.resolvers.user import resolve_user
from handlers.graphql.types.user import User


class GQuotaObject(graphene.Interface):
    main_owner = graphene.Field(User,
                                description="The user against whom the quotas for this object are calculated",
                                resolver=resolve_user("main_owner"))

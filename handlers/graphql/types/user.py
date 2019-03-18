import graphene

from handlers.graphql.types.objecttype import ObjectType



class User(ObjectType):
    id = graphene.Field(graphene.ID, required=True)
    name = graphene.Field(graphene.String, required=True)
    username = graphene.Field(graphene.String, required=True)

class CurrentUserInformation(ObjectType):
    is_admin = graphene.Field(graphene.Boolean, required=True)
    user = graphene.Field(User)
    groups = graphene.Field(graphene.List(User))


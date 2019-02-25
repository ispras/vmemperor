import graphene

from handlers.graphql.types.objecttype import ObjectType


class User(ObjectType):
    id = graphene.Field(graphene.ID, required=True)
    name = graphene.Field(graphene.String, required=True)
    username = graphene.Field(graphene.String, required=True)


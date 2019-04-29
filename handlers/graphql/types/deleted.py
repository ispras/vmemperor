import graphene

from handlers.graphql.types.base.gxenobjecttype import GXenObjectType


class Deleted(GXenObjectType):
    ref = graphene.Field(graphene.ID, required=True, description="Deleted object's ref")


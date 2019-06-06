import graphene

from handlers.graphql.interfaces.xenobject import GXenObject
from handlers.graphql.interfaces.accessentry import GAccessEntry


class GAclXenObject(GXenObject):
    access = graphene.List(GAccessEntry, required=True)
    is_owner = graphene.Field(graphene.Boolean, required=True)
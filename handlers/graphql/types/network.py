from enum import auto

import graphene
from serflag import SerFlag

from handlers.graphql.interfaces.xenobject import GAclXenObject
from handlers.graphql.resolvers.accessentry import resolve_accessentries
from handlers.graphql.types.accessentry import GAccessEntry
from handlers.graphql.types.gxenobjecttype import GXenObjectType
from handlers.graphql.types.objecttype import ObjectType
from handlers.graphql.types.vif import GVIF
from handlers.graphql.utils.query import resolve_many


class NetworkActions(SerFlag):
    attaching = auto()


GNetworkActions = graphene.Enum.from_enum(NetworkActions)

class GNetworkAccessEntry(ObjectType):
    class Meta:
        interfaces = (GAccessEntry, )

    actions = graphene.Field(GNetworkActions, required=True)

class GNetwork(GXenObjectType):
    class Meta:
        interfaces = (GAclXenObject,)

    access = graphene.Field(graphene.List(GNetworkAccessEntry), required=True,
                            resolver=resolve_accessentries(NetworkActions, GNetworkAccessEntry))
    my_actions = graphene.Field(graphene.List(GNetworkActions), required=True)

    VIFs = graphene.List(GVIF, resolver=resolve_many())
    other_config = graphene.JSONString()


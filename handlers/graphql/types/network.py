from enum import auto

import graphene
from serflag import SerFlag

from handlers.graphql.interfaces.xenobject import GAclXenObject
from handlers.graphql.resolvers.accessentry import resolve_accessentries
from handlers.graphql.resolvers.myactions import resolve_myactions, resolve_owner
from handlers.graphql.types.access import create_access_type
from handlers.graphql.types.accessentry import GAccessEntry
from handlers.graphql.types.gxenobjecttype import GXenObjectType
from handlers.graphql.types.objecttype import ObjectType
from handlers.graphql.types.vif import GVIF
from handlers.graphql.utils.query import resolve_many


class NetworkActions(SerFlag):
    rename = auto()
    attaching = auto()


GNetworkActions = graphene.Enum.from_enum(NetworkActions)
GNetworkAccessEntry = create_access_type("GNetworkAccessEntry", GNetworkActions)

class GNetwork(GXenObjectType):
    class Meta:
        interfaces = (GAclXenObject,)

    access = graphene.Field(graphene.List(GNetworkAccessEntry), required=True,
                            resolver=resolve_accessentries(NetworkActions))
    my_actions = graphene.Field(graphene.List(GNetworkActions), required=True, resolver=resolve_myactions(NetworkActions))
    is_owner = graphene.Field(graphene.Boolean, required=True, resolver=resolve_owner(NetworkActions))

    VIFs = graphene.List(GVIF, resolver=resolve_many())
    other_config = graphene.JSONString()


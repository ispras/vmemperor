import graphene

from handlers.graphql.interfaces.xenobject import GAclXenObject
from handlers.graphql.types.gxenobjecttype import GXenObjectType
from handlers.graphql.types.vif import GVIF
from handlers.graphql.utils.query import resolve_many
from xenadapter.vif import VIF


class GNetwork(GXenObjectType):
    class Meta:
        interfaces = (GAclXenObject,)

    VIFs = graphene.List(GVIF, resolver=resolve_many())
    other_config = graphene.JSONString()
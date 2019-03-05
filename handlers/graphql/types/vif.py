import graphene

from handlers.graphql.resolvers.network import networkType
from handlers.graphql.resolvers.vm import vmType
from handlers.graphql.types.gxenobjecttype import GXenObjectType
from xenadapter.xenobject import XenObject


class GVIF(GXenObjectType):
    ref = graphene.Field(graphene.ID, required=True,
                         description="Unique constant identifier/object reference (primary)")
    MAC = graphene.Field(graphene.ID, required=True, description="MAC address")
    VM = graphene.Field(vmType, resolver=XenObject.resolve_one())
    device = graphene.Field(graphene.ID, required=True, description="Device ID")
    currently_attached = graphene.Field(graphene.Boolean, required=True)
    ip = graphene.Field(graphene.String)
    ipv4 = graphene.Field(graphene.String)
    ipv6 = graphene.Field(graphene.String)
    network = graphene.Field(networkType, resolver=XenObject.resolve_one())
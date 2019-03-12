import graphene

from handlers.graphql.interfaces.xenobject import GXenObject
from handlers.graphql.resolvers.host import hostType
from handlers.graphql.resolvers.sr import srType
from handlers.graphql.types.gxenobjecttype import GXenObjectType
from handlers.graphql.utils.query import resolve_one


class GPool(GXenObjectType):
    class Meta:
        interfaces = (GXenObject,)
    master = graphene.Field(hostType, description="Pool master", resolver=resolve_one())
    default_SR = graphene.Field(srType, description="Default SR", resolver=resolve_one())
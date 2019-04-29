from enum import auto

import graphene
from serflag import SerFlag

from handlers.graphql.interfaces.aclxenobject import GAclXenObject
from handlers.graphql.resolvers.accessentry import resolve_accessentries
from handlers.graphql.resolvers.host import hostType
from handlers.graphql.resolvers.myactions import resolve_owner, resolve_myactions
from handlers.graphql.resolvers.sr import srType
from handlers.graphql.resolvers.user import userType, resolve_user
from handlers.graphql.types.access import create_access_type
from handlers.graphql.types.base.gxenobjecttype import GXenObjectType
from handlers.graphql.types.base.objecttype import ObjectType
from handlers.graphql.utils.query import resolve_one

class PoolActions(SerFlag):
    create_vm = auto()

GPoolActions = graphene.Enum.from_enum(PoolActions)
GPoolAccessEntry = create_access_type("GPoolAccessEntry", GPoolActions)

class Quota(ObjectType):
    memory = graphene.Float()
    vdi_size = graphene.Float()
    vcpu_count = graphene.Int()
    vm_count = graphene.Int()
    user= graphene.Field(userType, required=True, resolver=resolve_user(field_name='user_id'))




class GPool(GXenObjectType):
    class Meta:
        interfaces = (GAclXenObject,)

    access = graphene.Field(graphene.List(GPoolAccessEntry), required=True,
                            resolver=resolve_accessentries(PoolActions))
    my_actions = graphene.Field(graphene.List(GPoolActions), required=True, resolver=resolve_myactions(PoolActions))
    is_owner = graphene.Field(graphene.Boolean, required=True, resolver=resolve_owner(PoolActions))

    master = graphene.Field(hostType, description="Pool master", resolver=resolve_one())
    default_SR = graphene.Field(srType, description="Default SR", resolver=resolve_one())


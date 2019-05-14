import graphene

from handlers.graphql.interfaces.abstractvm import GAbstractVM
from handlers.graphql.interfaces.aclxenobject import GAclXenObject
from handlers.graphql.interfaces.quotaobject import GQuotaObject
from handlers.graphql.resolvers.myactions import resolve_owner
from handlers.graphql.resolvers.vm import vmType
from handlers.graphql.types.base.gxenobjecttype import GXenObjectType
from handlers.graphql.types.vbd import GVBD
from handlers.graphql.types.vif import GVIF
from handlers.graphql.types.base.vmbase import VMActions, GVMActions, GVMAccessEntry
from handlers.graphql.utils.query import resolve_many, resolve_one


class GVMSnapshot(GXenObjectType):
    class Meta:
        interfaces = (GAclXenObject, GAbstractVM, GQuotaObject)

    access = graphene.Field(graphene.List(GVMAccessEntry), required=True)
    my_actions = graphene.Field(graphene.List(GVMActions), required=True)
    is_owner = graphene.Field(graphene.Boolean, required=True, resolver=resolve_owner(VMActions))

    VIFs = graphene.Field(graphene.List(GVIF), required=True, resolver=resolve_many())
    VBDs = graphene.Field(graphene.List(GVBD), description="Virtual block devices", required=True, resolver=resolve_many())

    snapshot_time = graphene.Field(graphene.DateTime, required=True)
    snapshot_of = graphene.Field(vmType, required=True, resolver=resolve_one())

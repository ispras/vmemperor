from dataclasses import dataclass

import graphene
from graphene.types.resolver import dict_resolver

from handlers.graphql.action_deserializers.abstractvm_deserializer import AbstractVMDeserializer
from handlers.graphql.interfaces.abstractvm import GAbstractVM
from handlers.graphql.interfaces.quotaobject import GQuotaObject
from handlers.graphql.resolvers.accessentry import resolve_accessentries
from handlers.graphql.resolvers.myactions import resolve_myactions, resolve_owner
from handlers.graphql.types.base.vmbase import VMActions, GVMActions, GVMAccessEntry
from handlers.graphql.types.base.gxenobjecttype import GXenObjectType
from handlers.graphql.types.vmsnapshot import GVMSnapshot
from handlers.graphql.utils.query import resolve_many
from handlers.graphql.types.vbd import GVBD
from handlers.graphql.types.vif import GVIF
from xenadapter.xenobject import XenObject
from handlers.graphql.interfaces.aclxenobject import GAclXenObject


@dataclass
class SetDisksEntry:
    '''
    New disk entry
    '''

    SR : XenObject # Storage repository
    size: int # disk size in bytes


class PvDriversVersion(graphene.ObjectType):
    '''
    Drivers version. We don't want any fancy resolver except for the thing that we know that it's a dict in VM document
    '''
    class Meta:
        default_resolver = dict_resolver
    major = graphene.Int()
    minor = graphene.Int()
    micro = graphene.Int()
    build = graphene.Int()


class OSVersion(graphene.ObjectType):
    '''
    OS version reported by Xen tools
    '''
    class Meta:
        default_resolver = dict_resolver
    name = graphene.String()
    uname = graphene.String()
    distro = graphene.String()
    major = graphene.Int()
    minor = graphene.Int()




class PowerState(graphene.Enum):
    Halted = 'Halted'
    Paused = 'Paused'
    Running = 'Running'
    Suspended = 'Suspended'


class GVM(GXenObjectType):
    class Meta:
        interfaces = (GAclXenObject, GAbstractVM, GQuotaObject)

    access = graphene.Field(graphene.List(GVMAccessEntry), required=True)
    my_actions = graphene.Field(graphene.List(GVMActions), required=True)
    is_owner = graphene.Field(graphene.Boolean, required=True, resolver=resolve_owner(VMActions))

    # from http://xapi-project.github.io/xen-api/classes/vm_guest_metrics.html
    PV_drivers_up_to_date = graphene.Field(graphene.Boolean, description="True if PV drivers are up to date, reported if Guest Additions are installed")
    PV_drivers_version = graphene.Field(PvDriversVersion,description="PV drivers version, if available")
    metrics = graphene.Field(graphene.ID, required=True)
    os_version = graphene.Field(OSVersion)
    power_state = graphene.Field(PowerState, required=True)
    start_time = graphene.Field(graphene.DateTime)
    VIFs = graphene.Field(graphene.List(GVIF), required=True, resolver=resolve_many())
    VBDs = graphene.Field(graphene.List(GVBD), description="Virtual block devices", required=True, resolver=resolve_many())
    snapshots = graphene.Field(graphene.List(GVMSnapshot), required=True, resolver=resolve_many())

    @staticmethod
    def resolve_my_actions(root, info, *args, **kwargs):
        return resolve_myactions(AbstractVMDeserializer(root, VMActions))(root, info, *args, **kwargs)

    @staticmethod
    def resolve_access(root, info, *args, **kwargs):
        return resolve_accessentries(AbstractVMDeserializer(root, VMActions))(root, info, *args, **kwargs)


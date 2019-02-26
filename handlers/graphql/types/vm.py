from dataclasses import dataclass
from enum import auto

import graphene
from graphene.types.resolver import dict_resolver
from serflag import SerFlag

from handlers.graphql.resolvers.accessentry import resolve_accessentries
from handlers.graphql.types.access import create_access_type
from handlers.graphql.types.accessentry import GAccessEntry
from handlers.graphql.types.gxenobjecttype import GXenObjectType
from handlers.graphql.types.objecttype import ObjectType
from xenadapter.vif import GVIF, VIF
from xenadapter.xenobject import XenObject, GAclXenObject


@dataclass
class SetDisksEntry:
    '''
    New disk entry
    '''

    SR : XenObject # Storage repository
    size: int # disk size in megabytes


class XenEnum(graphene.Enum):
    def __str__(self):
        return self.name


class VBDMode(XenEnum):
    RO = auto()
    RW = auto()

    def __repr__(self):
        if self.name == 'RO':
            return 'Read-only device'
        elif self.name == 'RW':
            return 'Read-write device'


class VBDType(XenEnum):
    CD = auto()
    Disk = auto()
    Floppy = auto()

    def __repr__(self):
        if self.name == 'CD':
            return 'Optical disc device'
        elif self.name == 'Disk':
            return 'Hard disk device'
        elif self.name == 'Floppy':
            return 'Floppy device'


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


class DomainType(graphene.Enum):
    HVM = 'hvm'
    PV = 'pv'
    PV_in_PVH = 'pv_in_pvh'


class VMActions(SerFlag):
    attach_vdi = auto()
    rename = auto()
    change_domain_type = auto()
    VNC = auto()

    snapshot = auto()
    clone = auto()
    copy = auto()
    create_template = auto()
    revert = auto()
    checkpoint = auto()
    snapshot_with_quiesce = auto()
    #provision = auto()
    start = auto()
    start_on = auto()
    pause = auto()
    unpause = auto()
    clean_shutdown = auto()
    clean_reboot = auto()
    hard_shutdown = auto()
    power_state_reset = auto()
    hard_reboot = auto()
    suspend = auto()
    csvm = auto()
    resume = auto()
    resume_on = auto()
    pool_migrate = auto()
    migrate_send = auto()
    shutdown = auto()
    destroy = auto()


GVMActions = graphene.Enum.from_enum(VMActions)


GVMAccessEntry = create_access_type("GVMAccessEntry", GVMActions)


class GVM(GXenObjectType):
    class Meta:
        interfaces = (GAclXenObject,)

    access = graphene.Field(graphene.List(GVMAccessEntry), required=True,
                            resolver=resolve_accessentries(VMActions, GVMAccessEntry))

    # from http://xapi-project.github.io/xen-api/classes/vm_guest_metrics.html
    PV_drivers_up_to_date = graphene.Field(graphene.Boolean, description="True if PV drivers are up to date, reported if Guest Additions are installed")
    PV_drivers_version = graphene.Field(PvDriversVersion,description="PV drivers version, if available")
    VCPUs_at_startup = graphene.Field(graphene.Int, required=True)
    VCPUs_max = graphene.Field(graphene.Int, required=True)
    domain_type = graphene.Field(DomainType, required=True)
    guest_metrics = graphene.Field(graphene.ID, required=True)
    install_time = graphene.Field(graphene.DateTime, required=True)
    memory_actual = graphene.Field(graphene.Float, required=True)
    memory_static_min = graphene.Field(graphene.Float, required=True)
    memory_static_max = graphene.Field(graphene.Float, required=True)
    memory_dynamic_min = graphene.Field(graphene.Float, required=True)
    memory_dynamic_max = graphene.Field(graphene.Float, required=True)
    metrics = graphene.Field(graphene.ID, required=True)
    os_version = graphene.Field(OSVersion)
    power_state = graphene.Field(PowerState, required=True)
    start_time = graphene.Field(graphene.DateTime, required=True)
    VIFs = graphene.Field(graphene.List(GVIF), required=True, resolver=VIF.resolve_many())

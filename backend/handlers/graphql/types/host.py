import graphene
from graphene.types.resolver import dict_resolver

from handlers.graphql.interfaces.xenobject import GXenObject
from handlers.graphql.resolvers.vm import vmType
from handlers.graphql.types.base.gxenobjecttype import GSubtypeObjectType, GXenObjectType
from handlers.graphql.types.pbd import GPBD
from handlers.graphql.utils.query import resolve_many


class HostAllowedOperations(graphene.Enum):
    Provision = 'provision'
    Evacuate = 'evacuate'
    Shutdown = 'shutdown'
    Reboot = 'reboot'
    PowerOn = 'power_on'
    VmStart = 'vm_start'
    VmResume = 'vm_resume'
    VmMigrate = 'vm_migrate'

    @property
    def description(self):
        if self == HostAllowedOperations.Provision:
            return "Indicates this host is able to provision another VM"
        elif self == HostAllowedOperations.Evacuate:
            return "Indicates this host is evacuating"
        elif self == HostAllowedOperations.Shutdown:
            return "Indicates this host is in the process of shutting itself down"
        elif self == HostAllowedOperations.Reboot:
            return "Indicates this host is in the process of rebooting"
        elif self == HostAllowedOperations.PowerOn:
            return "Indicates this host is in the process of being powered on"
        elif self == HostAllowedOperations.VmStart:
            return "This host is starting a VM"
        elif self == HostAllowedOperations.VmResume:
            return "This host is resuming a VM"
        elif self == HostAllowedOperations.VmMigrate:
            return "This host is the migration target of a VM"


class HostDisplay(graphene.Enum):
    Enabled = 'enabled'
    DisableOnReboot = 'disable_on_reboot'
    Disabled = 'disabled'
    EnableOnReboot = 'enable_on_reboot'

    @property
    def description(self):
        if self == HostDisplay.Enabled:
            return 	"This host is outputting its console to a physical display device"
        elif self == HostDisplay.DisableOnReboot:
            return "The host will stop outputting its console to a physical display device on next boot"
        elif self == HostDisplay.Disabled:
            return "This host is not outputting its console to a physical display device"
        elif self == HostDisplay.EnableOnReboot:
            return "The host will start outputting its console to a physical display device on next boot"


class CpuInfo(GSubtypeObjectType):
    class Meta:
        default_resolver = dict_resolver
    cpu_count = graphene.Field(graphene.Int, required=True)
    modelname = graphene.Field(graphene.String, required=True)
    socket_count = graphene.Field(graphene.Int, required=True)
    vendor = graphene.Field(graphene.String, required=True)
    family = graphene.Field(graphene.Int, required=True)
    features = graphene.Field(graphene.ID, required=True)
    features_hvm = graphene.Field(graphene.ID)
    features_pv = graphene.Field(graphene.ID)
    flags = graphene.Field(graphene.String, required=True)
    model = graphene.Field(graphene.Int, required=True)
    speed = graphene.Field(graphene.Float, required=True)
    stepping = graphene.Field(graphene.Int, required=True)


class SoftwareVersion(GSubtypeObjectType):
    class Meta:
        default_resolver = dict_resolver

    build_number = graphene.Field(graphene.String, required=True)
    date = graphene.Field(graphene.String, required=True)
    hostname = graphene.Field(graphene.String, required=True)
    linux = graphene.Field(graphene.String, required=True, description="Linux kernel version")
    network_backend = graphene.Field(graphene.String, required=True)
    platform_name = graphene.Field(graphene.String, required=True)
    platform_version = graphene.Field(graphene.String, required=True)
    platform_version_text = graphene.Field(graphene.String, required=True)
    platform_version_text_short = graphene.Field(graphene.String, required=True)
    xapi = graphene.Field(graphene.String, required=True, description="XAPI version")
    xen = graphene.Field(graphene.String, required=True, description="Xen version")
    product_brand = graphene.Field(graphene.String, required=True)
    product_version = graphene.Field(graphene.String, required=True)
    product_version_text = graphene.Field(graphene.String, required=True)


class GHost(GXenObjectType):
    class Meta:
        interfaces = (GXenObject,)

    API_version_major = graphene.Field(graphene.Int, description="Major XenAPI version number")
    API_version_minor = graphene.Field(graphene.Int, description="Minor XenAPI version number")
    PBDs = graphene.Field(graphene.List(GPBD),
                                         description="Connections to storage repositories",
                                         required=True, resolver=resolve_many())
    PCIs = graphene.List(graphene.ID, required=True)
    PGPUs = graphene.List(graphene.ID, required=True)
    PIFs = graphene.List(graphene.ID, required=True)
    PUSBs = graphene.List(graphene.ID, required=True)
    address = graphene.Field(graphene.String, required=True,
                             description="The address by which this host can be contacted from any other host in the pool")
    allowed_operations = graphene.List(HostAllowedOperations, required=True)
    cpu_info = graphene.Field(CpuInfo, required=True)
    display = graphene.Field(HostDisplay, required=True)
    hostname = graphene.Field(graphene.String, required=True)
    software_version = graphene.Field(SoftwareVersion, required=True)
    resident_VMs = graphene.Field(graphene.List(vmType), required=True, description="VMs currently resident on host",
                                                                             resolver=resolve_many())
    metrics = graphene.Field(graphene.ID, required=True)
    memory_total = graphene.Field(graphene.Float, description="Total memory in kilobytes")
    memory_free = graphene.Field(graphene.Float, description="Free memory in kilobytes")
    memory_available = graphene.Field(graphene.Float, description="Available memory as measured by the host in kilobytes")
    memory_overhead = graphene.Field(graphene.Float, description="Virtualization overhead in kilobytes")
    live = graphene.Field(graphene.Boolean, description="True if host is up. May be null if no data")
    live_updated = graphene.Field(graphene.DateTime, description="When live status was last updated")

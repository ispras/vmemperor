import graphene

from handlers.graphql.types.input.namedinput import NamedInput
from handlers.graphql.types.objecttype import InputObjectType
from handlers.graphql.types.vm import DomainType


class PlatformInput(InputObjectType):
    cores_per_socket = graphene.Argument(graphene.Int, default_value={})
    timeoffset = graphene.InputField(graphene.Int, default_value={})
    nx = graphene.InputField(graphene.Boolean, default_value={})
    device_model = graphene.InputField(graphene.String, default_value={})
    pae = graphene.InputField(graphene.Boolean, default_value={})
    hpet = graphene.InputField(graphene.Boolean, default_value={})
    apic = graphene.InputField(graphene.Boolean, default_value={})
    acpi = graphene.InputField(graphene.Int, default_value={})
    videoram = graphene.InputField(graphene.Int, default_value={})


class AbstractVMInput(NamedInput):
    domain_type = graphene.InputField(DomainType, description="VM domain type: 'pv', 'hvm', 'pv_in_pvh'")
    platform = graphene.InputField(PlatformInput, description="VCPU platform properties")
    VCPUs_at_startup = graphene.InputField(graphene.Int, description="Number of VCPUs at startup")
    VCPUs_max = graphene.InputField(graphene.Int, description="Maximum number of VCPUs")
    memory_dynamic_min = graphene.InputField(graphene.Float, description="Dynamic memory min in bytes")
    memory_dynamic_max = graphene.InputField(graphene.Float, description="Dynamic memory max in bytes")
    memory_static_min = graphene.InputField(graphene.Float, description="Static memory min in bytes")
    memory_static_max = graphene.InputField(graphene.Float, description="Static memory max in bytes")
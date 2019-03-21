import graphene

from handlers.graphql.types.input.namedinput import NamedInput
from handlers.graphql.types.objecttype import InputObjectType
from handlers.graphql.types.vm import DomainType
from xenadapter.abstractvm import AbstractVM
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
    memory = graphene.InputField(graphene.Float, description="Set the memory allocation in bytes - Sets all of memory_static_max, memory_dynamic_min, and memory_dynamic_max to the given value, and leaves memory_static_min untouched")
    memory_dynamic_min = graphene.InputField(graphene.Float, description="Dynamic memory min in bytes")
    memory_dynamic_max = graphene.InputField(graphene.Float, description="Dynamic memory max in bytes")
    memory_static_min = graphene.InputField(graphene.Float, description="Static memory min in bytes")
    memory_static_max = graphene.InputField(graphene.Float, description="Static memory max in bytes")



def set_memory(input: AbstractVMInput, vm: AbstractVM):
    try:
        smin = int(input.memory_static_min)
    except TypeError:
        smin = None
    try:
        smax = int(input.memory_static_max)
    except TypeError:
        smax = None
    try:
        dmin = int(input.memory_dynamic_min)
    except TypeError:
        dmin = None
    try:
        dmax = int(input.memory_dynamic_max)
    except TypeError:
        dmin = None
    
    if smin and smax and dmin and dmax: # No worries on zeros, memory cant be 0
        vm.set_memory_limits(smin, smax, dmin, dmax)
        return
    if smin and smax:
        vm.set_memory_static_range(smin, smax)
    elif smin or smax:
        if smin:
            vm.set_memory_static_min(smin)
        else:
            vm.set_memory_static_max(smax)
    
    if dmin and smax:
        vm.set_memory_dynamic_range(smin, smax)
    elif dmin or dmax:
        if dmin:
            vm.set_memory_dynamic_min(dmin)
        else:
            vm.set_memory_dynamic_max(dmax)


def memory_input_validator(input: AbstractVMInput):
    smin : float = input.memory_static_min
    smax : float = input.memory_static_max
    dmin : float = input.memory_dynamic_min
    dmax : float = input.memory_dynamic_max
    memory_filter = filter(lambda item: item is not None, (smin, smax, dmin, dmax))
    has_values = False # return False, None -> skip mutation. True - execute mutation, False w/nonempty string - break transaction
    for item in memory_filter:
        if not item.is_integer() or item <= 0:
            return False, f"Incorrect value: {item}: expected positive integer"
        has_values = True

    return has_values, None


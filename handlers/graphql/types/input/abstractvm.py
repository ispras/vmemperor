from handlers.graphql.mutation_utils.cleanup import cleanup_defaults
from handlers.graphql.utils.input import validate_subtype
from input.abstractvm import AbstractVMInput
from xenadapter.abstractvm import AbstractVM


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


def memory_input_validator(input: AbstractVMInput, _):
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

def vcpus_input_validator(input: AbstractVMInput, vm: AbstractVM):
    if not input.VCPUs_at_startup and not input.VCPUs_max:
        return False, None

    if input.VCPUs_max and vm.get_power_state() != 'Halted':
        return False, f"VCPUsMax: Setting VCPUs maximum requires {vm} to be in Halted state"

    return True, None

def set_VCPUs(input: AbstractVMInput, vm: AbstractVM):
    current_startup = vm.get_VCPUs_at_startup()
    if current_startup > input.VCPUs_max:
        if not input.VCPUs_at_startup:
            raise ValueError()
        vm.set_VCPUs_at_startup(input.VCPUs_at_startup)
        vm.set_VCPUs_max(input.VCPUs_max)
    else:
        if input.VCPUs_max:
            vm.set_VCPUs_max(input.VCPUs_max)
        if input.VCPUs_at_startup:
            vm.set_VCPUs_at_startup(input.VCPUs_at_startup)

def platform_validator(input, vm):
    return validate_subtype('platform')(input, vm)



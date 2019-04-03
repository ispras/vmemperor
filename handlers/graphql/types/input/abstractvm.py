from handlers.graphql.utils.input import validate_subtype
from input.abstractvm import AbstractVMInput
from xenadapter.abstractvm import AbstractVM


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


def platform_validator(input, vm):
    return validate_subtype('platform')(input, vm)



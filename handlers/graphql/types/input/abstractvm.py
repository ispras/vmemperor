import graphene

from handlers.graphql.graphql_handler import ContextProtocol
from handlers.graphql.types.input.namedinput import NamedInput
from handlers.graphql.types.vm import DomainType
from xenadapter.abstractvm import AbstractVM


class AbstractVMInput(NamedInput):
    domain_type = graphene.InputField(DomainType, description="VM domain type: 'pv', 'hvm', 'pv_in_pvh'")
    VCPUs_at_startup = graphene.InputField(graphene.Int, description="Number of VCPUs at startup")
    VCPUs_max = graphene.InputField(graphene.Int, description="Maximum number of VCPUs")


def domain_type(ctx: ContextProtocol, vm: AbstractVM, changes: AbstractVMInput):
    if changes.domain_type is not None:
        vm.set_domain_type(changes.domain_type)

def VCPUs_at_startup(ctx: ContextProtocol, vm: AbstractVM, changes: AbstractVMInput):
    if changes.VCPUs_at_startup is not None:
        vm.set_VCPUs_at_startup(changes.VCPUs_at_startup)

def VCPUs_max(ctx: ContextProtocol, vm: AbstractVM, changes: AbstractVMInput):
    if changes.VCPUs_max is not None:
        vm.set_VCPUs_max(changes.VCPUs_max)


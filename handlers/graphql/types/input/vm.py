from typing import Optional

import graphene

from authentication import with_authentication, with_default_authentication
from handlers.graphql.graphql_handler import ContextProtocol
from handlers.graphql.mutations.base import MutationMethod, MutationHelper
from handlers.graphql.resolvers import with_connection
from handlers.graphql.types.objecttype import InputObjectType
from xenadapter.vm import VM, DomainType


class VMInput(InputObjectType):
    ref = graphene.InputField(graphene.ID, required=True, description="VM ref")
    name_label = graphene.InputField(graphene.String, description="VM human-readable name")
    name_description = graphene.InputField(graphene.String, description="VM human-readable description")
    domain_type = graphene.InputField(DomainType, description="VM domain type: 'pv', 'hvm', 'pv_in_pvh'")

def set_name_label(ctx : ContextProtocol, vm : VM, changes : VMInput):
    if changes.name_label is not None:
        vm.set_name_label(changes.name_label)


def set_name_description(ctx: ContextProtocol, vm: VM, changes: VMInput):
    if changes.name_description is not None:
        vm.set_name_description(changes.name_description)

def set_domain_type(ctx: ContextProtocol, vm: VM, changes: VMInput):
    if changes.domain_type is not None:
        vm.set_domain_type(changes.domain_type)


class VMMutation(graphene.Mutation):
    '''
    This class represents synchronous mutations for VM, i.e. you can change name_label, name_description, etc.
    '''
    success = graphene.Field(graphene.Boolean, required=True)

    class Arguments:
        vm = graphene.Argument(VMInput, description="VM to change", required=True)


    @staticmethod
    @with_default_authentication
    @with_connection
    def mutate(root, info, vm):
        ctx : ContextProtocol = info.context

        m = VM(ctx.xen, uuid=vm.uuid)


        mutations = [
            MutationMethod(func=set_name_label, access_action='rename'),
            MutationMethod(func=set_name_description, access_action='rename'),
            MutationMethod(func=set_domain_type, access_action='change_domain_type')
        ]
        helper = MutationHelper(mutations, ctx, m)
        helper.perform_mutations(vm)

        return VMMutation(success=True)


class VMStartInput(InputObjectType):
    paused = graphene.InputField(graphene.Boolean, default_value=False, description="Should this VM be started and immidiately paused")
    # todo Implement Host field
    force = graphene.InputField(graphene.Boolean, default_value=False, description="Should this VM be started forcibly")


class VMStartMutation(graphene.Mutation):
    taskId = graphene.ID(required=True, description="Start task ID")

    class Arguments:
        uuid = graphene.ID(required=True)
        options = graphene.Argument(VMStartInput)

    @staticmethod
    @with_authentication(access_class=VM, access_action='change_power_state')
    def mutate(root, info, uuid, options : VMStartInput = None):
        ctx :ContextProtocol = info.context
        vm = VM(auth=ctx.user_authenticator, uuid=uuid)
        paused = options.paused if options else False
        force = options.force if options else False
        return VMStartMutation(taskId=vm.async_start(paused, force))


class ShutdownForce(graphene.Enum):
    HARD = 1
    CLEAN = 2


class VMShutdownMutation(graphene.Mutation):
    taskId = graphene.ID(required=True, description="Shutdown task ID")

    class Arguments:
        uuid = graphene.ID(required=True)
        force = graphene.Argument(ShutdownForce, description="Force shutdown in a hard or clean way")

    @staticmethod
    @with_authentication(access_class=VM, access_action='change_power_state')
    def mutate(root, info, uuid, force: Optional[ShutdownForce] = None):
        ctx: ContextProtocol = info.context
        vm = VM(auth=ctx.user_authenticator, uuid=uuid)
        if force is None:
            return VMShutdownMutation(taskId=vm.async_shutdown())
        elif force == ShutdownForce.HARD:
            return VMShutdownMutation(taskId=vm.async_hard_shutdown())
        elif force == ShutdownForce.CLEAN:
            return VMShutdownMutation(taskId=vm.async_clean_shutdown())


class VMRebootMutation(graphene.Mutation):
    taskId = graphene.ID(required=True, description="Reboot task ID")

    class Arguments:
        uuid = graphene.ID(required=True)
        force = graphene.Argument(ShutdownForce, description="Force reboot in a hard or clean way. Default: clean")

    @staticmethod
    @with_authentication(access_class=VM, access_action='change_power_state')
    def mutate(root, info, uuid, force: Optional[ShutdownForce] = ShutdownForce.CLEAN):
        ctx: ContextProtocol = info.context
        vm = VM(auth=ctx.user_authenticator, uuid=uuid)
        if force == ShutdownForce.HARD:
            return VMShutdownMutation(taskId=vm.async_hard_reboot())
        elif force == ShutdownForce.CLEAN:
            return VMShutdownMutation(taskId=vm.async_clean_reboot())


class VMPauseMutation(graphene.Mutation):
    taskId = graphene.ID(required=True, description="Pause/unpause task ID")

    class Arguments:
        uuid = graphene.ID(required=True)

    @staticmethod
    @with_authentication(access_class=VM, access_action='change_power_state')
    def mutate(root, info, uuid):
        ctx: ContextProtocol = info.context
        vm = VM(auth=ctx.user_authenticator, uuid=uuid)
        if vm.get_power_state() == "Running":
            return VMPauseMutation(taskId=vm.async_pause())
        elif vm.get_power_state() == "Paused":
            return VMPauseMutation(taskId=vm.async_unpause())
        else:
            raise ValueError(f"Pause mutation requires powerState 'Running' or 'Paused'. Got: {vm.get_power_state()}")


class VMDeleteMutation(graphene.Mutation):
    taskId = graphene.ID(required=True, description="Deleting task ID")

    class Arguments:
        uuid = graphene.ID(required=True)

    @staticmethod
    @with_authentication(access_class=VM, access_action='delete')
    def mutate(root, info, uuid):
        ctx: ContextProtocol = info.context
        vm = VM(auth=ctx.user_authenticator, uuid=uuid)
        if vm.get_power_state() == "Halted":
            return VMDeleteMutation(taskId=vm.async_destroy())
        else:
            raise ValueError(f"Delete mutation requires powerState 'Halted'. Got: {vm.get_power_state()}")


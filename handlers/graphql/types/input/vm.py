from typing import Optional

import graphene

from authentication import with_authentication, with_default_authentication
from handlers.graphql.graphql_handler import ContextProtocol
from handlers.graphql.mutation_utils.base import MutationMethod, MutationHelper
from handlers.graphql.resolvers import with_connection
from handlers.graphql.types.objecttype import InputObjectType
from xenadapter.vm import VM
from handlers.graphql.types.vm import DomainType


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

        mutable = VM(ctx.xen, vm.ref)

        mutations = [
            MutationMethod(func=set_name_label, access_action=VM.Actions.rename),
            MutationMethod(func=set_name_description, access_action=VM.Actions.rename),
            MutationMethod(func=set_domain_type, access_action=VM.Actions.change_domain_type)
        ]
        helper = MutationHelper(mutations, ctx, mutable)
        helper.perform_mutations(vm)

        return VMMutation(success=True)


class VMStartInput(InputObjectType):
    paused = graphene.InputField(graphene.Boolean, default_value=False, description="Should this VM be started and immidiately paused")
    # todo Implement Host field
    force = graphene.InputField(graphene.Boolean, default_value=False, description="Should this VM be started forcibly")


class VMStartMutation(graphene.Mutation):
    taskId = graphene.ID(required=True, description="Start task ID")

    class Arguments:
        ref = graphene.ID(required=True)
        options = graphene.Argument(VMStartInput)

    @staticmethod
    @with_authentication(access_class=VM, access_action=VM.Actions.start)
    def mutate(root, info, ref, options : VMStartInput = None, **kwargs):
        ctx :ContextProtocol = info.context
        vm = kwargs['VM']
        paused = options.paused if options else False
        force = options.force if options else False
        return VMStartMutation(taskId=vm.async_start(paused, force))


class ShutdownForce(graphene.Enum):
    HARD = 1
    CLEAN = 2


class VMShutdownMutation(graphene.Mutation):
    taskId = graphene.ID(required=True, description="Shutdown task ID")

    class Arguments:
        ref = graphene.ID(required=True)
        force = graphene.Argument(ShutdownForce, description="Force shutdown in a hard or clean way")

    @staticmethod
    def mutate(root, info, ref, force: Optional[ShutdownForce] = None):
        if force is None:
            access_action = VM.Actions.shutdown
            method = 'async_shutdown'
        elif force == ShutdownForce.HARD:
            access_action = VM.Actions.hard_shutdown
            method = 'async_hard_shutdown'
        elif force == ShutdownForce.CLEAN:
            access_action = VM.Actions.clean_shutdown
            method = 'async_clean_shutdown'

        @with_authentication(access_class=VM, access_action=access_action)
        def get_vm(*args, **kwargs):
            return kwargs['VM']

        vm = get_vm(root, info, ref, force)
        call = getattr(vm, method)
        return VMShutdownMutation(taskId=call())


class VMRebootMutation(graphene.Mutation):
    taskId = graphene.ID(required=True, description="Reboot task ID")

    class Arguments:
        ref = graphene.ID(required=True)
        force = graphene.Argument(ShutdownForce, description="Force reboot in a hard or clean way. Default: clean")

    @staticmethod
    def mutate(root, info, ref, force: Optional[ShutdownForce] = ShutdownForce.CLEAN):
        if force == ShutdownForce.HARD:
            access_action = VM.Actions.hard_reboot
            method = 'async_hard_reboot'
        elif force == ShutdownForce.CLEAN:
            access_action = VM.Actions.clean_reboot
            method = 'async_clean_reboot'

        @with_authentication(access_class=VM, access_action=access_action)
        def get_vm(*args, **kwargs):
            return kwargs['VM']

        vm = get_vm(root, info, ref, force)
        call = getattr(vm, method)
        return VMRebootMutation(taskId=call())


class VMPauseMutation(graphene.Mutation):
    taskId = graphene.ID(required=True, description="Pause/unpause task ID")

    class Arguments:
        ref = graphene.ID(required=True)

    @staticmethod
    @with_authentication
    def mutate(root, info, ref):
        ctx: ContextProtocol = info.context

        vm = VM(ctx.xen, ref)
        if vm.get_power_state() == "Running":
            access_action = VM.Actions.pause
            method = 'async_pause'
        elif vm.get_power_state() == "Paused":
            access_action = VM.Actions.unpause
            method = 'async_unpause'
        else:
            raise ValueError(f"Pause mutation requires powerState 'Running' or 'Paused'. Got: {vm.get_power_state()}")

        vm.check_access(ctx.user_authenticator, access_action)

        return VMPauseMutation(taskId=getattr(vm, method)())


class VMDeleteMutation(graphene.Mutation):
    taskId = graphene.ID(required=True, description="Deleting task ID")

    class Arguments:
        ref = graphene.ID(required=True)

    @staticmethod
    @with_authentication(access_class=VM, access_action=VM.Actions.destroy)
    def mutate(root, info, ref, VM):
        if VM.get_power_state() == "Halted":
            return VMDeleteMutation(taskId=VM.async_destroy())
        else:
            raise ValueError(f"Delete mutation requires powerState 'Halted'. Got: {VM.get_power_state()}")


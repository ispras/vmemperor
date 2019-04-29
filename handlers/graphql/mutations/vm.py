from typing import Optional

import graphene

from authentication import with_authentication, with_default_authentication, return_if_access_is_not_granted
from handlers.graphql.graphql_handler import ContextProtocol
from handlers.graphql.mutation_utils.asyncmutationmethod import AsyncMutationMethod
from handlers.graphql.mutation_utils.mutationmethod import MutationMethod
from handlers.graphql.mutations.abstractvm import vcpus_input_validator, memory_input_validator, platform_validator
from xenadapter.abstractvm import set_memory, set_VCPUs
from handlers.graphql.types.base.objecttype import InputObjectType
from handlers.graphql.utils.editmutation import create_edit_mutation, create_async_mutation
from handlers.graphql.types.input.vm import VMInput
from xenadapter.xenobject import set_subtype_from_input
from xenadapter.vm import VM

mutations = [
            MutationMethod(func="name_label", access_action=VM.Actions.rename),
            MutationMethod(func="name_description", access_action=VM.Actions.rename),
            MutationMethod(func="domain_type", access_action=VM.Actions.change_domain_type),
            MutationMethod(func=(set_subtype_from_input("platform"), platform_validator), access_action=VM.Actions.changing_VCPUs),
            MutationMethod(func=(set_VCPUs, vcpus_input_validator), access_action=VM.Actions.changing_VCPUs),
            MutationMethod(func=(set_memory, memory_input_validator), access_action=VM.Actions.changing_memory_limits),
            MutationMethod(func="main_owner", access_action=VM.Actions.ALL)
        ]
VMMutation = create_edit_mutation("VMMutation", "vm", VMInput, VM, mutations)

class VMStartInput(InputObjectType):
    paused = graphene.InputField(graphene.Boolean, default_value=False, description="Should this VM be started and immidiately paused")
    host = graphene.InputField(graphene.ID, description="Host to start VM on")
    force = graphene.InputField(graphene.Boolean, default_value=False, description="Should this VM be started forcibly")


class VMStartMutation(graphene.Mutation):
    taskId = graphene.ID(required=False, description="Start task ID")
    granted = graphene.Boolean(required=True, description="Shows if access to start is granted")
    reason = graphene.String()

    class Arguments:
        ref = graphene.ID(required=True)
        options = graphene.Argument(VMStartInput)

    @staticmethod
    @with_default_authentication
    def mutate(root, info, ref, options : VMStartInput = None, **kwargs):
        ctx :ContextProtocol = info.context

        paused = options.paused if options else False
        force = options.force if options else False
        host = options.host if options else None
        vm = VM(ctx.xen, ref)
        power_state = vm.get_power_state()
        if power_state == "Halted":
            if host:
                access_action = VM.Actions.start_on
                method = 'start_on'
            else:
                access_action = VM.Actions.start
                method = 'start'
        elif power_state == 'Suspended':
            if host:
                access_action = VM.Actions.resume_on
                method = 'resume_on'
            else:
                access_action = VM.Actions.resume
                method = 'resume'
        else:
            return VMStartMutation(granted=False, reason=f"Power state is  {power_state}, expected: Halted or Suspended")

        if not vm.check_access(ctx.user_authenticator, access_action):
            return VMStartMutation(granted=False, reason=f"Access to action {access_action} for VM {vm.ref} is not granted")

        # calling signature: method(paused, force)
        return VMStartMutation(granted=True, taskId=AsyncMutationMethod.call(vm, method, info.context,  args=(paused, force)))




class ShutdownForce(graphene.Enum):
    HARD = 1
    CLEAN = 2


class VMShutdownMutation(graphene.Mutation):
    taskId = graphene.ID(required=False, description="Shutdown task ID")
    granted = graphene.Boolean(required=True, description="Shows if access to shutdown is granted")

    class Arguments:
        ref = graphene.ID(required=True)
        force = graphene.Argument(ShutdownForce, description="Force shutdown in a hard or clean way")

    @staticmethod
    def mutate(root, info, ref, force: Optional[ShutdownForce] = None):
        if force is None:
            access_action = VM.Actions.shutdown
            method = 'shutdown'
        elif force == ShutdownForce.HARD:
            access_action = VM.Actions.hard_shutdown
            method = 'hard_shutdown'
        elif force == ShutdownForce.CLEAN:
            access_action = VM.Actions.clean_shutdown
            method = 'clean_shutdown'

        @with_authentication(access_class=VM, access_action=access_action)
        def get_vm(*args, **kwargs):
            return kwargs['VM']

        vm = get_vm(root, info, ref, force)
        if not vm:
            return VMShutdownMutation(granted=False)

        return VMShutdownMutation(taskId=AsyncMutationMethod.call(vm, method, info.context), granted=True)


class VMRebootMutation(graphene.Mutation):
    taskId = graphene.ID(required=False, description="Reboot task ID")
    granted = graphene.Boolean(required=True, description="Shows if access to reboot is granted")
    class Arguments:
        ref = graphene.ID(required=True)
        force = graphene.Argument(ShutdownForce, description="Force reboot in a hard or clean way. Default: clean")

    @staticmethod
    def mutate(root, info, ref, force: ShutdownForce = ShutdownForce.CLEAN):
        if force == ShutdownForce.HARD:
            access_action = VM.Actions.hard_reboot
            method = 'hard_reboot'
        elif force == ShutdownForce.CLEAN:
            access_action = VM.Actions.clean_reboot
            method = 'clean_reboot'

        @with_authentication(access_class=VM, access_action=access_action)
        def get_vm(*args, **kwargs):
            return kwargs['VM']

        vm = get_vm(root, info, ref, force)
        if not vm:
            return VMRebootMutation(granted=False)


        return VMRebootMutation(taskId=AsyncMutationMethod.call(vm, method, info.context), granted=True)


class VMPauseMutation(graphene.Mutation):
    taskId = graphene.ID(required=False, description="Pause/unpause task ID")
    granted = graphene.Boolean(required=True, description="Shows if access to pause/unpause is granted")
    reason = graphene.String()

    class Arguments:
        ref = graphene.ID(required=True)

    @staticmethod
    @with_default_authentication
    def mutate(root, info, ref):
        ctx: ContextProtocol = info.context

        vm = VM(ctx.xen, ref)
        power_state = vm.get_power_state()
        if power_state == "Running":
            access_action = VM.Actions.pause
            method = 'pause'
        elif power_state == "Paused":
            access_action = VM.Actions.unpause
            method = 'unpause'
        else:
            return VMPauseMutation(granted=False, reason=f"Power state is {power_state}, expected: Running or Paused")


        if not vm.check_access(ctx.user_authenticator, access_action):
            return VMPauseMutation(granted=False, reason=f"Access to action {access_action} for VM {vm.ref} is not granted")

        return VMPauseMutation(taskId=AsyncMutationMethod.call(vm, method, info.context), granted=True)


VMSuspendMutation = create_async_mutation("VMSuspendMutation", VM, VM.Actions.suspend)

class VMDestroyMutation(graphene.Mutation):
    taskId = graphene.ID(required=False, description="Deleting task ID")
    granted = graphene.Boolean(required=True, description="Shows if access to delete is granted")
    reason = graphene.String()

    class Arguments:
        ref = graphene.ID(required=True)

    @staticmethod
    @with_authentication(access_class=VM, access_action=VM.Actions.destroy)
    @return_if_access_is_not_granted([("VM", "ref", VM.Actions.destroy)])
    def mutate(root, info, ref, VM):
        if VM.get_power_state() == "Halted":
            return VMDestroyMutation(taskId=AsyncMutationMethod.call(VM, 'destroy', info.context), granted=True)
        else:
            return VMDestroyMutation(granted=False, reason=f"Power state of VM {VM.ref} is not Halted, unable to delete")



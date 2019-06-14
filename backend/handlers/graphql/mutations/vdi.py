import graphene

from handlers.graphql.mutation_utils.mutationmethod import MutationMethod
from handlers.graphql.mutations.quotaobject import set_main_owner, main_owner_validator
from handlers.graphql.utils.editmutation import create_edit_mutation, create_async_mutation
from handlers.graphql.types.input.vdi import VDIInput
from xenadapter import VDI

mutations = [
    MutationMethod(func=(set_main_owner, main_owner_validator), access_action=VDI.Actions.ALL),
    MutationMethod(func="name_label", access_action=VDI.Actions.rename),
    MutationMethod(func="name_description", access_action=VDI.Actions.rename),
]

VDIMutation = create_edit_mutation("VDIMutation", "vdi", VDIInput, VDI, mutations)

VDIDestroyMutation = create_async_mutation("VDIDestroyMutation", VDI, VDI.Actions.destroy)

class VMShutdownMutation(graphene.Mutation):
    taskId = graphene.ID(required=False, description="Create VDI task ID")
    granted = graphene.Boolean(required=True, description="Shows if access to VDI creation is granted")

    class Arguments:
        vdi_ref = graphene.ID(required=True)


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

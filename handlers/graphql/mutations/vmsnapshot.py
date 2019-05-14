import graphene

from authentication import with_authentication, return_if_access_is_not_granted
from handlers.graphql.mutation_utils.asyncmutationmethod import AsyncMutationMethod
from handlers.graphql.utils.editmutation import create_async_mutation, create_edit_mutation
from xenadapter import VMSnapshot

class VMRevertMutation(graphene.Mutation):
    taskId = graphene.ID(required=False, description="Deleting task ID")
    granted = graphene.Boolean(required=True, description="Shows if access to delete is granted")
    reason = graphene.String()

    class Arguments:
        ref = graphene.ID(required=True)

    @staticmethod
    @with_authentication(access_class=VMSnapshot, access_action=VMSnapshot.Actions.destroy)
    @return_if_access_is_not_granted([("VMSnapshot", "ref", VMSnapshot.Actions.destroy)])
    def mutate(root, info, ref, VMSnapshot):
        if VMSnapshot.get_is_a_snapshot():
            return VMRevertMutation(taskId=AsyncMutationMethod.call(VMSnapshot, 'revert', info.context), granted=True) #
        else:
            return VMRevertMutation(granted=False, reason=f"{VMSnapshot} is not a snapshot")



import graphene

from authentication import with_authentication, return_if_access_is_not_granted
from handlers.graphql.mutation_utils.mutationmethod import MutationMethod
from handlers.graphql.utils.editmutation import create_edit_mutation
from input.sr import SRInput
from xenadapter import SR

mutations = [
    MutationMethod(func="name_label", access_action=SR.Actions.rename),
    MutationMethod(func="name_description", access_action=SR.Actions.rename),
]

SRMutation = create_edit_mutation("SRMutation", "sr", SRInput, SR, mutations)

class SRDestroyMutation(graphene.Mutation):
    task_id = graphene.ID(required=False, description="destroy task ID")
    granted = graphene.Boolean(required=True, description="Shows if access to destroy is granted")
    reason = graphene.String()

    class Arguments:
        ref = graphene.ID(required=True)

    @staticmethod
    @with_authentication(access_class=SR, access_action=SR.Actions.destroy)
    @return_if_access_is_not_granted([("SR", "ref", SR.Actions.destroy)])
    def mutate(root, info, ref, SR : SR):
        return SRDestroyMutation(granted=True, task_id=SR.async_destroy())

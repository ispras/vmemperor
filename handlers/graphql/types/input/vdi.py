import graphene

from authentication import with_authentication, return_if_access_is_not_granted
from handlers.graphql.mutation_utils.mutationmethod import MutationMethod
from handlers.graphql.utils.editmutation import create_edit_mutation
from input.vdi import VDIInput
from xenadapter import VDI

mutations = [
    MutationMethod(func="name_label", access_action=VDI.Actions.rename),
    MutationMethod(func="name_description", access_action=VDI.Actions.rename),
]

VDIMutation = create_edit_mutation("VDIMutation", "vdi", VDIInput, VDI, mutations)

class VDIDestroyMutation(graphene.Mutation):
    task_id = graphene.ID(required=False, description="destroy task ID")
    granted = graphene.Boolean(required=True, description="Shows if access to destroy is granted")
    reason = graphene.String()

    class Arguments:
        ref = graphene.ID(required=True)

    @staticmethod
    @with_authentication(access_class=VDI, access_action=VDI.Actions.destroy)
    @return_if_access_is_not_granted([("VDI", "ref", VDI.Actions.destroy)])
    def mutate(root, info, ref, VDI : VDI):
        return VDIDestroyMutation(granted=True, task_id=VDI.async_destroy())

from handlers.graphql.mutation_utils.mutationmethod import MutationMethod
from handlers.graphql.utils.editmutation import create_edit_mutation, create_async_mutation
from handlers.graphql.types.input.sr import SRInput
from xenadapter import SR

mutations = [
    MutationMethod(func="name_label", access_action=SR.Actions.rename),
    MutationMethod(func="name_description", access_action=SR.Actions.rename),
]

SRMutation = create_edit_mutation("SRMutation", "sr", SRInput, SR, mutations)

SRDestroyMutation = create_async_mutation("SRDestroyMutation", SR, SR.Actions.destroy)

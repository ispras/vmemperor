import graphene

from authentication import with_authentication, return_if_access_is_not_granted
from handlers.graphql.mutation_utils.mutationmethod import MutationMethod
from handlers.graphql.utils.editmutation import create_edit_mutation, create_async_mutation
from input.sr import SRInput
from xenadapter import SR

mutations = [
    MutationMethod(func="name_label", access_action=SR.Actions.rename),
    MutationMethod(func="name_description", access_action=SR.Actions.rename),
]

SRMutation = create_edit_mutation("SRMutation", "sr", SRInput, SR, mutations)

SRDestroyMutation = create_async_mutation("SRDestroyMutation", SR, SR.Actions.destroy)

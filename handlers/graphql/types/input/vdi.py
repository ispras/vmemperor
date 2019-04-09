import graphene

from authentication import with_authentication, return_if_access_is_not_granted
from handlers.graphql.mutation_utils.mutationmethod import MutationMethod
from handlers.graphql.utils.editmutation import create_edit_mutation, create_async_mutation
from input.vdi import VDIInput
from xenadapter import VDI

mutations = [
    MutationMethod(func="name_label", access_action=VDI.Actions.rename),
    MutationMethod(func="name_description", access_action=VDI.Actions.rename),
]

VDIMutation = create_edit_mutation("VDIMutation", "vdi", VDIInput, VDI, mutations)

VDIDestroyMutation = create_async_mutation("VDIDestroyMutation", "async_destroy", VDI, VDI.Actions.destroy)

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

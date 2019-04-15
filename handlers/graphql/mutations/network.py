from handlers.graphql.mutation_utils.mutationmethod import MutationMethod
from handlers.graphql.types.input.network import NetworkInput
from handlers.graphql.utils.editmutation import create_edit_mutation
from xenadapter import Network

mutations = [
    MutationMethod(func="name_label", access_action=Network.Actions.rename),
    MutationMethod(func="name_description", access_action=Network.Actions.rename),
]

NetworkMutation = create_edit_mutation("NetworkMutation", "network", NetworkInput, Network, mutations)

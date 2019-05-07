from handlers.graphql.mutation_utils.mutationmethod import MutationMethod
from handlers.graphql.types.input.pool import PoolInput
from handlers.graphql.utils.editmutation import create_edit_mutation
from xenadapter import Pool

mutations = [
    MutationMethod(func="name_label", access_action=Pool.Actions.rename),
    MutationMethod(func="name_description", access_action=Pool.Actions.rename),
]

PoolMutation = create_edit_mutation("PoolMutation", "pool", PoolInput, Pool, mutations)

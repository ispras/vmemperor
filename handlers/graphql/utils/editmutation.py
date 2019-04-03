from typing import Type, List

import graphene

from authentication import with_default_authentication
from handlers.graphql.graphql_handler import ContextProtocol
from handlers.graphql.mutation_utils.mutationmethod import MutationMethod, MutationHelper
from handlers.graphql.types.input.basicxeninput import BasicXenInput
from xenadapter.xenobject import XenObject


def create_edit_mutation(name: str, argument_name: str, argument_type: Type[BasicXenInput], object_type: Type["XenObject"], mutations: List[MutationMethod]):

    Arguments = type('Arguments', (), {
        argument_name:  graphene.Argument(argument_type, description=f"{argument_name.capitalize()} to change", required=True),
        "ref": graphene.Argument(graphene.ID, description="Object ID", required=True)
    })

    @with_default_authentication
    def mutate(root, info, ref, **kwargs):
        ctx : ContextProtocol = info.context
        input : BasicXenInput = kwargs[argument_name]
        mutable = object_type(ctx.xen, ref)

        helper = MutationHelper(mutations, ctx, mutable)
        granted, reason = helper.perform_mutations(input)
        if not granted:
            return type(name, (), dict(granted=False, reason=reason))

        return type(name, (), dict(granted=True))

    return type(name, (graphene.Mutation, ), {
        "granted": graphene.Field(graphene.Boolean, required=True),
        "reason": graphene.Field(graphene.String),
        "Arguments": Arguments,
        "mutate": mutate
    })





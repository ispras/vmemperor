from typing import Type, List

import graphene
from serflag import SerFlag

from authentication import with_default_authentication, with_authentication, return_if_access_is_not_granted
from handlers.graphql.graphql_handler import ContextProtocol
from handlers.graphql.mutation_utils.asyncmutationmethod import AsyncMutationMethod
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


def create_async_mutation(name: str, method, access_class : type, action : SerFlag, post_mutation_hook =  None):
    """
    This method creates standard async mutations: one action per one mutation
    :param name:
    :param method:
    :param action:
    :return:
    """


    task_id = graphene.ID(required=False, description="Task ID")
    granted = graphene.Boolean(required=True, description="Shows if access to destroy is granted")
    reason = graphene.String()

    class Arguments:
        ref = graphene.ID(required=True)


    @with_authentication(access_class=access_class, access_action=action)
    @return_if_access_is_not_granted([(access_class.__name__, "ref", action)])
    def mutate(root, info, ref, **kwargs):
        object = kwargs[access_class.__name__]
        return type(name, (),
                    dict(
                        granted=True,
                        task_id=AsyncMutationMethod.call(getattr(object, method), info.context, post_mutation_hook)))

    return type(name, (graphene.Mutation, ), {
    "task_id": task_id,
    "Arguments": Arguments,
    "granted": granted,
    "reason": reason,
    "mutate" : mutate
    })



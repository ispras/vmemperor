import graphene
from graphene.types.resolver import dict_resolver

from authentication import with_default_authentication
from handlers.graphql.graphql_handler import ContextProtocol
from handlers.graphql.mutation_utils import access
from handlers.graphql.interfaces.accessentry import GAccessEntry
from handlers.graphql.types.base.objecttype import ObjectType



def create_access_mutation_type(name, actions_type, xenobject_type):
    """
    Returns a type for access mutation (i.e. change access of a particular XenObject

    It has one output field: "success" which is rendered false if user does not exist OR access is denied
    """

    class Arguments:
        ref = graphene.ID(required=True)
        revoke = graphene.Boolean(required=True)
        actions = graphene.List(graphene.NonNull(actions_type), required=True)
        user = graphene.String(required=True)


    @with_default_authentication
    def mutate(root, info, ref, actions, user,  revoke):
        ctx: ContextProtocol = info.context
        obj = xenobject_type(ctx.xen, ref)
        return dict(success=access.mutate(root, info, obj, actions, user,  revoke))

    return type(name, (graphene.Mutation, ), {
        "Arguments": Arguments,
        "success": graphene.Boolean(required=True),
        "mutate" : mutate,
        "Meta": type("Meta", (), {"default_resolver":  dict_resolver})
    })



def create_access_type(name, actions_type):
    return type(name, (ObjectType,), {
        "Meta": type("Meta",(), {"interfaces": (GAccessEntry,)}),
        "actions": graphene.Field(graphene.List(graphene.NonNull(actions_type)), required=True)
    })


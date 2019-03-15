import graphene
from graphene.types.resolver import dict_resolver

from handlers.graphql.graphql_handler import ContextProtocol
from handlers.graphql.mutation_utils import access
from handlers.graphql.types.accessentry import GAccessEntry
from handlers.graphql.types.objecttype import ObjectType



def create_access_mutation_type(name, actions_type, xenobject_type):


    class Arguments:
        ref = graphene.ID(required=True)
        revoke = graphene.Boolean(required=True)
        actions = graphene.List(graphene.NonNull(actions_type), required=True)
        user = graphene.String(required=True)



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
        "actions": graphene.Field(graphene.List(actions_type), required=True)
    })


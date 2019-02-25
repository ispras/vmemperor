import graphene

from handlers.graphql.graphql_handler import ContextProtocol
from handlers.graphql.types.vm import GVMActions
from xenadapter.vm import VM
import handlers.graphql.mutation_utils.access as access


class VMAccessSet(graphene.Mutation):
    success = graphene.Boolean(required=True)
    class Arguments:
        ref = graphene.Argument(graphene.ID, required=True)
        revoke = graphene.Argument(graphene.Boolean)
        actions = graphene.Argument(graphene.List(GVMActions, required=True), required=True)
        user = graphene.Argument(graphene.String, required=True)

    @staticmethod
    def mutate(root, info, ref, actions, user,  revoke=False):
        ctx : ContextProtocol = info.context
        vm = VM(ctx.xen, ref)
        return VMAccessSet(success=access.mutate(root, info, vm, actions, user,  revoke))








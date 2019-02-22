import graphene

from authentication import with_authentication
from handlers.graphql.graphql_handler import ContextProtocol
from xenadapter.network import Network
from xenadapter.vm import VM


class AttachNetworkMutation(graphene.Mutation):
    taskId = graphene.ID(description="Attach/Detach task ID. If already attached/detached, returns null")

    class Arguments:
        net_uuid = graphene.ID(required=True)
        vm_uuid = graphene.ID(required=True)
        is_attach = graphene.Boolean(required=True, description="True if attach, False if detach")

    @staticmethod
    @with_authentication(access_class=Network, access_action='attach', id_field='net_uuid')
    @with_authentication(access_class=VM, access_action='attach', id_field='vm_uuid')
    def mutate(root, info, net_ref, vm_ref, is_attach):
        ctx: ContextProtocol = info.context
        network = Network(uuid=net_ref, xen=ctx.xen)
        if is_attach:
            taskId = network.attach(VM(uuid=vm_ref, auth=ctx.user_authenticator))
        else:
            taskId = network.detach(VM(uuid=vm_ref, auth=ctx.user_authenticator))
        return AttachNetworkMutation(taskId=taskId)

import graphene

from authentication import with_authentication
from handlers.graphql.graphql_handler import ContextProtocol
from xenadapter.network import Network
from xenadapter.vm import VM


class AttachNetworkMutation(graphene.Mutation):
    taskId = graphene.ID(description="Attach/Detach task ID. If already attached/detached, returns null")

    class Arguments:
        net_ref = graphene.ID(required=True)
        vm_ref = graphene.ID(required=True)
        is_attach = graphene.Boolean(required=True, description="True if attach, False if detach")

    @staticmethod
    @with_authentication(access_class=Network, access_action='attach', id_field='net_ref')
    @with_authentication(access_class=VM, access_action='attach', id_field='vm_ref')
    def mutate(root, info, net_ref, vm_ref, is_attach, Network, VM):
        if is_attach:
            taskId = Network.attach(VM)
        else:
            taskId = Network.detach(VM)
        return AttachNetworkMutation(taskId=taskId)

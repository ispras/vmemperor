import graphene

from authentication import with_authentication, return_if_access_is_not_granted
from handlers.graphql.graphql_handler import ContextProtocol
from xenadapter.network import Network
from xenadapter.vm import VM


class AttachNetworkMutation(graphene.Mutation):
    taskId = graphene.ID(description="Attach/Detach task ID. If already attached/detached, returns null")
    granted = graphene.Boolean(required=True)
    reason = graphene.String()

    class Arguments:
        net_ref = graphene.ID(required=True)
        vm_ref = graphene.ID(required=True)
        is_attach = graphene.Boolean(required=True, description="True if attach, False if detach")

    @staticmethod
    @with_authentication(access_class=Network, access_action=Network.Actions.attaching, id_field='net_ref')
    @with_authentication(access_class=VM, access_action=VM.Actions.attach_network, id_field='vm_ref')
    @return_if_access_is_not_granted(
        [("VM", "vm_ref", VM.Actions.attach_network), ("Network", "net_ref", Network.Actions.attaching)])
    def mutate(root, info, net_ref, vm_ref, is_attach, Network, VM):
        if is_attach:
            taskId = Network.attach(VM)
        else:
            taskId = Network.detach(VM)
        return AttachNetworkMutation(taskId=taskId, granted=True)

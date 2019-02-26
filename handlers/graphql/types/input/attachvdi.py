import graphene

from authentication import with_authentication
from handlers.graphql.graphql_handler import ContextProtocol
from xenadapter.disk import VDI, VDIorISO
from xenadapter.vm import VM


class AttachVDIMutation(graphene.Mutation):
    taskId = graphene.ID(description="Attach/Detach task ID. If already attached/detached, returns null")

    class Arguments:
        vdi_ref = graphene.ID(required=True)
        vm_ref = graphene.ID(required=True)
        is_attach = graphene.Boolean(required=True, description="True if attach, False if detach")

    @staticmethod
    @with_authentication(access_class=VDIorISO, access_action=VDI.Actions.plug, id_field='vdi_ref')
    @with_authentication(access_class=VM, access_action=VM.Actions.attach_vdi, id_field='vm_ref')
    def mutate(root, info, vdi_ref, vm_ref, is_attach, VDIorISO, VM):
        if is_attach:
            taskId = VDIorISO.attach(VM)
        else:
            taskId = VDIorISO.detach(VM)
        return AttachVDIMutation(taskId=taskId)

import graphene

from authentication import with_authentication, return_if_access_is_not_granted
from handlers.graphql.graphql_handler import ContextProtocol
from xenadapter.vdi import VDI
from xenadapter.vm import VM


class AttachVDIMutation(graphene.Mutation):
    taskId = graphene.ID(description="Attach/Detach task ID. If already attached/detached, returns null")
    granted = graphene.Boolean(required=True, description="Returns True if access is granted")
    reason = graphene.String(description="If access is not granted, return the reason")

    class Arguments:
        vdi_ref = graphene.ID(required=True)
        vm_ref = graphene.ID(required=True)
        is_attach = graphene.Boolean(required=True, description="True if attach, False if detach")

    @staticmethod
    @with_authentication(access_class=VDI, access_action=VDI.Actions.plug, id_field='vdi_ref')
    @with_authentication(access_class=VM, access_action=VM.Actions.attach_vdi, id_field='vm_ref')
    @return_if_access_is_not_granted([("VDI", "vdi_ref", VDI.Actions.plug), ("VM", "vm_ref", VM.Actions.attach_vdi)])
    def mutate(root, info, vdi_ref, vm_ref, is_attach, VDI, VM):
        if is_attach:
            taskId = VDI.attach(VM)
        else:
            taskId = VDI.detach(VM)
        return AttachVDIMutation(taskId=taskId)

import graphene

from authentication import with_authentication
from handlers.graphql.graphql_handler import ContextProtocol
from xenadapter.disk import ISO
from xenadapter.vm import VM


class AttachISOMutation(graphene.Mutation):
    taskId = graphene.ID(description="Attach/Detach task ID. If already attached/detached, returns null")

    class Arguments:
        iso_ref = graphene.ID(required=True)
        vm_ref = graphene.ID(required=True)
        is_attach = graphene.Boolean(required=True, description="True if attach, False if detach")

    @staticmethod
    @with_authentication(access_class=ISO, access_action=ISO.Actions.plug, id_field='iso_ref')
    @with_authentication(access_class=VM, access_action=VM.Actions.attach_vdi, id_field='vm_ref')
    def mutate(root, info, iso_ref, vm_ref, is_attach, ISO, VM):
        if is_attach:
            taskId = ISO.attach(VM)
        else:
            taskId = ISO.detach(VM)
        return AttachISOMutation(taskId=taskId)

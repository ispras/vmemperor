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
    @with_authentication(access_class=ISO, access_action='attach', id_field='iso_ref')
    @with_authentication(access_class=VM, access_action='attach', id_field='iso_ref')
    def mutate(root, info, iso_ref, vm_ref, is_attach):
        ctx: ContextProtocol = info.context
        iso = ISO(ref=iso_ref, xen=ctx.xen)
        if is_attach:
            taskId = iso.attach(VM(ref=vm_ref, xen=ctx.xen))
        else:
            taskId = iso.detach(VM(ref=vm_ref, xen=ctx.xen))
        return AttachISOMutation(taskId=taskId)

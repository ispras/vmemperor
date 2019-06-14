import graphene

from authentication import with_authentication, return_if_access_is_not_granted
from handlers.graphql.graphql_handler import ContextProtocol
from handlers.graphql.mutation_utils.mutationmethod import MutationMethod
from handlers.graphql.mutations.quotaobject import set_main_owner, main_owner_validator
from handlers.graphql.utils.editmutation import create_edit_mutation, create_async_mutation
from handlers.graphql.types.input.vdi import VDIInput
from utils.user import user_entities
from xenadapter import VDI, SR

mutations = [
    MutationMethod(func=(set_main_owner, main_owner_validator), access_action=VDI.Actions.ALL),
    MutationMethod(func="name_label", access_action=VDI.Actions.rename),
    MutationMethod(func="name_description", access_action=VDI.Actions.rename),
]

VDIMutation = create_edit_mutation("VDIMutation", "vdi", VDIInput, VDI, mutations)

VDIDestroyMutation = create_async_mutation("VDIDestroyMutation", VDI, VDI.Actions.destroy)


class VDICreateMutation(graphene.Mutation):
    task_id = graphene.ID(required=False, description="Create VDI task ID")
    granted = graphene.Boolean(required=True, description="Shows if access to VDI creation is granted")

    class Arguments:
        sr_ref = graphene.ID(required=True)
        size = graphene.Float(required=True)
        name_label = graphene.String(required=True)
        user = graphene.String()


    @staticmethod
    @with_authentication(access_class=SR, access_action=SR.Actions.vdi_create)
    @return_if_access_is_not_granted([("SR", "sr_ref", SR.Actions.vdi_create)])
    def mutate(root, info, sr_ref, size, name_label, **kwargs):
        ctx: ContextProtocol = info.context
        user = kwargs.get('user')
        if not ctx.user_authenticator.is_admin():
            if user and user not in user_entities(ctx.user_authenticator.get_id()):
                return VDICreateMutation(granted=False)

            if not user:
                user = f'users/{ctx.user_authenticator.get_id()}'

        task_id = VDI.create_async(ctx.xen, sr_ref, size, name_label, user)
        from xenadapter.task import Task
        Task.add_pending_task(ctx.xen, task_id, SR, sr_ref, "vdi_create", True, f'users/{ctx.user_authenticator.get_id()}')



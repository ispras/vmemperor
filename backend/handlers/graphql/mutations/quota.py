import graphene

from authentication import with_default_authentication
from handlers.graphql.graphql_handler import ContextProtocol
from handlers.graphql.mutation_utils.cleanup import cleanup_defaults
from handlers.graphql.types.base.objecttype import InputObjectType
from utils.user import get_user_object
from xenadapter import Pool


class QuotaInput(InputObjectType):
    memory = graphene.InputField(graphene.Float, default_value={})
    vdi_size = graphene.InputField(graphene.Float, default_value={})
    vcpu_count = graphene.InputField(graphene.Int, default_value={})
    vm_count = graphene.InputField(graphene.Int, default_value={})

class QuotaMutation(graphene.Mutation):
    success = graphene.Boolean(required=True)

    class Arguments:
        user_id = graphene.String(required=True)
        quota = graphene.Argument(QuotaInput, required=True)

    @staticmethod
    @with_default_authentication
    def mutate(root, info, user_id,  quota):
        ctx : ContextProtocol = info.context
        if not ctx.user_authenticator.is_admin() or not get_user_object(user_id):
            return QuotaMutation(success=False)

        records = Pool.get_all(ctx.xen)
        assert len(records) == 1
        ref=records[0]
        pool = Pool(xen=ctx.xen, ref=ref)
        pool.set_quota(user_id, cleanup_defaults(quota))
        return QuotaMutation(success=True)


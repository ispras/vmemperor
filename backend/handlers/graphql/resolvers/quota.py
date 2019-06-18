from graphql import ResolveInfo
from rethinkdb.errors import ReqlNonExistenceError

from handlers.graphql.graphql_handler import ContextProtocol
from handlers.graphql.types.pool import Quota
from handlers.graphql.utils.query import resolve_from_root
import constants.re as re
from utils.quota import check_vdi_size, check_memory, check_vcpu_count, check_vm_count, get_used_vdi_size, \
    get_used_memory, get_used_vcpu_count, get_used_vm_count
from utils.user import user_entities, get_user_object


def resolve_quotas(root, info, **args):
    from xenadapter import Pool
    ctx: ContextProtocol = info.context
    if ctx.user_authenticator.is_admin():
        return re.db.table(Pool.quotas_table_name).coerce_to('array').run()
    else:
        return re.db.table(Pool.quotas_table_name).get_all(*user_entities(ctx.user_authenticator)).coerce_to('array').run()


def get_item(user):
    from xenadapter import Pool
    result =  re.db.table(Pool.quotas_table_name).get(user).run()
    if result:
        return result
    else:
        user_object = get_user_object(user)
        if user_object:
            result = {key: None for key in Quota._meta.fields.keys()}
            result.update({
                "user_id": user
            })
            return result
        else:
            raise ValueError(f"No such user: {user}")

def resolve_quota(root, info, user):
    ctx: ContextProtocol = info.context
    if not ctx.user_authenticator.is_admin():
        if user not in user_entities(ctx.user_authenticator):
            raise ValueError(f"Access denied: Not a member of an entity: {user}")

    return get_item(user)

def resolve_quota_left(root, info : ResolveInfo, user):
    ctx: ContextProtocol = info.context
    if not ctx.user_authenticator.is_admin() and user not in user_entities(ctx.user_authenticator):
        raise ValueError(f"Access denied: Not a member of an entity: {user}")

    fields = [item.name.value for item in info.field_asts[0].selection_set.selections]
    result = {}
    if 'vdiSize' in fields:
        result['vdi_size'] = check_vdi_size(user)

    if 'memory' in fields:
        result['memory'] = check_memory(user)

    if 'vcpuCount' in fields:
        result['vcpu_count'] = check_vcpu_count(user)

    if 'vmCount' in fields:
        result['vm_count'] = check_vm_count(user)

    if 'user' in fields:
        result['user_id'] = user

    return result


def resolve_quota_usage(root, info : ResolveInfo, user):
    ctx: ContextProtocol = info.context
    if not ctx.user_authenticator.is_admin() and user not in user_entities(ctx.user_authenticator):
        raise ValueError(f"Access denied: Not a member of an entity: {user}")

    fields = [item.name.value for item in info.field_asts[0].selection_set.selections]
    result = {}
    if 'vdiSize' in fields:
        result['vdi_size'] = get_used_vdi_size(user)

    if 'memory' in fields:
        result['memory'] = get_used_memory(user)

    if 'vcpuCount' in fields:
        result['vcpu_count'] = get_used_vcpu_count(user)

    if 'vmCount' in fields:
        result['vm_count'] = get_used_vm_count(user)

    if 'user' in fields:
        result['user_id'] = user

    return result







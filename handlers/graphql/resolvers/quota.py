from rethinkdb.errors import ReqlNonExistenceError

from handlers.graphql.graphql_handler import ContextProtocol
from handlers.graphql.types.pool import Quota
from handlers.graphql.utils.query import resolve_from_root
import constants.re as re
from utils.user import user_entities, get_user_object


def resolve_quotas(root, info, **args):
    from xenadapter import Pool
    ctx: ContextProtocol = info.context
    if ctx.user_authenticator.is_admin():
        return re.db.table(Pool.quotas_table_name).coerce_to('array').run()
    else:
        return re.db.table(Pool.quotas_table_name).get_all(*user_entities(ctx.user_authenticator)).coerce_to('array').run()


def resolve_quota(root, info, user):
    from xenadapter import Pool
    ctx: ContextProtocol = info.context
    def get_item():
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

    if ctx.user_authenticator.is_admin():
        return get_item()
    else:
        if user not in user_entities(ctx.user_authenticator):
            raise ValueError(f"Access denied: Not a member of an entity: {user}")

        return get_item()





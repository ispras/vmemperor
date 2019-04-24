from handlers.graphql.graphql_handler import ContextProtocol
from handlers.graphql.utils.query import resolve_from_root
import constants.re as re
from utils.user import user_entities


def resolve_quotas(root, info, **args):
    from xenadapter import Pool
    ctx: ContextProtocol = info.context
    if ctx.user_authenticator.is_admin():
        return re.db.table(Pool.quotas_table_name).coerce_to('array').run()
    else:
        return re.db.table(Pool.quotas_table_name).get_all(*user_entities(ctx.user_authenticator)).coerce_to('array').run()

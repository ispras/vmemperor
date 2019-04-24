from _operator import or_
from functools import reduce

from handlers.graphql.graphql_handler import ContextProtocol
from utils.user import get_user_object
from xenadapter.aclxenobject import ACLXenObject


def mutate(root, info, object : ACLXenObject, actions, user, revoke=False):
    all_actions = reduce(or_, (object.Actions(action) for action in actions))
    ctx : ContextProtocol = info.context
    if not get_user_object(user):
        return False

    if not object.check_access(ctx.user_authenticator, object.Actions.ALL):
        return False

    object.manage_actions(all_actions, user=user, revoke=revoke)
    return True

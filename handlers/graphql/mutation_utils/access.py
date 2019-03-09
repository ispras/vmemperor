from _operator import or_
from functools import reduce

from handlers.graphql.graphql_handler import ContextProtocol
from xenadapter.xenobject import ACLXenObject


def mutate(root, info, object : ACLXenObject, actions, user, revoke=False):
    all_actions = reduce(or_, (object.Actions(action) for action in actions))
    ctx : ContextProtocol = info.context
    if not object.check_access(ctx.user_authenticator, all_actions):
        return False

    object.manage_actions(all_actions, user=user, revoke=revoke)
    return True

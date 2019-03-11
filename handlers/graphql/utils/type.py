from typing import Type

from graphql import ResolveInfo


from handlers.graphql.graphql_handler import ContextProtocol


def get_xentype(type):
    while hasattr(type, "of_type"):
        type = type.of_type

    return type.xentype


def check_access_of_return_value(ctx : ContextProtocol, ret, type : Type["XenObject"]):
    '''
    Return None if user can't use this resource (by resolver's return value)
    :param self:
    :param ctx: GraphQL context (ours)
    :param ret: value
    :param type: value type
    :return:
    '''
    if ctx.user_authenticator.is_admin() or not ret:
        return ret
    type_object = type(xen=ctx.xen, ref=ret['ref'])

    if not type_object.check_access(ctx.user_authenticator, action=None):
        return None
    return ret


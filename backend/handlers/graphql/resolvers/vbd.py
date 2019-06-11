from graphql import ResolveInfo
from sentry_sdk import capture_exception

from handlers.graphql.graphql_handler import ContextProtocol
from handlers.graphql.utils.query import resolve_one
from xenadapter import VBD, VM


def resolve_vbd(root, info: ResolveInfo, **kwargs):
    ctx: ContextProtocol = info.context
    try:
        vbd = VBD(xen=ctx.xen, ref=kwargs['ref'])
        vm_ref = vbd.get_VM()

        if vm_ref != VM.REF_NULL:
            vm = VM(xen=ctx.xen, ref=vm_ref)
            if not vm.check_access(ctx.user_authenticator, VM.Actions.attach_vdi):
                return None

        return resolve_one()(root, info, **kwargs)
    except Exception as e:
        capture_exception(e)
        return None






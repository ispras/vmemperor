from handlers.graphql.resolvers import with_connection
from tornado.options import options

from typing import Optional, List, Union



def resolve_vdi(root, info, **args):
    from xenadapter.disk import VDI, ISO
    if not root:
        return None

    return VDI.resolve_one(field_name='VDI')(root, info)


def resolve_vdis(root, info, **args):
    '''
    Resolve VDI list of VDIs by ref
    :param root:
    :param info:
    :param args:
    :return:
    '''
    from xenadapter.disk import VDI

    return VDI.resolve_many(field_name='VDIs')(root, info, **args)



def vdiType():
    from xenadapter.disk import GVDI
    return GVDI

import constants.re as re
from handlers.graphql.graphql_handler import ContextProtocol
from handlers.graphql.types.vdi import GVDI
from handlers.graphql.utils.subscription import resolve_all_xen_items_changes
from utils.user import user_entities


def resolve_vdis(*args, **kwargs):
    '''
    This resolver is for Subscription "vdis"
    :param args:
    :param kwargs:
    :return:
    '''
    only_isos = kwargs.get('only_isos')
    filter_function = None
    if only_isos is not None:
        async def f(ref, connection):
            if only_isos:
                query =  re.db.table('vdis').get_all(ref).filter(lambda item: item['content_type'] == 'iso')
            else:
                query =  re.db.table('vdis').get_all(ref).filter(lambda item: item['content_type'] != 'iso')

            value = await query.coerce_to('array').run(connection)
            return len(value) == 1
        filter_function = f
    return resolve_all_xen_items_changes(GVDI, filter_function)(*args, **kwargs)



def resolve_isos_for_install(root, info, *args, **kwargs):
    '''
    This resolver is for Query "isos_for_install"
    :param args:
    :param kwargs:
    :return:
    '''
    ctx : ContextProtocol = info.context
    if ctx.user_authenticator.is_admin():
        return re.db.table('vdis').filter(lambda item: item['content_type'] == 'iso')\
            .filter(lambda item: re.db.table('srs').get(item['SR'])['is_tools_sr'] == False)\
            .run()
    else:
        entities = list(user_entities(ctx.user_authenticator))
        return re.db.table('vdis_user').get_all(*entities, index='userid')\
            .filter(lambda item: re.db.table('vdis')\
            .get(item['ref'])['content_type'] == 'iso')\
            .filter(lambda  item: re.db.table('srs')\
            .get(re.db.table('vdis').get(item['ref'])['SR'])['is_tools_sr'] == False)\
            .merge(lambda item: re.db.table('vdis').get(item['ref']))\
            .run()


import constants.re as re
from handlers.graphql.types.vdi import GVDI
from handlers.graphql.utils.subscription import resolve_all_xen_items_changes


def resolve_vdis(*args, **kwargs):
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




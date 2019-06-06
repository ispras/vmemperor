from handlers.graphql.types.pbd import GPBD
from xenadapter.xenobject import XenObject


class PBD (XenObject):
    db_table_name = 'pbds'
    api_class = 'PBD'
    EVENT_CLASSES = ['pbd']
    GraphQLType = GPBD

from handlers.graphql.types.vif import GVIF
from xenadapter.xenobject import XenObject


class VIF(XenObject):
    api_class = 'VIF'
    EVENT_CLASSES = ['vif']
    db_table_name = 'vifs'
    GraphQLType = GVIF


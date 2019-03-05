from handlers.graphql.types.sr import SRActions, GSR
from xenadapter.xenobject import ACLXenObject


class SR(ACLXenObject):
    '''
    https://docs.citrix.com/en-us/xenserver/current-release/storage/manage.html
    '''
    api_class = "SR"
    db_table_name = "srs"
    EVENT_CLASSES=["sr"]
    GraphQLType = GSR
    Actions = SRActions

    @classmethod
    def process_record(cls, xen, ref, record):

        record['space_available'] = int(record['physical_size']) - int(record['physical_utilisation'])
        return super().process_record(xen, ref, record)




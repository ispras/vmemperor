import constants.re as re
from handlers.graphql.types.pool import GPool
from rethinkdb_tools.helper import CHECK_ER
from .xenobject import XenObject
import json
from json import JSONDecodeError
import constants.auth as auth


class Pool (XenObject):
    db_table_name = 'pools'
    api_class = 'pool'
    EVENT_CLASSES = ['pool']
    quotas_table_name = 'quotas'
    GraphQLType = GPool

    @classmethod
    def create_db(cls, indexes=None):
        '''
        This implementation creates a DB for quotas and then runs parent implementation
        The quotas table has the following document structure:
        {
        "userid": "users/1" (user id/ group id with user/group mark)
        "storage": 9007199254740992 (How many storage bytes this user is allowed to have)
        }
        :param db:
        :param indexes:
        :return:
        '''

        re.db.table_create(cls.quotas_table_name, durability='soft', primary_key='userid').run()

        super().create_db(indexes)



    @classmethod
    def process_event(cls, xen, event):
        '''
        Calls parent implementation and then inserts JSON documents from Pool's
        other_config field named vmemperor_quotas_auth.name
        Reads fields with JSON.reads

        :param xen:
        :param event:
        :param db:
        :return:
        '''
        super().process_event(xen, event)

        if 'snapshot' not in event:
            return
        field_name = f'vmemperor_quotas_{auth.name}'
        record =  event['snapshot']
        if field_name not in record['other_config']:
            return

        json_string = record['other_config'][field_name]
        try:
            json_doc = json.loads(json_string)
        except JSONDecodeError as e:
            xen.log.error(f"Error while loading JSON quota info for {auth.name}: {e}")
            return
        for doc in json_doc:
            if 'userid' not in doc:
                xen.log.error(f"Malformed JSON quota document in {field_name}: {doc}")
                return


        CHECK_ER(re.db.table(cls.quotas_table_name).insert(json_doc, conflict='update').run())

    def __init__(self, xen):
        records = Pool.get_all(xen)
        assert len(records) == 1
        super().__init__(xen, ref=records[0])








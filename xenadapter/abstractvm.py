from serflag import SerFlag
import constants.re as re
from authentication import BasicAuthenticator
from xenadapter.aclxenobject import ACLXenObject


class AbstractVM(ACLXenObject):
    api_class = 'VM'

    @classmethod
    def process_record(cls, xen, ref, record):
        '''
        This implementation saves blocked_operations field into db so that check_access could use it
        :param xen:
        :param ref:
        :param record:
        :return:
        '''
        new_rec = super().process_record(xen, ref, record)
        new_rec['_blocked_operations_'] = list(record['blocked_operations'].keys())
        return new_rec

    def check_access(self, auth : BasicAuthenticator, action : SerFlag):
        if action:
            blocked_operations_query = re.db.table(self.db_table_name).get(self.ref).pluck('_blocked_operations_')
            if action.name in blocked_operations_query.run()['_blocked_operations_']:
                return False
        return super().check_access(auth, action)

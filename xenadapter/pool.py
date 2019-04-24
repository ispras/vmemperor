import constants.re as re
from exc import XenAdapterArgumentError
from frozendict import frozendict
from handlers.graphql.types.pool import GPool, PoolActions
from rethinkdb_tools.helper import CHECK_ER
from xenadapter.aclxenobject import ACLXenObject, make_change_to_settings
import constants.auth as auth



class Pool (ACLXenObject):
    """
    Pool object.

    Provides per-pool quotas
    Quota implementation details:
    Defines a quotas implementation using other_config field. Can be used by pool
    This mixin defines the following subtype
    >>> {
    >>> "memory": int # bytes of memory allowed for the user
    >>> "vdi_size": int # bytes of disk space allowed for the user
    >>> "vcpu_count": int # VCPUs allowed for the user
    >>> "vm_count": int # VMs allowed for the user
    >>> "userid": str # the user (or group, prefixed as everywhere)
    }

    Also defines method set_quota writing this data to other_config:
    >>> other_config = {
    >>> "vmemperor":  {
    >>>  "quotas" : {
    >>> "{authenticator_name}" : {
    >>> ... # subtype defined above
    >>> }


    Also defines create_db for quotas table
    Also defines method get_quota_data

    Also defines  get_quota (from db
    """

    db_table_name = 'pools'
    api_class = 'pool'
    EVENT_CLASSES = ['pool']
    quotas_table_name = 'quotas'
    GraphQLType = GPool
    Actions = PoolActions

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

        re.db.table_create(cls.quotas_table_name, durability='soft', primary_key='user_id').run()

        super().create_db(indexes)


    @classmethod
    def process_record(cls, xen, ref, record):
        """
        Calls parent process_record. Then obtains quota data from other_config and writes it onto quotas table
        :param xen:
        :param ref:
        :param record:
        :return:
        """
        new_rec = super().process_record(xen, ref, record)

        quota_diff = cls.compare_settings("quota", new_rec, True)
        for item in quota_diff:
            if item[0] == 'remove':
                if not item[1]:
                    re.db.table(cls.quotas_table_name).get(item[2][0][0]).delete().run()
                else:
                    to_remove = [keys[0] for keys in item[2]]
                    re.db.table(cls.quotas_table_name).get(item[1][0]).replace(lambda doc: doc.without(*to_remove)).run()
                continue
            if item[0] == 'change':
                doc = {
                    'user_id': item[1][0],
                    item[1][1]: item[2][1]
                }
            elif item[0] == 'add':
                if item[1]:
                    doc = {
                        'user_id': item[1][0],
                        **dict(item[2])
                    }
                else:
                    doc = []
                    for to_add in item[2]:
                        if not to_add[1]: # This means no info for this (to_add[0]) particular user. For us, no info means no limits at all
                            continue
                        doc.append({
                        'user_id' : to_add[0],
                        **to_add[1]
                        })
                    if not doc:
                        continue

            re.db.table(cls.quotas_table_name).insert(doc, conflict='update').run()
        return new_rec


    @make_change_to_settings('quota')
    def set_quota(self, user, quota):
        QUOTA_KEYS = {
            'memory': int,
            'vdi_size': int,
            'vcpu_count': int,
            'vm_count': int,
        }
        if user is None:
            return False

        if not (user.startswith('users/') or user.startswith('groups/') or user == 'any'):
            raise XenAdapterArgumentError(self.log, f'Specify user OR group for {self.__class__.__name__}::set_quota. Specified: {user}')

        self._settings.setdefault(user, {})
        for key in quota:
            assert key in QUOTA_KEYS

            if quota[key]:
                self._settings[user][key] = QUOTA_KEYS[key](quota[key])
            else:
                if key in self._settings[user]:
                    del self._settings[user][key]

        for user, quota_struct in  list(self._settings.items()):
            if not len(quota_struct): # Will delete self._settings[user]
                del self._settings[user]


        return True


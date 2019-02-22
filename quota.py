import json
from json import JSONDecodeError
from xenadapter.pool import Pool
import constants.auth as auth
class Quota:
    def __init__(self, xen):
        '''
        :param auth_name:
        '''
        self.auth = xen

        self.pool = Pool(xen)

    def set_storage_quota(self, user, bytes):
        '''
        Set storage quota for user or group to bytes
        :param user: string, beginning with 'users/' for user and 'groups/' for group
        :param bytes:
        :return:
        '''

        # Get other_config field
        other_config = self.pool.get_other_config()
        field_name = f'vmemperor_quotas_{auth.auth_name}'
        if field_name in other_config:
            try:
                docs = json.loads(other_config[field_name])
            except JSONDecodeError:
                docs = []
        else:
            docs = []

        has_userid = False
        def mapper(item):
            nonlocal has_userid
            if item['userid'] == user:
                item['storage'] = bytes
                has_userid = True

            return item

        docs = list(map(mapper, docs))
        if not has_userid:
            docs.append({'userid': user, 'storage': bytes})

        other_config[field_name] = json.dumps(docs)

        self.pool.set_other_config(other_config)


    def get_storage_usage(self, userid =  None):
        '''
        For AdministratorAuthenticator returns stats for all users if userid is None
        Else returns stats for specified user and all his groups, ignoring userid
        :return:
        '''
        from rethinkdb import  RethinkDB
        r = RethinkDB()
        if self.auth.is_admin():
            if userid:
                data = self.pool.db.table(Pool.quotas_table_name).get(userid)\
                    .merge({'storage_usage': self.pool.db.table('vdis_user').merge(lambda rec: {'virtual_size': self.pool.db.table('vdis').get(rec['uuid'])['virtual_size']})\
                            .filter({'access': ['all'], 'userid': userid}).sum('virtual_size')}).run()
            else:
                data = self.pool.db.table('vdis_user').merge(
                     lambda rec: {'virtual_size':
                     self.pool.db.table('vdis').get(rec['ref'])['virtual_size']}).filter({'access':['all']}).group('userid').sum('virtual_size').ungroup()\
                    .eq_join('group', self.pool.db.table(Pool.quotas_table_name))\
                    .map({'userid':r.row['right']['userid'], 'storage': r.row['right']['storage'], 'storage_usage': r.row['left']['reduction']}).run()

        else:
            userid = self.auth.get_id()
            entities = list(map(lambda n: f'groups/{n}', self.auth.get_user_groups()))
            entities.append('users/' + userid)
            data = self.pool.db.table('vdis_user').get_all(*entities, index='userid').merge(
                lambda rec: {'virtual_size':
                                 self.pool.db.table('vdis').get(rec['uuid'])['virtual_size']}).filter(
                {'access': ['all']}).group('userid').sum('virtual_size').ungroup() \
                .eq_join('group', self.pool.db.table(Pool.quotas_table_name)) \
                .map({'userid': r.row['right']['userid'], 'storage': r.row['right']['storage'],
                      'storage_usage': r.row['left']['reduction']}).run()

        return data

    def space_left_after_disk_creation(self, size, userid):
        '''
        return how much space will be left after we create a disk there
        :param size: disk size, in bytes
        :return: free space, in bytes or None if no quota for this user
        '''
        resources = self.get_storage_usage(userid)
        for i in resources:
            if i['userid'] == userid:
                return i['storage'] - i['storage_usage'] - size

        return None






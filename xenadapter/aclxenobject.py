import json
from json import JSONDecodeError
from typing import Dict

from rethinkdb.errors import ReqlNonExistenceError
from serflag import SerFlag

from authentication import BasicAuthenticator
from constants import re as re, auth as auth
from exc import XenAdapterArgumentError
from handlers.graphql.utils.deserialize_auth_dict import deserialize_auth_dict
from xenadapter.helpers import use_logger
from xenadapter.xenobject import XenObject


class ACLXenObject(XenObject):
    '''
    Abstract class for objects that store ACL information in their other_config
    '''


    @classmethod
    def process_record(cls, xen, ref, record):
        '''
        Adds an 'access' field to processed record containing access rights
        if access is changed
        :param xen: XenAdapter
        :param ref: Object ref
        :param record: Object record
        :return:
        '''
        new_rec = super().process_record(xen, ref, record)
        try:
            new_rec['_settings_'] = json.loads(record['other_config']['vmemperor'])
        except (KeyError, JSONDecodeError):
            new_rec['_settings_'] = {}

        access_data = cls.get_access_data(record, new_rec,  ref)
        if access_data is not None:
            new_rec['access'] = access_data

        return new_rec


    @use_logger
    def check_access(self, auth : BasicAuthenticator, action):
        '''
        Check if it's possible to do 'action' by specified user with specified Xen Object
        :param action: action to perform. If action is None, check for the fact that user can view this Xen object
        :param auth: authenticator - an object containing info about user and all its groups

        Implementation details:
        looks for self.db_table_name and then in db to table $(self.db_table_name)_access

        with empty=True if XenStore is empty and ALLOW_EMPTY_OTHERCONFIG set to false

        '''
        if not action:
            action = self.Actions.NONE
        if auth.is_admin():
            return True # admin can do it all

        self.log.info(
            f"Checking {self.__class__.__name__} {self.ref} rights for user {auth.get_id()}: action {action}")
        from rethinkdb.errors import ReqlNonExistenceError

        try:
            access_info = re.db.table(self.db_table_name).get(self.ref).pluck('access').run()
        except ReqlNonExistenceError:
            access_info = None

        access_info = access_info['access'] if access_info else None
        if not access_info:
            if self.ALLOW_EMPTY_OTHERCONFIG:
                self.log.info(f"Access granted to {self} for {auth.get_id()}")
                return True
            else:
                self.log.info(f"Access prohibited to {self} for {auth.get_id()}")
                return False


        username = f'users/{auth.get_id()}'
        groupnames = [f'groups/{group}' for group in auth.get_user_groups()]
        for userid in (username, *groupnames):
            for item in access_info.get(userid, []):
                if not item:
                    continue
                available_actions = self.Actions.deserialize(item)
                if action & available_actions or action == self.Actions.NONE:
                    self.log.info(f"Access granted to {self} for {auth.get_id()}")
                    return True

        self.log.info(f"Access prohibited to {self} for {auth.get_id()}")
        return False

    @classmethod
    def get_access_data(cls, record,  new_rec, ref):
        '''
        Obtain access data from other_config
        :param record: Original object record (is not used in default implementation)
        :param new_rec: New object record (with _settings_ parsed)
        :param ref: Object ref
        :return: None if access data wasnt changed since last call
        '''

        try:
            old_settings = re.db.table(cls.db_table_name).get(ref).pluck('_settings_').run()
        except ReqlNonExistenceError:
            old_settings = {'_settings_' : {}}

        if old_settings['_settings_'] == new_rec['_settings_']:
            return None

        def read_other_config_access_rights(access_settings) -> Dict[str, cls.Actions]:
            if auth.name in access_settings:
                auth_dict = access_settings[auth.name]
                deserialize_auth_dict(cls, auth_dict) # Will raise KeyError if something is wrong
                return auth_dict

            return {}

        if 'access' in new_rec['_settings_']:
            return read_other_config_access_rights(new_rec['_settings_']['access'])
        else:
            return {}

    def get_other_config(self):
        ret = self._get_other_config()
        if isinstance(ret, dict):
            return ret
        else:
            return {}

    def manage_actions(self, action : SerFlag, revoke=False, clear=False, user : str = None):
        '''
        Changes action list for a Xen object
        :param action:
        :param revoke:
        :param user: User ID  in form "users/USER_ID" or "groups/GROUP_ID"
        :param group:
        '''
        if user is None:  # It's root so do nothing
            return

        if not isinstance(action, self.Actions):
            raise TypeError(f"Unsupported type for 'action': {type(action)}. Expected: {self.Actions}")


        from json import JSONDecodeError
        if not (user.startswith('users/') or user.startswith('groups/')):
            raise XenAdapterArgumentError(self.log, f'Specify user OR group for {self.__class__.__name__}::manage_actions. Specified: {user}')


        other_config = self.get_other_config()

        if 'vmemperor' not in other_config:
            emperor = {'access': {auth.name : {}}}
        else:

            try:
                emperor = json.loads(other_config['vmemperor'])
            except JSONDecodeError:
                emperor = {'access': {auth.name: {}}}

        if auth.name in emperor['access'] and not clear:
            previous_actions = deserialize_auth_dict(self, emperor['access'][auth.name])
        else:
            previous_actions = {}
            emperor['access'][auth.name] = {}

        user_actions: SerFlag = previous_actions.get(user, self.Actions.NONE)

        if revoke:
            user_actions = user_actions & ~action
        else:
            user_actions = user_actions | action
        if user_actions:
            emperor['access'][auth.name][user] = user_actions.serialize()
        else:
            if user in emperor['access'][auth.name]:
                del emperor['access'][auth.name][user]

        if not emperor['access'][auth.name]:
            del emperor['access'][auth.name]

        other_config['vmemperor'] = json.dumps(emperor)
        self.set_other_config(other_config)
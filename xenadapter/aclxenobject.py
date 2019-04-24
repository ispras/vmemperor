import json
from functools import wraps
from json import JSONDecodeError
from typing import Dict, Optional, List

from rethinkdb.errors import ReqlNonExistenceError
from serflag import SerFlag
from dictdiffer import diff
from authentication import BasicAuthenticator
from constants import re as re, auth as auth
from exc import XenAdapterArgumentError
from frozendict import FrozenDictEncoder, frozendict
from handlers.graphql.utils.deserialize_auth_dict import deserialize_auth_dict
from xenadapter.helpers import use_logger
from xenadapter.xenobject import XenObject

def make_change_to_settings(subfield):
    '''
    Reads an other_config['vmemperor'] using frozendict as object hook.
    If method returns true, other_config['vmemperor'][subfield][auth.name] will be updated with self._settings
    :param subfield: other_config['vmemperor'][subfield][auth.name] will be put into self._settings. Then method will be called.


    '''
    def decorator(method):
        @wraps(method)

        def  wrapper(self, *args, **kwargs):
            other_config = self.get_other_config()


            try:
                emperor = json.loads(other_config['vmemperor'])
            except (JSONDecodeError, KeyError) as e:
                self.log.warning(f"Unable to extract settings: {e}")
                emperor = {}

            self._settings = emperor.setdefault(subfield, {}).setdefault(auth.name, {})


            ret = method(self, *args, **kwargs)
            if ret:
                emperor[subfield][auth.name] = self._settings
                other_config['vmemperor'] = json.dumps(emperor)
                self.set_other_config(other_config)

            del self._settings
        return wrapper
    return decorator








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
    def check_access(self, auth : BasicAuthenticator, action : Optional[SerFlag]):
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
        for userid in (username, *groupnames, 'any'):
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
    def compare_settings(cls, subfield, new_rec, return_diff = False):
        '''
        Compare other_config settings cache for subfield in DB and in new_rec provided.
        If returns false, cache is not up to date and settings need to be recalculated
        :return:
        '''
        ref = new_rec['ref']
        try:
            old_settings = re.db.table(cls.db_table_name).get(ref).pluck('_settings_').run()['_settings_'][subfield][auth.name]
        except (ReqlNonExistenceError, KeyError):
            old_settings = {}

        new_settings = new_rec.get('_settings_', {}).get(subfield, {}).get(auth.name, {})
        if return_diff:
            return list(diff(old_settings, new_settings, dot_notation=False))
        else:
            return old_settings == new_settings



    @classmethod
    def get_access_data(cls, record,  new_rec, ref) -> Dict[str, List[str]]:
        '''
        Obtain access data from other_config using _settings_ cache
        :param record: Original object record (is not used in default implementation)
        :param new_rec: New object record (with _settings_ parsed)
        :param ref: Object ref
        :return: None if access data wasnt changed since last call
        '''


        def read_other_config_access_rights(access_settings) -> Dict[str, List[str]]:
            if auth.name in access_settings:
                auth_dict = access_settings[auth.name]
                deserialize_auth_dict(cls, auth_dict) # Will raise KeyError if something is wrong
                return auth_dict

            return {}

        if not cls.compare_settings('access', new_rec):
            try:
                return read_other_config_access_rights(new_rec['_settings_']['access'])
            except KeyError:
                return {}

        # if we're here, None means we don't need to update access data

    @make_change_to_settings('access')
    def manage_actions(self, action : SerFlag, revoke=False, clear=False, user : str = None):
        '''
        Changes action list for a Xen object
        :param action:
        :param revoke:
        :param user: User ID  in form "users/USER_ID" or "groups/GROUP_ID"
        :param group:
        '''
        if user is None:  # It's root so do nothing
            return False

        if not isinstance(action, self.Actions):
            raise TypeError(f"Unsupported type for 'action': {type(action)}. Expected: {self.Actions}")

        if not (user.startswith('users/') or user.startswith('groups/') or user == 'any'):
            raise XenAdapterArgumentError(self.log, f'Specify user OR group for {self.__class__.__name__}::manage_actions. Specified: {user}')

        if not clear:
            previous_actions = deserialize_auth_dict(self, self._settings)
        else:
            previous_actions = {}
            self._settings = {}

        user_actions: SerFlag = previous_actions.get(user, self.Actions.NONE)

        if revoke:
            user_actions = user_actions & ~action
        else:
            user_actions = user_actions | action
        if user_actions:
            self._settings[user] = user_actions.serialize()
        else:
            if user in self._settings:
                del self._settings[user]

        return True


        other_config['vmemperor'] = json.dumps(emperor)
        self.set_other_config(other_config)
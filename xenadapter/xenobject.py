import collections
import json
from collections import Mapping
from json import JSONDecodeError

from rethinkdb.errors import ReqlNonExistenceError
from serflag import SerFlag

import XenAPI
from xmlrpc.client import DateTime as xmldt
from datetime import datetime
import pytz

import constants.re as re
import constants.auth as auth
from exc import *
from authentication import BasicAuthenticator

from handlers.graphql.types.gxenobjecttype import GXenObjectType
from handlers.graphql.utils.deserialize_auth_dict import deserialize_auth_dict
from handlers.graphql.utils.graphql_xenobject import assign_xenobject_type_for_graphql_type
from xentools.xenadapter import XenAdapter
import logging
from typing import Optional, Type, Collection, Dict
from xenadapter.helpers import use_logger


def dict_deep_convert(d):
    def convert_to_bool(v):
        if isinstance(v, str):
            if v.lower() == 'true':
                return True
            elif v.lower() == 'false':
                return False
        elif isinstance(v, dict):
            return dict_deep_convert(v)

        return v

    return {k: convert_to_bool(v) for k, v in d.items()}






class XenObjectMeta(type):

    def __getattr__(cls, name):
        if name[0] == '_':
            name = name[1:]

        if name.startswith('async_'):
            name = name[6:]
            from .task import Task
            def async_method(xen, *args, **kwargs):
                try:
                    async_method = getattr(xen.api, 'Async')
                    api = getattr(async_method, cls.api_class)
                    attr = getattr(api, name)
                    ret = attr(*args, **kwargs)
                    return ret

                except XenAPI.Failure as f:
                    raise XenAdapterAPIError(xen.log, f"Failed to execute {cls.api_class}::{name} asynchronously", f.details)
            return async_method

        def method(xen, *args, **kwargs):
            if not hasattr(cls, 'api_class'):
                raise XenAdapterArgumentError(xen.log, "api_class not specified for XenObject")

            api_class = getattr(cls, 'api_class')
            api = getattr(xen.api, api_class)
            attr = getattr(api, name)

            try:
                ret = attr(*args, **kwargs)
                if isinstance(ret, dict):
                    ret = dict_deep_convert(ret)
                return ret
            except XenAPI.Failure as f:
                raise XenAdapterAPIError(xen.log, f"Failed to execute static method {api_class}::{name}", f.details)
        return method


    def __init__(cls, what, bases=None, dict=None):
        from rethinkdb_tools.db_classes import create_db_for_me, create_acl_db_for_me
        from xenadapter.event_dispatcher import add_to_event_dispatcher
        super().__init__(what, bases, dict)
        logging.debug(f"Add XenObject class {cls}")
        add_to_event_dispatcher(cls)
        if 'db_table_name' in dict and dict['db_table_name']:
            if any((base.__name__ == 'ACLXenObject' for base in cls.mro())):
                create_acl_db_for_me(cls)
            else:
                create_db_for_me(cls)

            if 'GraphQLType' in dict and dict['GraphQLType']:
                assign_xenobject_type_for_graphql_type(dict['GraphQLType'], cls)


class XenObject(metaclass=XenObjectMeta):
    api_class = None
    GraphQLType : GXenObjectType = None # Specify GraphQL type to access Rethinkdb cache
    REF_NULL = "OpaqueRef:NULL"
    db_table_name = ''
    Actions: SerFlag = None
    """
    Database table name for a XenObject. Set by every XenObject class. Don't use field value from the class instance as individual instances may disable
    db caching for themselves by clearing this variable. Instead, use a value provided at class level.
    """
    EVENT_CLASSES=[]
    _db_created = False
    FAIL_ON_NON_EXISTENCE = False # Fail if object does not exist in cache database. Usable if you know for sure that filter_record is always true


    def __str__(self):
        return f"<{self.__class__.__name__} \"{self.ref}\">"

    def __repr__(self):
        return self.__str__()

    def __init__(self, xen : XenAdapter, ref : str =None):
        '''

                either
        :param uuid: object uuid
        :param ref: object ref or object
        '''
        # if not isinstance(xen, XenAdapter):
        #          raise AttributeError("No XenAdapter specified")
        self.xen = xen
        self.log = xen.log

        if isinstance(ref, str):
            self.ref = ref
            try:
                self.uuid = self.get_uuid() #  Test that object ID is good
            except XenAdapterAPIError:
                raise ValueError(f"{self.__class__} identifier {ref} is invalid")
        else:
            raise ValueError(
                             f"XenObject:Failed to initialize object of type {self.__class__.__name__}"
                             f": invalid type of ref. Expected: str, got {ref.__class__.__name__}")

    def check_access(self, auth: BasicAuthenticator,  action):
        return True

    def manage_actions(self, actions: Collection, revoke=False, user: str = None):
        pass

    @classmethod
    def process_event(cls,  xen, event):

        '''
        Make changes to a RethinkDB-based cache, processing a XenServer event
        :param event: event dict
                :return: nothing
        '''
        from rethinkdb_tools.helper import CHECK_ER
        from xenadapter.task import Task
        if event['class'] in cls.EVENT_CLASSES:
            if event['operation'] == 'del':
                CHECK_ER(re.db.table(cls.db_table_name).get(event['ref']).delete().run())
                return

            record = event['snapshot']

            if not cls.filter_record(xen, record, event['ref']):
                return


            if event['operation'] in ('mod', 'add'):
                new_rec = cls.process_record(xen, event['ref'], record)
                CHECK_ER(re.db.table(cls.db_table_name).insert(new_rec,
                                                               conflict=lambda id, old_doc, newdoc: old_doc.without(re.r.args(newdoc.keys())).merge(newdoc)
                                                               ).run())

                def get_access_for_task(task_type):
                    '''
                    Returns access rights for task so that only those who have the following access action can view and cancel it
                    :param task_ref:
                    :param task_type - access action to check
                    :return:
                    '''

                    if task_type not in Task.Actions._value2member_map_:
                        return {} # Ignore access for "destroy" - no one gets updates on task destroy except admin

                    userids = re.db.table(cls.db_table_name + '_user')\
                                    .get_all(event['ref'], index='ref')\
                                    .filter(lambda value: value['actions'].set_intersection(['ALL', task_type]) != [])\
                                    .pluck('userid')['userid']\
                                    .coerce_to('array').run()


                    return {user: ['cancel'] for user in userids}


                if 'current_operations' in record and isinstance(record['current_operations'], Mapping):
                    task_docs = [{
                        "ref": k,
                        "object": cls.__name__,
                        "type": v,
                        "access" : get_access_for_task(v)
                    } for k, v in record['current_operations'].items()]
                    if task_docs:
                        CHECK_ER(re.db.table(Task.db_table_name).insert(task_docs, conflict='update').run())




    @classmethod
    def create_db(cls, indexes=None):
        '''
        Creates a DB table named cls.db_table_name and specified indexes
        :param db:
        :param indexes:
        :return:
        '''
        if not cls.db_table_name:
            return
        def index_yielder():
            if hasattr(indexes, '__iter__'):
                for y in indexes:
                    yield y


        table_list = re.db.table_list().run()
        if cls.db_table_name not in table_list:
            re.db.table_create(cls.db_table_name, durability='soft', primary_key='ref').run()
        index_list = re.db.table(cls.db_table_name).index_list().coerce_to('array').run()
        for index in index_yielder():
            if not index in index_list:
                re.db.table(cls.db_table_name).index_create(index).run()
                re.db.table(cls.db_table_name).index_wait(index).run()
                re.db.table(cls.db_table_name).wait().run()




    @classmethod
    def process_record(cls, xen, ref, record) -> dict:
        '''
        Used by init_db. Should return dict with info that is supposed to be stored in DB
        :param record:
        :return: dict suitable for document-oriented DB
        : default: return record as-is, adding a 'ref' field with current opaque ref
        '''

        def get_real_value(k : str, v, current_type: Optional[Type[GXenObjectType]]):
            if current_type and not issubclass(current_type, GXenObjectType):
                raise ValueError(f"current_type should be a subclass of GXenObjectType. Got: {current_type}")
            if isinstance(v, xmldt):
                try:  # XenAPI standard time format. Z means strictly UTC
                    time = datetime.strptime(v.value, "%Y%m%dT%H:%M:%SZ")
                except ValueError:  # try Python time format
                    time = datetime.strptime(v.value, "%Y%m%dT%H:%M:%S")

                time = time.replace(tzinfo=pytz.utc)
                return time
            elif isinstance(v, collections.abc.Mapping):
                type_for_key = current_type.get_type(k) if current_type else None
                if type_for_key and not issubclass(type_for_key, GXenObjectType):
                    if hasattr(type_for_key, 'serialize'): # When we have a complex structure (Mapping) but Schema insists on plain type, e.g. JSONString or we substitute complex type with ID
                        return type_for_key.serialize(v)
                    else:
                        raise ValueError(f"type_for_key should be a subclass of GXenObjectType or contain serialize method. Got: {type_for_key}")
                return {key: get_real_value(key, value, type_for_key)
                        for key, value in v.items() if not type_for_key or key in type_for_key._meta.fields}
            else:
                if current_type:
                    return current_type.get_type(k).serialize(v)
                else:
                    return v

        if cls.GraphQLType:
            new_record = {k: get_real_value(k, v, cls.GraphQLType if cls.GraphQLType else None)
                          for k, v in record.items() if k in cls.GraphQLType._meta.fields}
        else:
            new_record = {k : get_real_value(k, v, None) for k,v in record.items()}

        new_record['ref'] = ref

        return new_record

    @classmethod
    def filter_record(cls, xen, record, ref):
        '''
        Returns true if record is suitable for a class
        :param record: record from get_all_records (pure XenAPI method)
        :return: true if record is suitable for this class
        '''
        return True


    def set_other_config(self, config):
        config = {k : str(v) for k,v in config.items()}
        self.__getattr__('set_other_config')(config)


    def __getattr__(self, name):
        api = getattr(self.xen.api, self.api_class)
        if name == 'ref':
            return self.ref
        if self.GraphQLType and self.db_table_name: #возьми из базы
            if name.startswith("get_"):
                field_name = name[4:]


                if field_name in self.GraphQLType._meta.fields:
                    try:
                        data = re.db.table(self.db_table_name).get(self.ref).pluck(field_name)

                        def method():
                            try:
                                return data.run()[field_name]
                            except re.r.ReqlNonExistenceError as e:
                                return getattr(self, f'_{name}')()

                        return method

                    except KeyError: # Returning a db-only field (i.e. not that of XenAPI) that is not computed (yet or purposefully)
                        return lambda: None



        if name.startswith('async_'):
            async_method = getattr(self.xen.api, 'Async')
            api = getattr(async_method, self.api_class)
            name = name[6:]


        if name[0] == '_':
            name=name[1:]
        attr = getattr(api, name)
        def method (*args, **kwargs):
            try:
                ret = attr(self.ref, *args, **kwargs)

                if isinstance(ret, dict):
                    ret = dict_deep_convert(ret)

                return ret
            except XenAPI.Failure as f:
                raise XenAdapterAPIError(self.log, f"Failed to execute {self.api_class}::{name}", f.details)

        return method


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

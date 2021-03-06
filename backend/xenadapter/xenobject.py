import collections
import time
from collections import Mapping
from http.client import CannotSendRequest

import tornado
from sentry_sdk import capture_exception
from serflag import SerFlag
from tornado import ioloop

import XenAPI
from xmlrpc.client import DateTime as xmldt
from datetime import datetime
import pytz

import constants.re as re
from exc import *
from authentication import BasicAuthenticator
from handlers.graphql.mutation_utils.cleanup import cleanup_defaults

from handlers.graphql.types.base.gxenobjecttype import GXenObjectType
from xenadapter.xenobjectmeta import XenObjectMeta
from xentools.dict_deep_convert import dict_deep_convert
from xentools.xenadapter import XenAdapter
from typing import Optional, Type, Collection

from xentools.xenadapterpool import XenAdapterPool
import json



def set_subtype(field_name: str):
    def setter(input_dict: dict, obj: XenObject):
        '''
        Update values in original dict or field_name but not replace whole dict in its entirety
        :param input:
        :param obj:
        :return:
        '''
        old_dict = getattr(obj, f'get_{field_name}')()
        to_delete = filter(lambda item: input_dict[item] is None, input_dict.keys())

        def item_yielder():
            for delete_key in to_delete:
                del input_dict[delete_key]
                del old_dict[delete_key]
            for key in old_dict:
                if key in input_dict:
                    yield key, input_dict.pop(key)
                else:
                    yield key, old_dict[key]

            yield from input_dict.items()

        arg = {k:v for k,v in item_yielder()}
        getattr(obj, f'set_{field_name}')(arg)
    return setter

def set_subtype_from_input(field_name, return_diff=True):
    '''
    Sets a subtype named field_name of XenObject, cleaning input dict of defaults (empty dict)
    :param field_name:
    :return:
    '''
    thunk = set_subtype(field_name)
    def setter(input : Mapping, obj: XenObject):
        if return_diff:
            old_val = getattr(obj, f'get_{field_name}')()

        thunk(cleanup_defaults(input[field_name]), obj)
        if return_diff:
            new_val = getattr(obj, f'get_{field_name}')
            return old_val, new_val

    return setter


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

        def yield_values():
            for key, value in v.items():
                key = key.replace('-', '_')
                if not type_for_key or key in type_for_key._meta.fields:
                    yield key, get_real_value(key, value, type_for_key)
        return {key: value for key, value in yield_values()}
    else:
        if current_type:
            return current_type.get_type(k).serialize(v)
        else:
            return v

class XenObject(metaclass=XenObjectMeta):
    '''
    Represents a proxy used to call XAPI methods on particular object (with particular ref)
    Attributes:
    db_table_name:
    Database table name for a XenObject. Set by every XenObject class. Don't use field value from the class instance as individual instances may disable
    db caching for themselves by clearing this variable. Instead, use a value provided at class level.

    '''
    api_class = None
    GraphQLType : GXenObjectType = None # Specify GraphQL type to access Rethinkdb cache
    REF_NULL = "OpaqueRef:NULL"
    db_table_name = ''
    Actions: SerFlag = None

    EVENT_CLASSES=[]
    _db_created = False
    FAIL_ON_NON_EXISTENCE = False # Fail if object does not exist in cache database. Usable if you know for sure that filter_record is always true
    OPTIONS_FLOAT_TO_INT = [] #  As GraphQL does not know about big ints, we'll convert floats corresponding to these fields in set_options

    def __str__(self):
        return f"<{self.__class__.__name__} \"{self.ref}\">"

    def __repr__(self):
        return self.__str__()

    def __new__(cls, xen, ref, *args, **kwargs):
        if not ref or not xen or ref == cls.REF_NULL:
            return None
        else:
            return super().__new__(cls)

    def __init__(self, xen : XenAdapter, ref : str):
        '''
        :param xen: XenAdapter used to obtain this object through XenAPI
        :param ref: object ref
        '''
        # if not isinstance(xen, XenAdapter):
        #          raise AttributeError("No XenAdapter specified")
        self.xen = xen
        self.log = xen.log
        if isinstance(ref, str):
            self.ref = ref
            try:
                self.uuid = self.get_uuid() #  Test that object ID is good
            except XenAdapterAPIError as e:
                capture_exception(e)
                raise e
        else:
            raise ValueError(
                             f"XenObject:Failed to initialize object of type {self.__class__.__name__}"
                             f": invalid type of ref. Expected: str, got {ref.__class__.__name__}")

    def check_access(self, auth: BasicAuthenticator,  action : Optional[SerFlag]):
        '''
        Check if it's possible to do 'action' by specified user with specified Xen Object
        :param action: action to perform. If action is None, check for the fact that user can view this Xen object
        :param auth: authenticator - an object containing info about user and all its groups
        :return boolean

        Implementation details:
        ACL is disabled, always return True
        '''
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
                re.db.table(cls.db_table_name).get(event['ref']).delete().run()
                return

            record = event['snapshot']

            if not cls.filter_record(xen, record, event['ref']):
                re.db.table(cls.db_table_name).get(event['ref']).delete().run()
                return


            if event['operation'] in ('mod', 'add'):
                new_rec = cls.process_record(xen, event['ref'], record)
                CHECK_ER(re.db.table(cls.db_table_name).insert(new_rec,
                                                               conflict=lambda id, old_doc, newdoc: old_doc.without(re.r.args(newdoc.keys())).merge(newdoc)
                                                               ).run())

                if 'current_operations' in record and isinstance(record['current_operations'], Mapping):
                    for ref, type in record['current_operations'].items():

                        Task.add_pending_task(xen, ref, cls, event['ref'], type, False)


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

    def get_other_config(self):
        ret = self._get_other_config()
        if isinstance(ret, dict):
            return ret
        else:
            return {}


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
                            except re.r.ReqlNonExistenceError:
                                value = getattr(self, f'_{name}')()
                                return get_real_value(field_name, value, self.GraphQLType)
                            except KeyError:
                                raise AttributeError(name)



                        return method

                    except KeyError: # Returning a db-only field (i.e. not that of XenAPI) that is not computed (yet or purposefully)
                        return lambda: None


        async_destroy = False
        if name.startswith('async_'):
            async_method = getattr(self.xen.api, 'Async')
            api = getattr(async_method, self.api_class)
            name = name[6:]
            if name == 'destroy':
                async_destroy = True


        if name[0] == '_':
            name=name[1:]
        attr = getattr(api, name)
        def method (*args, **kwargs):
            args = [type(self).convert_dict(arg) for arg in args]
            if async_destroy: # Remember last record and write it to the name_description
                rec = self.process_record(self.xen, self.ref, self.get_record())
            try:
                while True:
                    try:
                        ret = attr(self.ref, *args, **kwargs)
                    except CannotSendRequest as e:
                        self.log.error(f"Cannot send request for {self.ref}: {str(e)}, trying again with a new XenAdapter")
                        self.xen = XenAdapterPool().get()
                        self.log = self.xen.log
                        continue

                    break
                if isinstance(ret, dict):
                    ret = dict_deep_convert(ret)

                if async_destroy:
                    def post_destroy(task_id):
                        xen = XenAdapterPool().get()
                        try:
                            from connman import ReDBConnection
                            with ReDBConnection().get_connection():
                                from xenadapter.task import Task
                                task = Task(self.xen, task_id)
                                task.add_to_other_config("last_snapshot", json.dumps(rec))
                        finally:
                            XenAdapterPool().unget(xen)

                    ioloop.IOLoop.current().run_in_executor(None, post_destroy, ret)
                return ret
            except XenAPI.Failure as f:
                raise XenAdapterAPIError(self.log, f"Failed to execute {self.api_class}::{name}", f.details)

        return method

    def set_options(self, options: Mapping):

        for key in options.keys():
            if not options[key]:
                continue

            if isinstance(options[key], Mapping):
                set_subtype_from_input(key)(options, self)
            else:
                attr = getattr(self, f'set_{key}')
                if key in self.OPTIONS_FLOAT_TO_INT:
                    attr(int(options[key]))
                else:
                    attr(options[key])



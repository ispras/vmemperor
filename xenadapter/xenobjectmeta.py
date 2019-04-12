import logging
from collections import Mapping

import XenAPI
from exc import XenAdapterAPIError, XenAdapterArgumentError
from handlers.graphql.utils.graphql_xenobject import assign_xenobject_type_for_graphql_type
from rethinkdb_tools.helper import CHECK_ER
from xentools.dict_deep_convert import dict_deep_convert
import constants.re as re


class XenObjectMeta(type):

    @staticmethod
    def convert_dict(d):
        '''
        XenObject non-static methods require conversion from Python booleans to strings in their dicts.
        Static methods such as X.create(args), on the other hand, accept Python booleans as is so we don't use it in XenObjectMeta::__getattr__
        :param d:
        :return:
        '''
        if not isinstance(d, Mapping):
            return d
        def convert_value(v):
            if v is True:
                return 'true'
            elif v is False:
                return 'false'
            else:
                return str(v)
        return {k: convert_value(v) for k,v in d.items()}

    def __getattr__(cls, name):
        if name[0] == '_':
            name = name[1:]

        if name.startswith('async_'):
            name = name[6:]
            def async_method(xen, *args, **kwargs):
                try:
                    args = [cls.convert_dict(arg) for arg in args]
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
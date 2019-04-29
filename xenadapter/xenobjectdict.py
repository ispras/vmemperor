import collections
from xmlrpc.client import DateTime as xmldt
from datetime import datetime
import pytz




class XenObjectDict(collections.UserDict):
    '''
    This dict converts XMLRPC datetime to Python (UTC) datetime when inserted; Graphene objects with data to JSON
    Only insert UTC times. Create your own implementation for localtimes using tzlocal if you want
    '''

    def __init__(self, *args, **kwargs):
        super().__init__()
        self.update(*args, **kwargs)

    def __setitem__(self, key, value):

        value = self.get_value(value)
        self.data.__setitem__(key, value)

    def update(self, *args, **kwargs):
        if len(args) > 1:
            raise TypeError(f"update expected at most 1 argument, got {len(args)}")
        other = dict(*args, **kwargs)
        for key in other:
            self[key] = other[key]

    def get_value(self, value):
        from handlers.graphql.types.base.objecttype import ObjectType
        if isinstance(value, xmldt):
            try:  # XenAPI standard time format. Z means strictly UTC
                time =  datetime.strptime(value.value, "%Y%m%dT%H:%M:%SZ")
            except ValueError:  # try Python time format
                time =  datetime.strptime(value.value, "%Y%m%dT%H:%M:%S")

            time = time.replace(tzinfo=pytz.utc)
            return time

        elif isinstance(value, dict):
            return XenObjectDict(value)
        elif isinstance(value, list):
            return [self.get_value(item) for item in value]
        elif isinstance(value, ObjectType):
            return XenObjectDict(**value)
        elif hasattr(value, 'value'): # Hack for Graphene enums
            if isinstance(value.value, tuple):
                return value.value[0]
            else:
                return value.value
        else:
            return value

    def __getitem__(self, item):
        if isinstance(self.data[item], XenObjectDict):
            return dict(**self.data[item])
        else:
            return super().__getitem__(item)

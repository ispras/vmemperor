import datetime
import json
from xmlrpc.client import DateTime as xmldt


class DateTimeEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, xmldt):
            t = datetime.datetime.strptime(o.value, "%Y%m%dT%H:%M:%SZ")
            return t.isoformat()
        elif isinstance(o, datetime.datetime):
            return o.isoformat()

        return super().default(o)
from functools import wraps

from connman import ReDBConnection


def with_connection(method):
    @wraps(method)
    def decorator(self, info, *args, **kwargs):
        info.context.log.debug(f"{'/'.join(str(x) for x in info.path)}: Serving field {info.parent_type.name}::{info.field_name} => {info.return_type}")
        with ReDBConnection().get_connection():
            return method(self, info, *args, **kwargs)

    return decorator

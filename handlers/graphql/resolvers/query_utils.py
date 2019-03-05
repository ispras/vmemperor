from functools import reduce

from graphql import ResolveInfo

from handlers.graphql.utils.querybuilder.get_fields import underscore


def resolve_from_root(root, info : ResolveInfo, **kwargs):
    if not info.field_name:
        raise ValueError("Cannot find field_name")

    def reducer(object, key):
        key = underscore(key)  # our JS-optimized api is camelCase while python api is under_score
        if isinstance(object, dict):
            return object.get(key)
        elif isinstance(object, list):
            return [reducer(item, key) for item in object]
        elif object is None:
            return None
        else:
            raise ValueError(object)

    return reduce(reducer, [info.field_name], root)
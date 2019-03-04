from functools import reduce

from graphql import ResolveInfo

from handlers.graphql.utils.querybuilder.get_fields import underscore


def resolve_from_root(root, info : ResolveInfo, **kwargs):
    while info.path[0] not in root:
        del info.path[0] # Supplied root is of more depth than ResolveInfo object

    if not info.path:
        raise ValueError("Cannot find path")

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

    return reduce(reducer, info.path, root)
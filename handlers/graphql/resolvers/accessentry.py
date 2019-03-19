from typing import Type

from serflag import SerFlag

from handlers.graphql.utils.query import resolve_from_root
from handlers.graphql.types.objecttype import ObjectType


def resolve_accessentries(actions_type: Type[SerFlag]):
    def resolver(root, info, **args):

        access = resolve_from_root(root, info, **args)
        if not access:
            return []

        def resolve_entry(key, value):
            actions = actions_type.deserialize_distinct(value)
            return {"user_id": key, "actions": actions}

        ret =[resolve_entry(k,v) for k,v in access.items()]
        return ret

    return resolver


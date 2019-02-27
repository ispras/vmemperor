from typing import Type

from serflag import SerFlag

from handlers.graphql.types.objecttype import ObjectType


def resolve_accessentries(actions_type : Type[SerFlag], access_type : Type[ObjectType]):
    def resolver(root, info, **args):
        if not root.access:
            return []

        def resolve_entry(key, value):
            actions = actions_type.deserialize_distinct(value)
            return access_type(user_id=key, actions=actions)

        ret =[resolve_entry(k,v) for k,v in root.access.items()]
        return ret

    return resolver

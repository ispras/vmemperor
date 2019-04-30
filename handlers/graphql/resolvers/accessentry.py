from typing import Type

from serflag import SerFlag

from handlers.graphql.utils.query import resolve_from_root


def resolve_accessentries(actions_type: Type[SerFlag]):
    def resolver(root, info, **args):

        access = resolve_from_root(root, info, **args)
        if not access:
            return []

        def resolve_entry(key, value):
            actions = actions_type.deserialize_distinct(value)
            actions_all = actions_type.deserialize(value)
            is_owner = actions_all == actions_type.ALL

            return {"user_id": key, "actions": actions, "is_owner": is_owner}

        ret =[resolve_entry(k,v) for k,v in access.items()]
        return ret

    return resolver

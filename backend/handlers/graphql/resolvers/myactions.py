from typing import Type

from serflag import SerFlag

from handlers.graphql.utils.query import resolve_from_root


def resolve_myactions(actions_type: Type[SerFlag]):
    def resolver(root, info, **args):
        actions = resolve_from_root(root, info)
        if not actions:
            return []

        return actions_type.deserialize_distinct(actions)

    return resolver

def resolve_owner(actions_type: Type[SerFlag]):
    def resolver(root, info, **args):
        data = resolve_from_root(root, "my_actions")
        if not data:
            return False
        return actions_type.deserialize(data) == actions_type.ALL

    return resolver

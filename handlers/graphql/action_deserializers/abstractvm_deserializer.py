from typing import Type

from serflag import SerFlag


class AbstractVMDeserializer:
    '''
    This class reimplements deserialize_distinct for resolve_accessentry and resolve_myactions
    so that explicitly blocked operations are taken into account when resolving access actions
    '''
    def __init__(self, root, actions_type : Type[SerFlag]):
        if '_blocked_operations_' not in root:
            raise ValueError(f"_blocked_operations_ should be in DB record for VM, got: {root}")
        self.actions_type = actions_type
        self.ALL = actions_type.ALL
        self.blocked_operations = root['_blocked_operations_']

    def deserialize_distinct(self, value):
        ret =  list(filter(lambda item: item.name not in self.blocked_operations, self.actions_type.deserialize_distinct(value)))
        return ret

    def deserialize(self, value):
        return self.actions_type.deserialize(value)

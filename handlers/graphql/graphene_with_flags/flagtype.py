from graphene.types.definitions import GrapheneEnumType
from serflag import SerFlag


class FlagType(GrapheneEnumType):
    def serialize(self, value):
        # type: (SerFlag) -> Optional[str]
        if isinstance(value, SerFlag):
            return value.value

        return None

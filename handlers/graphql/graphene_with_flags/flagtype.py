from graphene.types.definitions import GrapheneEnumType
from serflag import SerFlag


class FlagType(GrapheneEnumType):
    def serialize(self, value):
        # type: (SerFlag) -> Optional[str]
        if isinstance(value, SerFlag):
            try:
                return value.serialize()[0]
            except IndexError:
                return SerFlag.NONE

        return None

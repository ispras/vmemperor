import graphene.types.typemap as original_typemap
from graphql import GraphQLEnumValue
from graphql.pyutils.enum import OrderedDict
import handlers.graphql.utils.graphql_xenobject as clss
from handlers.graphql.graphene_with_flags.flagtype import FlagType


class TypeMap(original_typemap.TypeMap):
    def construct_enum(self, map, type):
        if hasattr(type._meta.enum, 'NONE') and hasattr(type._meta.enum, 'ALL'):
            values = OrderedDict()
            for name, value in type._meta.enum.__members__.items():
                description = getattr(value, "description", None)
                deprecation_reason = getattr(value, "deprecation_reason", None)
                if not description and callable(type._meta.description):
                    description = type._meta.description(value)

                if not deprecation_reason and callable(type._meta.deprecation_reason):
                    deprecation_reason = type._meta.deprecation_reason(value)

                values[name] = GraphQLEnumValue(
                    name=name,
                    value=value.value,
                    description=description,
                    deprecation_reason=deprecation_reason,
                )

            type_description = (
                type._meta.description(None)
                if callable(type._meta.description)
                else type._meta.description
            )

            return FlagType(
                graphene_type=type,
                values=values,
                name=type._meta.name,
                description=type_description,
            )

        else:
            return super().construct_enum(map, type)

    def construct_objecttype(self, map, type):
        _type = super().construct_objecttype(map,type)
        if _type.name in clss.GRAPHQL_XENOBJECT_DICT:
            _type.xentype = clss.GRAPHQL_XENOBJECT_DICT[_type.name]

        return _type


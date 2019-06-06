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

    def construct_union(self, map, type):
        """
        This implemetation alters two things in standard GraphQL Union
        1) Adds a resolve_type function based on dict root for compatibility with dict_resolver
        2) Adds a xentype to union from one of the union types. Only one of the union types is a Xen type. By design, the second type usually represent a deleted object (by its ref only)
        :param map:
        :param type:
        :return:
        """
        def resolve_type_for_union(root, info):
            return map[root['__typename']]
        type.resolve_type = resolve_type_for_union

        _type = super().construct_union(map, type)
        for t in _type.types:
            if hasattr(t, "xentype"):
                _type.xentype = t.xentype
                break
        return _type
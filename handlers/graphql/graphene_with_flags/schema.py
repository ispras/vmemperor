import graphene.types.schema as original_schema
from graphql.type.introspection import IntrospectionSchema

from handlers.graphql.graphene_with_flags.typemap import TypeMap


class SchemaWithFlags(original_schema.Schema):
    def build_typemap(self):
        initial_types = [
            self._query,
            self._mutation,
            self._subscription,
            IntrospectionSchema,
        ]
        if self.types:
            initial_types += self.types
        self._type_map = TypeMap(
            initial_types, auto_camelcase=self.auto_camelcase, schema=self
        )


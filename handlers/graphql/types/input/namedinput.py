import graphene

from handlers.graphql.types.input.basicxeninput import BasicXenInput


class NamedInput(BasicXenInput):
    name_label = graphene.InputField(graphene.String, description="Object's human-readable name")
    name_description = graphene.InputField(graphene.String, description="Object's human-readable description")

import graphene

from handlers.graphql.graphql_handler import ContextProtocol
from handlers.graphql.types.input.basicxeninput import BasicXenInput
from handlers.graphql.types.objecttype import InputObjectType
from xenadapter.xenobject import XenObject


class NamedInput(BasicXenInput):
    name_label = graphene.InputField(graphene.String, description="Object's human-readable name")
    name_description = graphene.InputField(graphene.String, description="Object's human-readable description")

import graphene

from handlers.graphql.graphql_handler import ContextProtocol
from handlers.graphql.types.objecttype import InputObjectType
from xenadapter.xenobject import XenObject


class NamedInput(InputObjectType):
    ref = graphene.InputField(graphene.ID, required=True, description="Object's ref")
    name_label = graphene.InputField(graphene.String, description="Object's human-readable name")
    name_description = graphene.InputField(graphene.String, description="Object's human-readable description")

def set_name_label(ctx : ContextProtocol, obj : XenObject, changes : NamedInput):
    if changes.name_label is not None:
        obj.set_name_label(changes.name_label)


def set_name_description(ctx: ContextProtocol, obj: XenObject, changes: NamedInput):
    if changes.name_description is not None:
        obj.set_name_description(changes.name_description)
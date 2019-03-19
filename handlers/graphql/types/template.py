from enum import auto

import graphene
from serflag import SerFlag

from handlers.graphql.action_deserializers.abstractvm_deserializer import AbstractVMDeserializer
from handlers.graphql.interfaces.xenobject import GAclXenObject
from handlers.graphql.resolvers.accessentry import resolve_accessentries
from handlers.graphql.resolvers.myactions import resolve_myactions, resolve_owner
from handlers.graphql.types.access import create_access_type
from handlers.graphql.types.gxenobjecttype import GXenObjectType


class TemplateActions(SerFlag):
    clone = auto()
    destroy = auto()


GTemplateActions = graphene.Enum.from_enum(TemplateActions)
GTemplateAccessEntry = create_access_type("GTemplateAccessEntry", GTemplateActions)




class GTemplate(GXenObjectType):
    class Meta:
        interfaces = (GAclXenObject,)

    access = graphene.Field(graphene.List(GTemplateAccessEntry), required=True,
                            resolver=resolve_accessentries(TemplateActions))
    my_actions = graphene.Field(graphene.List(GTemplateActions), required=True)
    is_owner = graphene.Field(graphene.Boolean, required=True, resolver=resolve_owner(TemplateActions))
    os_kind = graphene.Field(graphene.String, description="If a template supports auto-installation, here a distro name is provided")
    hvm = graphene.Field(graphene.Boolean, required=True, description="True if this template works with hardware assisted virtualization")
    enabled = graphene.Field(graphene.Boolean, required=True, description="True if this template is available for regular users")
    is_default_template = graphene.Field(graphene.Boolean, required=True, description="This template is preinstalled with XenServer")

    @staticmethod
    def resolve_my_actions(root, info, *args, **kwargs):
        return resolve_myactions(AbstractVMDeserializer(root, TemplateActions))(root, info, *args, **kwargs)

    @staticmethod
    def resolve_access(root, info, *args, **kwargs):
        return resolve_accessentries(AbstractVMDeserializer(root, TemplateActions))(root, info, *args, **kwargs)

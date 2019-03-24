from enum import auto, Enum

import graphene
from serflag import SerFlag

from handlers.graphql.action_deserializers.abstractvm_deserializer import AbstractVMDeserializer
from handlers.graphql.interfaces.xenobject import GAclXenObject
from handlers.graphql.resolvers.accessentry import resolve_accessentries
from handlers.graphql.resolvers.myactions import resolve_myactions, resolve_owner
from handlers.graphql.types.access import create_access_type
from handlers.graphql.types.gxenobjecttype import GXenObjectType, GSubtypeObjectType
from input.template import GArch, GDistro



class TemplateActions(SerFlag):
    clone = auto()
    destroy = auto()
    change_install_os_options = auto()



GTemplateActions = graphene.Enum.from_enum(TemplateActions)
GTemplateAccessEntry = create_access_type("GTemplateAccessEntry", GTemplateActions)


class InstallOSOptions(GSubtypeObjectType):
    distro = graphene.Field(GDistro, required=True)
    arch = graphene.Field(GArch)
    version = graphene.Field(graphene.String)
    install_repository = graphene.Field(graphene.String)



class GTemplate(GXenObjectType):
    class Meta:
        interfaces = (GAclXenObject,)

    access = graphene.Field(graphene.List(GTemplateAccessEntry), required=True,
                            resolver=resolve_accessentries(TemplateActions))
    my_actions = graphene.Field(graphene.List(GTemplateActions), required=True)
    is_owner = graphene.Field(graphene.Boolean, required=True, resolver=resolve_owner(TemplateActions))
    hvm = graphene.Field(graphene.Boolean, required=True, description="True if this template works with hardware assisted virtualization")
    enabled = graphene.Field(graphene.Boolean, required=True, description="True if this template is available for regular users")
    is_default_template = graphene.Field(graphene.Boolean, required=True, description="This template is preinstalled with XenServer")
    install_options = graphene.Field(InstallOSOptions, description="If the template supports unattended installation, its options are there")

    @staticmethod
    def resolve_my_actions(root, info, *args, **kwargs):
        return resolve_myactions(AbstractVMDeserializer(root, TemplateActions))(root, info, *args, **kwargs)

    @staticmethod
    def resolve_access(root, info, *args, **kwargs):
        return resolve_accessentries(AbstractVMDeserializer(root, TemplateActions))(root, info, *args, **kwargs)

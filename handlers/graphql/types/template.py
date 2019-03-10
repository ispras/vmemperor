from enum import auto

import graphene
from serflag import SerFlag

from handlers.graphql.interfaces.xenobject import GAclXenObject
from handlers.graphql.resolvers.accessentry import resolve_accessentries
from handlers.graphql.types.access import create_access_type
from handlers.graphql.types.gxenobjecttype import GXenObjectType


class TemplateActions(SerFlag):
    clone = auto()


GTemplateActions = graphene.Enum.from_enum(TemplateActions)
GTemplateAccessEntry = create_access_type("GTemplateAccessEntry", GTemplateActions)


class GTemplate(GXenObjectType):
    class Meta:
        interfaces = (GAclXenObject,)

    access = graphene.Field(graphene.List(GTemplateAccessEntry), required=True,
                            resolver=resolve_accessentries(TemplateActions, GTemplateAccessEntry))

    os_kind = graphene.Field(graphene.String, description="If a template supports auto-installation, here a distro name is provided")
    hvm = graphene.Field(graphene.Boolean, required=True, description="True if this template works with hardware assisted virtualization")
    enabled = graphene.Field(graphene.Boolean, required=True, description="True if this template is available for regular users")
from enum import auto

import graphene
from serflag import SerFlag

from handlers.graphql.interfaces.xenobject import GAclXenObject
from handlers.graphql.resolvers.accessentry import resolve_accessentries
from handlers.graphql.resolvers.myactions import resolve_myactions, resolve_owner
from handlers.graphql.resolvers.sr import srType, srContentType
from handlers.graphql.types.access import create_access_type
from handlers.graphql.types.gxenobjecttype import GXenObjectType
from handlers.graphql.types.vbd import GVBD
from handlers.graphql.utils.query import resolve_one, resolve_many


class VDIActions(SerFlag):
    rename = auto()
    plug = auto()
    destroy = auto()


class VDIType(graphene.Enum):
    '''
    VDI class supports only a subset of VDI types, that are listed below.
    '''
    System = "system"
    User = "user"
    Ephemeral = "ephemeral"


GVDIActions = graphene.Enum.from_enum(VDIActions)
GVDIAccessEntry = create_access_type("GVDIAccessEntry", GVDIActions)


class GVDI(GXenObjectType):
    class Meta:
        interfaces = (GAclXenObject,)

    access = graphene.Field(graphene.List(GVDIAccessEntry), required=True,
                            resolver=resolve_accessentries(VDIActions))
    my_actions = graphene.Field(graphene.List(GVDIActions), required=True, resolver=resolve_myactions(VDIActions))
    is_owner = graphene.Field(graphene.Boolean, required=True, resolver=resolve_owner(VDIActions))

    SR = graphene.Field(srType, resolver=resolve_one()) #
    virtual_size = graphene.Field(graphene.Float, required=True) #
    VBDs = graphene.List(GVBD, required=True, resolver=resolve_many())
    content_type = graphene.Field(srContentType, required=True)
    type = graphene.Field(VDIType, required=True)
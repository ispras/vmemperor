from enum import auto

import graphene
from serflag import SerFlag

from handlers.graphql.interfaces.xenobject import GAclXenObject
from handlers.graphql.resolvers.accessentry import resolve_accessentries
from handlers.graphql.resolvers.myactions import resolve_myactions
from handlers.graphql.types.access import create_access_type
from handlers.graphql.types.gxenobjecttype import GXenObjectType

class TaskActions(SerFlag):
    cancel = auto()

GTaskActions = graphene.Enum.from_enum(TaskActions)
GTaskAccessEntry = create_access_type("GTaskAccessEntry", GTaskActions)


class GTask(GXenObjectType):
    class Meta:
        interfaces = (GAclXenObject,)

    access = graphene.Field(graphene.List(GTaskAccessEntry), required=True,
                            resolver=resolve_accessentries(TaskActions))
    my_actions = graphene.Field(graphene.List(GTaskActions), required=True, resolver=resolve_myactions(TaskActions))
    created = graphene.Field(graphene.DateTime, required=True, description="Task creation time")
    finished = graphene.Field(graphene.DateTime, required=True, description="Task finish time")
    progress = graphene.Field(graphene.Float, required=True, description="Task progress")
    result = graphene.Field(graphene.ID, description="Task result if available")
    type = graphene.Field(graphene.String, description="Task result type")
    resident_on = graphene.Field(graphene.ID, description="ref of a host that runs this task")
    error_info = graphene.Field(graphene.List(graphene.String), description="Error strings, if failed")
    status = graphene.Field(graphene.String, description="Task status")
from enum import auto, Enum

import graphene
from serflag import SerFlag

from handlers.graphql.interfaces.aclxenobject import GAclXenObject
from handlers.graphql.resolvers.accessentry import resolve_accessentries
from handlers.graphql.resolvers.myactions import resolve_myactions, resolve_owner
from handlers.graphql.resolvers.user import resolve_user
from handlers.graphql.types.access import create_access_type
from handlers.graphql.types.base.gxenobjecttype import GXenObjectType
from handlers.graphql.types.user import User


class TaskActions(SerFlag):
    cancel = auto()
    remove = auto()

class TaskStatus(Enum):
    Pending = "pending"
    Success = "success"
    Failure = "failure"
    Cancelling = "cancelling"
    Cancelled = "cancelled"

GTaskStatus = graphene.Enum.from_enum(TaskStatus)
GTaskActions = graphene.Enum.from_enum(TaskActions)
GTaskAccessEntry = create_access_type("GTaskAccessEntry", GTaskActions)


class GTask(GXenObjectType):
    class Meta:
        interfaces = (GAclXenObject,)

    access = graphene.Field(graphene.List(GTaskAccessEntry), required=True,
                            resolver=resolve_accessentries(TaskActions))
    my_actions = graphene.Field(graphene.List(GTaskActions), required=True, resolver=resolve_myactions(TaskActions))
    is_owner = graphene.Field(graphene.Boolean, required=True, resolver=resolve_owner(TaskActions))

    created = graphene.Field(graphene.DateTime, required=True, description="Task creation time")
    finished = graphene.Field(graphene.DateTime, description="Task finish time")
    progress = graphene.Field(graphene.Float, required=True, description="Task progress")
    result = graphene.Field(graphene.ID, description="Task result if available")
    who = graphene.Field(User,resolver=resolve_user("who") )
    resident_on = graphene.Field(graphene.ID, description="ref of a host that runs this task")
    error_info = graphene.Field(graphene.List(graphene.String), description="Error strings, if failed")
    status = graphene.Field(GTaskStatus, required=True,  description="Task status")
    object_ref = graphene.Field(graphene.ID, description="An object this task is running on")
    object_type = graphene.Field(graphene.String, description="Object type")
    action = graphene.Field(graphene.String, description="Action kind, if detected. Must be of object_type's action enum (See also: myActions on type corresponding to object_type)")
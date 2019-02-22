import graphene

from handlers.graphql.types.objecttype import ObjectType
from handlers.graphql.types.tasks.graphenetasklist import GrapheneTaskList
from rethinkdb_tools.dbcreator import create_db_for_me


class CreateVMTask(ObjectType):
    id = graphene.Field(graphene.ID, required=True, description="VM creation task ID")
    ref = graphene.Field(graphene.ID, description="ref of created VM")
    state = graphene.Field(graphene.String, description="VM installation state")
    message = graphene.Field(graphene.String, description="Human-readable message")


class CreateVMTaskList(GrapheneTaskList):

    @staticmethod
    def table_name():
        return 'tasks_vms_created'

    @staticmethod
    def task_type():
        return CreateVMTask

create_db_for_me(CreateVMTaskList)
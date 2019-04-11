import graphene

from handlers.graphql.types.objecttype import ObjectType
from handlers.graphql.types.tasks.graphenetasklist import GrapheneTaskList
from rethinkdb_tools.dbcreator import create_db_for_me


class PlaybookTaskState(graphene.Enum):
    Preparing = 'preparing'
    ConfigurationWarning = 'configuration_warning' # this state is raised when we can't connect to one of VMs due to misconfiguration
    Error = 'error'
    Running = 'running'
    Finished = 'finished'
    Unknown = 'unknown'


class PlaybookTask(ObjectType):
    id = graphene.Field(graphene.ID, required=True, description="Playbook task ID")
    playbook_id = graphene.Field(graphene.ID, required=True, description="Playbook ID")
    state = graphene.Field(PlaybookTaskState, required=True, description="Playbook running state")
    message = graphene.Field(graphene.String, required=True, description="Human-readable message: error description or return code")

class PlaybookTaskList(GrapheneTaskList):
    @staticmethod
    def table_name():
        return 'tasks_playbooks'

    @staticmethod
    def task_type():
        return PlaybookTask


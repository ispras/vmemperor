import constants.re as re
from .xenobject import ACLXenObject
from handlers.graphql.interfaces.xenobject import GAclXenObject
from handlers.graphql.types.gxenobjecttype import GXenObjectType
import graphene


class GTask(GXenObjectType):
    class Meta:
        interfaces = (GAclXenObject,)

    created = graphene.Field(graphene.DateTime, required=True, description="Task creation time")
    finished = graphene.Field(graphene.DateTime, required=True, description="Task finish time")
    progress = graphene.Field(graphene.Float, required=True, description="Task progress")
    result = graphene.Field(graphene.ID, description="Task result if available")
    type = graphene.Field(graphene.String, description="Task result type")
    resident_on = graphene.Field(graphene.ID, description="ref of a host that runs this task")
    error_info = graphene.Field(graphene.List(graphene.String), description="Error strings, if failed")
    status = graphene.Field(graphene.String, description="Task status")


class Task(ACLXenObject):
    api_class = 'task'
    EVENT_CLASSES = ['task']
    db_table_name = 'tasks'
    GraphQLType = GTask
    
    @classmethod
    def process_event(cls, xen, event):
        '''
        Make changes to a RethinkDB-based cache, processing a XenServer event

        :param event: event dict
        :param db: rethinkdb DB
        :param authenticator_name: authenticator class name - used by access control
        :return: nothing
        '''
        from rethinkdb_tools.helper import CHECK_ER

        if event['class'] in cls.EVENT_CLASSES:
            if event['operation'] == 'del':
                #CHECK_ER(db.table(cls.db_table_name).get_all(event['ref'], index='ref').delete().run())
                return

            record = event['snapshot']
            if not cls.filter_record(xen, record, event['ref']):
                return

            if event['operation'] in ('mod', 'add'):
                new_rec = cls.process_record(xen, event['ref'], record)
                CHECK_ER(re.db.table(cls.db_table_name).insert(new_rec, conflict='update').run())
                if record['status'] in ['success', 'failure', 'cancelled'] and new_rec['access']: # only our tasks have non-empty 'access'
                    xen.api.task.destroy(event['ref'])



        

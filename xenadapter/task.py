import constants.re as re
from handlers.graphql.types.task import GTask, TaskActions
from .xenobject import ACLXenObject


class Task(ACLXenObject):
    api_class = 'task'
    EVENT_CLASSES = ['task']
    db_table_name = 'tasks'
    GraphQLType = GTask
    Actions = TaskActions
    
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
                # Wait for evictions support in rethinkdb
                return

            record = event['snapshot']

            if event['operation'] in ('mod', 'add'):
                new_rec = cls.process_record(xen, event['ref'], record)
                if not new_rec:
                    return
                CHECK_ER(re.db.table(cls.db_table_name).insert(new_rec, conflict='update').run())
                if record['status'] in ['success', 'failure', 'cancelled'] and new_rec['vmemperor']: # only our tasks have non-empty 'access'
                    xen.api.task.destroy(event['ref'])



    @classmethod
    def process_record(cls, xen, ref, record):
        '''
        Preserve vmemperor=True if exists. If does not exist (Task is not created by us), add vmemperor=False.
        NB: This method would return None if the `ref` does not exist in the Task table.
        New entries are added to task table by calling Async XAPI via `xenobject.__getattr__` or by appearing in `current_operations` in
        XenObject.process_event
        :param xen:
        :param ref:
        :param record:
        :return: None if the value does not exist.
        '''
        current_rec = re.db.table(cls.db_table_name).get(ref).run()
        if not current_rec:
            return None

        new_rec = super().process_record(xen, ref, record)
        if 'vmemperor' in current_rec and current_rec['vmemperor']:
            new_rec['vmemperor'] = current_rec['vmemperor']
        else:
            new_rec['vmemperor'] = False
        return new_rec

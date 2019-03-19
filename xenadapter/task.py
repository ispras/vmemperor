import threading
from typing import Type, Optional, Dict

from rethinkdb.errors import ReqlNonExistenceError

import constants.re as re
from handlers.graphql.types.task import GTask, TaskActions
from rethinkdb_tools.helper import CHECK_ER
from xenadapter.aclxenobject import ACLXenObject
from xenadapter.xenobject import XenObject


class Task(ACLXenObject):
    api_class = 'task'
    EVENT_CLASSES = ['task']
    db_table_name = 'tasks'
    GraphQLType = GTask
    Actions = TaskActions
    pending_db_table_name = 'pending_tasks'
    global_pending_lock = threading.Lock()
    pending_values_under_lock = set()

    @classmethod
    def process_event(cls, xen, event):
        '''
        Make changes to a RethinkDB-based cache, processing a XenServer event

        :param event: event dict
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
    def create_db(cls, indexes=None):
        '''
        Creates a table pending_tasks which contains tasks scheduled for processing by Task class in the following format:
        >>> {
        >>> "ref" : "Task ref",
        >>> "object_type" : "Classname of object who created this task",
        >>> "object_ref" : "ref of object who created this task",
        >>> "access" : "access entries for task",
        >>> "action": "task action - corresponds to one of access actions",
        >>> "vmemperor": "True if this task was created by vmemperor"
        >>> }
        :param indexes:
        :return:
        '''
        super().create_db(indexes=indexes)
        re.db.table_create(cls.pending_db_table_name, durability="soft", primary_key="ref").run()
        re.db.table(cls.pending_db_table_name).wait().run()

    @classmethod
    def add_pending_task(cls, ref: str, object_type: Type[XenObject], object_ref: Optional[str], action: str, vmemperor: bool):
        '''
        Add a pending task
        :param ref: Task ref
        :param object_type: Type of caller
        :param object_ref: Object ref of caller (None if it's called by method)
        :param action: Task action
        :param vmemperor - True if this task was created by VMEmperor, False otherwise.
         Bear in mind that this method does not overwrite pending tasks so that if it was called with vmemperor=True first,
         then subsequent calls won't matter
        :return:
        '''

        if re.db.table(cls.db_table_name).get(ref).run() is not None or\
           re.db.table(cls.pending_db_table_name).get(ref).run() is not None:
            return

        def get_access_for_task():
            '''
            Returns access rights for task so that only those who have the following access action can view and cancel it
            :return:
            '''

            userids = re.db.table(object_type.db_table_name + '_user')\
                            .get_all(object_ref, index='ref')\
                            .filter(lambda value: value['actions'].set_intersection(['ALL', action]) != [])\
                            .pluck('userid')['userid']\
                            .coerce_to('array').run()


            return {user: ['cancel'] for user in userids}

        with cls.global_pending_lock:
            if ref in cls.pending_values_under_lock:
                return
            else:
                cls.pending_values_under_lock.add(ref)

        doc = {
            "ref": ref,
            "object_type": object_type.__name__,
            "object_ref": object_ref,
            "action": action,
            "vmemperor": vmemperor,
            "access": get_access_for_task()
        }
        CHECK_ER(re.db.table(cls.pending_db_table_name).insert(doc).run())
        with cls.global_pending_lock:
            cls.pending_values_under_lock.remove(ref)



    @classmethod
    def process_record(cls, xen, ref, record):
        '''
        NB: This method would return None if the `ref` does not exist in the Task table AND vmemperor=None (i.e. not created by us)
        New entries are added to task table by calling Async XAPI via `xenobject.__getattr__` or by appearing in `current_operations` in
        XenObject.process_event
        :param xen:
        :param ref:
        :param record:
        '''
        try: #  "vmemperor" field is used by Task.process_event
            current_rec = re.db.table(cls.db_table_name).get(ref).pluck('ref', 'vmemperor').run()
        except ReqlNonExistenceError:
            pop_from_pending = re.db.table(cls.pending_db_table_name).get(ref).delete(return_changes=True).run()
            if pop_from_pending['deleted'] != 1:
                return None  # This task is not being processed because it was not requested

            current_rec = pop_from_pending['changes'][0]['old_val']

        new_rec = super().process_record(xen, ref, record)
        return {**current_rec, **new_rec}

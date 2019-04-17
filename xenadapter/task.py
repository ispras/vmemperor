import threading
import time
from collections import Sequence
from typing import Type, Optional, Dict, List, Callable, Union, Mapping
from xml.etree import ElementTree as ET
from xml.etree.ElementTree import ParseError

from rethinkdb.errors import ReqlNonExistenceError
from sentry_sdk import capture_message

import constants.re as re
from handlers.graphql.types.task import GTask, TaskActions
from rethinkdb_tools.helper import CHECK_ER
from xenadapter.aclxenobject import ACLXenObject
from xenadapter.xenobject import XenObject


def get_userids(object_type: Type, object_ref: Optional[Union[str, List[str]]], action: str):
    if issubclass(object_type, ACLXenObject) and object_ref:
        userids = re.db.table(object_type.db_table_name + '_user')
        if isinstance(object_ref, str):
            userids = userids.get_all(object_ref, index='ref')
        else:
            userids = userids.get_all(*object_ref, index='ref')
        userids = userids\
            .filter(lambda value: value['actions'].set_intersection(['ALL', action]) != [])\
            .pluck('userid')['userid']\
            .coerce_to('array').run()
    else:
        userids = []

    return userids

class Task(ACLXenObject):
    api_class = 'task'
    EVENT_CLASSES = ['task']
    db_table_name = 'tasks'
    GraphQLType = GTask
    Actions = TaskActions
    pending_db_table_name = 'pending_tasks'
    global_pending_lock = threading.Lock()
    pending_values_under_lock = set()
    CancelHandlers : Dict[str, Callable[[], None]] = {}

    minor_tasks = ('host.compute_memory_overhead', 'SR.scan')

    @classmethod
    def filter_record(cls, xen, record, ref):
        return record['name_label'] not in cls.minor_tasks

    @classmethod
    def process_event(cls, xen, event):
        '''
        This function processes Task events

        Implementation detail: in will only delete non-async task with 'pending' state. Those are created by
        sync XAPI calls. They possess no interest for us. Failed  sync XAPI calls may have some interest though.
        All other tasks are saved for further review.


        XenCenter uses Async API when possible as does VMEmperor
        '''
        from rethinkdb_tools.helper import CHECK_ER

        if event['class'] in cls.EVENT_CLASSES:
            if event['operation'] == 'del':
                # Set finished field if it's not set
                record = re.db.table(cls.db_table_name).get(event['ref']).run()
                if not record:
                    return

                if not record['name_label'].startswith("Async") and record['status'] == 'pending':
                    re.db.table(Task.db_table_name).get(event['ref']).delete().run()

                return

            record = event['snapshot']
            if not cls.filter_record(xen, record, event['ref']):
                return
            if event['operation'] in ('mod', 'add'):
                new_rec = cls.process_record(xen, event['ref'], record)
                if not new_rec:
                    return
                CHECK_ER(re.db.table(cls.db_table_name).insert(new_rec, conflict='update').run())
                if record['status'] in ('success', 'failure', 'cancelled'):
                    try:
                        task_rec = re.db.table(cls.db_table_name).get(event['ref']).pluck('vmemperor').run()
                        if task_rec.get('vmemperor'):
                            Task(xen=xen, ref=event['ref']).destroy()
                    except ReqlNonExistenceError:
                        pass


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
        table_list = re.db.table_list().run()
        if cls.db_table_name not in table_list:
            super().create_db(indexes=indexes)

        if cls.pending_db_table_name not in table_list:
            re.db.table_create(cls.pending_db_table_name, durability="soft").run()
            re.db.table(cls.pending_db_table_name).wait().run()
            re.db.table(cls.pending_db_table_name).index_create('ref').run()
            re.db.table(cls.pending_db_table_name).index_wait('ref').run()


    @classmethod
    def add_pending_task(cls, xen, ref: str, object_type: Type[XenObject], object_ref: Optional[str], action: str, vmemperor: bool, who=None):
        '''
        Add a pending task.

        :param ref: Task ref
        :param object_type: Type of caller
        :param object_ref: Object ref of caller (None if it's called by method)
        :param action: Task action
        :param vmemperor - True if this task was created by VMEmperor, False otherwise.
         Bear in mind that this method does not overwrite pending tasks so that if it was called with vmemperor=True first,
         then subsequent calls won't matter
        :return:
        '''

        current_vmemperor_status = re.db.table(cls.db_table_name).get(ref).run()
        try:
            if 'vmemperor' in current_vmemperor_status and not vmemperor: # We don't need more than 1 record coming from current_operations. Skipping
                return

            pending_vmemperor_status = re.db.table(cls.pending_db_table_name).get(ref).run()
            if 'vmemperor' in pending_vmemperor_status and not vmemperor:
                return
        except (KeyError, TypeError): # Either None or doesnt have vmemperor there
            pass



        def get_access_for_task(object_ref, object_type, action): #
            '''
            Returns access rights for task so that only those who have the following access action can view and cancel it
            :return:
            '''
            if object_type.db_table_name == 'vifs': # Special case, map it onto VM's VMActions.attach_network
                vif = object_type(xen=xen, ref=object_ref)
                from xenadapter import VM
                object_type = VM
                object_ref = vif.get_VM()
                action = "attach_network"

            userids = get_userids(object_type, object_ref, action)


            return {user: ['cancel', 'remove'] for user in userids}



        doc = {
            "ref": ref,
            "object_type": object_type.__name__,
            "object_ref": object_ref,
            "action": action,
            "access": get_access_for_task(object_ref, object_type, action),
        }
        if vmemperor:
            doc.update({'vmemperor': vmemperor})
        if who:
            doc.update({'who': who})

        CHECK_ER(re.db.table(cls.pending_db_table_name).insert(doc).run())



    @classmethod
    def process_result(cls, result : str):
        try:
            root = ET.fromstring(result)
            return root.text
        except ParseError:
            return result

    @classmethod
    def choose_pending_record(cls, record, pending : Mapping) -> dict:
        def get_type_from_name_label(name_label : str):
            chunks = name_label.split('.')
            if len(chunks) < 2:
                raise ValueError('name_label')
            if chunks[0] == 'Async':
                del chunks[0]

            return chunks[0]

        for rec in pending:
            if rec['object_type'] == get_type_from_name_label(record['name_label']):
                return rec
        else:
            return {}

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


        current_rec = {}
        query = re.db.table(cls.pending_db_table_name).get_all(ref, index='ref')
        pending = query.coerce_to('array').run()
        if len(pending) > 0:
            current_rec.update(cls.choose_pending_record(record, pending))
            query.delete().run()


        new_rec = super().process_record(xen, ref, record)
        new_rec['result'] = cls.process_result(new_rec['result'])
        if new_rec['status'] in ('pending', 'cancelling'):
            del new_rec['finished'] # it doesn't make sense anyway

        return {**current_rec, **new_rec}

    def cancel(self):
        '''
        Cancel Xen tasks via Xen API.
        ancel VMEmperor tasks via VMEmperor cancel handlers. Example: PlaybookLauncher
        :return: 
        '''
        if self.ref in self.CancelHandlers:
            self.CancelHandlers[self.ref]()
        elif self.ref.startswith("OpaqueRef"):
            self._cancel()

    def remove(self):
        CHECK_ER(re.db.table(Task.db_table_name).get(self.ref).delete().run())


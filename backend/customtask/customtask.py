from typing import Type, List, Union

import constants.re as re
from authentication import BasicAuthenticator
from rethinkdb_tools.helper import CHECK_ER
from xenadapter import Task


class CustomTask:
    '''
    Represents a VMEmperor task in task table
    Behaves just like a Xen Task. Supports cancellation (See xenadapter.Task.cancel)
    '''
    def __init__(self, id : str, object_type : Type , object_ref : Union[str, List[str]], action: str, user_authenticator: BasicAuthenticator):
        self.id = id
        self.object_type = object_type
        if isinstance(object_ref, str) or not object_ref:
            self.object_ref = object_ref
        else:
            self.object_ref = ';'.join(object_ref)
        self.action = action
        self.error_info = []
        who = "users/" + user_authenticator.get_id() if not user_authenticator.is_admin() else None
        CHECK_ER(re.db.table(Task.db_table_name).insert({
            'ref': id,
            'object_type': object_type.__name__,
            'object_ref': object_ref,
            "action": action,
            "error_info": self.error_info,
            "created" : re.r.now().run(),
            "name_label": f'{object_type.__name__}.{action}',
            "name_description": "",
            "uuid": id,
            "progress": 0.0,
            "resident_on": None,
            "who": who,
            "status": "pending",
            "result": "",
            "access": {who: ['cancel', 'remove']} if who else None,
        }).run())

    def set_status(self, status=None, progress=None, result=None, error_info_add=None):
        record = {"ref": self.id}
        if status:
            record['status'] = status
            if status not in ('pending', 'cancelling'):
                record['finished'] = re.r.now().run()
            else:
                record['finished'] = None
        if progress:
            record['progress'] = progress
        if result:
            record['result'] = result
        if error_info_add:
            self.error_info.append(error_info_add)
            record['error_info'] = self.error_info


        CHECK_ER(re.db.table(Task.db_table_name).insert(record, conflict='update').run())

    def set_cancel_handler(self, handler):
        def handler_with_status():
            self.set_status(status='cancelling')
            handler()
            self.set_status(status='cancelled')

        Task.CancelHandlers[self.id] = handler_with_status

    def unset_cancel_handler(self):
        del Task.CancelHandlers[self.id]

    def set_name_description(self, name_description):
        record = {"ref": self.id, "name_description": name_description}
        CHECK_ER(re.db.table(Task.db_table_name).insert(record, conflict='update').run())


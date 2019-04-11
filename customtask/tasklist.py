import constants.re as re
from loggable import Loggable
from rethinkdb_tools.helper import  CHECK_ER
from xenadapter.xenobjectdict import XenObjectDict
from abc import ABC, abstractmethod
from rethinkdb import RethinkDB

r = RethinkDB()

class TaskList(ABC, Loggable):
    db = None

    def __init__(self):
        self.init_log()



    def __repr__(self):
        return self.__class__.__name__


    def insert_task(self, user, task_data):
        '''
        Inserts a task considering authentication information
        :param task_data: dict. Use your own class to convert your datatype into a dict and then call upsert_task
        :return:
        '''

        #if not isinstance(task_data, XenObjectDict):
        #    task_data = XenObjectDict(task_data)
        #self.log.debug(f"Upserting task: {task_data['id']}")
        if user:  # replace
            query = re.db.table("tasks").insert()
        else:  # update
            CHECK_ER(self.table().insert({**task_data}, conflict='update').run())
        self.log.debug(f"Task upserted: {task_data['id']}")

    def get_task(self, user, id) -> dict:
        task = self.table().get(id).run()
        if not task:
            raise KeyError(f"No such task: {id}")
        if user == task['userid'] or user == 'root':
            return task
        else:
            raise ValueError('Authentication failed')

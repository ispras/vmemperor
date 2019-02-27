from abc import abstractmethod
from typing import Union, Type
import constants.re as re
from authentication import with_default_authentication
from handlers.graphql.resolvers import with_connection
from handlers.graphql.types.objecttype import ObjectType, InputObjectType
from handlers.graphql.utils.paging import do_paging
from tasklist.tasklist import TaskList
from xenadapter.xenobjectdict import XenObjectDict


class GrapheneTaskList(TaskList):


    @staticmethod
    @abstractmethod
    def task_type() -> Union[Type[ObjectType], Type[InputObjectType]]:
        """
        A graphene type which is a format for this tasklist.
        Each task has current state represented by this graphene type
        :return: type
        """
        ...

    @classmethod
    def resolve_one(cls, field_name=None):
        if not field_name:
            field_name = cls.__name__

        @with_connection
        @with_default_authentication
        def resolver(root, info, **kwargs):

            if 'id' in kwargs:
                id = kwargs['id']
            else:
                id = getattr(root, field_name)

            try:
                record = re.db.table(cls.table_name()).get(id).\
                pluck(*cls.task_type()._meta.fields).run()
            except Exception as e:
                return None
            if not record:
                return None

            return cls.task_type()(**record)

        return resolver

    @classmethod
    def resolve_all(cls, field_name=None):
        if not field_name:
            field_name = f'{cls.__name__}s'


        @with_connection
        @with_default_authentication
        def resolver(root, info, **kwargs):


            query = re.db.table(cls.table_name()).\
                pluck(*cls.task_type()._meta.fields).coerce_to('array')

            if 'page' in kwargs:
                if 'page_size' in kwargs:
                    query = do_paging(query, kwargs['page'], kwargs['page_size'])
                else:
                    query = do_paging(query, kwargs['page'])

                records = query.run()
                return [cls.task_type()(**record) for record in records]

        return resolver


    def upsert_task(self, user : str, task_data):
        assert isinstance(task_data, self.task_type())
        super().upsert_task(user, XenObjectDict(**task_data))

    def get_task(self, user : str, id):
        data = super().get_task(user, id)
        task = self.task_type()
        for field in task._meta.fields.keys():
            setattr(task, field, data[field])


import constants.re as re
from rethinkdb_tools.db_classes import create_db_for_me


class AutoInstallList:
    table_name = 'autoinstalls'
    @classmethod
    def create_db(cls):
        re.db.table_create(cls.table_name, durability='soft').run()
        re.db.table(cls.table_name).wait().run()

    @classmethod
    def insert(cls, args: dict) -> int:
        value = re.db.table(cls.table_name).insert(args).run()
        if not len(value['generated_keys']):
            raise RuntimeError("Can't insert into auto install list")
        else:
            return value['generated_keys'][0]

    @classmethod
    def get(cls, id):
        query = re.db.table(cls.table_name).get(id)
        ret = query.run()
        if ret:
            #query.delete().run()
            del ret['id']
            return ret
        else:
            return {}

create_db_for_me(AutoInstallList)

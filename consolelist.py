from secrets import token_urlsafe
import constants.re as re
from rethinkdb_tools.dbcreator import DBCreator
from rethinkdb import RethinkDB


class ConsoleList(metaclass=DBCreator):
    TABLE_NAME = 'consolelist'
    @classmethod
    def create_db(cls):
        re.db.table_create(cls.TABLE_NAME, durability='soft').run()
        re.db.table(cls.TABLE_NAME).wait().run()

    @classmethod
    def create_secret(self, url):
        secret = token_urlsafe()
        re.db.table(self.TABLE_NAME).insert({
            "id" : secret,
            "url" : url
        }, conflict="error").run()
        return secret

    @classmethod
    async def get_url_by_secret(self, connection, secret):
        '''
        This method is asynchronous since it is used by WebSocket method
        :param connection:
        :param secret:
        :return:
        '''
        query = re.db.table(self.TABLE_NAME).get(secret)
        data = await query.run(connection)
        if not secret:
            return None

        await query.delete().run(connection)
        return data['url']
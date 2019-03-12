import json

from handlers.rest.base import RESTHandler


class PoolListPublic(RESTHandler):
    def get(self):
        '''

        :return: list of pools available for login (ids only)
        '''
        self.write(json.dumps([{'id': 1}]))
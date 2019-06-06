from authentication import *
from exc import *

class DummyAuthenticator(BasicAuthenticator):
    def initialize(self, executor):
        '''
        Establishes connection to a ldap server
        :return:
        '''
        super().initialize(executor)

    def get_id(self):
        return 'dummy'

    def get_name(self):
        return 'dummy'

    def check_credentials(self, password, username, log=None):
        return True

    def get_user_groups(self):
        return {}

    def set_user_groups(self):
        raise NotImplementedError()



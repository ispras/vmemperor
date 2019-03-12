import json
import pickle

from authentication import AdministratorAuthenticator
from exc import AuthenticationException
from handlers.rest.base import RESTHandler


class AdminAuth(RESTHandler):
    def initialize(self, pool_executor, authenticator):
        super().initialize(pool_executor=pool_executor)
        self.user_auth = authenticator

    def post(self):
        '''
        Authenticate using XenServer auth system directly (as admin)
        :param username
        :param password
        :return:
        '''
        username = self.get_argument("username", "")
        password = self.get_argument("password", "")
        try:
            authenticator = AdministratorAuthenticator(user_auth=self.user_auth)
            authenticator.check_credentials(username=username, password=password, log=self.log)
        except AuthenticationException:
            self.write(json.dumps({"status": 'error', 'message': "wrong credentials"}))
            self.set_status(401)
            return

        self.set_secure_cookie("user", pickle.dumps(authenticator))
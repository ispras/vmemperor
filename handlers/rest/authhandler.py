import json
import pickle

from exc import AuthenticationException
from handlers.rest.base import RESTHandler


class AuthHandler(RESTHandler):

    def initialize(self, pool_executor, authenticator):
        '''
        :param executor:
        :param authenticator: authentication object derived from BasicAuthenticator
        :return:
        '''
        super().initialize(pool_executor=pool_executor)
        self.authenticator = authenticator()

    def post(self):
        '''
        Authenticate as a regular user
        params:
        :param username
        :param password
        :return:
        '''

        username = self.get_argument("username", "")
        password = self.get_argument("password", "")
        try:
            self.authenticator.check_credentials(username=username, password=password, log=self.log)
        except AuthenticationException:
            self.write(json.dumps({"status": 'error', 'message': "wrong credentials"}))
            self.log.info('User failed to login with credentials: {0} {1}'.format(username, password))
            self.set_status(401)
            return

        self.write(json.dumps({'status': 'success', 'login': username}))
        self.set_secure_cookie("user", pickle.dumps(self.authenticator))
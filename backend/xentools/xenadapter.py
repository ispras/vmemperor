import threading

import XenAPI
from exc import XenAdapterArgumentError, XenAdapterConnectionError
from loggable import Loggable
from singleton import Singleton


class XenAdapter(Loggable, metaclass=Singleton):
    VMEMPEROR_ACCESS_PREFIX='vm-data/vmemperor/access'


    def __repr__(self):
        if hasattr(self, 'url'):
            return f'XenAdapter <{self.url}>'
        else:
            return 'XenAdapter'

    def __init__(self, settings):
        """creates session connection to XenAPI. Connects using admin login/password from settings
        :param authenticator: authorized authenticator object
    """
        if 'debug' in settings:
               self.debug = bool(settings['debug'])

        self.init_log()
        try:
            url = settings['url']
            username = settings['username']
            password = settings['password']
        except KeyError as e:
            raise XenAdapterArgumentError(self.log, f'Failed to parse settings: {str(e)}')
        self.username = username
        try:
            self.session = XenAPI.Session(url)
            self.session.xenapi.login_with_password(username, password)
            self.log.info (f'Authentication is successful. XenAdapter object created in thread {threading.get_ident()}')
            self.api = self.session.xenapi
            self.url = url
        except OSError as e:
            raise XenAdapterConnectionError(self.log, f"Unable to reach XenServer at {url}: {str(e)}")
        except XenAPI.Failure as e:
            raise XenAdapterConnectionError(self.log,
                                            f'Failed to login: url: "{url}"; username: "{username}"; password: "{password}"; error: {str(e)}')
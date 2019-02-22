import asyncio
import queue

import XenAPI
from exc import XenAdapterConnectionError, XenAdapterArgumentError
from loggable import Loggable
from .singleton import Singleton
from tornado.options import options as opts
import threading
from rethinkdb import RethinkDB
r = RethinkDB()




class XenAdapter(Loggable, metaclass=Singleton):
    AUTOINSTALL_PREFIX = '/autoinstall'
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


        self.conn = r.connect(settings['host'], settings['port'], db=settings['database']).repl()
        if not settings['database'] in r.db_list().run():
            r.db_create(settings['database']).run()

        self.db  = r.db(settings['database'])



class XenAdapterPool(metaclass=Singleton):
    def __init__(self):
        self._xens = queue.Queue()
        self._asyncio_xens = asyncio.Queue()

    def get(self):
        if not self._xens.empty():
           return self._xens.get()
        else:
            xen = XenAdapter({**opts.group_dict('xenadapter'), **opts.group_dict('rethinkdb')}, nosingleton=True)
            xen.log.debug("Getting new XenAdapter from XenAdapterPool: Empty queue!")
            return xen

    def unget(self, xen):
        xen.log.debug("Pushing back into XenPool")
        self._xens.put_nowait(xen)

    async def get_asyncio(self):
        if not self._asyncio_xens.empty():
            return await self._asyncio_xens.get()
        else:
            xen = XenAdapter({**opts.group_dict('xenadapter'), **opts.group_dict('rethinkdb')}, nosingleton=True)
            xen.log.debug("Getting new XenAdapter from XenAdapterPool (for AsyncIO): Empty queue!")
            return xen

    async def unget_asyncio(self, xen):
        xen.log.debug("Pushing back into XenPool (for AsyncIO)")
        await self._asyncio_xens.put(xen)


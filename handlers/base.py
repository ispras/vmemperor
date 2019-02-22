import json
import pickle
from typing import Optional

from rethinkdb import RethinkDB

from xenadapter import XenAdapterPool

r = RethinkDB()
import tornado.ioloop
import tornado.web
from tornado.options import options as opts
from tornado.websocket import WebSocketHandler

from authentication import BasicAuthenticator
from connman import ReDBConnection
from constants import first_batch_of_events
from exc import XenAdapterUnauthorizedActionException, EmperorException
from loggable import Loggable


class HandlerMethods(Loggable):
    def init_executor(self, executor):
        self.executor = executor
        self.debug = opts.debug
        self.init_log()
        first_batch_of_events.wait()
        self.actions_log = self.create_additional_log('actions')


    def prepare(self):
        self.xen = XenAdapterPool().get()
        self.request.xen = self.xen

    def on_finish(self):
        self.log.debug(f"Finishing request: {self.request}")
        XenAdapterPool().unget(self.xen)

    def get_current_user(self):
        return self.get_secure_cookie('user')

    def setRepr(self):
        self.__repr__ = f"{self.__class__.__name__} ({self.request.uri})"



class RequestHandler(tornado.web.RequestHandler):
    def initialize(self, *args, **kwargs):
        super().initialize()



class BaseHandler(RequestHandler, HandlerMethods):
    _ASYNC_KEY = None

    def prepare(self):
        HandlerMethods.prepare(self)
        self.setRepr()
        self.log.debug(f"Handling request: {self.request}")


        self.request.log = self.log
        self.request.actions_log = self.actions_log

        self.request.executor = self.executor
        user = self.get_current_user()
        if user:
            user_authenticator: BasicAuthenticator = pickle.loads(user)
            self.request.user = user_authenticator.get_id()
            self.request.user_authenticator = user_authenticator



    def on_finish(self):
        HandlerMethods.on_finish(self)


    def initialize(self, *args, **kwargs):

        self.init_executor(kwargs['pool_executor'])
        del kwargs['pool_executor']
        super().initialize(*args, **kwargs)
        self.user_authenticator = Optional[BasicAuthenticator]





    def get_current_user(self):
        return self.get_secure_cookie("user")


    def async_run(self, task_ref):
        '''
        Run (wait for end of) asyncronous task (from XenServer)  in executor
        :param task_ref: Task reference
        :return:
        '''
        ioloop = tornado.ioloop.IOLoop.instance()
        ioloop.run_in_executor(self.executor, self._run_async_task, task_ref)


    def try_xenadapter(self, func, post_hook=None):
        '''
        Call a xenadapter method, handle exceptions
        :param func:
        :param post_hook: call this function with a xenadapter method's return value and an authenticator object  as arguments argument (optional)        :return:
        '''
        auth = self.user_authenticator

        try:
            ret = func(auth)

        except XenAdapterUnauthorizedActionException as ee:
            self.set_status(403)
            self.write(json.dumps({'status': 'not allowed', 'details': ee.message}))
            self.finish()


        except EmperorException as ee:
            self.set_status(400)
            self.write(json.dumps({'status': 'error', 'details': ee.message}))
            self.finish()



        else:
            if ret:
                self.write(ret)
            else:
                self.write(json.dumps({'status': 'ok'}))

            self.finish()
            try:
                if post_hook:
                    post_hook(ret, auth)
            except EmperorException as e:
                self.log.error("try_xenadapter: exception catched in post_hook: %s" % e.message)


class BaseWSHandler(WebSocketHandler, HandlerMethods):
    def initialize(self, *args, **kwargs):
        self.init_executor(kwargs['pool_executor'])
        del kwargs['pool_executor']

        super().initialize()

    def prepare(self):
        HandlerMethods.prepare(self)
        self.setRepr()
        self.log.debug(f"Handling WebSocket request: {self.request}")


    def on_finish(self):
        HandlerMethods.on_finish(self)
        self.log.debug(f"Finishing WebSocket request: {self.request}")



    def check_origin(self, origin):
        return True

from __future__ import annotations
#from graphene_tornado.tornado_graphql_handler import TornadoGraphQLHandler as BaseGQLHandler
from tornadoql.tornadoql import GraphQLSubscriptionHandler as BaseGQLSubscriptionHandler, GraphQLHandler as BaseGQLHandler
import pickle

from authentication import BasicAuthenticator
from connman import ReDBConnection
from handlers.base import BaseHandler, BaseWSHandler
from xenadapter import XenAdapter, XenAdapterPool
from tornado.options import options as opts
from typing import _Protocol, Mapping, Any, ContextManager
from logging import Logger
from tornado.web import get_signature_key_version
class ContextProtocol(_Protocol):
    def async_run(self, task_ref : str) -> None:
        '''
        This method awaits for XenAPI task completion in executor
        :param task_ref: XenAPI task reference
        :return: None
        '''
        ...

    log : Logger # XenAdapter log, see loggable.py, logs in vmemperor.log
    actions_log : Logger #XenAdapter actions log, for VM installs, logs in action.log
    xen: XenAdapter
    user_authenticator: BasicAuthenticator





class GraphQLHandler(BaseHandler, BaseGQLHandler):
    request : ContextProtocol
    def initialize(self, *args, **kwargs):
        BaseHandler.initialize(self, *args, **kwargs)
        del kwargs['pool_executor']
        BaseGQLHandler.initialize(self, *args, **kwargs)

    def prepare(self):
        super().prepare()








class GraphQLSubscriptionHandler(BaseWSHandler, BaseGQLSubscriptionHandler):
    request: ContextProtocol

    def initialize(self, *args, **kwargs):
        BaseWSHandler.initialize(self, *args, **kwargs)
        del kwargs['pool_executor']
        BaseGQLSubscriptionHandler.initialize(self, *args, **kwargs)

    def __repr__(self):
        return "GraphQLSubscriptionHandler"

    def prepare(self):
        super().prepare()

        # copy some members to context, we'll use then in a resolvers
        #self.request.async_run = self.async_run

        self.request.log = self.log
        self.request.actions_log = self.actions_log
        self.request.executor = self.executor

    def on_init(self, payload):
        if not payload or not payload['authToken']:
            self.log.error(f"GraphQL connection initiated, but no authToken provided. Payload: {payload}")
            return False
        token = payload['authToken'].strip('\'"')
        cookie = self.get_secure_cookie('user', value=token)
        user_auth = pickle.loads(cookie)
        if not isinstance(user_auth, BasicAuthenticator):
            self.log.error("GraphQL connection initiated, Loaded authToken, not a BasicAuthenticator")
            return False
        self.request.user_authenticator = user_auth


        self.log.debug(f"GraphQL subscription authentication successful (as {user_auth.get_id()})")
        return True



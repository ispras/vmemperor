from __future__ import annotations
#from graphene_tornado.tornado_graphql_handler import TornadoGraphQLHandler as BaseGQLHandler
from tornadoql.tornadoql import GraphQLSubscriptionHandler as BaseGQLSubscriptionHandler, GraphQLHandler as BaseGQLHandler
import pickle

from authentication import BasicAuthenticator
from handlers.base import BaseHandler, BaseWSHandler
from xentools.xenadapter import XenAdapter
from typing import _Protocol
from logging import Logger


class ContextProtocol(_Protocol):
    log : Logger # XenAdapter log, see loggable.py, logs in vmemperor.log
    actions_log : Logger #XenAdapter actions log, for VM installs, logs in action.log
    xen: XenAdapter # XenAdapter used for synchronous operations. It is initalized when a request is accepted and finalized when request is served
    user_authenticator: BasicAuthenticator # Current user





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



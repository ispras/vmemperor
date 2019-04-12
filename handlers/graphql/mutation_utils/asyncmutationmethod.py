import threading
from typing import Optional, Callable

import tornado.ioloop

from authentication import BasicAuthenticator
from connman import ReDBConnection
from handlers.graphql.graphql_handler import ContextProtocol
import constants.re as re
from xenadapter import Task
from xenadapter.xenobject import XenObject

PostMutationHookType = Optional[Callable[[str, ContextProtocol], None]]

class AsyncMutationMethod:
    @staticmethod
    def post_call(taskId, object : XenObject, action: str, ctx: ContextProtocol,  post_mutation_hook: PostMutationHookType):
        '''

        :param taskId:
        :param object: xen object that is the mutation subject
        :param post_mutation_hook: a hook that runs with task result as argument if task is successful
        :param action: string representation of an action that is used in task DB table
        :return:
        '''
        if ctx.user_authenticator.is_admin():
            who = ctx.user_authenticator.get_id()
        else:
            who = 'users/' + ctx.user_authenticator.get_id()


        with ReDBConnection().get_connection():
            Task.add_pending_task(taskId, type(object), object.ref, action, True, who)
            if post_mutation_hook:
                cur = re.db.table('tasks').get_all(taskId).pluck('status', 'result').changes(include_initial=True).run()
                while True:
                    try:
                        val = cur.next()['new_val']
                    except KeyError:
                        return
                    if val and val['status'] == 'success':
                        post_mutation_hook(val['result'], ctx)
                        return
                    elif not val or  val['status'] not in ('pending', 'cancelling'):
                        return


    @staticmethod
    def call(object : XenObject, action : str, ctx: ContextProtocol, args : tuple = (), post_mutation_hook: PostMutationHookType  = None):
        """
        Calls a (async) action, returns a task ID, creates a new thread where it sets up caller field and optionally runs post_mutation_hook
        :param action:
        :param ctx:
        :param post_mutation_hook:
        :return:
        """

        taskId = getattr(object, f'async_{action}')(*args)
        tornado.ioloop.IOLoop.current().run_in_executor(ctx.executor,
                                                        lambda : AsyncMutationMethod.post_call(taskId, object, action, ctx, post_mutation_hook))
        return taskId


    @staticmethod
    def access_denied(method_name, ctx: ContextProtocol):
        """
        Writes a
        :param methodName:
        :param ctx:
        :return:
        """
        pass


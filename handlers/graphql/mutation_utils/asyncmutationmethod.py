from typing import Optional, Callable

import tornado.ioloop

from authentication import BasicAuthenticator
from connman import ReDBConnection
from handlers.graphql.graphql_handler import ContextProtocol
import constants.re as re

PostMutationHookType = Optional[Callable[[str, ContextProtocol], None]]

class AsyncMutationMethod:
    @staticmethod
    def post_call(taskId, ctx: ContextProtocol,  post_mutation_hook: PostMutationHookType):
        '''

        :param taskId:
        :param authenticator:
        :param post_mutation_hook: a hook that runs with task result as argument if task is successful
        :return:
        '''
        if ctx.user_authenticator.is_admin():
            who = ctx.user_authenticator.get_id()
        else:
            who = 'users/' + ctx.user_authenticator.get_id()


        with ReDBConnection().get_connection():
            re.db.table('tasks').insert({
                'ref': taskId,
                'vmemperor': True,
                'who': who
            }, conflict='update').run()


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
    def call(method, ctx: ContextProtocol, post_mutation_hook: PostMutationHookType  = None):
        """
        Calls an async method, returns a task ID, creates a new thread where it sets up caller field and optionally runs post_mutation_hook
        :param method:
        :param ctx:
        :param post_mutation_hook:
        :return:
        """
        taskId = method()
        tornado.ioloop.IOLoop.current().run_in_executor(ctx.executor,
                                                        lambda : AsyncMutationMethod.post_call(taskId, ctx, post_mutation_hook))
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


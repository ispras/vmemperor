import sys

from loggable import Loggable
from asyncio import iscoroutinefunction


class GraphQLLog:
    class GraphQL(Loggable):
        def __init__(self):
            self.init_log()


    def resolve(next, root, info, *args,  **kwargs):
        try:
            result = next(root,info, *args,  **kwargs)
            return result
        except:
            err = sys.exc_info()
            return err[1]



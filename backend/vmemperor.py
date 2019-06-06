import tracemalloc

import sentry_sdk
import pathlib
import signal
import atexit
import constants
import constants.auth
from connman import ReDBConnection
import handlers.graphql.graphql_handler as gql_handler
from createdbs import create_dbs
from eventloop import EventLoop
from handlers.rest.adminauth import AdminAuth
from handlers.rest.authhandler import AuthHandler
from handlers.rest.autoinstall import AutoInstall
from handlers.graphql.root import schema
from handlers.rest.console import ConsoleHandler
from handlers.rest.logout import LogOut
from handlers.rest.playbooklog import PlaybookLogHandler
from handlers.rest.poollistpublic import PoolListPublic
from handlers.rest.postinst import Postinst
from xentools.xenadapter import XenAdapter
import tornado.web
import tornado.httpserver
import tornado.iostream
from dynamicloader import DynamicLoader
from tornado import ioloop
from concurrent.futures import ThreadPoolExecutor
from authentication import BasicAuthenticator
from exc import *
import logging
from tornado.options import define, options as opts, parse_config_file
from tornado.websocket import *
import asyncio
from tornado.platform.asyncio import AnyThreadEventLoopPolicy

# Memory snapshots
s1 = None
s2 = None

def event_loop(executor, authenticator=None, ioloop=None):
    if not ioloop:
        ioloop = tornado.ioloop.IOLoop.instance()

    try:
        loop_object = EventLoop(executor, authenticator)
    except XenAdapterAPIError as e:
        print(f'Launch error: {e.message}')
        exit(2)

    # tornado.ioloop.PeriodicCallback(loop_object.vm_list_update, delay).start()  # read delay from ini

    ioloop.run_in_executor(executor, loop_object.do_access_monitor)
    ioloop.run_in_executor(executor, loop_object.do_user_table)
    constants.xen_events_run.set()
    ioloop.run_in_executor(executor, loop_object.process_xen_events)

    constants.load_playbooks.set()
    ioloop.run_in_executor(executor, loop_object.load_playbooks)


    def usr2_signal_handler(num, stackframe):
        '''
        Send USR2 signal to freeze/unfreeze loading of Xen events
        :param num:
        :param stackframe:
        :return:
        '''
        if constants.xen_events_run.is_set():
            constants.xen_events_run.clear()
        else:
            constants.xen_events_run.set()

    def usr1_signal_handler(num, stackframe):
        '''
        Send USR1 signal to reload Playbook configuration
        :param num:
        :param stackframe:
        :return:
        '''
        constants.load_playbooks.set()

    signal.signal(signal.SIGUSR2, usr2_signal_handler)
    signal.signal(signal.SIGUSR1, usr1_signal_handler)


    return ioloop

class SnapshotHandler(tornado.web.RequestHandler):
    def get(self):
        global s1,s2
        trace = self.get_argument('trace')
        if trace == 's2':
            s2=tracemalloc.take_snapshot()
            print("Begin memory comparison block")
            for i in s2.compare_to(s1,'lineno')[:10]:
                print(i)
            self.write({"status" : "snapshot comparison printed"})
        elif trace == 's1':
            s1=tracemalloc.take_snapshot()
            self.write({"status" : "initial snapshot taken"})

class AuthCheckHandler(tornado.web.RequestHandler):
    def get(self):
        import pickle
        cookie = self.get_secure_cookie('user')
        user_auth = pickle.loads(cookie)
        if not isinstance(user_auth, BasicAuthenticator):
            self.set_status(401)



def make_app(executor, auth_class=None, debug=False):
    if auth_class is None:
        d = DynamicLoader('auth')

        module = opts.authenticator if opts.authenticator else None
        if not auth_class:
            auth_class = d.load_class(class_base=BasicAuthenticator, module=module)[0]

        constants.auth.name = auth_class.__name__

    settings = {
        "cookie_secret": "SADFccadaeqw221fdssdvxccvsdf",
        "login_url": "/login",
        "debug": debug
    }


    app = tornado.web.Application([
        (r"/snapshot", SnapshotHandler),
        (r"/auth", AuthCheckHandler),
        (r"/login", AuthHandler, dict(pool_executor=executor, authenticator=auth_class)),
        (r"/logout", LogOut, dict(pool_executor=executor)),
        (constants.AUTOINSTALL_ROUTE + r'/([^/]+)', AutoInstall, dict(pool_executor=executor)),
        (constants.POSTINST_ROUTE + r'.*', Postinst, dict(pool_executor=executor)),
        (r'/console.*', ConsoleHandler, dict(pool_executor=executor)),
        (r'/pblog.*', PlaybookLogHandler, dict(pool_executor=executor)),
        (r'/list_pools', PoolListPublic, dict(pool_executor=executor)),
        (r'/adminauth', AdminAuth, dict(pool_executor=executor, authenticator=auth_class)),
        (r'/graphql', gql_handler.GraphQLHandler, dict(pool_executor=executor, graphiql=False, schema=schema)),
        (r'/graphiql', gql_handler.GraphQLHandler, dict(pool_executor=executor, graphiql=True, schema=schema)),
        (r'/subscriptions', gql_handler.GraphQLSubscriptionHandler, dict(pool_executor=executor, schema=schema))
    ], **settings)

    app.auth_class = auth_class

    from auth.sqlalchemyauthenticator import SqlAlchemyAuthenticator, User, Group
    if opts.debug and app.auth_class.__name__ == SqlAlchemyAuthenticator.__name__:
        # create test users

        john_group = Group(name='John friends')
        SqlAlchemyAuthenticator.session.add(john_group)
        SqlAlchemyAuthenticator.session.add(User(name='john', password='john', groups=[john_group]))
        SqlAlchemyAuthenticator.session.add(User(name='mike', password='mike', groups=[john_group]))
        SqlAlchemyAuthenticator.session.add(User(name='eva', password='eva', groups=[]))
        try:
            SqlAlchemyAuthenticator.session.commit()
        except:  # Users have already been added
            SqlAlchemyAuthenticator.session.rollback()

    return app


def read_settings():
    """reads settings from ini"""
    define('debug', group='debug', type=bool, default=False)
    define('username', group='xenadapter')
    define('password', group='xenadapter')
    define('url', group='xenadapter')
    define('database', group='rethinkdb', default='test')
    define('host', group='rethinkdb', default='localhost')
    define('port', group='rethinkdb', type=int, default=28015)
    define('delay', group='ioloop', type=int, default=5000)
    define('max_workers', group='executor', type=int, default=16)
    define('vmemperor_host', group='vmemperor', default='localhost')
    define('vmemperor_port', group='vmemperor', type=int, default=8888)
    define('authenticator', group='vmemperor', default='')
    define('log_events', group='ioloop', default='')
    define('user_source_delay', group='ioloop', type=int, default=2)
    define('log_file_name', group='log', default='vmemperor.log')
    define('ansible_pubkey', group='ansible', default='~/.ssh/id_rsa.pub')
    define('ansible_playbook', group='ansible', default='ansible-playbook')
    define('ansible_dir', group='ansible', default='../ansible')
    define('ansible_logs', group='ansible', default='/var/log/vmemperor/ansible')
    define('ansible_networks', group='ansible', default='', multiple=True)
    define('graphql_error_log_file', group='graphql', default='graphql_errors.log')
    define('sentry_dsn', group='vmemperor', default='')
    define('log_dir', group='vmemperor', default='/var/log/vmemperor')

    from os import path

    file_path = path.join(path.dirname(path.realpath(__file__)), 'config.ini')
    parse_config_file(file_path)

    rotateLogs()
    sentry_sdk.init(opts.sentry_dsn)
    constants.ansible_pubkey = path.expanduser(opts.ansible_pubkey)
    ReDBConnection().set_options(opts.host, opts.port)
    if not os.access(constants.ansible_pubkey, os.R_OK):
        logger.warning(
            f"WARNING: Ansible pubkey {constants.ansible_pubkey} (ansible_pubkey config option) is not readable")

    def on_exit():
        constants.xen_events_run.set()
        constants.need_exit.set()

    atexit.register(on_exit)
    # do log rotation


def rotateLogs():
    log_path = pathlib.Path(opts.log_file_name)
    if log_path.exists():
        number = 0
        for file in log_path.parent.glob(opts.log_file_name + ".*"):
            try:
                next_number = int(file.suffix[1:])
                if next_number > number:
                    number = next_number
            except ValueError:
                continue

        for current in range(number, -1, -1):
            file = pathlib.Path(opts.log_file_name + '.{0}'.format(current))
            if file.exists():
                file.rename(opts.log_file_name + '.{0}'.format(current + 1))

        log_path.rename(opts.log_file_name + '.0')


def main():
    """ reads settings in ini configures and starts system"""
    tracemalloc.start()
    create_dbs()
    asyncio.set_event_loop_policy(AnyThreadEventLoopPolicy())
    constants.URL = f"http://{opts.vmemperor_host}:{opts.vmemperor_port}"
    logger.debug(f"Listening on: {constants.URL}")
    executor = ThreadPoolExecutor(max_workers=2048)
    app = make_app(executor)
    server = tornado.httpserver.HTTPServer(app)
    server.listen(opts.vmemperor_port, address="0.0.0.0")
    ioloop = event_loop(executor, authenticator=app.auth_class)
    logger.debug(f"Using authentication: {app.auth_class.__name__}")
    constants.auth_class_name = app.auth_class.__name__
    ioloop.start()

    return


if __name__ == '__main__':
    logger = logging.getLogger(__name__)
    logger.setLevel(logging.DEBUG)
    logger.propagate = False

    sh = logging.StreamHandler(sys.stdout)
    sh.setLevel(logging.DEBUG)
    logger.addHandler(sh)

    read_settings()

    try:
        main()
    except KeyboardInterrupt:
        pass

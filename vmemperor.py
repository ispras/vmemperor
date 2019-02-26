import json

import sentry_sdk


import pathlib
import signal
import atexit

from sentry_sdk import capture_exception

import constants.re as re
import constants
import constants.auth
from connman import ReDBConnection


import handlers.graphql.graphql_handler as gql_handler
from datetimeencoder import DateTimeEncoder
from handlers.rest.base import RESTHandler, auth_required, admin_required
from handlers.graphql.root import schema
from handlers.rest.console import ConsoleHandler
from handlers.rest.createvm import CreateVM
from rethinkdb_tools import db_classes
from rethinkdb_tools.helper import CHECK_ER
from quota import Quota
from xenadapter import XenAdapter, XenAdapterPool
from xenadapter.event_queue import EventQueue
from xenadapter.template import Template
from xenadapter.vm import VM
from xenadapter.network import Network
from xenadapter.disk import ISO, VDI, VDIorISO
from playbookloader import PlaybookLoader, PlaybookEncoder
import traceback
import tornado.web
import tornado.httpserver
import tornado.iostream
from dynamicloader import DynamicLoader
from tornado import ioloop
from concurrent.futures import ThreadPoolExecutor
from urllib.parse import urlencode
import pickle
from rethinkdb.errors import ReqlTimeoutError
from authentication import BasicAuthenticator
from loggable import Loggable
from pathlib import Path
from exc import *
import time
import logging
from tornado.options import define, options as opts, parse_config_file
import threading
import tempfile
import shutil
from ruamel import yaml
from frozendict import frozendict, FrozenDictEncoder
from authentication import AdministratorAuthenticator
from tornado.websocket import *
import asyncio
from tornado.platform.asyncio import AnyThreadEventLoopPolicy
from secrets import token_urlsafe
from rethinkdb import RethinkDB

r = RethinkDB()
sentry_sdk.init("https://0d8af126e03f447fbdf43ef5afc9efc0@sentry.io/1395379")

def table_drop(db, table_name):
    try:
        db.table_drop(table_name).run()
    except r.errors.ReqlOpFailedError as e:
        # TODO make logging
        print(e.message)
        r.db('rethinkdb').table('table_config').filter(
            {'db': opts.database, 'name': table_name}).delete().run()


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


"""
dbms - RethinkDB
db is used as cache
different users should see different info (i.e. only vms created by that user)


views should return info in json format
"""


class AdminAuth(RESTHandler):
    def initialize(self, pool_executor, authenticator):
        super().initialize(pool_executor=pool_executor)
        self.user_auth = authenticator

    def post(self):
        '''
        Authenticate using XenServer auth system directly (as admin)
        :param username
        :param password
        :return:
        '''
        username = self.get_argument("username", "")
        password = self.get_argument("password", "")
        try:
            authenticator = AdministratorAuthenticator(user_auth=self.user_auth)
            authenticator.check_credentials(username=username, password=password, log=self.log)
        except AuthenticationException:
            self.write(json.dumps({"status": 'error', 'message': "wrong credentials"}))
            self.set_status(401)
            return

        self.set_secure_cookie("user", pickle.dumps(authenticator))


class LogOut(RESTHandler):
    def get(self):
        self.clear_cookie('user')
        # self.redirect(self.get_argument("next", "/login"))
        self.write({'status': 'ok'})


class PoolListPublic(RESTHandler):
    def get(self):
        '''

        :return: list of pools available for login (ids only)
        '''
        self.write(json.dumps([{'id': 1}]))


class EventLoop(Loggable):
    """every n seconds asks all vms about their status and updates collections (dbs, tables)
    of corresponding user, if they are logged in (have open connection to dbms notifications)
     and admin db if admin is logged in"""

    def __repr__(self):
        return "EventLoop"

    def __init__(self, executor, authenticator):
        self.debug = opts.debug

        self.init_log()

        self.executor = executor
        self.authenticator = authenticator


        


    def do_user_table(self):
        try:
            conn = ReDBConnection().get_connection()
            log = self.log
            with conn:
                re.db.table_create('users', durability='soft').run()
                re.db.table_create('groups', durability='soft').run()
                users = self.authenticator.get_all_users(log=log)
                groups = self.authenticator.get_all_groups(log=log)
                re.db.table('users').insert(users, conflict='update').run()
                re.db.table('groups').insert(groups, conflict='update').run()
                while True:
                    if constants.need_exit.is_set():
                        return
                    delay = 0
                    while True:
                        if opts.user_source_delay <= delay:
                            break
                        if constants.need_exit.is_set():
                            return
                        sleep_time = 2
                        time.sleep(sleep_time)
                        delay += sleep_time

                    new_users = self.authenticator.get_all_users(log=log)
                    new_groups = self.authenticator.get_all_groups(log=log)
                    re.db.table('users').insert(new_users, conflict='update').run()
                    re.db.table('groups').insert(new_groups, conflict='update').run()

                    new_users_set = set(map(lambda item: item['id'], new_users))
                    users_set = set(map(lambda item: item['id'], users))
                    difference = users_set.difference(new_users_set)
                    if difference:
                        re.db.table('users').get(*difference).delete().run()

                    new_groups_set = set(map(lambda item: item['id'], new_users))
                    groups_set = set(map(lambda item: item['id'], users))
                    difference = groups_set.difference(new_groups_set)
                    if difference:
                        re.db.table('groups').get(*difference).delete().run()


        except Exception as e:
            self.log.error(f"Exception in user_table: {e}")
            traceback.print_exc()
            # tornado.ioloop.IOLoop.current().run_in_executor(self.executor, self.do_access_monitor)
            raise e


    def do_access_monitor(self):
        try:
            conn = ReDBConnection().get_connection()

            # log = self.create_additional_log('AccessMonitor')
            log = self.log
            with conn:
                table_list = re.db.table_list().run()

                class_list = list(db_classes.CREATE_DB_FOR_CLASSES_WITH_ACL)
                query = re.db.table(class_list[0].db_table_name).pluck('ref', 'access') \
                .merge({'table': class_list[0].db_table_name}).changes(include_initial=True, include_types=True)

                def initial_merge(table):
                    nonlocal table_list

                    re.db.table(table).wait().run()
                    table_user = table + '_user'
                    if table_user in table_list:
                        re.db.table_drop(table_user).run()

                    re.db.table_create(table_user, durability='soft').run()
                    re.db.table(table_user).wait().run()
                    re.db.table(table_user).index_create('ref').run()
                    re.db.table(table_user).index_wait('ref').run()
                    re.db.table(table_user).index_create('ref_and_userid', [r.row['ref'], r.row['userid']]).run()

                    re.db.table(table_user).index_wait('ref_and_userid').run()
                    re.db.table(table_user).index_create('userid', r.row['userid']).run()
                    re.db.table(table_user).index_wait('userid').run()
                    # no need yet
                    # re.db.table(table_user).index_create('uuid', r.row['uuid']).run()
                    # re.db.table(table_user).index_wait('uuid').run()

                i = 0
                while i < len(class_list):

                    initial_merge(class_list[i].db_table_name)

                    if i > 0:
                        query = query.union(re.db.table(class_list[i].db_table_name).pluck('ref', 'access') \
                                            .merge({'table': class_list[i].db_table_name}).changes(include_initial=True,
                                                                                                                    include_types=True))
                    i += 1

                # indicate that vms_user table is ready
                constants.user_table_ready.set()
                self.log.debug(f"Changes query: {query}")
                cur = query.run()
                self.log.debug(f"Started access_monitor in thread {threading.get_ident()}")

                def ref_delete(table_user, ref):
                    CHECK_ER(re.db.table(table_user).get_all(ref, index='ref').delete().run())

                while True:
                    try:
                        record = cur.next(1)
                    except ReqlTimeoutError as e:
                        if constants.need_exit.is_set():
                            self.log.debug("Exiting access_monitor")
                            return
                        else:
                            continue

                    if record['new_val']:  # edit
                        ref = record['new_val']['ref']
                        table = record['new_val']['table']
                        access = record['new_val'].get('access', {}) # key - user, value - access data
                        table_user = table + '_user'


                        if access: # Update access rights with data from new_val
                            log.info(f"Updating access rights for {ref} (table {table}): {json.dumps(access)}")
                            for k, v in access.items():
                                CHECK_ER(re.db.table(table_user).insert({'ref': ref, 'userid': k, 'actions': v}, conflict='replace').run())

                        if 'old_val' in record and record['old_val']: # Delete values in old_val but not in new_val
                            old_access_list = record['old_val'].get('access', {}).keys()
                            access_to_delete = set(old_access_list).difference(access.keys())
                            items = [[ref, item] for item in access_to_delete]
                            log.info(f"Deleting access rights for {ref} (table {table}): {items}")
                            CHECK_ER(re.db.table(table_user).get_all(*items).delete().run())

                    else:
                        ref = record['old_val']['ref']
                        table = record['old_val']['table']
                        table_user = table + '_user'
                        log.info(f"Deleting access rights for {ref} (table {table})")
                        CHECK_ER(re.db.table(table_user).get_all(ref, index='ref').delete())
        except Exception as e:
            self.log.error(f"Exception in access_monitor: {e}")
            capture_exception(e)
            # tornado.ioloop.IOLoop.current().run_in_executor(self.executor, self.do_access_monitor)
            raise e

    def load_playbooks(self):
        '''
        Load playbooks into RethinkDB. To trigger reloading, send USR1 signal to this process
        :return:
        '''
        self.log.debug("Starting load_playbooks. You can re-trigger playbook loading by sending USR1 signal")
        while True:
            constants.load_playbooks.wait()
            with ReDBConnection().get_connection():
                re.db.table_create(PlaybookLoader.PLAYBOOK_TABLE_NAME, durability='soft').run()
                PlaybookLoader.load_playbooks()
            constants.load_playbooks.clear()




    def process_xen_events(self):
        self.log.debug(f"Started process_xen_events in thread {threading.get_ident()}")
        from XenAPI import Failure

        event_types = None
        timeout = None
        xen = None
        token_from = None
        def init_xen():
            nonlocal  xen, event_types, token_from, timeout
            xen = XenAdapterPool().get()
            event_types = ["*"]
            token_from = ''
            timeout = 1.0

            xen.api.event.register(event_types)
            return

        init_xen()
        conn = ReDBConnection().get_connection()



        with conn:
            self.log.debug("Started process_xen_events. You can kill this thread and 'freeze'"
                           " cache databases (except for access) by sending signal USR2")
            constants.first_batch_of_events.clear()
            queue = EventQueue()

            while True:
                try:
                    if not constants.xen_events_run.is_set():
                        self.log.debug("Freezing process_xen_events")
                        constants.xen_events_run.wait()
                        self.log.debug("Unfreezing process_xen_events")
                    if constants.need_exit.is_set():
                        self.log.debug("Exiting process_xen_events")
                        return
                    try:
                        event_from_ret = xen.api.event_from(event_types, token_from, timeout)
                    except Exception:
                        self.log.error("Connection error,trying to reconnect")
                        init_xen()
                        continue

                    events = event_from_ret['events']
                    token_from = event_from_ret['token']

                    for event in events:
                        queue.put(event)

                    if not constants.first_batch_of_events.is_set():
                        queue.join()
                        constants.first_batch_of_events.set()

                except Failure as f:
                    if f.details == ["EVENTS_LOST"]:
                        self.log.warning("Reregistering for events...")
                        xen.api.event.register(event_types)
                    else:
                        raise f


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


class Postinst(RESTHandler):
    def get(self):
        os = self.get_argument("os")
        device = self.get_argument("device")
        pubkey_path = pathlib.Path(constants.ansible_pubkey)
        pubkey = pubkey_path.read_text()
        self.render(f'templates/installation-scenarios/postinst/{os}', pubkey=pubkey, device=device)


class AutoInstall(RESTHandler):
    def get(self, os_kind):
        '''
        This is used by CreateVM
        :param os_kind:
        :return:
        '''
        filename = None
        hostname = self.get_argument('hostname')
        device = self.get_argument('device')
        username = self.get_argument('username', default='')
        password = self.get_argument('password', default='')
        mirror_url = self.get_argument('mirror_url', default='')
        fullname = self.get_argument('fullname', default='')
        ip = self.get_argument('ip', default='')
        gateway = self.get_argument('gateway', default='')
        netmask = self.get_argument('netmask', default='')
        dns0 = self.get_argument('dns0', default='')
        dns1 = self.get_argument('dns1', default='')
        part = self.get_argument('partition').split('-')
        partition = {'method': 'regular',
                     'mode': 'mbr',
                     'expert_recipe': [],
                     'swap': ''}
        if part[0] == 'auto':
            part.remove('auto')
        if 'swap' not in part and 'centos' not in os_kind:
            partition['swap'] = '2048'
        if 'swap' in part:
            ind = part.index('swap')
            partition['swap'] = part[ind + 1]
            part.remove('swap')
            part.remove(part[ind])
        if 'mbr' in part:
            part.remove('mbr')
        if 'gpt' in part:
            partition['mode'] = 'gpt'
            part.remove('gpt')
        if 'lvm' in part:
            partition['method'] = 'lvm'
            part.remove('lvm')
            if '/boot' not in part:
                raise ValueError("LVM partition require boot properties")
        partition['expert_recipe'] = [{'mp': part[i + 0], 'size': part[i + 1], 'fs': part[i + 2]}
                                      for i in range(0, len(part), 3)]
        if 'ubuntu' in os_kind or 'debian' in os_kind:
            mirror_url = mirror_url.split('http://')[1]
            mirror_path = mirror_url[mirror_url.find('/'):]
            mirror_url = mirror_url[:mirror_url.find('/')]
            filename = 'debian.jinja2'

            pubkey = ""  # We handle it in postinst
        if 'centos' in os_kind:
            for part in partition['expert_recipe']:
                if part['mp'] is "/":
                    part['name'] = 'root'
                else:
                    part['name'] = part['mp'].replace('/', '')
            filename = 'centos-ks.cfg'
            mirror_path = ''
            pubkey_path = pathlib.Path(constants.ansible_pubkey)
            pubkey = pubkey_path.read_text()
        if not filename:
            raise ValueError(f"OS {os_kind} doesn't support autoinstallation")
        # filename = 'raid10.cfg'
        self.render(f"templates/installation-scenarios/{filename}", hostname=hostname, username=username,
                    fullname=fullname, password=password, mirror_url=mirror_url, mirror_path=mirror_path,
                    ip=ip, gateway=gateway, netmask=netmask, dns0=dns0, dns1=dns1, partition=partition, pubkey=pubkey,device=device,
                    postinst=f"{constants.URL}{constants.POSTINST_ROUTE}?{urlencode({'os': 'debian', 'device':device})}")


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

        (r"/login", AuthHandler, dict(pool_executor=executor, authenticator=auth_class)),
        (r"/logout", LogOut, dict(pool_executor=executor)),
        (XenAdapter.AUTOINSTALL_PREFIX + r'/([^/]+)', AutoInstall, dict(pool_executor=executor)),
        (constants.POSTINST_ROUTE + r'.*', Postinst, dict(pool_executor=executor)),
        (r'/console.*', ConsoleHandler, dict(pool_executor=executor)),
        (r'/createvm', CreateVM, dict(pool_executor=executor)),

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
    define('ansible_dir', group='ansible', default='./ansible')
    define('ansible_logs', group='ansible', default='./ansible_logs')
    define('ansible_networks', group='ansible', default='', multiple=True)
    define('graphql_error_log_file', group='graphql', default='graphql_errors.log')

    from os import path

    file_path = path.join(path.dirname(path.realpath(__file__)), 'login.ini')
    parse_config_file(file_path)

    rotateLogs()

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


def create_dbs():

    re.db =  r.db(opts.database)
    with ReDBConnection().get_connection():
        logging.debug(f"Creating tables for {db_classes.CREATE_DB_FOR_CLASSES}")
        if opts.database in r.db_list().run():
            r.db_drop(opts.database).run()

        r.db_create(opts.database).run()
        logging.debug(f"Creating tables (with ACL) for {db_classes.CREATE_DB_FOR_CLASSES_WITH_ACL}")
        for cl in db_classes.CREATE_DB_FOR_CLASSES_WITH_ACL:
            cl.create_db()



        for cl in db_classes.CREATE_DB_FOR_CLASSES:
            cl.create_db()


def main():
    """ reads settings in ini configures and starts system"""

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

import json
import threading
import time
import traceback

from rethinkdb.errors import ReqlTimeoutError
from sentry_sdk import capture_exception
from tornado.options import options as opts

import constants
from connman import ReDBConnection
from constants import re as re
from loggable import Loggable
from playbookloader import PlaybookLoader
from rethinkdb_tools import db_classes
from rethinkdb_tools.helper import CHECK_ER
from xenadapter.event_queue import EventQueue
from xentools.xenadapterpool import XenAdapterPool


class EventLoop(Loggable):
    '''

    Maintains user tables
    '''
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


                i = 0
                while i < len(class_list):

                    if i > 0:
                        query = query.union(re.db.table(class_list[i].db_table_name).pluck('ref', 'access') \
                                            .merge({'table': class_list[i].db_table_name}).changes(include_initial=True,
                                                                                                                    include_types=True))
                    i += 1

                self.log.debug(f"Changes query: {query}")
                cur = query.run()
                self.log.debug(f"Started access_monitor in thread {threading.get_ident()}")


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
                        access = record['new_val'].get('access')
                        if not access:
                            access = {}

                        table_user = table + '_user'


                        if access: # Update access rights with data from new_val
                            log.info(f"Updating access rights for {ref} (table {table}): {json.dumps(access)}")
                            for k, v in access.items():
                                existing_item_query = re.db.table(table_user).get_all([ref, k], index='ref_and_userid')
                                rec_len = len(existing_item_query.coerce_to('array').run())
                                if rec_len == 1:
                                    CHECK_ER(existing_item_query.update({'actions': v}).run())
                                elif rec_len > 1:
                                    log.error(f"broken table {table_user}:  Object {ref} has {rec_len} entries for user {k}, while only 0 or 1 is allowed")
                                else:
                                    CHECK_ER(re.db.table(table_user).insert({'ref': ref, 'userid': k, 'actions': v}, conflict='replace').run())
                        if 'old_val' in record and record['old_val']: # Delete values in old_val but not in new_val
                            old_access_list = record['old_val'].get('access')
                            if not old_access_list:
                                old_access_list = {}

                            users_to_delete = set(old_access_list).difference(access.keys())
                            if users_to_delete:
                                items = [[ref, user] for user in users_to_delete]
                                log.info(f"Deleting access rights for one user in table {table}: {items}")
                                CHECK_ER(re.db.table(table_user).get_all(*items, index='ref_and_userid').delete().run())


                    else:
                        ref = record['old_val']['ref']
                        table = record['old_val']['table']
                        table_user = table + '_user'
                        log.info(f"Deleting all access rights for {ref} (table {table})")
                        CHECK_ER(re.db.table(table_user).get_all(ref, index='ref').delete().run())
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
import json

from rethinkdb import RethinkDB
from rethinkdb.ast import ReQLEncoder
from serflag import SerFlag

import constants.re as re
import queue
from xenadapter import singleton
from loggable import Loggable
import asyncio

class ReDBConnection(Loggable, metaclass=singleton.Singleton):
    def __init__(self):

        self.conn_queue : queue.Queue
        self.host : str = None
        self.port : int = None
        self.db = re.db
        self.user : str = None
        self.password : str = None
        self.init_log()

    def set_options(self, host, port, db=None, user='admin', password=None):
        self.conn_queue = queue.Queue()
        self.conn_queue_async = asyncio.Queue()
        self.host = host
        self.port = port
        self.db = db
        self.user = user
        self.password = password

        self.log.info(f"Options set: {repr(self)}")

    def __repr__(self):
        return f"ReDBConnection <host {self.host}, port {self.port}, db '{self.db}', user '{self.user}', password '{self.password}'>"

    def _get_new_connection_async(self):
        class AsyncConnection:
            async def __aenter__(myself):
                r = RethinkDB()
                r.set_loop_type('asyncio')
                if not hasattr(myself, 'conn') or not myself.conn or not myself.conn.is_open():

                    myself.conn = await r.connect(self.host, self.port, self.db, user=self.user, password=self.password)
                    self.log.debug(f"Connecting using connection: {myself} (AsyncIO)")

                if not myself.conn.is_open():
                    raise Exception("Cannot open a new rethinkdb connection...")

                return myself.conn

            async def __aexit__(myself, exc_type, exc_val, exc_tb):
                try:
                    if not myself.conn or not myself.conn.is_open():
                        return
                    self.conn_queue_async.put_nowait(myself)
                    self.log.debug("Releasing connection into async queue: {0}".format(myself))
                except Exception as e:
                    self.log.error(f"Exception while releasing connection into async queue: {e}")

        return AsyncConnection()


    def _get_new_connection(self):
        class Connection:
            def __enter__(myself):
                r = RethinkDB()
                if not hasattr(myself, 'conn') or not myself.conn  or not myself.conn.is_open():

                    myself.conn = r.connect(self.host, self.port, self.db, user=self.user, password=self.password,
                                         )
                    self.log.debug(f"Connecting using connection: {myself}")

                if not myself.conn.is_open():
                    raise Exception("Cannot open a new rethinkdb connection...")

                self.log.debug(f"Repl-ing connection: {myself}")
                myself.conn.repl()

                return myself.conn

            def __exit__(myself, exc_type, exc_val, exc_tb):
                # TODO handle if connection is closed
                try:
                    if not  myself.conn or not myself.conn.is_open():
                        return
                    self.conn_queue.put_nowait(myself)
                    self.log.debug("Releasing connection into Queue: {0}".format(myself))
                except Exception as e:
                    self.log.error(f"Exception while releasing connection into Queue: {e}")

            def __repr__(myself):
                return repr(self)

        return Connection()

    def get_connection(self):
        try:
            conn = self.conn_queue.get_nowait()
            self.log.debug("Getting connection from Queue: {0}".format(conn))
            try:
                if not conn.conn.is_open():
                    self.log.debug("Connection from queue is not opened, skipping")
                    return self._get_new_connection()
            except Exception as e:
                self.log.error(f"Error while trying to obtain a Connection: {e}, returning new Connection")
                return self._get_new_connection()

            return conn
        except queue.Empty:
            self.log.debug("No connections in Queue, creating a new one...")
            return self._get_new_connection()

    def get_async_connection(self):
        if not self.conn_queue_async.empty():
            conn = self.conn_queue_async.get_nowait()
            self.log.debug("Getting connection from Queue: {0}".format(conn))
            try:
                if not conn.conn.is_open():
                    self.log.debug("Connection from queue is not opened, skipping")
                    return self._get_new_connection_async()
            except Exception as e:
                self.log.error(f"Error while trying to obtain a Connection: {e}, returning new Connection")
                return self._get_new_connection_async()

            return conn
        else:
            self.log.debug("No connections in Queue, creating a new one...")
            return self._get_new_connection_async()






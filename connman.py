import json
from functools import partial
from rethinkdb import RethinkDB
from rethinkdb.ast import ReQLEncoder
from sentry_sdk import capture_exception
from serflag import SerFlag

import threading

import constants.re as re
from xenadapter import singleton
from loggable import Loggable
import asyncio

local = threading.local()

class ReDBConnection(Loggable, metaclass=singleton.Singleton):
    def __init__(self):
        self.conn_queue_async = asyncio.Queue()
        self.host : str = None
        self.port : int = None
        self.db = re.db
        self.user : str = None
        self.password : str = None
        self.init_log()

    def set_options(self, host, port, db=None, user='admin', password=None):
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
                    self.log.debug(f"Connecting using connection: {id(myself)} (AsyncIO)")

                if not myself.conn.is_open():
                    raise Exception("Cannot open a new rethinkdb connection...")

                return myself.conn

            async def __aexit__(myself, exc_type, exc_val, exc_tb):
                try:
                    if not myself.conn or not myself.conn.is_open():
                        return
                    self.conn_queue_async.put_nowait(myself)
                    self.log.debug(f"Releasing connection into async queue: {id(myself)}")
                except Exception as e:
                    self.log.error(f"Exception {e} while releasing connection {id(myself)} into async queue")
                    capture_exception(e)

        return AsyncConnection()


    def _get_new_connection(self):
        class Connection:
            def __init__(myself):
                r = RethinkDB()

                if not hasattr(myself, 'conn') or not myself.conn  or not myself.conn.is_open():
                    myself.conn = r.connect(self.host, self.port, self.db, user=self.user, password=self.password,)
                    self.log.debug(f"Connecting"
                                   f" using synchronous connection:"
                                   f" {id(myself)}")
                if not myself.conn.is_open():
                    raise Exception("Cannot open a new rethinkdb connection...")
                self.log.debug(f"Repl-ing connection: {myself}")
                myself.conn.repl()

            def __enter__(myself):
                return myself.conn

            def __exit__(myself, exc_type, exc_val, exc_tb):
                pass

            def __del__ (myself):
                if hasattr(myself, 'conn'):
                    myself.conn.close()
        return Connection()




    def get_connection(self):
        return self._get_connection_base("connection", self._get_new_connection)



    def _get_connection_base(self, connection_name, new_connection_factory):
        conn = getattr(local, connection_name, None)
        if not conn:
            conn = new_connection_factory()
        else:
            self.log.debug(f"Getting connection from thread-local storage: {id(conn)}")
            try:
                if not conn.conn.is_open():
                    self.log.debug("Connection from queue is not opened, skipping")
                    conn = new_connection_factory()
            except Exception as e:
                self.log.error(f"Error while trying to obtain a Connection: {e}, returning new Connection")
                capture_exception(e)
                conn =  new_connection_factory()

        setattr(local, connection_name, conn)
        return conn

    def get_async_connection(self):
        if not self.conn_queue_async.empty():
            conn = self.conn_queue_async.get_nowait()
            self.log.debug(f"Getting connection from Queue: {id(conn)}")
            try:
                if not conn.conn.is_open():
                    self.log.debug("Connection from queue is not opened, skipping")
                    return self._get_new_connection_async()
            except Exception as e:
                self.log.error(f"Error while trying to obtain a Connection {id(conn)}:"
                               f" {e}, returning new Connection")
                capture_exception(e)
                return self._get_new_connection_async()

            return conn
        else:
            self.log.debug("No connections in Queue, creating a new one...")
            return self._get_new_connection_async()

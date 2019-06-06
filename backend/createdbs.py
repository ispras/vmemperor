import logging
from threading import Thread
from typing import List

from tornado.options import options as opts

from connman import ReDBConnection
from constants import re as re
from rethinkdb_tools import db_classes
import rethinkdb

from xenadapter.xenobject import XenObject
from xenadapter import  * #  for metaclass initialization

r = rethinkdb.RethinkDB()

threads : List[Thread] = []
table_list = []
def create_dbs():
    global table_list
    re.db = r.db(opts.database)
    with ReDBConnection().get_connection():
        logging.debug(f"Creating database {opts.database}")

        if opts.database not in r.db_list().run():
            r.db_create(opts.database).run()
        else:
            table_list = re.db.table_list().run()
            for table in table_list:
                if table == Task.db_table_name or table == Task.pending_db_table_name:
                    continue
                re.db.table_drop(table).run()


    def create_table(cl : "XenObject"):
        with ReDBConnection().get_connection():
            cl.create_db()



    def create_user_table(cl: "XenObject"):
        with ReDBConnection().get_connection():
            table_user = f'{cl.db_table_name}_user'
            re.db.table_create(table_user, durability='soft').run()
            re.db.table(table_user).wait().run()
            re.db.table(table_user).index_create('ref').run()
            re.db.table(table_user).index_wait('ref').run()
            re.db.table(table_user).index_create('ref_and_userid', [re.r.row['ref'], re.r.row['userid']]).run()
            re.db.table(table_user).index_wait('ref_and_userid').run()
            re.db.table(table_user).index_create('userid', re.r.row['userid']).run()
            re.db.table(table_user).index_wait('userid').run()


    logging.debug(f"Scheduling creation of tables (with ACL) for {db_classes.CREATE_DB_FOR_CLASSES_WITH_ACL}")
    for cl in db_classes.CREATE_DB_FOR_CLASSES_WITH_ACL:
        threads.append(Thread(target=create_table, args=(cl, )))
        threads.append(Thread(target=create_user_table, args=(cl, )))


    logging.debug(f"Scheduling creation of  tables for {db_classes.CREATE_DB_FOR_CLASSES}")
    for cl in db_classes.CREATE_DB_FOR_CLASSES:
        threads.append(Thread(target=create_table, args=(cl, )))

    def create_simple_table(table):
        with ReDBConnection().get_connection():
            re.db.table_create(table, durability='soft').run()
            re.db.table(table).wait().run()
    for table in ('users', 'groups'):
        logging.debug(f"Scheduling creation of table: {table}")

        threads.append(Thread(target=create_simple_table, args=(table, )))



    for t in threads:
        t.start()

    logging.debug("Creating tables...")
    for t in threads:
        t.join()










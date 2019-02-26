from authentication import with_authentication
from connman import ReDBConnection
from consolelist import ConsoleList
from handlers.graphql.graphql_handler import ContextProtocol
from handlers.graphql.resolvers import with_connection
from xenadapter.console import Console
from xenadapter.vm import VM
from tornado.options import options
from rethinkdb import RethinkDB
r = RethinkDB()


@with_connection
@with_authentication(access_class=VM, access_action=VM.Actions.VNC, id_field='vm_ref')
def resolve_console(root, info, vm_ref, **kwargs):
    db = r.db(options.database)
    console = db.table(Console.db_table_name).get_all(vm_ref, index='VM')\
        .pluck('location').coerce_to('array').run()
    if not len(console):
        return None
    secret = ConsoleList.create_secret(console[0]['location'])
    return f"/console?secret={secret}"


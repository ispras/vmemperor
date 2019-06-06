import constants.re as re
from handlers.graphql.types.host import GHost
from rethinkdb_tools.helper import CHECK_ER
from xenadapter.xenobjectdict import XenObjectDict
from .xenobject import XenObject


class Host(XenObject):
    db_table_name = 'hosts'
    api_class = 'host'
    EVENT_CLASSES = ['host']

    GraphQLType = GHost

    @classmethod
    def create_db(cls, indexes=None): #ignore indexes
        super(Host, cls).create_db(indexes=['metrics'])

class HostMetrics(XenObject):
    api_class = "host_metrics"
    EVENT_CLASSES = ["host_metrics"]

    @classmethod
    def process_event(cls, xen, event):
        if event['class'] in cls.EVENT_CLASSES:
            if event['operation'] == 'del':
                # handled by Host
                return
            record = XenObjectDict(**event['snapshot'])


            if event['operation'] in ('mod', 'add'):
                rec = re.db.table(Host.db_table_name).get_all(event['ref'], index='metrics').pluck('ref').run().items
                if len(rec) != 1:
                    xen.log.warning(
                        f"HostMetrics::process_event: Cannot find a Host "
                        f"(or there are more than one) for metrics {event['ref']}")
                    return

                host_ref = rec[0]['ref']
                host = Host(xen, host_ref)
                memory_available = int(host.compute_free_memory())
                memory_overhead = int(host.compute_memory_overhead())
                new_rec = {
                    'ref': host_ref,
                    'live': record['live'],
                    'memory_total': int(record['memory_total']),  # This is kilobytes
                    'memory_free': int(record['memory_free']),
                    'memory_available': memory_available,
                    'live_updated':  record['last_updated'],
                    'memory_overhead': memory_overhead,
                }
                CHECK_ER(re.db.table(Host.db_table_name).insert(new_rec, conflict='update').run())



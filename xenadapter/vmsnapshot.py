from handlers.graphql.types.base.vmbase import VMActions
from handlers.graphql.types.vmsnapshot import GVMSnapshot
from xenadapter.abstractvm import AbstractVM


class VMSnapshot(AbstractVM):
    EVENT_CLASSES = ['vm']
    db_table_name = 'vm_snapshots'
    GraphQLType = GVMSnapshot
    Actions = VMActions

    def get_power_state(self):
        return self.get_snapshot_info().get('power_state_at_snapshot', self._get_power_state())

    @classmethod
    def create_db(cls):
        super(AbstractVM, cls).create_db(indexes=['snapshot_of'])

    @classmethod
    def filter_record(cls, xen, record, ref):
        return record['is_a_snapshot']


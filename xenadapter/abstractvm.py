from typing import Mapping

from serflag import SerFlag
import constants.re as re
from authentication import BasicAuthenticator
from xenadapter.aclxenobject import ACLXenObject


class AbstractVM(ACLXenObject):
    api_class = 'VM'

    @classmethod
    def process_record(cls, xen, ref, record):
        '''
        This implementation saves blocked_operations field into db so that check_access could use it
        :param xen:
        :param ref:
        :param record:
        :return:
        '''
        new_rec = super().process_record(xen, ref, record)
        new_rec['_blocked_operations_'] = list(record['blocked_operations'].keys())
        return new_rec

    def check_access(self, auth : BasicAuthenticator, action : SerFlag):
        if action:
            blocked_operations_query = re.db.table(self.db_table_name).get(self.ref).pluck('_blocked_operations_')
            if action.name in blocked_operations_query.run()['_blocked_operations_']:
                return False
        return super().check_access(auth, action)

    def set_platform(self, platform : dict):
        keys = tuple(platform.keys())
        for key in keys:
            if '_' in key:
                new_key = key.replace('_', '-')
                platform[new_key] = platform.pop(key)
        self._set_platform(platform)


def set_memory(input: Mapping, vm: AbstractVM):
    try:
        smin = int(input.get('memory_static_min'))
    except TypeError:
        smin = None
    try:
        smax = int(input.get('memory_static_max'))
    except TypeError:
        smax = None
    try:
        dmin = int(input.get('memory_dynamic_min'))
    except TypeError:
        dmin = None
    try:
        dmax = int(input.get('memory_dynamic_max'))
    except TypeError:
        dmin = None

    if smin and smax and dmin and dmax: # No worries on zeros, memory cant be 0
        vm.set_memory_limits(smin, smax, dmin, dmax)
        return
    if smin and smax:
        vm.set_memory_static_range(smin, smax)
    elif smin or smax:
        if smin:
            vm.set_memory_static_min(smin)
        else:
            vm.set_memory_static_max(smax)

    if dmin and smax:
        vm.set_memory_dynamic_range(smin, smax)
    elif dmin or dmax:
        if dmin:
            vm.set_memory_dynamic_min(dmin)
        else:
            vm.set_memory_dynamic_max(dmax)


def set_VCPUs(input: Mapping, vm: AbstractVM):
    current_startup = vm.get_VCPUs_at_startup()
    if current_startup > input['VCPUs_max']:
        if not input.get('VCPUs_at_startup'):
            raise ValueError()
        vm.set_VCPUs_at_startup(input['VCPUs_at_startup'])
        vm.set_VCPUs_max(input['VCPUs_max'])
    else:
        if input.get('VCPUs_max'):
            vm.set_VCPUs_max(input['VCPUs_max'])
        if input.get('VCPUs_at_startup'):
            vm.set_VCPUs_at_startup(input['VCPUs_at_startup'])
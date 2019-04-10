from typing import Mapping

from serflag import SerFlag

import XenAPI
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

    def set_domain_type(self,  type: str):
        """
        set vm domain type to 'pv', 'hvm' (or pv_in_pvh' starting from XenServer 7.5)
        :param type: pv/hvm
        :return:
        """
        if type == 'pv':
            if not self.get_PV_bootloader():
                raise ValueError("Can't set PV domain type since no PV bootloader is set")
        try:
            self._set_domain_type(type)
        except XenAPI.Failure as f:
            if f.details[0] == "MESSAGE_METHOD_UNKNOWN":
                hvm_boot_policy = self.get_HVM_boot_policy()
                if hvm_boot_policy and type == 'pv':
                    self.set_HVM_boot_policy('')
                if hvm_boot_policy == '' and type == 'hvm':
                    self.set_HVM_boot_policy('BIOS order')
            else:
                raise f


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


def set_memory(input: Mapping, vm: AbstractVM, return_diff=True):
    def get_memory_dict():
        return {
            'memory_static_min' : vm.get_memory_static_min(),
            'memory_static_max': vm.get_memory_static_max(),
            'memory_dynamic_min': vm.get_memory_dynamic_min(),
            'memory_dynamic_max': vm.get_memory_dynamic_max(),
        }
    if return_diff:
        old_val = get_memory_dict()

    try:
        smin = str(int(input.get('memory_static_min')))
    except TypeError:
        smin = None
    try:
        smax = str(int(input.get('memory_static_max')))
    except TypeError:
        smax = None
    try:
        dmin = str(int(input.get('memory_dynamic_min')))
    except TypeError:
        dmin = None
    try:
        dmax = str(int(input.get('memory_dynamic_max')))
    except TypeError:
        dmax = None

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

    if return_diff:
        new_val = get_memory_dict()
        return old_val, new_val



def set_VCPUs(input: Mapping, vm: AbstractVM, return_diff=True):
    def get_VCPUs_dict():
        return {
            'VCPUs_max': vm.get_VCPUs_max(),
            'VCPUs_at_startup': vm.get_VCPUs_at_startup(),
        }
    if return_diff:
        old_val = get_VCPUs_dict()
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

    if return_diff:
        new_val = get_VCPUs_dict()
        return old_val, new_val
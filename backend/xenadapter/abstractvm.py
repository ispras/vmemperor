from typing import Mapping

from rethinkdb.errors import ReqlNonExistenceError
from serflag import SerFlag

import XenAPI
import constants.re as re
from authentication import BasicAuthenticator
from xenadapter.aclxenobject import ACLXenObject
from xenadapter.quotaobject import QuotaObject

def keydiff(old_val, new_val):
    changed_keys = [k for k in old_val if old_val[k] != new_val[k]]

    return {k: v for k,v in old_val.items() if k in changed_keys},\
               {k: v for k,v in new_val.items() if k in changed_keys}


class AbstractVM(QuotaObject):
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

    def set_domain_type(self,  type: str, return_diff=True):
        """
        set vm domain type to 'pv', 'hvm' (or pv_in_pvh' starting from XenServer 7.5)
        :param type: pv/hvm
        :return:
        """

        if type == 'pv':
            if not self.get_PV_bootloader():
                raise ValueError("Can't set PV domain type since no PV bootloader is set")

        if return_diff:
            old_val = {
                "domain_type" : self.get_domain_type()
            }
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

        if return_diff:
            return old_val,  {"domain_type": type}

    def check_access(self, auth : BasicAuthenticator, action : SerFlag):
        if action:
            blocked_operations_query = re.db.table(self.db_table_name).get(self.ref).pluck('_blocked_operations_')
            try:
                if action.name in blocked_operations_query.run()['_blocked_operations_']:
                    return False
            except ReqlNonExistenceError:
                return False
        return super().check_access(auth, action)

    def set_platform(self, platform : dict, return_diff=True):
        if return_diff:
            old_val = {
                "platform":self.get_platform()
            }
        keys = tuple(platform.keys())
        for key in keys:
            if '_' in key:
                new_key = key.replace('_', '-')
                platform[new_key] = platform.pop(key)
        self._set_platform(platform)

        if return_diff:
            return old_val, {
                "platform" : platform
            }



def set_memory(input: Mapping, vm: AbstractVM, return_diff=True):
    old_val = {
            'memory_static_min' : vm.get_memory_static_min(),
            'memory_static_max': vm.get_memory_static_max(),
            'memory_dynamic_min': vm.get_memory_dynamic_min(),
            'memory_dynamic_max': vm.get_memory_dynamic_max(),
        }

    try:
        smin = int(input.get('memory_static_min'))
    except TypeError:
        smin = old_val['memory_static_min']
    try:
        smax = int(input.get('memory_static_max'))
    except TypeError:
        smax = old_val['memory_static_max']
    try:
        dmin = int(input.get('memory_dynamic_min'))
    except TypeError:
        dmin = old_val['memory_dynamic_min']
    try:
        dmax = int(input.get('memory_dynamic_max'))
    except TypeError:
        dmax = old_val['memory_dynamic_max']


    vm.set_memory_limits(str(smin), str(smax), str(dmin), str(dmax))

    if return_diff:
        new_val = {
            'memory_static_min' : int(vm._get_memory_static_min()),
            'memory_static_max': int(vm._get_memory_static_max()),
            'memory_dynamic_min': int(vm._get_memory_dynamic_min()),
            'memory_dynamic_max': int(vm._get_memory_dynamic_max()),
        }
        changed_keys = [k for k in old_val if old_val[k] != new_val[k]]
        return {k: v for k,v in old_val.items() if k in changed_keys},\
               {k: v for k,v in new_val.items() if k in changed_keys}



def set_VCPUs(input: Mapping, vm: AbstractVM, return_diff=True):


    old_val = {'VCPUs_max': vm._get_VCPUs_max(),
               'VCPUs_at_startup': vm._get_VCPUs_at_startup()}

    current_startup = old_val['VCPUs_at_startup']
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
        return keydiff(old_val, {
            'VCPUs_max': int(vm._get_VCPUs_max()),
            'VCPUs_at_startup': int(vm._get_VCPUs_at_startup()),
        })

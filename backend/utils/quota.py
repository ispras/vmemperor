from rethinkdb.errors import ReqlNonExistenceError

import constants.re as re

def _get_from_quotas(user_id: str, name: str):
    try:
        record = re.db.table('quotas').get(user_id).pluck(name).run()
    except ReqlNonExistenceError:
        return None

    try:
        res = record[name]
    except KeyError:
        return  None

    return res

def get_used_vm_count(user_id: str):
    used_vm_count = re.db.table('vms').get_all(user_id, index='main_owner').count().run()
    return used_vm_count

def check_vm_count(user_id: str):
    '''
    This method checks VM count quota against user and returns
    number of remaining VMs that user can create. if there's no quota, returns None
    :param user_id: user id to be checked
    :return
    '''
    vm_count = _get_from_quotas(user_id, 'vm_count')
    if not vm_count:
        return None

    return vm_count - get_used_vm_count(user_id)

def get_used_vdi_size(user_id: str):
    used_vdi_size = re.db.table('vdis')\
        .get_all(user_id, index='main_owner')\
        .map(lambda item: item['virtual_size'])\
        .sum()\
        .run()
    return used_vdi_size


def check_vdi_size(user_id: str):
    vdi_size = _get_from_quotas(user_id, 'vdi_size')
    if not vdi_size:
        return None

    return vdi_size - get_used_vdi_size(user_id)


def get_used_memory(user_id: str):
    used_memory = re.db.table('vms')\
        .get_all(user_id, index='main_owner')\
        .filter(lambda item: item['power_state'] == 'Paused' or item['power_state'] == 'Halted')\
        .map(lambda item: item['memory_static_max'])\
        .sum()\
        .run()

    return used_memory

def check_memory(user_id: str):
    memory = _get_from_quotas(user_id, 'memory')
    if not memory:
        return None

    result = memory - get_used_memory(user_id)
    return result


def get_used_vcpu_count(user_id: str):
    used_vcpu_count = re.db.table('vms')\
        .get_all(user_id, index='main_owner')\
        .filter(lambda item: item['power_state'] == 'Running')\
        .map(lambda item: item['VCPUs_max'])\
        .sum()\
        .run()

    return used_vcpu_count

def check_vcpu_count(user_id: str):
    vcpu_count = _get_from_quotas(user_id, 'vcpu_count')
    if not vcpu_count:
        return None
    

    return vcpu_count - get_used_vcpu_count(user_id)

def quota_memory_error(vm_info, main_owner):
    memory_left = check_memory(main_owner)
    if memory_left is not None:
        memory_expected_left  = memory_left - vm_info['memory_static_max']
        if memory_expected_left < 0:
            return f'Unable to allocate memory: memory quota will be exceeded by {-(memory_expected_left/1024/1024)} Mb'

def quota_vcpu_count_error(vm_info, main_owner):
    vcpus_left = check_vcpu_count(main_owner)
    if vcpus_left is not None:
        vcpus_expected_left = vcpus_left - vm_info['VCPUs_max']
        if vcpus_expected_left < 0:
            return f'Unable to allocate VCPUs: VCPUs quota will be exceeded by {-vcpus_expected_left} VCPUs'

def quota_vdi_size_error(size, main_owner):
    """
    Perform a VDI size check for main_owner against disk of size bytes
    :param size:
    :param main_owner:
    :return: None if OK, error message otherwise
    """
    vdi_size_left = check_vdi_size(main_owner)
    if vdi_size_left is not None:
        vdi_size_expected_left = vdi_size_left - size
        if vdi_size_expected_left < 0:
            return f'Unable to allocate VDI: VDI size quota will be exceeded by {-vdi_size_expected_left/1024/1024/1024} Gb'

def before_vm_start_resume(ref: str):
    '''
    Perform necessary checks before vm start/resume
    :param ref:
    :return: None if OK, string error message if not OK
    '''
    vm_info = re.db.table('vms').get(ref).pluck('power_state', 'memory_static_max', 'VCPUs_max', 'main_owner').run()
    if vm_info['power_state'] not in ('Halted', 'Suspended'):
        return

    main_owner = vm_info.get('main_owner')
    if not main_owner:
        return

    memcheck = quota_memory_error(vm_info, main_owner)
    if memcheck:
        return memcheck

    vcpucheck = quota_vcpu_count_error(vm_info, main_owner)
    if vcpucheck:
        return vcpucheck



def before_vm_unpause(ref: str):
    vm_info = re.db.table('vms').get(ref).pluck('power_state', 'VCPUs_max', 'main_owner').run()
    if vm_info['power_state'] != 'Paused':
        return
    main_owner = vm_info.get('main_owner')
    if not main_owner:
        return

    return quota_vcpu_count_error(vm_info, main_owner)


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

    real_vm_count = re.db.table('vms').get_all(user_id, index='main_owner').run()
    return vm_count - real_vm_count

def check_vdi_size(user_id: str):
    vdi_size = _get_from_quotas(user_id, 'vdi_size')
    if not vdi_size:
        return None

    real_vdi_size = re.db.table('vdis')\
        .get_all(user_id, index='main_owner')\
        .map(lambda item: item['vdi_size'])\
        .sum()\
        .run()

    return real_vdi_size - vdi_size

def check_memory(user_id: str):
    memory = _get_from_quotas(user_id, 'memory')
    if not memory:
        return None

    real_memory = re.db.table('vms')\
        .get_all(user_id, index='main_owner')\
        .filter(lambda item: item['power_state'] == 'Paused' or item['power_state'] == 'Halted')\
        .map(lambda item: item['memory_static_max'])\
        .sum()\
        .run()

    result = memory - real_memory
    return result

def check_vcpu_count(user_id: str):
    vcpu_count = _get_from_quotas(user_id, 'vcpu_count')
    if not vcpu_count:
        return None
    
    real_vcpu_count = re.db.table('vms')\
        .get_all(user_id, index='main_owner')\
        .filter(lambda item: item['power_state'] == 'Running')\
        .map(lambda item: item['VCPUs_max'])\
        .sum()\
        .run()


    return vcpu_count - real_vcpu_count

def do_memory_check(vm_info, main_owner):
    memory_left = check_memory(main_owner)
    if memory_left is not None:
        memory_expected_left  = memory_left - vm_info['memory_static_max']
        if memory_expected_left < 0:
            return f'Unable to allocate memory: memory quota will be exceeded by {-(memory_expected_left/1024/1024)} Mb'

def do_vcpus_check(vm_info, main_owner):
    vcpus_left = check_vcpu_count(main_owner)
    if vcpus_left is not None:
        vcpus_expected_left = vcpus_left - vm_info['VCPUs_max']
        if vcpus_expected_left < 0:
            return f'Unable to allocate VCPUs: VCPUs quota will be exceeded by {-vcpus_expected_left} VCPUs'


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

    memcheck = do_memory_check(vm_info, main_owner)
    if memcheck:
        return memcheck

    vcpucheck = do_vcpus_check(vm_info, main_owner)
    if vcpucheck:
        return vcpucheck



def before_vm_unpause(ref: str):
    vm_info = re.db.table('vms').get(ref).pluck('power_state', 'VCPUs_max', 'main_owner').run()
    if vm_info['power_state'] != 'Paused':
        return
    main_owner = vm_info.get('main_owner')
    if not main_owner:
        return

    return do_vcpus_check(vm_info, main_owner)


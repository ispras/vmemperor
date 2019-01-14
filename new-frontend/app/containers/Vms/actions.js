/*
 *
 * Vms actions
 * As for now, we only need 'uuid' and 'power_state' in 'row'
 * for vm_select, vm_deselect, vm_select_all, vm_deselect_all
 */

import {
  VM_DESELECT, VM_SELECT, VM_DESELECT_ALL, VM_SELECT_ALL,

} from './constants';


export function vm_select(uuid) {
  return {
    type: VM_SELECT,
    uuid
  }
}

export function vm_deselect(uuid)
{
  return {
    type: VM_DESELECT,
    uuid
  }
}

export function vm_select_all(uuids)
{
  return {
    type: VM_SELECT_ALL,
    uuids
  }
}

export function vm_deselect_all()
{
  return {
    type: VM_DESELECT_ALL,
  }
}



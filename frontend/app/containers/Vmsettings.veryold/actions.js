/*
 *
 * VmSettings actions
 *
 */

import {
  REQUEST_VMINFO, SET_VMINFO,
} from './constants';

export function requestVMInfo(ref) {
  return {
    type: REQUEST_VMINFO,
    ref
  };
}

export function setVMInfo(data){
    return {
      type: SET_VMINFO,
      data
    }
  }


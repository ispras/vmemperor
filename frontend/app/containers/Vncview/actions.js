/*
 *
 * Vncview actions
 *
 */

import {
  VNC_ERROR,
  VNC_REQUESTED,
  VNC_URL_ACQUIRED,
} from './constants';

export function vncRequest(ref) {
  return {
    type: VNC_REQUESTED,
    ref
  };
}

export function vncAcquire(url, ref) {
  return {
    type: VNC_URL_ACQUIRED,
    url,
    ref
  }
}

export function vncError(error)
{
  return {
    type: VNC_ERROR,
    error
  }
}

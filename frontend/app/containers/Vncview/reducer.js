/*
 *
 * Vncview reducer
 *
 */

import { fromJS } from 'immutable';
import {
  VNC_ERROR,
  VNC_URL_ACQUIRED,
} from './constants';

const initialState = fromJS({
  url: null, error: null,
});

function urlReducer(state = initialState, action) {
  switch (action.type) {
    case VNC_URL_ACQUIRED:
      return state.set('url',action.url).set('ref', action.ref);
    case VNC_ERROR:
      return state.set('error', action.error);
    default:
      return state;
  }
}

export default urlReducer;

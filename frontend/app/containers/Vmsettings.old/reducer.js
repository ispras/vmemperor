/*
 *
 * VmSettings reducer
 *
 */

import { fromJS } from 'immutable';
import {combineReducers} from 'redux-immutable';
import {VM_REQUEST_RESOURCE, VM_SET_INFO, VM_SET_RESOURCE, VM_WATCH} from "./constants";

const initialState = fromJS({});

const vmInfo = (resourceType) => (state = initialState, action) =>
{
  switch (action.type) {
    case VM_SET_INFO:
      switch (action.resourceType) {
        case resourceType:

          if (action.data)
            return fromJS(action.data);
          else
            return fromJS({});
        default:
          return state;
      }
    default:
      return state;
  }

};

const genericList = (resource) => (state = fromJS([]), action) =>
{
  switch (action.type) {
    case VM_SET_RESOURCE:
      switch (action.resourceType) {
        case resource:
              if (action.data) {
                return fromJS(action.data);
              }
              else {
                return fromJS([]);
              }
        default:
          return state;
      }
    default:
      return state;
  }

};

const ref = (state = "", action) =>
{
  switch (action.type) {
    case VM_WATCH:
      return action.ref;
    default:
      return state;
  }
};

const pages = (state = fromJS({}), action) =>
{
  switch (action.type) {
    case VM_REQUEST_RESOURCE:
      return state.set(action.resourceType,
        fromJS({page: action.page, pageSize: action.pageSize}));
    default:
      return state;

  }
}

export default combineReducers(
  {
    vmDiskInfo: vmInfo('disk'),
    vmNetworkInfo: vmInfo('net'),
    isoList: genericList('iso'),
    vdiList: genericList('vdi'),
    netList: genericList('net'),
    pages: pages,
    ref,
  }
);

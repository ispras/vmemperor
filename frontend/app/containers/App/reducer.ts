import {combineReducers} from 'redux-immutable';
import {fromJS} from 'immutable';
import {Set} from 'immutable';
import {
  ADD_TO_WAIT_LIST, REMOVE_FROM_WAIT_LIST,
  VMLIST_MESSAGE
} from "./constants";
import VM from 'models/VM';

const initialState = fromJS(
  {}
);

const waitListInitialState = fromJS({
  running: {},
  suspended: {},
  halted: {},
  paused: {},
  notifications: {}

});


const vm_data = (state = initialState, action) => {
  switch (action.type) {
    case VMLIST_MESSAGE:
      const {type, ...message} = action.message;
      switch (type) {
        case 'initial':
        case 'add':
          return state.set(message.ref, new VM(fromJS(message)));
        case 'change':
          return state.set(message.new_val.ref, new VM(fromJS(message.new_val)));
        case 'remove':
          return state.delete(message.old_val.ref);
        default:
          console.error('Unexpected message type: ', type);
      }

      return state;
    default:
      return state;
  }

};


const waitList = (actionType) => (state = fromJS({}), action) => { //Key: REF; value: notification ID
  switch (action.type) {
    case ADD_TO_WAIT_LIST:
      switch (action.action) {
        case actionType:
          return state.set(action.ref, action.notifyId);
        default:
          return state;

      }
    case REMOVE_FROM_WAIT_LIST:
      switch (action.action) {
        case actionType:
          return state.delete(action.ref);
        case 'rebooted':
          if (actionType === 'running') //Remove from rebooted wait list triggers addition to running wait list
            return state.set(action.ref, action.notifyId);
        default: //eslint-disable-line no-fallthrough
          return state;
      }
    default:
      return state;
  }
};


const notifications = (state = fromJS({}), action) => { //Key: Notification ID, value: List of REFs
  switch (action.type) {
    case ADD_TO_WAIT_LIST:
      return state.update(action.notifyId, new Set(), oldSet => oldSet.add(action.ref));
    case REMOVE_FROM_WAIT_LIST:
      if (!state.has(action.notifyId))
        return state;
      newState = state.update(action.notifyId, new Set(), oldSet => oldSet.delete(action.ref));
      if (newState.get(action.notifyId).isEmpty())
        return state.delete(action.notifyId);
      else
        return newState;
    default:
      return state;
  }
};


export default combineReducers(
  {
    vm_data,
    waitList: combineReducers({
      running: waitList('running'),
      halted: waitList('halted'),
      paused: waitList('paused'),
      suspended: waitList('suspended'),
      removed: waitList('removed'),
      rebooted: waitList('rebooted'),
      notifications,
    })
  }
);

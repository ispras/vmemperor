/**
 * Combine all reducers in this file and export the combined reducers.
 */

import {combineReducers} from 'redux-immutable';
import {fromJS} from 'immutable';
import {LOCATION_CHANGE, routerReducer} from 'react-router-redux';
import Redux from 'redux';
import languageProviderReducer from './containers/LanguageProvider/reducer';

/*
 * routeReducer
 *
 * The reducer merges route location changes into our immutable state.
 * The change is necessitated by moving to react-router-redux@4
 *
 */

// Initial routing state
const routeInitialState = fromJS({
  location: null,
});
/*
const routerReducer =  (state = routeInitialState, action) => {
  if (action.type === LOCATION_CHANGE) {
    return state.set('location', action.payload);
  }

  return state;
};
*/
/**
 * Creates the main reducer with the dynamically injected ones
 */
export default function createReducer(injectedReducers: Redux.ReducersMapObject = {}): Redux.Reducer<any> {
  return combineReducers({
    route: routerReducer,
    language: languageProviderReducer,
    ...injectedReducers,
  });
}

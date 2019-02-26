import {createSelector} from 'reselect';

/**
 * Direct selector to the vncview state domain
 */
const selectVncviewDomain = (state) => state.get('vncview');

/**
 * Other specific selectors
 */


/**
 * Default selector used by Vncview
 */

const makeSelectUrl = () => createSelector(
  selectVncviewDomain,
  (substate) => substate.get('url'),
);
const makeSelectRef = () => createSelector(
  selectVncviewDomain,
  (substate) => substate.get('ref')
);

const makeSelectError = () => createSelector(
  selectVncviewDomain,
  (substate) => substate.get('error')
);

export {
  makeSelectUrl,
  makeSelectError,
  makeSelectRef,
};

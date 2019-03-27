import { createSelector } from 'reselect';

const selectRouter = (state) => state.get('route');

const makeSelectLocation = () => createSelector(
  selectRouter,
  (routerState) => routerState.location
);


const selectAppData = (state) => state.get('app');
const selectVMData = (state) => selectAppData(state).get('vm_data');

const makeSelectVMData = () => createSelector(
  selectVMData,
  (substate) => {return substate}
);

export {
  makeSelectLocation,
  makeSelectVMData,
};

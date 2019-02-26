import {createSelector} from 'reselect';
import {fromJS} from 'immutable';

/**
 * Direct selector to the vmsettings state domain
 */
const makeSelectVmSettingsDomain = () => (state) => state.get('vmsettings');
const makeSelectRef = () => (state) => makeSelectVmSettingsDomain()(state).get('ref');
const makeSelectAppDomain = () => (state) => state.get('app');
const selectVmData = (state) => selectAppData(state).get('vm_data');
/**
 * Other specific selectors
 */

const makeSelectVmData = () => createSelector(
  makeSelectAppDomain(),
  state => {
    return state.get('vm_data');
  }
);

const makeSelectInfo = (resourceType) => () => createSelector(
  makeSelectVmSettingsDomain(),
  state => {
    return state.get(resourceType).entrySeq().map(value => {
      return {
        key: value[0],
        ...value[1].toJS(),
      };
    }).toArray()
  }
);

const makeSelectResList = (res) => () => createSelector(
  makeSelectVmSettingsDomain(),
  makeSelectRef(),
  makeSelectVmData(),
  (vmsettings, ref, vmdata) => {
    const data = vmsettings.get(res).filterNot(iso => iso.get('VMs').includes(ref))
      .map(iso => {
        return iso.update('VMs', VMs => {
          return VMs.map(vm => {
              return vmdata.get(vm, fromJS({ref: vm, name_label: "Unknown VM"}));
            }
          );
        });
      }).toJS();
    return data;
  }
);

const makeSelectPages = (res) => () => createSelector(
  makeSelectVmSettingsDomain(),
  (vmsettings) => {
    return vmsettings.get('pages').get(res).toJS();
  }
);


const makeSelectVdiList = makeSelectResList('vdiList');
const makeSelectIsoList = makeSelectResList('isoList');
const makeSelectNetList = makeSelectResList('netList');

const makeSelectDiskInfo = makeSelectInfo('vmDiskInfo');
const makeSelectNetInfo = makeSelectInfo('vmNetworkInfo');

export {
  makeSelectVmData,
  makeSelectDiskInfo,
  makeSelectIsoList,
  makeSelectVdiList,
  makeSelectNetInfo,
  makeSelectNetList,
  makeSelectPages,
};

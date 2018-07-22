/**
 *
 * Vmsettings
 *
 */

import React from 'react';
import T from 'prop-types';
import IPT from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectVmsettings from './selectors';
import reducer from './reducer';
import saga from './saga';
import VmsettingsForm from "../../components/VmsettingsForm";
import {makeSelectVmData} from "./selectors";
import {makeSelectVmDataForTable} from "../Vms/selectors";

export class VMSettings extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const data = this.props.vm_data.get(this.props.match.params.uuid);
    if (!data) {
      return (
        <div>
          <h1>
            VM NOT FOUND
          </h1>
        </div>

      )
    }
    else {
      return (
        <div>
          <VmsettingsForm
            data={data}
          />
        </div>
      );
    }
  }
}

VMSettings.propTypes = {
  vm_data: IPT.map.isRequired,
  match: T.shape({
    params: T.shape({
      uuid: T.string.isRequired,
    }),
  }).isRequired,
};

const mapStateToProps = createStructuredSelector({
  vm_data: makeSelectVmData(),
});

const mapDispatchToProps = {

};




const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'vmsettings', reducer });
const withSaga = injectSaga({ key: 'vmsettings', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(VMSettings);

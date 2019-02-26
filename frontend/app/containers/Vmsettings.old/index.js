/**
 *
 * VmSettings
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
import reducer from './reducer';
import saga from './saga';
import VmsettingsForm from "../../components/VmsettingsForm";
import {makeSelectVmData} from "../../containers/App/selectors";
import { halt, run, reboot } from "../App/actions";
import {requestInfo, vm_convert, vdi_detach, vdi_attach, vmWatch, iso_attach, requestResourceData, net_action} from "./actions";
import {makeSelectDiskInfo, makeSelectNetInfo, makeSelectIsoList, makeSelectVdiList, makeSelectNetList } from "./selectors";


class VMSettings extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props)
  {
    super(props);
    this.render = this.render.bind(this);
    this.onHalt = this.onHalt.bind(this);
    this.onReboot = this.onReboot.bind(this);
    this.onConvertVm = this.onConvertVm.bind(this);
    this.onDetachVdi = this.onDetachVdi.bind(this);
    this.onAttachVdi = this.onAttachVdi.bind(this);
    this.onAttachIso = this.onAttachIso.bind(this);
    this.onAttachNet = this.onAttachNet.bind(this);
    this.onDetachNet = this.onDetachNet.bind(this);
    this.requestIso = this.requestIso.bind(this);
    this.requestNet = this.requestNet.bind(this);
    this.requestVdi = this.requestVdi.bind(this);
  }

  /* static getDerivedStateFromProps(props, state)
  {
    if (props.vm_data) {
      return {
        ref: props.match.params.ref,
        data: props.vm_data.get(props.match.params.ref),
        loading: false,
      }
    }
    else{
      return {loading: true,}
    }
  } */
  onHalt()
  {
    const data  = this.props.vm_data.get(this.props.match.params.ref);
    if (data.power_state === 'Halted')
    {
      this.props.run([data.ref]);
    }
    else
    {
      this.props.halt([data.ref]);
    }
  }

  onReboot()
  {

    const data  = this.props.vm_data.get(this.props.match.params.ref);
    if (data.power_state === 'Running')
    {
      console.log("Rebooting");
      this.props.reboot([data.ref]);
    }
  }

  onConvertVm()
  {
    const data  = this.props.vm_data.get(this.props.match.params.ref);
    if (data.power_state === 'Halted')
    {

      const mode = data.domain_type === 'hvm' ? 'pv' : 'hvm';
      console.log("Converting to " + mode);
      this.props.vm_convert(data.ref, mode);
    }
  }

  onDetachVdi(vdi)
  {
    this.props.vdi_detach(this.props.match.params.ref, vdi);
  }

  onAttachVdi(vdi)
  {
    this.props.vdi_attach(this.props.match.params.ref, vdi);
  }

  onAttachIso(iso)
  {
    this.props.iso_attach(this.props.match.params.ref, iso);
  }

  onAttachNet(net)
  {
    this.props.net_action(this.props.match.params.ref, net, 'attach');
  }

  onDetachNet(net)
  {
    this.props.net_action(this.props.match.params.ref, net, 'detach');
  }

  requestIso(page, pageSize)
  {
    this.props.requestResourceData('iso', page, pageSize);
  }

  requestNet(page, pageSize)
  {
    this.props.requestResourceData('net', page, pageSize);
  }

  requestVdi(page, pageSize)
  {
    this.props.requestResourceData('vdi', page, pageSize);
  }
  componentDidMount()
  {

    const { props } = this;
    if (props.match) {
      if (props.vmWatch)
      {
        props.vmWatch(props.match.params.ref);
      }
      if (!props.diskInfo.size) {
        props.requestInfo('disk',props.match.params.ref);

      }
      if (!props.netInfo.size)
      {
        props.requestInfo('net', props.match.params.ref);
      }
    }
  }


  render() {
    if (!this.props.vm_data)
    {
      return (
        <h1>
          LOADING
        </h1>
      );
    }
    const data  = this.props.vm_data.get(this.props.match.params.ref);
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
            onHalt={this.onHalt}
            onReboot={this.onReboot}
            onConvertVm={this.onConvertVm}
            onAttachVdi={this.onAttachVdi}
            onAttachIso={this.onAttachIso}
            onDetachVdi={this.onDetachVdi}
            onAttachNet={this.onAttachNet}
            onDetachNet={this.onDetachNet}
            diskInfo={this.props.diskInfo}
            isoList={this.props.isoList}
            vdiList={this.props.vdiList}
            netList={this.props.netList}
            requestIso={this.requestIso}
            requestVdi={this.requestVdi}
            requestNet={this.requestNet}
            netInfo={this.props.netInfo}
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
      ref: T.string.isRequired,
    }),
  }).isRequired,
  halt: T.func.isRequired,
  run: T.func.isRequired,
  reboot: T.func.isRequired,
  vm_convert: T.func.isRequired,
  vdi_detach: T.func.isRequired,
  vdi_attach: T.func.isRequired,
  net_action: T.func.isRequired,
  requestResourceData: T.func.isRequired,
  requestInfo: T.func.isRequired,
  diskInfo: T.array.isRequired,
  netInfo: T.array.isRequired,
  netList: T.array.isRequired,
};

const mapStateToProps = createStructuredSelector({
  vm_data: makeSelectVmData(),
  diskInfo: makeSelectDiskInfo(),
  netInfo: makeSelectNetInfo(),
  isoList: makeSelectIsoList(),
  vdiList: makeSelectVdiList(),
  netList: makeSelectNetList(),
});

const mapDispatchToProps = {
  halt,
  run,
  reboot,
  vm_convert,
  requestInfo,
  vdi_detach,
  vdi_attach,
  iso_attach,
  vmWatch,
  requestResourceData,
  net_action,
};




const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'vmsettings', reducer });
const withSaga = injectSaga({ key: 'vmsettings', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(VMSettings);

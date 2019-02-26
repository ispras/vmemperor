/**
 *
 * Vncview
 *
 */

import React, {Fragment} from 'react';
import VncDisplay from '../../components/VncDisplay';
import {Console, PowerState, VmInfoFragment} from "../../generated-models";
import {useQuery} from "react-apollo-hooks";

interface Props {
  vm: VmInfoFragment.Fragment;
}


const VNCView = ({vm: {ref, nameLabel, powerState}}: Props) => {
  const {data} = useQuery<Console.Query, Console.Variables>(Console.Document, {
    variables: {
      id: ref,
    }
  });
  if (!data.console) {
    return (<h1>Turn VM on</h1>)
  }
  const url = `ws://${window.location.hostname}:${window.location.port}/api${data.console}`;

  return (
    <Fragment>
      {nameLabel &&
      <h2>{
        nameLabel
      }</h2>}
      <VncDisplay url={url}/>
    </Fragment>
  );
};

export default VNCView;

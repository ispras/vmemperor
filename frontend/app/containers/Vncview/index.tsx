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
  const {data, refetch} = useQuery<Console.Query, Console.Variables>(Console.Document, {
    variables: {
      id: ref,
    }
  });
  if (!data.console) {
    return (<h1>Access denied! Ask your administrator</h1>)
  }
  const url = `ws://${window.location.hostname}:${window.location.port}/api${data.console}`;

  return (
    <Fragment>
      <VncDisplay url={url} onDisconnect={() => refetch()}/>
    </Fragment>
  );
};

export default VNCView;

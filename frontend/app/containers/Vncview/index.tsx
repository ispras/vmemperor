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

  const onClipboard = (e: CustomEvent) => {
    /*
    Copies text to system clipboard.
     e is defined in  RFB._handle_server_cut_text
     */
    const textField = document.createElement("textarea");
    textField.innerText = e.detail.text;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
  };

  return (
    <Fragment>
      <VncDisplay
        onClipboard={onClipboard}
        url={url}
        onDisconnect={() => refetch()}/>
    </Fragment>
  );
};

export default VNCView;

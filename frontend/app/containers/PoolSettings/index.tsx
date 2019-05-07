import {PoolInfoDocument, PoolInfoUpdateDocument, usePoolListQuery} from "../../generated-models";
import * as React from "react";
import SettingsComponent from "../Settings";
import {PoolSettingsForm} from "../../components/PoolSettingsForm";

const PoolSettings: React.FunctionComponent = () => {
  const {data: {pools}} = usePoolListQuery();
  if (pools.length !== 1)
    return "Access denied";
  const id = pools[0].ref;
  return (<SettingsComponent
    Form={PoolSettingsForm}
    documentNode={PoolInfoDocument}
    updateDocumentNode={PoolInfoUpdateDocument}
    id={id}/>);

};

export default PoolSettings;

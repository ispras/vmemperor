import SettingsComponent, {SettingsRouteProps} from "../Settings";
import NetworkSettingsForm from "../../components/NetworkSettingsForm";
import * as React from "react";
import {NetworkInfoDocument, NetworkInfoUpdateDocument} from "../../generated-models";

const NetworkSettings: React.FunctionComponent<SettingsRouteProps> = ({match: {params: {ref}}}) => {

  return (<SettingsComponent
    Form={NetworkSettingsForm}
    documentNode={NetworkInfoDocument}
    updateDocumentNode={NetworkInfoUpdateDocument}
    id={ref}
  />)
};

export default NetworkSettings;

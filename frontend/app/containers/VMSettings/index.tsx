import SettingsComponent, {SettingsRouteProps} from "../Settings";
import * as React from 'react';
import VmSettingsForm from "../../components/VmSettingsForm";
import {VmInfo, VmInfoUpdate} from "../../generated-models";

const VmSettings: React.FunctionComponent<SettingsRouteProps> = ({match: {params: {ref}}}) => {

  return (<SettingsComponent
    Form={VmSettingsForm}
    documentNode={VmInfo.Document}
    updateDocumentNode={VmInfoUpdate.Document}
    id={ref}
  />)
};

export default VmSettings;

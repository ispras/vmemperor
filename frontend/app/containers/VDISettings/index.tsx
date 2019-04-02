import SettingsComponent, {SettingsRouteProps} from "../Settings";
import VDISettingsForm from "../../components/VDISettingsForm";
import * as React from "react";
import {VDIInfoDocument, VDIInfoUpdateDocument} from "../../generated-models";

const VDISettings: React.FunctionComponent<SettingsRouteProps> = ({match: {params: {ref}}}) => {

  return (<SettingsComponent
    Form={VDISettingsForm}
    documentNode={VDIInfoDocument}
    updateDocumentNode={VDIInfoUpdateDocument}
    id={ref}
  />)
};

export default VDISettings;

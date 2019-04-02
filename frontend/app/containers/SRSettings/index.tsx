import SettingsComponent, {SettingsRouteProps} from "../Settings";
import SRSettingsForm from "../../components/SRSettingsForm";
import * as React from "react";
import {SRInfoDocument, SRInfoUpdateDocument} from "../../generated-models";

const SRSettings: React.FunctionComponent<SettingsRouteProps> = ({match: {params: {ref}}}) => {

  return (<SettingsComponent
    Form={SRSettingsForm}
    documentNode={SRInfoDocument}
    updateDocumentNode={SRInfoUpdateDocument}
    id={ref}
  />)
};

export default SRSettings;

import SettingsComponent, {SettingsRouteProps} from "../Settings";
import * as React from 'react';
import VMSettingsForm from "../../components/VMSettingsForm";
import {VMInfoDocument, VMInfoUpdateDocument} from "../../generated-models";

const VMSettings: React.FunctionComponent<SettingsRouteProps> = ({match: {params: {ref}}}) => {

  return (<SettingsComponent
    Form={VMSettingsForm}
    documentNode={VMInfoDocument}
    updateDocumentNode={VMInfoUpdateDocument}
    id={ref}
  />)
};

export default VMSettings;

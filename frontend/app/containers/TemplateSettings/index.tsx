import SettingsComponent, {SettingsRouteProps} from "../Settings";
import TemplateSettingsForm from "../../components/TemplateSettingsForm";
import {TemplateInfo, TemplateInfoUpdate} from "../../generated-models";
import * as React from "react";

const TemplateSettings: React.FunctionComponent<SettingsRouteProps> = ({match: {params: {ref}}}) => {

  return (<SettingsComponent
    Form={TemplateSettingsForm}
    documentNode={TemplateInfo.Document}
    updateDocumentNode={TemplateInfoUpdate.Document}
    id={ref}
  />)
};

export default TemplateSettings;

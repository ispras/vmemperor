import SettingsComponent, {SettingsRouteProps} from "../Settings";
import TemplateSettingsForm from "../../components/TemplateSettingsForm";
import * as React from "react";
import {TemplateInfoDocument, TemplateInfoUpdateDocument} from "../../generated-models";

const TemplateSettings: React.FunctionComponent<SettingsRouteProps> = ({match: {params: {ref}}}) => {

  return (<SettingsComponent
    Form={TemplateSettingsForm}
    documentNode={TemplateInfoDocument}
    updateDocumentNode={TemplateInfoUpdateDocument}
    id={ref}
  />)
};

export default TemplateSettings;

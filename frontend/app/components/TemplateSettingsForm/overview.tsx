import {TemplateEditOptionsDocument, TemplateInfoFragmentFragment} from "../../generated-models";
import {ResourcesFormContainer} from "../ApplyResetForm";
import {defaults} from "./defaults";
import schema from "./schema";
import * as React from "react";
import {Mode} from "../AbstractVMSettingsComponents/mode";

import {Fields} from "../AbstractVMSettingsComponents/fields";

import DistroType from "./distro";


interface Props {
  template: TemplateInfoFragmentFragment
}

export const Overview: React.FunctionComponent<Props> = ({template}) => {
  return (
    <ResourcesFormContainer
      object={template}
      mutationNode={TemplateEditOptionsDocument}
      mutationName="template"
      defaultValues={defaults}
      schema={schema}
    >
      <Mode PVBootloader={template.PVBootloader}/>
      <DistroType/>
      <Fields/>
    </ResourcesFormContainer>
  )
}

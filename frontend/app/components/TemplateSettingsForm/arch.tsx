import {TemplateSettingsFormValues} from "./schema";
import {connect, Field, FormikProps} from "formik";
import * as React from "react";
import {archId, TemplateRadioButtonGroup} from "./constants";
import {RadioButton} from "../RadioButton";
import {Arch} from "../../generated-models";

interface Props {
  formik: FormikProps<TemplateSettingsFormValues>;
}

const Inner: React.FunctionComponent<Props> = ({formik}) => {
  return (
    <TemplateRadioButtonGroup
      label="Select installation architecture"
      id={archId}>
      <Field
        component={RadioButton}
        name={archId}
        id={Arch.I386}
        label="32-bit"
        disabled={!formik.values.installOptions.distro}
      />
      <Field
        component={RadioButton}
        name={archId}
        id={Arch.X86_64}
        label="64-bit"
        disabled={!formik.values.installOptions.distro}
      />
    </TemplateRadioButtonGroup>);
};

export default connect<{}, TemplateSettingsFormValues>(Inner);

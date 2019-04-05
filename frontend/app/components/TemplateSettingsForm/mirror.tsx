import {TemplateSettingsFormValues} from "./schema";
import {connect, Field, FormikProps} from "formik";
import * as React from "react";
import Input from '../../components/Input';
import {prefix} from "./constants";

interface Props {
  formik: FormikProps<TemplateSettingsFormValues>;
}

const Inner: React.FunctionComponent<Props> = ({formik}) => {
  return <Field
    component={Input}
    type="url"
    disabled={!formik.values.installOptions || !formik.values.installOptions.distro}
    name={prefix + 'installRepository'}
  >
    Installation repository
  </Field>
};

export default connect<{}, TemplateSettingsFormValues>(Inner);

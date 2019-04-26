import {Field, FormikProps} from "formik";
import {Quota, QuotaSetMutationVariables} from "../../generated-models";
import * as React from "react";

import {ApplyResetForm} from "../../components/ApplyResetForm/form";
import Select from '../../components/Select';
import {SelectUserForForm, SelectUserForFormProps} from "./selectUserForForm";
import {withCheckBoxOption} from "../../components/OptionalFormComponent";
import {InputBase} from "../../components/Input/inputBase";
import {AbstractMemoryInput, Unit} from "../../components/AbstractSettingsForm/abstractMemoryInput";
import {Fragment} from "react";

interface FormProps extends FormikProps<Quota> {
  onUserChanged: SelectUserForFormProps['onAfterChange']
}

const MemoryInput = withCheckBoxOption(AbstractMemoryInput);
const NumberInput = withCheckBoxOption(InputBase);

export const QuotaAdminControllerForm: React.FunctionComponent<FormProps> =
  ({onUserChanged, ...props}) => {
    console.log("Quota form values: ", props);
    return (
      <ApplyResetForm {...props}>
        <h4>Quota options</h4>
        <Field
          name="user"
          component={SelectUserForForm}
          onAfterChange={onUserChanged}
          placeholder="Select a user to impose quote on..."
        />
        {props.values.user &&
        (<Fragment>
          <Field
            name="vmCount"
            component={NumberInput}
            type="number"
            checkboxLabelContent="VM count"
          />
          <Field
            name="vcpuCount"
            component={NumberInput}
            type="number"
            checkboxLabelContent="VCPU count"
          />
          <Field
            name="vdiSize"
            component={MemoryInput}
            checkboxLabelContent="Total VDI size"
            unit={Unit.GB}
          />
          <Field
            name="memory"
            component={MemoryInput}
            checkboxLabelContent="Total RAM size"
            unit={Unit.MB}
          />
        </Fragment>)}
      </ApplyResetForm>
    )
  };


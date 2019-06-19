import {Field, FormikProps} from "formik";
import {Quota, QuotaSetMutationVariables, QuotaSizeQuery, useCurrentUserQuery} from "../../generated-models";
import * as React from "react";

import {ApplyResetForm} from "../../components/ApplyResetForm/form";
import Select from '../../components/Select';
import {SelectUserForForm, SelectUserForFormProps} from "./selectUserForForm";
import {withCheckBoxOption} from "../../components/OptionalFormComponent";
import {InputBase} from "../../components/Input/inputBase";
import {AbstractMemoryInput, Unit} from "../../components/AbstractSettingsForm/abstractMemoryInput";
import {Fragment} from "react";
import {UserInputField} from "../../components/MainOwnerForm/userInput";
import {useCurrentUserAndGroups} from "../../hooks/user";
import {Label} from "reactstrap";
import formatBytes from "../../utils/sizeUtils";

interface FormProps extends FormikProps<Quota> {
  onUserChanged: SelectUserForFormProps['onAfterChange']
  quotaSize: QuotaSizeQuery,
}

const MemoryInput = withCheckBoxOption(AbstractMemoryInput);
const NumberInput = withCheckBoxOption(InputBase);

export const QuotaAdminControllerForm: React.FunctionComponent<FormProps> =
  ({onUserChanged, quotaSize, ...props}) => {
    console.log("Quota form values: ", props);
    const {isValid} = props;
    const {data: {currentUser}} = useCurrentUserQuery();
    const myProps = {
      ...props,
      isValid: currentUser.isAdmin ? isValid : false
    };
    return (
      <ApplyResetForm {...myProps}>
        <h4>Quota options</h4>
        <Field
          name="user"
          component={SelectUserForForm}
          onAfterChange={onUserChanged}
          placeholder="Select a user to impose quota on..."
        />
        {props.values.user &&
        (<Fragment>
          <Field
            name="vmCount"
            component={NumberInput}
            type="number"
            checkboxLabelContent="VM count"
          >
            {quotaSize && quotaSize.quotaLeft && quotaSize.quotaLeft.vmCount && (
              <Label>
                <b>{quotaSize.quotaUsage.vmCount}</b> created / {quotaSize.quotaLeft.vmCount} left
              </Label>
            )}
          </Field>
          <Field
            name="vcpuCount"
            component={NumberInput}
            type="number"
            checkboxLabelContent="VCPU count">
            {quotaSize && quotaSize.quotaLeft && quotaSize.quotaLeft.vcpuCount && (
              <Label>
                <b>{quotaSize.quotaUsage.vcpuCount}</b> is currently running / {quotaSize.quotaLeft.vcpuCount} left
              </Label>
            )}
          </Field>
          <Field
            name="vdiSize"
            component={MemoryInput}
            checkboxLabelContent="Total VDI size"
            unit={Unit.GB}
          >
            {quotaSize && quotaSize.quotaLeft && quotaSize.quotaLeft.vdiSize && (
              <Label>
                <b>{formatBytes(quotaSize.quotaUsage.vdiSize, 2)}</b> is used
                / {formatBytes(quotaSize.quotaLeft.vdiSize, 2)} left
              </Label>
            )}
          </Field>
          <Field
            name="memory"
            component={MemoryInput}
            checkboxLabelContent="Total RAM size"
            unit={Unit.MB}
          >
            {quotaSize && quotaSize.quotaLeft && quotaSize.quotaLeft.memory && (
              <Label>
                <b>{formatBytes(quotaSize.quotaUsage.memory, 2)}</b> is currently used
                / {formatBytes(quotaSize.quotaLeft.memory, 2)} left
              </Label>
            )}
          </Field>
        </Fragment>)}
      </ApplyResetForm>
    )
  };


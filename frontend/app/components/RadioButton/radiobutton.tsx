import {Input, Label} from "reactstrap";
import React, {ChangeEvent} from "react";
import {FieldProps} from "formik";
import {FormGroup} from "../MarginFormGroup";
import {ChangeInputEvent} from "../AbstractSettingsForm/inputUtils";

interface Props<T> extends FieldProps<T> {
  id: string;
  label: string;
  disabled?: boolean;
}

/**
 * This Radio button sets value to null if id is null, which is the desired behaviour for e.g. distro.
 * If distro is set to null, it's removed
 * @param props
 * @constructor
 */
export function RadioButton<T>(props: Props<T>) {
  const onChange: Props<T>['field']['onChange'] = (e: ChangeInputEvent) => {
    if (e.target.value == '')
      props.form.setFieldValue(props.field.name, null);
    else
      props.field.onChange(e)

  };
  return (
    <FormGroup check={true}>
      <Label check={true}>
        <Input
          name={props.field.name}
          id={props.id}
          type="radio"
          value={props.id}
          checked={props.id === props.field.value}
          onChange={onChange}
          onBlur={props.field.onBlur}
          disabled={props.disabled}
        />
        {props.label}
      </Label>
    </FormGroup>
  );
}

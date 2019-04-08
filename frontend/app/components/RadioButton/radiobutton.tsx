import {Input, InputProps, Label} from "reactstrap";
import React, {ChangeEvent} from "react";
import {FieldProps} from "formik";
import {FormGroup} from "../MarginFormGroup";
import {ChangeInputEvent} from "../AbstractSettingsForm/inputUtils";

interface Props<T> extends FieldProps<T> {
  id: string;
  label: string;
}

/**
 * This Radio button sets value to null if id is null, which is the desired behaviour for e.g. distro.
 * If distro is set to null, it's removed
 * @param props
 * @constructor
 */
export function RadioButton<T>({form, field, id, label, ...props}: Props<T> & InputProps) {
  const onChange: Props<T>['field']['onChange'] = (e: ChangeInputEvent) => {
    if (e.target.value == '')
      form.setFieldValue(field.name, null);
    else
      field.onChange(e)

  };
  return (
    <FormGroup check={true}>
      <Label check={true}>
        <Input
          name={field.name}
          id={id}
          type="radio"
          value={id}
          checked={id === field.value}
          onChange={onChange}
          onBlur={field.onBlur}
          {...props}
        />
        {label}
      </Label>
    </FormGroup>
  );
}

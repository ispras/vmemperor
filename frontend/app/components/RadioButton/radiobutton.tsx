import {Input, Label} from "reactstrap";
import React from "react";
import {FieldProps} from "formik";
import {FormGroup} from "../MarginFormGroup";

interface Props<T> extends FieldProps<T> {
  id: string;
  label: string;
  disabled?: boolean;
}

export function RadioButton<T>(props: Props<T>) {
  return (
    <FormGroup check={true}>
      <Label check={true}>
        <Input
          name={props.field.name}
          id={props.id}
          type="radio"
          value={props.id}
          checked={props.id === props.field.value}
          onChange={props.field.onChange}
          onBlur={props.field.onBlur}
          disabled={props.disabled}
        />
        {props.label}
      </Label>
    </FormGroup>
  );
}

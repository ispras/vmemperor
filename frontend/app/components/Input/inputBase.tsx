import {FieldProps} from "formik";
import {Input, InputProps} from "reactstrap";
import {Omit} from "../AbstractSettingsForm/utils";
import {getFeedback, getInvalid} from "./utils";
import * as React from "react";
import {Fragment} from "react";

export interface InputBaseProps<T> extends FieldProps<T>, Omit<InputProps, "form" | "invalid"> {

}

export function InputBase<T>({form, field, ...props}: InputBaseProps<T>) {
  const newField: typeof field = {...field, value: field.value === null ? '' : field.value};
  return (<Fragment>
    <Input  {...newField} {...props}
            invalid={getInvalid(form, field.name)}
            key={field.name}
    />
    {getFeedback(form, field.name)}
  </Fragment>);
}


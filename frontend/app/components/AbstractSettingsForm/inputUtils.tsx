import {FormikProps} from "formik";
import * as React from "react";
import {Fragment, ReactNode} from "react";
import {Input, InputProps} from "reactstrap";
import {getFeedback, getInvalid} from "../Input/utils";
import {InputType} from "reactstrap/lib/Input";
import dlv from 'dlv';
import {Omit} from "./utils";

export type ChangeInputEvent = React.ChangeEvent<HTMLInputElement>;

interface Props<FormValues> extends Omit<InputProps, "onBlur" | "onChange" | "value" | "invalid" | "form"> {
  form: FormikProps<FormValues>;
  onChange?: (e: ChangeInputEvent) => void;
  value?: InputProps['value'];
}

export function FormInput<T>({form, onChange, value, ...props}: Props<T>) {
  const {name} = props;
  if (!value) {
    value = dlv(form.values, name);
  }
  if (!onChange)
    onChange = form.handleChange(name);
  return (
    <Fragment>
      <Input
        onBlur={form.handleBlur(name)}
        onChange={onChange}
        value={value}
        invalid={getInvalid(form, name)}
        {...props}
      />
      {getFeedback(form, name)}
    </Fragment>
  )
}

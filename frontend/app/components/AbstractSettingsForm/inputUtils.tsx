import {FormikProps} from "formik";
import * as React from "react";
import {Fragment} from "react";
import {Input} from "reactstrap";
import {getFeedback, getInvalid} from "../Input/utils";
import {InputType} from "reactstrap/lib/Input";

export type ChangeInputEvent = React.ChangeEvent<HTMLInputElement>;

export function getInput<T>(form: FormikProps<T>, name: string, type: InputType, onChange: (e: ChangeInputEvent) => void = null, value: any = null) {

  return (
    <Fragment>
      <Input
        name={name}
        type={type}
        onBlur={form.handleBlur(name)}
        onChange={onChange ? onChange : form.handleChange(name)}
        value={value}
        invalid={getInvalid(form, name)}
      />
      {getFeedback(form, name)}
    </Fragment>
  )
}
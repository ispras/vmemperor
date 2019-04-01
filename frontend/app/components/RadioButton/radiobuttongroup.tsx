import {connect, FormikProps} from "formik";
import {FormGroup} from "../MarginFormGroup";
import React, {ReactNode} from "react";
import {getFeedback} from "../Input/utils";

interface OuterProps {
  children: ReactNode;
  label: ReactNode;
  id: string;
}

interface Props<T> extends OuterProps {
  formik: FormikProps<T>;
}

/**
 * Radio Button Group that integrates well with Formik.
 * @param props
 * @constructor
 */
function RadioButtonGroup<T>({children, label, id, formik}: Props<T>) {
  return (
    <FormGroup tag={"fieldset"}>
      <legend>{label}</legend>
      {children}
      {getFeedback(formik, id)}
    </FormGroup>
  );
}

export default function <T>() {
  return connect<OuterProps, T>(RadioButtonGroup);
}

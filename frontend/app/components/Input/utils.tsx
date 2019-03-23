import {FormikProps} from "formik";
import {FormFeedback} from "reactstrap";
import React from "react";
import dlv from 'dlv';

export function getInvalid<T>(form: FormikProps<T>, fieldName: string) {
  return Boolean(dlv(form.touched, fieldName) && dlv(form.errors, fieldName));
}

export function getFeedback<T>(form: FormikProps<T>, fieldName: string) {
  if (getInvalid(form, fieldName)) {
    return (<FormFeedback>
      {dlv(form.errors, fieldName)}
    </FormFeedback>);
  } else
    return null;
}

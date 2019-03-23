import {validateYupSchema, yupToFormErrors} from "formik";
import {filterNullValuesAndTypename} from "../components/AbstractSettingsForm/utils";
import {merge} from "lodash";

export function mergeDefaults<T>(defaults: Partial<T>, initialValues: Partial<T>): T {
  return merge({}, defaults, filterNullValuesAndTypename(initialValues));
}

export const validation = (validationSchema) => (values) => {
  try {
    validateYupSchema(values, validationSchema, true, values);
  } catch (err) {
    const errs = yupToFormErrors(err);
    return errs;
  }

  return {};
}

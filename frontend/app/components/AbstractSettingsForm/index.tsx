import {useMutation} from "react-apollo-hooks";
import {Formik, FormikActions, FormikConfig} from "formik";
import * as React from "react";
import {useCallback} from "react";
import {difference, findDeepField, mutationResponseToFormikErrors, setXenAdapterAPIError,} from "./utils";
import {DocumentNode} from "graphql";
import {mergeDefaults, validation} from "../../utils/forms";
import {XenObjectFragment} from "../../generated-models";

export interface AbstractSettingsFormProps<T> {
  initialValues: Partial<T>,
  defaultValues: Partial<T>
  mutationNode: DocumentNode; //Represents a settings mutation
  mutationName: string; //Represents a settings mutation name and root key
  validationSchema: FormikConfig<T>['validationSchema'];
  component: FormikConfig<T>['component'];
}


export function AbstractSettingsForm<T extends XenObjectFragment.Fragment>({
                                                                             initialValues: {ref, ...rest},
                                                                             defaultValues,
                                                                             mutationNode,
                                                                             mutationName,
                                                                             validationSchema,
                                                                             component,
                                                                           }: AbstractSettingsFormProps<T>) {

  //@ts-ignore
  const initialValues = mergeDefaults(defaultValues, rest);
  const mutate = useMutation(mutationNode);
  const onSubmit: FormikConfig<T>['onSubmit'] = useCallback(async (values: T, formikActions: FormikActions<T>) => {
    const dirtyValues = difference(values, initialValues);
    if (!dirtyValues || Object.keys(dirtyValues).length == 0)
      return;
    else {
      console.log("Dirty values", dirtyValues, dirtyValues.length);
    }
    try {
      const {data} = await mutate({
        errorPolicy: "none",
        variables: {
          [mutationName]:
            {
              ref,
              ...dirtyValues,
            }
        }
      });

      const response = data[mutationName];
      const errorData = mutationResponseToFormikErrors(response);
      if (errorData) {
        if (errorData[0] !== null && values.hasOwnProperty(errorData[0]))
          formikActions.setFieldError(errorData[0], errorData[1]);
        else
          formikActions.setStatus({'error': errorData[1]});
      }
    } catch (e) {
      const [field, message] = setXenAdapterAPIError(e, values);
      console.log("Set error for field: ", field, message);
      formikActions.setFieldError(field, message);

    }

    formikActions.setSubmitting(false);

  }, [initialValues]);
  const validator = validation(validationSchema);
  return (
    <Formik initialValues={initialValues}
            isInitialValid={true}
            enableReinitialize={true}
            onSubmit={onSubmit}
            validate={validator}
            component={component}
    />
  );
}

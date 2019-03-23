import {useMutation} from "react-apollo-hooks";
import {Formik, FormikActions, FormikConfig} from "formik";
import {useCallback} from "react";
import {
  difference, filterNullValuesAndTypename, findDeepField,
  mutationResponseToFormikErrors, setXenAdapterAPIError,
} from "./utils";
import {DocumentNode} from "graphql";
import * as React from "react";
import {merge} from 'lodash';

export interface AbstractSettingsFormProps<T> {
  initialValues: Partial<T>,
  defaultValues: Partial<T>
  mutationNode: DocumentNode; //Represents a settings mutation
  mutationName: string; //Represents a settings mutation name and root key
  validationSchema: FormikConfig<T>['validationSchema'];
  component: FormikConfig<T>['component'];
  mutableObject: {
    ref: string;
  }

}

function mergeDefaults<T>(defaults: Partial<T>, initialValues: Partial<T>): T {
  return merge({}, defaults, filterNullValuesAndTypename(initialValues));
}

export function AbstractSettingsForm<T extends object>({
                                                         initialValues: _inits,
                                                         defaultValues,
                                                         mutationNode,
                                                         mutationName,
                                                         validationSchema,
                                                         component,
                                                         mutableObject,
                                                       }: AbstractSettingsFormProps<T>) {
  const initialValues = mergeDefaults(defaultValues, _inits);
  const mutate = useMutation(mutationNode);
  const onSubmit: FormikConfig<T>['onSubmit'] = useCallback(async (values: T, formikActions: FormikActions<T>) => {
    const dirtyValues = difference(initialValues, values);
    console.log("Dirty values: ", dirtyValues);
    if (!dirtyValues)
      return;
    try {
      const {data} = await mutate({
        errorPolicy: "none",
        variables: {
          [mutationName]:
            {
              ref: mutableObject.ref,
              ...dirtyValues,
            }
        }
      });

      const response = data[mutationName];
      const errorData = mutationResponseToFormikErrors(response);
      if (errorData) {

        const [field, message] = errorData;
        if (field) //Trace field returned from the server by inverting dirtyValues.
          formikActions.setFieldError(findDeepField(values, field), message);
        else
          formikActions.setFormikState({'error': message});
      }
    } catch (e) {
      const [field, message] = setXenAdapterAPIError(e, values);
      console.log("Set error for field: ", field, message);
      formikActions.setFieldError(field, message);

    }

    formikActions.setSubmitting(false);

  }, [initialValues, mutableObject.ref]);

  return (
    <Formik initialValues={initialValues}
            validationSchema={validationSchema}
            isInitialValid={true}
            enableReinitialize={true}
            onSubmit={onSubmit}
            component={component}
    />
  );
}

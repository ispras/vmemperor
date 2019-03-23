import {useMutation} from "react-apollo-hooks";
import {Formik, FormikActions, FormikConfig} from "formik";
import {useCallback} from "react";
import {
  dirtyFormValuesToVariables, invert,
  MapperTypeMap,
  mutationResponseToFormikErrors, setXenAdapterAPIError,
  variablesToMutationArguments
} from "./utils";
import {DocumentNode} from "graphql";
import * as React from "react";

export interface AbstractSettingsFormProps<T> {
  initialValues: T
  mutationNode: DocumentNode; //Represents a settings mutation
  mutationName: string; //Represents a settings mutation name and root key
  mapFromFormValuesToMutationValues: MapperTypeMap<T>;
  validationSchema: FormikConfig<T>['validationSchema'];
  component: FormikConfig<T>['component'];
  mutableObject: {
    ref: string;
  }

}

export function AbstractSettingsForm<T>({
                                          initialValues,
                                          mutationNode,
                                          mutationName,
                                          mapFromFormValuesToMutationValues,
                                          validationSchema,
                                          component,
                                          mutableObject,
                                        }: AbstractSettingsFormProps<T>) {

  const mutate = useMutation(mutationNode);
  const onSubmit: FormikConfig<T>['onSubmit'] = useCallback(async (values: T, formikActions: FormikActions<T>) => {
    const dirtyValues = dirtyFormValuesToVariables(initialValues, values, mapFromFormValuesToMutationValues);
    console.log("Dirty values: ", dirtyValues);
    if (!dirtyValues)
      return;
    const args = variablesToMutationArguments(dirtyValues);
    console.log("Arguments for mutation", args);
    try {
      const {data} = await mutate({
        errorPolicy: "none",
        variables: {
          [mutationName]:
            {
              ref: mutableObject.ref,
              ...args,
            }
        }
      });

      const response = data[mutationName];
      const errorData = mutationResponseToFormikErrors(response);
      if (errorData) {

        const [field, message] = errorData;
        if (field) //Trace field returned from the server by inverting dirtyValues.
          formikActions.setFieldError(invert(dirtyValues)[field], message);
        else
          formikActions.setFormikState({'error': message});
      }
    } catch (e) {
      const [field, message] = setXenAdapterAPIError(e, invert(dirtyValues));
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

import {useMutation} from "react-apollo-hooks";
import {Formik, FormikActions, FormikConfig, FormikProps, getIn} from "formik";
import * as React from "react";
import {ReactNode, useCallback} from "react";
import {difference, findDeepField, mutationResponseToFormikErrors, setApiError,} from "./utils";
import {DocumentNode} from "graphql";
import {mergeDefaults, validation} from "../../utils/forms";
import {XenObjectFragmentFragment} from "../../generated-models";

export interface AbstractSettingsFormProps<T> {
  children: ReactNode; // Formik-powered form fields
  initialValues: Partial<T>,
  defaultValues: Partial<T>
  mutationNode: DocumentNode; //Represents a settings mutation
  mutationName: string; //Represents a settings mutation name and root key
  validationSchema: FormikConfig<T>['validationSchema'];
  component: React.ComponentType<FormikProps<T>>
}


export function
AbstractSettingsForm<T extends XenObjectFragmentFragment>({
                                                            initialValues: {ref, ...rest},
                                                            defaultValues,
                                                            mutationNode,
                                                            mutationName,
                                                            validationSchema,
                                                            component,
                                                            children
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
          ref,
          [mutationName]:
            {
              ...dirtyValues,
            }
        }
      });

      const response = data[mutationName];
      const errorData = mutationResponseToFormikErrors(response);
      if (errorData) {
        if (errorData[0] !== null && getIn(values, errorData[0]))
          formikActions.setFieldError(errorData[0], errorData[1]);
        else if (errorData[0] === null)
          formikActions.setStatus({'error': errorData[1]});
        else
          formikActions.setStatus({'error': `in field ${errorData[0]}: ${errorData[1]}`})
      }
    } catch (e) {
      const [field, message] = setApiError(e, values);
      if (field)
        formikActions.setFieldError(field, message);
      else
        formikActions.setStatus({'error': message});

    }

    formikActions.setSubmitting(false);

  }, [initialValues]);
  const validator = validation(validationSchema);
  const Component = component;
  return (
    <Formik initialValues={initialValues}
            isInitialValid={true}
            enableReinitialize={true}
            onSubmit={onSubmit}
            validate={validator}
            render={props => (
              <Component {...props}>
                {children}
              </Component>
            )}
    />
  );
}

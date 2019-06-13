import React, {ReactNode, useMemo} from "react";
import {DocumentNode} from "graphql";
import {AbstractSettingsForm} from "../AbstractSettingsForm";
import {ApplyResetForm} from "./form";


interface Props<T> {
  object: T;
  mutationName: string;
  mutationNode: DocumentNode;
  defaultValues: Partial<T>;
  children: ReactNode;
  schema: any;
}


export function ResourcesFormContainer<T>({object, mutationName, mutationNode, defaultValues, children, schema}: Props<T>) {
  const initialValues = useMemo(() => {
    //Replace main_owner User object with user ID if it's there
    if (object.hasOwnProperty('mainOwner') && object['mainOwner']['id']) {
      return {
        ...object,
        mainOwner: object['mainOwner']['id']
      }
    } else {
      return object;
    }
  }, [object]);

  return (
    <AbstractSettingsForm
      initialValues={initialValues}
      defaultValues={defaultValues}
      mutationNode={mutationNode}
      mutationName={mutationName}
      validationSchema={schema}
      component={ApplyResetForm}
    >
      {children}
    </AbstractSettingsForm>

  );
}

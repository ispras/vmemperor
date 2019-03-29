import React, {ReactNode, useMemo} from "react";
import {DocumentNode} from "graphql";
import {AbstractSettingsForm} from "../AbstractSettingsForm";
import {ResourcesForm} from "./form";


interface Props<T> {
  object: T;
  mutationName: string;
  mutationNode: DocumentNode;
  defaultValues: Partial<T>;
  children: ReactNode;
  schema: any;
}


export function ResourcesFormContainer<T>({object, mutationName, mutationNode, defaultValues, children, schema}: Props<T>) {
  return (
    <AbstractSettingsForm
      initialValues={object}
      defaultValues={defaultValues}
      mutationNode={mutationNode}
      mutationName={mutationName}
      validationSchema={schema}
      component={ResourcesForm}
    >
      {children}
    </AbstractSettingsForm>

  );
}

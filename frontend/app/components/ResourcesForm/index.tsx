import React, {useMemo} from "react";
import {DocumentNode} from "graphql";
import schema from "./schema";
import {AbstractSettingsForm} from "../AbstractSettingsForm";
import {ResourcesForm} from "./form";
import {XenObjectFragmentFragment} from "../../generated-models";
import {Omit} from "../AbstractSettingsForm/utils";


interface Props<T> {
  object: T;
  mutationName: string;
  mutationNode: DocumentNode;
  defaultValues: Partial<T>;
}


export function ResourcesFormContainer<T>({object, mutationName, mutationNode, defaultValues}: Props<T>) {
  return (
    <AbstractSettingsForm
      initialValues={object}
      defaultValues={defaultValues}
      mutationNode={mutationNode}
      mutationName={mutationName}
      validationSchema={schema}
      component={ResourcesForm}
    />

  );
}

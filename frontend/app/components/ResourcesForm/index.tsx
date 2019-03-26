import React, {useMemo} from "react";
import {DocumentNode} from "graphql";
import schema from "./schema";
import {AbstractSettingsForm} from "../AbstractSettingsForm";
import {ResourcesForm} from "./form";
import {XenObjectFragment} from "../../generated-models";

interface Props<T extends XenObjectFragment.Fragment> {
  object: T;
  mutationName: string;
  mutationNode: DocumentNode;
  defaultValues: Partial<T>;
}


export function ResourcesFormContainer<T extends XenObjectFragment.Fragment>({object, mutationName, mutationNode, defaultValues}: Props<T>) {

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

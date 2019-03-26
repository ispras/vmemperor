import React, {useMemo} from "react";
import {DocumentNode} from "graphql";
import schema, {AbstractVM, ResourceFormValues} from "./schema";
import {AbstractSettingsForm} from "../AbstractSettingsForm";
import {ResourcesForm} from "./form";

interface Props {
  object: AbstractVM;
  mutationName: string;
  mutationNode: DocumentNode;
}

const defaults = {
  platform: {
    coresPerSocket: 1,
  }
};


export const ResourcesFormContainer: React.FunctionComponent<Props> = ({object, mutationName, mutationNode}) => {
  const {ref, myActions, ...rest} = object;

  return (
    <AbstractSettingsForm
      initialValues={rest}
      defaultValues={defaults}
      mutationNode={mutationNode}
      mutationName={mutationName}
      validationSchema={schema}
      component={ResourcesForm}
      mutableObject={object}/>

  );
};

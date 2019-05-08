import {
  PlaybookNameForTaskListDocument, PlaybookNameForTaskListQuery, PlaybookNameForTaskListQueryVariables,
  TaskFragmentFragment, TemplateForTaskListDocument, TemplateForTaskListQuery, TemplateForTaskListQueryVariables,
  VMForTaskListDocument,
  VMForTaskListQuery,
  VMForTaskListQueryVariables
} from "../../generated-models";
import {ApolloClient} from "apollo-client";
import Label from "reactstrap/lib/Label";
import * as React from "react";
import {Omit} from "react-apollo-hooks/lib/utils";
import * as moment from "moment";

export interface TaskDataType extends Omit<TaskFragmentFragment, "nameLabel" | "created" | "finished"> {
  nameLabel: React.ReactNode | TaskFragmentFragment['nameLabel']
}

export const getVMNameLabel = async (client: ApolloClient<any>, ref: string): Promise<string> => {
  if (!ref) {
    return "Unknown VM";
  }
  try {
    const {data: {vm: {nameLabel}}} = await client.query<VMForTaskListQuery, VMForTaskListQueryVariables>({
        query: VMForTaskListDocument,
        variables: {
          vmRef: ref
        }
      }
    );
    return nameLabel;
  } catch (e) {
    return `Deleted VM ${ref}`
  }
};

const getNameLabelForVM = async (client: ApolloClient<any>, method: string, value: TaskFragmentFragment) => {
  if (method == "launch_playbook") {
    const refs = value.objectRef.split(";");
    const asyncMapNameLabels = refs.map(async (item) => {
      return await getVMNameLabel(client, item);
    });
    const nameLabels = await Promise.all(asyncMapNameLabels);
    const playbookInfo = JSON.parse(value.nameDescription);
    const playbookName = async (playbookInfo) => {
      if (playbookInfo.playbookId) {
        try {
          const {data: {playbook: {name}}} = await client.query<PlaybookNameForTaskListQuery, PlaybookNameForTaskListQueryVariables>({
            query: PlaybookNameForTaskListDocument,
            variables: {
              playbookId: playbookInfo.playbookId
            }
          });
          return name;
        } catch (e) {
          return `Deleted playbook ${playbookInfo.playbookId}`
        }

      }
      return "Unknown";
    };
    return (<Label>
      Played playbook <i><b>{await playbookName(playbookInfo)}</b></i> on {nameLabels && nameLabels.length > 0 &&
    (nameLabels.length == 1 && <span>VM  <b>{nameLabels[0]}</b></span>
      || (<span>VMs {nameLabels.map((nameLabel, index) => index == nameLabels.length - 1
        ? <b>{nameLabel}</b> :
        <span><b>{nameLabel}</b>,</span>)}</span>))}
    </Label>)
  } else {

    const vmNameLabel = await getVMNameLabel(client, value.objectRef);
    switch (method) {
      case "start":
        return <Label>Started VM <b>{vmNameLabel}</b></Label>;
      case "shutdown":
        return <Label>Shut down VM <b>{vmNameLabel}</b></Label>;
      case "hard_shutdown":
        return <Label>Forcibly shut down VM <b>${vmNameLabel}</b></Label>;
      case "clean_shutdown":
        return <Label>Gracefully shut down VM <b>{vmNameLabel}</b></Label>;
      default:
        break;
    }
  }
  return value.nameLabel;
};

export const getTemplateNameLabel = async (client: ApolloClient<any>, ref: string) => {
  if (!ref)
    return `Unknown template`;
  try {
    const {data: {template: {nameLabel}}} = await client.query<TemplateForTaskListQuery, TemplateForTaskListQueryVariables>({
      query: TemplateForTaskListDocument,
      variables: {
        templateRef: ref,
      }
    });
    return nameLabel;
  } catch (e) {
    return `Deleted template ${ref}`
  }
};
const getNameLabelForTemplate = async (client: ApolloClient<any>, method: string, value: TaskFragmentFragment) => {
  const templateNameLabel = await getTemplateNameLabel(client, value.objectRef);
  switch (method) {
    case "create_vm":
      if (value.result) {
        const vmNameLabel = await getVMNameLabel(client, value.result);

        return <Label>Created VM <b>{vmNameLabel}</b> from template <i><b>{templateNameLabel}</b></i></Label>;
      }
      return <Label>Creating VM from template <i><b>{templateNameLabel}</b></i></Label>;
    default:
      break;
  }

  return value.nameLabel;
};

const getNameLabel = (client: ApolloClient<any>) => async (value: TaskFragmentFragment) => {
  let cl = value.objectType;
  let method = value.action;
  if (!value.objectType) {
    const nameParts = value.nameLabel.split('.');
    if (nameParts.length > 1 && value.objectRef) {
      if (nameParts[0] == 'Async') {
        cl = nameParts[1];
        method = nameParts[2];
      } else {
        cl = nameParts[0];
        method = nameParts[1];
      }
    }
  }

  switch (cl) {
    case "VM":
      return await getNameLabelForVM(client, method, value);
    case "Template":
      return await getNameLabelForTemplate(client, method, value);
    default:
      return value.nameLabel;
  }
};

export const getValue: (client: ApolloClient<any>) => (value: TaskFragmentFragment) => Promise<TaskDataType>
  = client => async value => ({
    ...value,
    nameLabel: await getNameLabel(client)(value),
  }
);

export default getValue;

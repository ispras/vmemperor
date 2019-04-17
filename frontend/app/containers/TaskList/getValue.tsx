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

export interface DataType extends Omit<TaskFragmentFragment, "nameLabel" | "created" | "finished"> {
  nameLabel: React.ReactNode | TaskFragmentFragment['nameLabel']
}


const getNameLabelForVM = async (client: ApolloClient<any>, method: string, value: TaskFragmentFragment) => {
  if (method == "launch_playbook") {
    const refs = value.objectRef.split(";");
    const asyncMapNameLabels = refs.map(async (item) => {
      const {data: {vm: {nameLabel: vmNameLabel}}} = await client.query<VMForTaskListQuery, VMForTaskListQueryVariables>({
        query: VMForTaskListDocument,
        variables: {
          vmRef: item
        }
      });
      return vmNameLabel;
    });
    const nameLabels = await Promise.all(asyncMapNameLabels);
    const playbookInfo = JSON.parse(value.nameDescription);
    const playbookName = async (playbookInfo) => {
      if (playbookInfo.playbookId) {
        const {data: {playbook: {name}}} = await client.query<PlaybookNameForTaskListQuery, PlaybookNameForTaskListQueryVariables>({
          query: PlaybookNameForTaskListDocument,
          variables: {
            playbookId: playbookInfo.playbookId
          }
        });
        if (name)
          return name;
        else
          return playbookInfo.playbookId;
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
    const {data: {vm: {nameLabel: vmNameLabel}}} = await client.query<VMForTaskListQuery, VMForTaskListQueryVariables>({
        query: VMForTaskListDocument,
        variables: {
          vmRef: value.objectRef
        }
      }
    );
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

const getNameLabel = (client: ApolloClient<any>) => async (value: TaskFragmentFragment) => {
  const nameParts = value.nameLabel.split('.');
  if (nameParts.length > 1 && value.objectRef) {
    let cl = null;
    let method = null;
    if (nameParts[0] == 'Async') {
      cl = nameParts[1];
      method = nameParts[2];
    } else {
      cl = nameParts[0];
      method = nameParts[1];
    }
    switch (cl) {
      case "VM":
        return await getNameLabelForVM(client, method, value);
      case "Template":
        const {data: {template: {nameLabel: templateNameLabel}}} = await client.query<TemplateForTaskListQuery, TemplateForTaskListQueryVariables>({
          query: TemplateForTaskListDocument,
          variables: {
            templateRef: value.objectRef
          }
        });
        switch (method) {
          case "create_vm":
            if (value.result) {
              const {data: {vm: {nameLabel: vmNameLabel}}} = await client.query<VMForTaskListQuery, VMForTaskListQueryVariables>({
                query: VMForTaskListDocument,
                variables: {
                  vmRef: value.result
                }
              });

              return <Label>Created VM <b>{vmNameLabel}</b> from template <i><b>{templateNameLabel}</b></i></Label>;
            }
            return <Label>Creating VM from template <i><b>{templateNameLabel}</b></i></Label>;
          default:
            break;
        }
        break;
      default:
        break;

    }
  }
  return value.nameLabel;
};

const getValue: (client: ApolloClient<any>) => (value: TaskFragmentFragment) => Promise<DataType>
  = client => async value => ({
    ...value,
    nameLabel: await getNameLabel(client)(value),
  }
);

export default getValue;

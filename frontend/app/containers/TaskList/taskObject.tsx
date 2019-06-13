import {
  PlaybookNameForTaskListDocument,
  PlaybookNameForTaskListQuery,
  PlaybookNameForTaskListQueryVariables,
  TaskFragmentFragment,
  TemplateForTaskListDocument,
  TemplateForTaskListQuery,
  TemplateForTaskListQueryVariables,
  UserGetDocument,
  UserGetQuery,
  UserGetQueryVariables,
  VBDForTaskListDocument,
  VBDForTaskListQuery,
  VBDForTaskListQueryVariables,
  VMForTaskListDocument,
  VMForTaskListQuery,
  VMForTaskListQueryVariables
} from "../../generated-models";
import ApolloClient from "apollo-client";
import {Label} from "reactstrap";
import React from "react";
import {getDriveName} from "../../utils/userdevice";


/**
 * Obtains a human-readable name label for objects that appear in settings changes
 * @param name settings key name
 * @param value settings key value
 * @return human-readable name label
 * @see getResultDiffText
 *
 */
const getNameLabelForObject = async (client: ApolloClient<any>, name: string, value: string) => {
  switch (name) {
    case "main_owner":
      if (!value)
        return "no one";
      try {
        const {data: {user: {name}}} = await client.query<UserGetQuery, UserGetQueryVariables>(
          {
            query: UserGetDocument,
            variables: {
              userId: value
            }
          }
        );
        return name;
      } catch (e) {
        return `Deleted user ${value}`
      }
    default:
      return value;
  }
};

/**
 * This class represents a task subject, i.e. an object who were used during a task
 * It allows to get a name label of the object and/or of the task in question
 */
class TaskSubject {
  protected task: TaskFragmentFragment;
  protected client: ApolloClient<any>;
  protected method: string;
  protected objectType: string;

  constructor(task: TaskFragmentFragment, objectType: string, method: string, client: ApolloClient<any>) {
    this.task = task;
    this.client = client;
    if (objectType)
      this.objectType = objectType;
    else
      this.objectType = this.task.objectType;

    this.method = method;
  }

  getObjectType() {
    return this.task.objectType;
  }

  protected async getNameLabel() {
    const nameLabel = await this.constructor._getNameLabel(this.client, this.task.objectRef);
    if (nameLabel)
      return nameLabel;
    return `Deleted ${this.getObjectType()} "${this.task.objectRef}"`
  };

  protected static async _getNameLabel(client: ApolloClient<any>, objectRef: string): Promise<string | JSX.Element> {
    //Subclass implementation of getNameLabel is expected to call _getNameLabel(ref)
    //This is done to reuse this method in tasks that require several types of name labels (i.e. VM creation
    // requires both template and VM name label"
    return null;
  }

  protected getDestroyTaskName() {
    /**
     * This method uses the fact that Task.process_record puts last record in destroy event's  result
     * (see backend/xenadapter/task.py)
     */
    try {
      const lastSnapshot = JSON.parse(this.task.result);
      return <Label>{this.getObjectType()} last known
        as <b>{lastSnapshot['name_label'] || lastSnapshot['uuid']}</b> destroyed
      </Label>
    } catch (e) {
      return <Label>{this.task.objectType} <b>{this.task.objectRef}</b> destroyed</Label>
    }
    return
  }

  protected async getTaskNameForDiff(): Promise<string | JSX.Element> {
    const resultTextMap = {
      "main_owner": "main owner"
    };
    try {
      const resultDiff = JSON.parse(this.task.result);
      const changedKeys = Object.keys(resultDiff['old_val']);

      const getResult = async (key) => {
        const oldValue = await getNameLabelForObject(this.client, key, resultDiff['old_val'][key]);
        const newValue = await getNameLabelForObject(this.client, key, resultDiff['new_val'][key])
        return resultTextMap[key] + " from " + oldValue + " to " + newValue + "\n";
      };

      const resultMap = await Promise.all(changedKeys.map(getResult));
      let result = `${this.objectType} ${await this.getNameLabel()}: setting value changed:\n`;
      for (let i = 0; i < resultMap.length; ++i) {
        result += ` ${resultMap[i]}`;
        if (i < resultMap.length - 1) {
          result += "\n"
        }
      }
      return result;
    } catch (e) {
      return null;
    }
  }

  public async getTaskName(): Promise<string | JSX.Element> {
    if (this.method == 'destroy')
      return this.getDestroyTaskName();
    if (this.task.result) {
      const name = await this.getTaskNameForDiff();
      if (name)
        return name;
    }
    return this.task.nameLabel;
  }
}

export class VM extends TaskSubject {
  static async _getNameLabel(client: ApolloClient<any>, objectRef: string) {
    try {
      const {data: {vm: {nameLabel}}} = await client.query<VMForTaskListQuery, VMForTaskListQueryVariables>({
          query: VMForTaskListDocument,
          variables: {
            vmRef: objectRef
          }
        }
      );
      return nameLabel;
    } catch (e) {
      return `Deleted VM ${objectRef}`
    }
  }

  /*
  This method returns a task name for a vdi_attach method
   */
  async getTaskNameForVDI() {

    const vmNameLabel = await this.getNameLabel();
    switch (this.task.nameLabel) {
      case 'Async.VBD.create':
        const {data} = await this.client.query<VBDForTaskListQuery, VBDForTaskListQueryVariables>(
          {
            query: VBDForTaskListDocument,
            variables: {
              vbdRef: this.task.result
            }
          });
        return (
          <Label>Added a disk drive <b>{getDriveName(data.vbd.userdevice)}</b> of type <i>{data.vbd.type}</i> into a
            VM "{vmNameLabel}"</Label>
        );
      case 'Async.VBD.destroy':
        return (<Label>Removed a disk drive from VM "{vmNameLabel}"</Label>)
      default:
        return await super.getTaskName();
    }
  }

  async getTaskName() {
    if (this.method == "launch_playbook") {
      const refs = this.task.objectRef.split(";");
      const asyncMapNameLabels = refs.map(async (item) => {
        return await VM._getNameLabel(this.client, item);
      });
      const nameLabels = await Promise.all(asyncMapNameLabels);
      const playbookInfo = JSON.parse(value.nameDescription);
      const playbookName = async (playbookInfo) => {
        if (playbookInfo.playbookId) {
          try {
            const {data: {playbook: {name}}} = await this.client.query<PlaybookNameForTaskListQuery, PlaybookNameForTaskListQueryVariables>({
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
    }

    switch (this.method) {
      case "start":
        return <Label>Started VM <b>{await this.getNameLabel()}</b></Label>;
      case "shutdown":
        return <Label>Shut down VM <b>{await this.getNameLabel()}</b></Label>;
      case "hard_shutdown":
        return <Label>Forcibly shut down VM <b>{await this.getNameLabel()}</b></Label>;
      case "clean_shutdown":
        return <Label>Gracefully shut down VM <b>{await this.getNameLabel()}</b></Label>;
      case "attach_vdi":
        return this.getTaskNameForVDI();
      case "provision":
        return <Label>Provisioned a new VM <b>{await this.getNameLabel()}</b></Label>;
      default:
        return super.getTaskName();
    }
  }

}

export class Template extends TaskSubject {
  static async _getNameLabel(client: ApolloClient<any>, objectRef: string) {
    if (!objectRef)
      return `Unknown template`;
    try {
      const {data: {template: {nameLabel}}} = await client.query<TemplateForTaskListQuery, TemplateForTaskListQueryVariables>({
        query: TemplateForTaskListDocument,
        variables: {
          templateRef: objectRef,
        }
      });
      return nameLabel;
    } catch (e) {
      return `Deleted template ${objectRef}`
    }
  }

  async getTaskName() {
    switch (this.method) {
      case "create_vm":
        if (this.task.result) {
          const vmNameLabel = await VM._getNameLabel(this.client, this.task.result);
          return <Label>Created VM <b>{vmNameLabel}</b> from template <i><b>{await this.getNameLabel()}</b></i></Label>;
        }
        return <Label>Creating VM from template <i><b>{await this.getNameLabel()}</b></i></Label>;
      default:
        break;
    }
  }
}


export const taskSubjectFactory = (task: TaskFragmentFragment, client: ApolloClient<any>) => {
  let cl = task.objectType;
  let method = task.action;
  if (!task.objectType) {
    const nameParts = task.nameLabel.split('.');
    if (nameParts.length > 1 && task.objectRef) {
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
    case 'VM':
      return new VM(task, cl, method, client);
    case 'Template':
      return new Template(task, cl, method, client);
    default:
      return new TaskSubject(task, cl, method, client);
  }
};


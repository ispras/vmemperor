import {
  PlaybookNameForTaskListDocument,
  PlaybookNameForTaskListQuery,
  PlaybookNameForTaskListQueryVariables, SRForTaskListDocument, SRForTaskListQuery, SRForTaskListQueryVariables,
  TaskFragmentFragment,
  TemplateForTaskListDocument,
  TemplateForTaskListQuery,
  TemplateForTaskListQueryVariables,
  UserGetDocument,
  UserGetQuery,
  UserGetQueryVariables,
  VBDForTaskListDocument,
  VBDForTaskListQuery,
  VBDForTaskListQueryVariables, VDIForTaskListDocument, VDIForTaskListQuery, VDIForTaskListQueryVariables,
  VMForTaskListDocument,
  VMForTaskListQuery,
  VMForTaskListQueryVariables
} from "../../generated-models";
import ApolloClient from "apollo-client";
import {Label} from "reactstrap";
import React from "react";
import {getDriveName} from "../../utils/userdevice";
import {sizeFormatter} from "../../utils/formatters";
import formatBytes from "../../utils/sizeUtils";


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
    //@ts-ignore
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
        as <b>{lastSnapshot['name_label'] || lastSnapshot['uuid']}</b> (<i>{lastSnapshot['ref']}</i>) destroyed
      </Label>
    } catch (e) {
      return <Label>{this.task.objectType} <b>{this.task.objectRef}</b> destroyed</Label>
    }
  }

  /**
   * Obtains a human-readable value label for values that appear in settings changes
   * @param name settings key name
   * @param value settings key value
   * @return human-readable name label
   * @see getResultDiffText
   *
   */
  protected async getValueLabelForSetting(name: string, value: string) {
    switch (name) {
      case "main_owner":
        if (!value)
          return "no one";
        try {
          const {data: {user: {name}}} = await this.client.query<UserGetQuery, UserGetQueryVariables>(
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
      case "memory_static_min":
      case "memory_static_max":
      case "memory_dynamic_min":
      case "memory_dynamic_max":
        return formatBytes(value, 2)

      default:
        return value;


    }


  };

  protected getValueNameForSetting(name: string) {
    switch (name) {
      case "main_owner":
        return "Main owner";
      case "memory_static_min":
        return "Memory static minimum";
      case "memory_static_max":
        return "Memory static maximum";
      case "memory_dynamic_min":
        return "Memory dynamic minimum";
      case "memory_dynamic_max":
        return "Memory dynamic maximum";
      case "VCPUs_max":
        return "Max VCPUs";
      case "VCPUs_at_startup":
        return "VCPUs at startup";
      case "domain_type":
        return "Virtualization mode";
      default:
        return name;
    }
  }

  protected async getTaskNameForDiff(): Promise<string | JSX.Element> {
    try {
      const resultDiff = JSON.parse(this.task.result);
      const changedKeys = Object.keys(resultDiff['old_val']);

      const getResult = async (key) => {
        const oldValue = await this.getValueLabelForSetting(key, resultDiff['old_val'][key]);
        const newValue = await this.getValueLabelForSetting(key, resultDiff['new_val'][key]);
        return "<b> " + this.getValueNameForSetting(key) + "</b>" + " from " + "<i>" + oldValue + "</i> to <i>" + newValue + "</i>\n";
      };

      const resultMap = await Promise.all(changedKeys.map(getResult));
      let result = `${this.objectType} <b>${await this.getNameLabel()}</b>: setting value changed:\n`;
      for (let i = 0; i < resultMap.length; ++i) {
        result += ` ${resultMap[i]}`;
        if (i < resultMap.length - 1) {
          result += "\n"
        }
      }
      return <div dangerouslySetInnerHTML={{__html: result}}/>
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
          },
          fetchPolicy: "network-only",
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
      const playbookInfo = JSON.parse(this.task.nameDescription);
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
        },
        fetchPolicy: "network-only",
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
        return super.getTaskName();
    }
  }
}

export class VDI extends TaskSubject {
  static async _getNameLabel(client: ApolloClient<any>, objectRef: string) {
    if (!objectRef)
      return `Unknown VDI`;
    try {
      const {data: {vdi: {nameLabel}}} = await client.query<VDIForTaskListQuery, VDIForTaskListQueryVariables>({
        query: VDIForTaskListDocument,
        variables: {
          vdiRef: objectRef,
        },
        fetchPolicy: "network-only",
      });
      return nameLabel;
    } catch (e) {
      return `Deleted VDI ${objectRef}`
    }
  }
}


export class SR extends TaskSubject {
  static async _getNameLabel(client: ApolloClient<any>, objectRef: string) {
    if (!objectRef)
      return `Unknown storage repository`;
    try {
      const {data: {sr: {nameLabel}}} = await client.query<SRForTaskListQuery, SRForTaskListQueryVariables>({
        query: SRForTaskListDocument,
        variables: {
          srRef: objectRef,
        }
      });
      return nameLabel;
    } catch (e) {
      return `Deleted storage repository ${objectRef}`
    }
  }

  async getTaskName() {
    switch (this.method) {
      case "vdi_create":
        if (this.task.result) {
          const vdiNameLabel = await VDI._getNameLabel(this.client, this.task.result);
          return <Label>Created VDI <b>{vdiNameLabel}</b> on SR <i><b>{await this.getNameLabel()}</b></i></Label>;
        }
        return <Label>Created VDI on SR <i><b>{await this.getNameLabel()}</b></i></Label>;
      default:
        return super.getTaskName();
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
    case 'VDI':
      return new VDI(task, cl, method, client);
    case 'SR':
      return new SR(task, cl, method, client);
    default:
      return new TaskSubject(task, cl, method, client);
  }
};


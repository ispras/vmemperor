export type Maybe<T> = T | null;

export interface NewVdi {
  /** Storage repository to create disk on */
  SR: string;
  /** Disk size of a newly created disk in megabytes */
  size: number;
}

export interface AutoInstall {
  /** VM hostname */
  hostname: string;
  /** Network installation URL */
  mirrorUrl?: Maybe<string>;
  /** Name of the newly created user */
  username: string;
  /** User and root password */
  password: string;
  /** User's full name */
  fullname?: Maybe<string>;
  /** Partition scheme (TODO) */
  partition: string;
  /** Static IP configuration, if needed */
  staticIpConfig?: Maybe<NetworkConfiguration>;
}

export interface NetworkConfiguration {
  ip: string;

  gateway: string;

  netmask: string;

  dns0: string;

  dns1?: Maybe<string>;
}

export interface TemplateInput {
  /** Template ID */
  uuid: string;
  /** Should this template be enabled, i.e. used in VMEmperor by users */
  enabled?: Maybe<boolean>;
}

export interface VmInput {
  /** VM ID */
  uuid: string;
  /** VM human-readable name */
  nameLabel?: Maybe<string>;
  /** VM human-readable description */
  nameDescription?: Maybe<string>;
  /** VM domain type: 'pv', 'hvm', 'pv_in_pvh' */
  domainType?: Maybe<DomainType>;
}

export interface VmStartInput {
  /** Should this VM be started and immidiately paused */
  paused?: Maybe<boolean>;
  /** Should this VM be started forcibly */
  force?: Maybe<boolean>;
}

export enum HostAllowedOperations {
  Provision = "Provision",
  Evacuate = "Evacuate",
  Shutdown = "Shutdown",
  Reboot = "Reboot",
  PowerOn = "PowerOn",
  VmStart = "VmStart",
  VmResume = "VmResume",
  VmMigrate = "VmMigrate"
}

export enum HostDisplay {
  Enabled = "Enabled",
  DisableOnReboot = "DisableOnReboot",
  Disabled = "Disabled",
  EnableOnReboot = "EnableOnReboot"
}

export enum SrContentType {
  User = "User",
  Disk = "Disk",
  Iso = "ISO"
}

export enum DomainType {
  Hvm = "HVM",
  Pv = "PV",
  PvInPvh = "PV_in_PVH"
}

export enum PowerState {
  Halted = "Halted",
  Paused = "Paused",
  Running = "Running",
  Suspended = "Suspended"
}

export enum PlaybookTaskState {
  Preparing = "Preparing",
  ConfigurationWarning = "ConfigurationWarning",
  Error = "Error",
  Running = "Running",
  Finished = "Finished",
  Unknown = "Unknown"
}

export enum Table {
  Vms = "VMS",
  NetworkAttach = "NetworkAttach",
  DiskAttach = "DiskAttach"
}

export enum ShutdownForce {
  Hard = "HARD",
  Clean = "CLEAN"
}

export enum Change {
  Initial = "Initial",
  Add = "Add",
  Remove = "Remove",
  Change = "Change"
}

/** JSON String */
export type JsonString = any;

/** The `DateTime` scalar type represents a DateTime value as specified by [iso8601](https://en.wikipedia.org/wiki/ISO_8601). */
export type DateTime = any;

// ====================================================
// Documents
// ====================================================

export namespace IsoAttach {
  export type Variables = {
    vmUuid: string;
    isoUuid: string;
  };

  export type Mutation = {
    __typename?: "Mutation";

    isoAttach: Maybe<IsoAttach>;
  };

  export type IsoAttach = {
    __typename?: "AttachISOMutation";

    taskId: Maybe<string>;
  };
}

export namespace IsoDetach {
  export type Variables = {
    vmUuid: string;
    isoUuid: string;
  };

  export type Mutation = {
    __typename?: "Mutation";

    isoAttach: Maybe<IsoAttach>;
  };

  export type IsoAttach = {
    __typename?: "AttachISOMutation";

    taskId: Maybe<string>;
  };
}

export namespace VdiAttach {
  export type Variables = {
    vmUuid: string;
    vdiUuid: string;
  };

  export type Mutation = {
    __typename?: "Mutation";

    vdiAttach: Maybe<VdiAttach>;
  };

  export type VdiAttach = {
    __typename?: "AttachVDIMutation";

    taskId: Maybe<string>;
  };
}

export namespace VdiDetach {
  export type Variables = {
    vmUuid: string;
    vdiUuid: string;
  };

  export type Mutation = {
    __typename?: "Mutation";

    vdiAttach: Maybe<VdiAttach>;
  };

  export type VdiAttach = {
    __typename?: "AttachVDIMutation";

    taskId: Maybe<string>;
  };
}

export namespace NetAttach {
  export type Variables = {
    vmUuid: string;
    netUuid: string;
  };

  export type Mutation = {
    __typename?: "Mutation";

    netAttach: Maybe<NetAttach>;
  };

  export type NetAttach = {
    __typename?: "AttachNetworkMutation";

    taskId: Maybe<string>;
  };
}

export namespace NetDetach {
  export type Variables = {
    vmUuid: string;
    netUuid: string;
  };

  export type Mutation = {
    __typename?: "Mutation";

    netAttach: Maybe<NetAttach>;
  };

  export type NetAttach = {
    __typename?: "AttachNetworkMutation";

    taskId: Maybe<string>;
  };
}

export namespace Console {
  export type Variables = {
    id: string;
  };

  export type Query = {
    __typename?: "Query";

    console: Maybe<string>;
  };
}

export namespace CreateVm {
  export type Variables = {
    VCPUs?: Maybe<number>;
    disks?: Maybe<(Maybe<NewVdi>)[]>;
    installParams?: Maybe<AutoInstall>;
    nameLabel: string;
    nameDescription: string;
    iso?: Maybe<string>;
    template: string;
    network?: Maybe<string>;
    ram: number;
  };

  export type Mutation = {
    __typename?: "Mutation";

    createVm: Maybe<CreateVm>;
  };

  export type CreateVm = {
    __typename?: "CreateVM";

    taskId: string;
  };
}

export namespace DeleteVm {
  export type Variables = {
    uuid: string;
  };

  export type Mutation = {
    __typename?: "Mutation";

    vmDelete: Maybe<VmDelete>;
  };

  export type VmDelete = {
    __typename?: "VMDeleteMutation";

    taskId: string;
  };
}

export namespace VmEditOptions {
  export type Variables = {
    vm: VmInput;
  };

  export type Mutation = {
    __typename?: "Mutation";

    vm: Maybe<Vm>;
  };

  export type Vm = {
    __typename?: "VMMutation";

    success: boolean;
  };
}

export namespace HostList {
  export type Variables = {};

  export type Query = {
    __typename?: "Query";

    hosts: (Maybe<Hosts>)[];
  };

  export type Hosts = HostListFragment.Fragment;
}

export namespace HostListUpdate {
  export type Variables = {};

  export type Subscription = {
    __typename?: "Subscription";

    hosts: Hosts;
  };

  export type Hosts = {
    __typename?: "GHostsSubscription";

    value: Value;

    changeType: Change;
  };

  export type Value = HostListFragment.Fragment;
}

export namespace IsoList {
  export type Variables = {};

  export type Query = {
    __typename?: "Query";

    isos: (Maybe<Isos>)[];
  };

  export type Isos = IsoListFragment.Fragment;
}

export namespace DiskAttachTableSelection {
  export type Variables = {};

  export type Query = {
    __typename?: "Query";

    selectedItems: string[];
  };
}

export namespace DiskAttachTableSelect {
  export type Variables = {
    item: string;
    isSelect: boolean;
  };

  export type Mutation = {
    __typename?: "Mutation";

    selectedItems: Maybe<string[]>;
  };
}

export namespace DiskAttachTableSelectAll {
  export type Variables = {
    items: string[];
    isSelect: boolean;
  };

  export type Mutation = {
    __typename?: "Mutation";

    selectedItems: Maybe<string[]>;
  };
}

export namespace NetAttachTableSelection {
  export type Variables = {};

  export type Query = {
    __typename?: "Query";

    selectedItems: string[];
  };
}

export namespace NetAttachTableSelect {
  export type Variables = {
    item: string;
    isSelect: boolean;
  };

  export type Mutation = {
    __typename?: "Mutation";

    selectedItems: Maybe<string[]>;
  };
}

export namespace NetAttachTableSelectAll {
  export type Variables = {
    items: string[];
    isSelect: boolean;
  };

  export type Mutation = {
    __typename?: "Mutation";

    selectedItems: Maybe<string[]>;
  };
}

export namespace SelectedItemsQuery {
  export type Variables = {
    tableId: Table;
  };

  export type Query = {
    __typename?: "Query";

    selectedItems: string[];
  };
}

export namespace VmTableSelection {
  export type Variables = {};

  export type Query = {
    __typename?: "Query";

    selectedItems: string[];
  };
}

export namespace VmTableSelect {
  export type Variables = {
    item: string;
    isSelect: boolean;
  };

  export type Mutation = {
    __typename?: "Mutation";

    selectedItems: Maybe<string[]>;
  };
}

export namespace VmTableSelectAll {
  export type Variables = {
    items: string[];
    isSelect: boolean;
  };

  export type Mutation = {
    __typename?: "Mutation";

    selectedItems: Maybe<string[]>;
  };
}

export namespace VmPowerState {
  export type Variables = {};

  export type Query = {
    __typename?: "Query";

    vms: (Maybe<Vms>)[];
  };

  export type Vms = {
    __typename?: "GVM";

    uuid: string;

    powerState: PowerState;
  };
}

export namespace VmStateForButtonToolbar {
  export type Variables = {};

  export type Query = {
    __typename?: "Query";

    vmSelectedReadyFor: VmSelectedReadyFor;
  };

  export type VmSelectedReadyFor = {
    __typename?: "VMSelectedIDLists";

    start: Maybe<(Maybe<string>)[]>;

    stop: Maybe<(Maybe<string>)[]>;

    trash: Maybe<(Maybe<string>)[]>;
  };
}

export namespace NetworkList {
  export type Variables = {};

  export type Query = {
    __typename?: "Query";

    networks: (Maybe<Networks>)[];
  };

  export type Networks = NetworkListFragment.Fragment;
}

export namespace PlaybookLaunch {
  export type Variables = {
    id: string;
    vms?: Maybe<(Maybe<string>)[]>;
    variables?: Maybe<JsonString>;
  };

  export type Mutation = {
    __typename?: "Mutation";

    playbookLaunch: Maybe<PlaybookLaunch>;
  };

  export type PlaybookLaunch = {
    __typename?: "PlaybookLaunchMutation";

    taskId: string;
  };
}

export namespace PlaybookList {
  export type Variables = {};

  export type Query = {
    __typename?: "Query";

    playbooks: (Maybe<Playbooks>)[];
  };

  export type Playbooks = {
    __typename?: "GPlaybook";

    requires: Maybe<Requires>;

    name: string;

    variables: Maybe<JsonString>;

    id: string;

    inventory: Maybe<string>;

    description: Maybe<string>;
  };

  export type Requires = {
    __typename?: "PlaybookRequirements";

    osVersion: (Maybe<OsVersion>)[];
  };

  export type OsVersion = {
    __typename?: "OSVersion";

    distro: Maybe<string>;

    name: Maybe<string>;

    uname: Maybe<string>;

    major: Maybe<number>;

    minor: Maybe<number>;
  };
}

export namespace PlaybookTaskUpdate {
  export type Variables = {
    id: string;
  };

  export type Subscription = {
    __typename?: "Subscription";

    playbookTask: Maybe<PlaybookTask>;
  };

  export type PlaybookTask = {
    __typename?: "PlaybookTask";

    id: string;

    state: PlaybookTaskState;

    message: string;
  };
}

export namespace PlaybookTask {
  export type Variables = {
    id: string;
  };

  export type Query = {
    __typename?: "Query";

    playbookTask: Maybe<PlaybookTask>;
  };

  export type PlaybookTask = {
    __typename?: "PlaybookTask";

    id: string;

    state: PlaybookTaskState;

    message: string;
  };
}

export namespace PoolList {
  export type Variables = {};

  export type Query = {
    __typename?: "Query";

    pools: (Maybe<Pools>)[];
  };

  export type Pools = PoolListFragment.Fragment;
}

export namespace PoolListUpdate {
  export type Variables = {};

  export type Subscription = {
    __typename?: "Subscription";

    pools: Pools;
  };

  export type Pools = {
    __typename?: "GPoolsSubscription";

    value: Value;

    changeType: Change;
  };

  export type Value = PoolListFragment.Fragment;
}

export namespace RebootVm {
  export type Variables = {
    uuid: string;
    force?: Maybe<ShutdownForce>;
  };

  export type Mutation = {
    __typename?: "Mutation";

    vmReboot: Maybe<VmReboot>;
  };

  export type VmReboot = {
    __typename?: "VMRebootMutation";

    taskId: string;
  };
}

export namespace ShutdownVm {
  export type Variables = {
    uuid: string;
    force?: Maybe<ShutdownForce>;
  };

  export type Mutation = {
    __typename?: "Mutation";

    vmShutdown: Maybe<VmShutdown>;
  };

  export type VmShutdown = {
    __typename?: "VMShutdownMutation";

    taskId: string;
  };
}

export namespace StartVm {
  export type Variables = {
    uuid: string;
  };

  export type Mutation = {
    __typename?: "Mutation";

    vmStart: Maybe<VmStart>;
  };

  export type VmStart = {
    __typename?: "VMStartMutation";

    taskId: string;
  };
}

export namespace StorageAttachList {
  export type Variables = {};

  export type Query = {
    __typename?: "Query";

    vdis: (Maybe<Vdis>)[];

    isos: (Maybe<Isos>)[];
  };

  export type Vdis = DiskFragment.Fragment;

  export type Isos = DiskFragment.Fragment;
}

export namespace StorageList {
  export type Variables = {};

  export type Query = {
    __typename?: "Query";

    srs: (Maybe<Srs>)[];
  };

  export type Srs = StorageListFragment.Fragment;
}

export namespace Tasks {
  export type Variables = {};

  export type Subscription = {
    __typename?: "Subscription";

    tasks: Tasks;
  };

  export type Tasks = {
    __typename?: "GTasksSubscription";

    value: Value;

    changeType: Change;
  };

  export type Value = {
    __typename?: "GTask";

    uuid: string;

    status: Maybe<string>;

    access: (Maybe<Access>)[];

    created: DateTime;

    nameLabel: string;

    nameDescription: string;

    finished: DateTime;

    progress: number;

    result: Maybe<string>;

    residentOn: Maybe<string>;
  };

  export type Access = {
    __typename?: "GAccessEntry";

    access: (Maybe<string>)[];

    userid: string;
  };
}

export namespace TemplateList {
  export type Variables = {};

  export type Query = {
    __typename?: "Query";

    templates: (Maybe<Templates>)[];
  };

  export type Templates = TemplateListFragment.Fragment;
}

export namespace VmInfo {
  export type Variables = {
    uuid: string;
  };

  export type Query = {
    __typename?: "Query";

    vm: Maybe<Vm>;
  };

  export type Vm = VmInfoFragment.Fragment;
}

export namespace VmInfoUpdate {
  export type Variables = {
    uuid: string;
  };

  export type Subscription = {
    __typename?: "Subscription";

    vm: Maybe<Vm>;
  };

  export type Vm = VmInfoFragment.Fragment;
}

export namespace VmList {
  export type Variables = {};

  export type Query = {
    __typename?: "Query";

    vms: (Maybe<Vms>)[];
  };

  export type Vms = VmListFragment.Fragment;
}

export namespace VmListUpdate {
  export type Variables = {};

  export type Subscription = {
    __typename?: "Subscription";

    vms: Vms;
  };

  export type Vms = {
    __typename?: "GVMsSubscription";

    value: Value;

    changeType: Change;
  };

  export type Value = VmListFragment.Fragment;
}

export namespace HostListFragment {
  export type Fragment = {
    __typename?: "GHost";

    softwareVersion: SoftwareVersion;

    cpuInfo: CpuInfo;

    uuid: string;

    nameLabel: string;

    nameDescription: string;

    memoryFree: Maybe<number>;

    memoryTotal: Maybe<number>;

    memoryAvailable: Maybe<number>;

    liveUpdated: Maybe<DateTime>;

    memoryOverhead: Maybe<number>;

    residentVms: (Maybe<ResidentVms>)[];
  };

  export type SoftwareVersion = {
    __typename?: "SoftwareVersion";

    platformVersion: string;

    productBrand: string;

    productVersion: string;

    xen: string;
  };

  export type CpuInfo = {
    __typename?: "CpuInfo";

    speed: number;

    cpuCount: number;

    socketCount: number;

    modelname: string;
  };

  export type ResidentVms = {
    __typename?: "GVM";

    uuid: string;
  };
}

export namespace IsoListFragment {
  export type Fragment = {
    __typename?: "GISO";

    uuid: string;

    nameLabel: string;

    SR: Maybe<Sr>;
  };

  export type Sr = {
    __typename?: "GSR";

    isToolsSr: boolean;

    PBDs: (Maybe<PbDs>)[];
  };

  export type PbDs = {
    __typename?: "GPBD";

    currentlyAttached: boolean;
  };
}

export namespace NetworkListFragment {
  export type Fragment = {
    __typename?: "GNetwork";

    uuid: string;

    nameLabel: string;

    nameDescription: string;
  };
}

export namespace PoolListFragment {
  export type Fragment = {
    __typename?: "GPool";

    master: Master;

    nameLabel: string;

    nameDescription: string;

    uuid: string;
  };

  export type Master = {
    __typename?: "GHost";

    uuid: string;
  };
}

export namespace DiskFragment {
  export type Fragment = {
    __typename?: "DiskImage";

    uuid: string;

    nameLabel: string;

    nameDescription: string;

    virtualSize: number;
  };
}

export namespace StorageListFragment {
  export type Fragment = {
    __typename?: "GSR";

    uuid: string;

    nameLabel: string;

    spaceAvailable: number;

    contentType: SrContentType;

    PBDs: (Maybe<PbDs>)[];
  };

  export type PbDs = {
    __typename?: "GPBD";

    currentlyAttached: boolean;
  };
}

export namespace TemplateListFragment {
  export type Fragment = {
    __typename?: "GTemplate";

    uuid: string;

    nameLabel: string;

    osKind: Maybe<string>;
  };
}

export namespace VmInterfaceFragment {
  export type Fragment = {
    __typename?: "Interface";

    network: Network;

    ip: Maybe<string>;

    ipv6: Maybe<string>;

    id: string;

    MAC: string;

    attached: boolean;
  };

  export type Network = {
    __typename?: "GNetwork";

    uuid: string;

    nameLabel: string;
  };
}

export namespace VmDiskFragment {
  export type Fragment = {
    __typename?: "BlockDevice";

    id: string;

    mode: string;

    type: string;

    device: string;

    attached: boolean;

    bootable: boolean;

    VDI: Maybe<Vdi>;
  };

  export type Vdi = {
    __typename?: "DiskImage";

    uuid: string;

    nameDescription: string;

    nameLabel: string;

    virtualSize: number;
  };
}

export namespace VmInfoFragment {
  export type Fragment = {
    __typename?: "GVM";

    uuid: string;

    nameLabel: string;

    nameDescription: string;

    interfaces: Maybe<(Maybe<Interfaces>)[]>;

    disks: Maybe<(Maybe<Disks>)[]>;

    powerState: PowerState;

    osVersion: Maybe<OsVersion>;

    startTime: DateTime;

    domainType: DomainType;
  };

  export type Interfaces = VmInterfaceFragment.Fragment;

  export type Disks = VmDiskFragment.Fragment;

  export type OsVersion = {
    __typename?: "OSVersion";

    name: Maybe<string>;
  };
}

export namespace VmListFragment {
  export type Fragment = {
    __typename?: "GVM";

    uuid: string;

    nameLabel: string;

    powerState: PowerState;
  };
}

import * as ReactApollo from "react-apollo";
import * as React from "react";

import gql from "graphql-tag";

// ====================================================
// Fragments
// ====================================================

export namespace HostListFragment {
  export const FragmentDoc = gql`
    fragment HostListFragment on GHost {
      softwareVersion {
        platformVersion
        productBrand
        productVersion
        xen
      }
      cpuInfo {
        speed
        cpuCount
        socketCount
        modelname
      }
      uuid
      nameLabel
      nameDescription
      memoryFree
      memoryTotal
      memoryAvailable
      liveUpdated
      memoryOverhead
      residentVms {
        uuid
      }
    }
  `;
}

export namespace IsoListFragment {
  export const FragmentDoc = gql`
    fragment ISOListFragment on GISO {
      uuid
      nameLabel
      SR {
        isToolsSr
        PBDs {
          currentlyAttached
        }
      }
    }
  `;
}

export namespace NetworkListFragment {
  export const FragmentDoc = gql`
    fragment NetworkListFragment on GNetwork {
      uuid
      nameLabel
      nameDescription
    }
  `;
}

export namespace PoolListFragment {
  export const FragmentDoc = gql`
    fragment PoolListFragment on GPool {
      master {
        uuid
      }
      nameLabel
      nameDescription
      uuid
    }
  `;
}

export namespace DiskFragment {
  export const FragmentDoc = gql`
    fragment DiskFragment on DiskImage {
      uuid
      nameLabel
      nameDescription
      virtualSize
    }
  `;
}

export namespace StorageListFragment {
  export const FragmentDoc = gql`
    fragment StorageListFragment on GSR {
      uuid
      nameLabel
      spaceAvailable
      contentType
      PBDs {
        currentlyAttached
      }
    }
  `;
}

export namespace TemplateListFragment {
  export const FragmentDoc = gql`
    fragment TemplateListFragment on GTemplate {
      uuid
      nameLabel
      osKind
    }
  `;
}

export namespace VmInterfaceFragment {
  export const FragmentDoc = gql`
    fragment VMInterfaceFragment on Interface {
      network {
        uuid
        nameLabel
      }
      ip
      ipv6
      id
      MAC
      attached
    }
  `;
}

export namespace VmDiskFragment {
  export const FragmentDoc = gql`
    fragment VMDiskFragment on BlockDevice {
      id
      mode
      type
      device
      attached
      bootable
      VDI {
        uuid
        nameDescription
        nameLabel
        virtualSize
      }
    }
  `;
}

export namespace VmInfoFragment {
  export const FragmentDoc = gql`
    fragment VMInfoFragment on GVM {
      uuid
      nameLabel
      nameDescription
      interfaces {
        ...VMInterfaceFragment
      }
      disks {
        ...VMDiskFragment
      }
      powerState
      osVersion {
        name
      }
      startTime
      domainType
    }

    ${VmInterfaceFragment.FragmentDoc}
    ${VmDiskFragment.FragmentDoc}
  `;
}

export namespace VmListFragment {
  export const FragmentDoc = gql`
    fragment VMListFragment on GVM {
      uuid
      nameLabel
      powerState
    }
  `;
}

// ====================================================
// Components
// ====================================================

export namespace IsoAttach {
  export const Document = gql`
    mutation ISOAttach($vmUuid: ID!, $isoUuid: ID!) {
      isoAttach(vmUuid: $vmUuid, isoUuid: $isoUuid, isAttach: true) {
        taskId
      }
    }
  `;
  export class Component extends React.Component<
    Partial<ReactApollo.MutationProps<Mutation, Variables>>
  > {
    render() {
      return (
        <ReactApollo.Mutation<Mutation, Variables>
          mutation={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }
  export type Props<TChildProps = any> = Partial<
    ReactApollo.MutateProps<Mutation, Variables>
  > &
    TChildProps;
  export type MutationFn = ReactApollo.MutationFn<Mutation, Variables>;
  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<
          TProps,
          Mutation,
          Variables,
          Props<TChildProps>
        >
      | undefined
  ) {
    return ReactApollo.graphql<TProps, Mutation, Variables, Props<TChildProps>>(
      Document,
      operationOptions
    );
  }
}
export namespace IsoDetach {
  export const Document = gql`
    mutation ISODetach($vmUuid: ID!, $isoUuid: ID!) {
      isoAttach(vmUuid: $vmUuid, isoUuid: $isoUuid, isAttach: false) {
        taskId
      }
    }
  `;
  export class Component extends React.Component<
    Partial<ReactApollo.MutationProps<Mutation, Variables>>
  > {
    render() {
      return (
        <ReactApollo.Mutation<Mutation, Variables>
          mutation={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }
  export type Props<TChildProps = any> = Partial<
    ReactApollo.MutateProps<Mutation, Variables>
  > &
    TChildProps;
  export type MutationFn = ReactApollo.MutationFn<Mutation, Variables>;
  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<
          TProps,
          Mutation,
          Variables,
          Props<TChildProps>
        >
      | undefined
  ) {
    return ReactApollo.graphql<TProps, Mutation, Variables, Props<TChildProps>>(
      Document,
      operationOptions
    );
  }
}
export namespace VdiAttach {
  export const Document = gql`
    mutation VDIAttach($vmUuid: ID!, $vdiUuid: ID!) {
      vdiAttach(vmUuid: $vmUuid, vdiUuid: $vdiUuid, isAttach: true) {
        taskId
      }
    }
  `;
  export class Component extends React.Component<
    Partial<ReactApollo.MutationProps<Mutation, Variables>>
  > {
    render() {
      return (
        <ReactApollo.Mutation<Mutation, Variables>
          mutation={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }
  export type Props<TChildProps = any> = Partial<
    ReactApollo.MutateProps<Mutation, Variables>
  > &
    TChildProps;
  export type MutationFn = ReactApollo.MutationFn<Mutation, Variables>;
  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<
          TProps,
          Mutation,
          Variables,
          Props<TChildProps>
        >
      | undefined
  ) {
    return ReactApollo.graphql<TProps, Mutation, Variables, Props<TChildProps>>(
      Document,
      operationOptions
    );
  }
}
export namespace VdiDetach {
  export const Document = gql`
    mutation VDIDetach($vmUuid: ID!, $vdiUuid: ID!) {
      vdiAttach(vmUuid: $vmUuid, vdiUuid: $vdiUuid, isAttach: false) {
        taskId
      }
    }
  `;
  export class Component extends React.Component<
    Partial<ReactApollo.MutationProps<Mutation, Variables>>
  > {
    render() {
      return (
        <ReactApollo.Mutation<Mutation, Variables>
          mutation={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }
  export type Props<TChildProps = any> = Partial<
    ReactApollo.MutateProps<Mutation, Variables>
  > &
    TChildProps;
  export type MutationFn = ReactApollo.MutationFn<Mutation, Variables>;
  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<
          TProps,
          Mutation,
          Variables,
          Props<TChildProps>
        >
      | undefined
  ) {
    return ReactApollo.graphql<TProps, Mutation, Variables, Props<TChildProps>>(
      Document,
      operationOptions
    );
  }
}
export namespace NetAttach {
  export const Document = gql`
    mutation NetAttach($vmUuid: ID!, $netUuid: ID!) {
      netAttach(vmUuid: $vmUuid, netUuid: $netUuid, isAttach: true) {
        taskId
      }
    }
  `;
  export class Component extends React.Component<
    Partial<ReactApollo.MutationProps<Mutation, Variables>>
  > {
    render() {
      return (
        <ReactApollo.Mutation<Mutation, Variables>
          mutation={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }
  export type Props<TChildProps = any> = Partial<
    ReactApollo.MutateProps<Mutation, Variables>
  > &
    TChildProps;
  export type MutationFn = ReactApollo.MutationFn<Mutation, Variables>;
  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<
          TProps,
          Mutation,
          Variables,
          Props<TChildProps>
        >
      | undefined
  ) {
    return ReactApollo.graphql<TProps, Mutation, Variables, Props<TChildProps>>(
      Document,
      operationOptions
    );
  }
}
export namespace NetDetach {
  export const Document = gql`
    mutation NetDetach($vmUuid: ID!, $netUuid: ID!) {
      netAttach(vmUuid: $vmUuid, netUuid: $netUuid, isAttach: false) {
        taskId
      }
    }
  `;
  export class Component extends React.Component<
    Partial<ReactApollo.MutationProps<Mutation, Variables>>
  > {
    render() {
      return (
        <ReactApollo.Mutation<Mutation, Variables>
          mutation={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }
  export type Props<TChildProps = any> = Partial<
    ReactApollo.MutateProps<Mutation, Variables>
  > &
    TChildProps;
  export type MutationFn = ReactApollo.MutationFn<Mutation, Variables>;
  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<
          TProps,
          Mutation,
          Variables,
          Props<TChildProps>
        >
      | undefined
  ) {
    return ReactApollo.graphql<TProps, Mutation, Variables, Props<TChildProps>>(
      Document,
      operationOptions
    );
  }
}
export namespace Console {
  export const Document = gql`
    query Console($id: ID!) {
      console(vmUuid: $id)
    }
  `;
  export class Component extends React.Component<
    Partial<ReactApollo.QueryProps<Query, Variables>>
  > {
    render() {
      return (
        <ReactApollo.Query<Query, Variables>
          query={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }
  export type Props<TChildProps = any> = Partial<
    ReactApollo.DataProps<Query, Variables>
  > &
    TChildProps;
  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<
          TProps,
          Query,
          Variables,
          Props<TChildProps>
        >
      | undefined
  ) {
    return ReactApollo.graphql<TProps, Query, Variables, Props<TChildProps>>(
      Document,
      operationOptions
    );
  }
}
export namespace CreateVm {
  export const Document = gql`
    mutation createVm(
      $VCPUs: Int
      $disks: [NewVDI]
      $installParams: AutoInstall
      $nameLabel: String!
      $nameDescription: String!
      $iso: ID
      $template: ID!
      $network: ID
      $ram: Float!
    ) {
      createVm(
        nameLabel: $nameLabel
        VCPUs: $VCPUs
        disks: $disks
        installParams: $installParams
        nameDescription: $nameDescription
        template: $template
        network: $network
        ram: $ram
        iso: $iso
      ) {
        taskId
      }
    }
  `;
  export class Component extends React.Component<
    Partial<ReactApollo.MutationProps<Mutation, Variables>>
  > {
    render() {
      return (
        <ReactApollo.Mutation<Mutation, Variables>
          mutation={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }
  export type Props<TChildProps = any> = Partial<
    ReactApollo.MutateProps<Mutation, Variables>
  > &
    TChildProps;
  export type MutationFn = ReactApollo.MutationFn<Mutation, Variables>;
  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<
          TProps,
          Mutation,
          Variables,
          Props<TChildProps>
        >
      | undefined
  ) {
    return ReactApollo.graphql<TProps, Mutation, Variables, Props<TChildProps>>(
      Document,
      operationOptions
    );
  }
}
export namespace DeleteVm {
  export const Document = gql`
    mutation DeleteVM($uuid: ID!) {
      vmDelete(uuid: $uuid) {
        taskId
      }
    }
  `;
  export class Component extends React.Component<
    Partial<ReactApollo.MutationProps<Mutation, Variables>>
  > {
    render() {
      return (
        <ReactApollo.Mutation<Mutation, Variables>
          mutation={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }
  export type Props<TChildProps = any> = Partial<
    ReactApollo.MutateProps<Mutation, Variables>
  > &
    TChildProps;
  export type MutationFn = ReactApollo.MutationFn<Mutation, Variables>;
  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<
          TProps,
          Mutation,
          Variables,
          Props<TChildProps>
        >
      | undefined
  ) {
    return ReactApollo.graphql<TProps, Mutation, Variables, Props<TChildProps>>(
      Document,
      operationOptions
    );
  }
}
export namespace VmEditOptions {
  export const Document = gql`
    mutation VMEditOptions($vm: VMInput!) {
      vm(vm: $vm) {
        success
      }
    }
  `;
  export class Component extends React.Component<
    Partial<ReactApollo.MutationProps<Mutation, Variables>>
  > {
    render() {
      return (
        <ReactApollo.Mutation<Mutation, Variables>
          mutation={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }
  export type Props<TChildProps = any> = Partial<
    ReactApollo.MutateProps<Mutation, Variables>
  > &
    TChildProps;
  export type MutationFn = ReactApollo.MutationFn<Mutation, Variables>;
  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<
          TProps,
          Mutation,
          Variables,
          Props<TChildProps>
        >
      | undefined
  ) {
    return ReactApollo.graphql<TProps, Mutation, Variables, Props<TChildProps>>(
      Document,
      operationOptions
    );
  }
}
export namespace HostList {
  export const Document = gql`
    query HostList {
      hosts {
        ...HostListFragment
      }
    }

    ${HostListFragment.FragmentDoc}
  `;
  export class Component extends React.Component<
    Partial<ReactApollo.QueryProps<Query, Variables>>
  > {
    render() {
      return (
        <ReactApollo.Query<Query, Variables>
          query={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }
  export type Props<TChildProps = any> = Partial<
    ReactApollo.DataProps<Query, Variables>
  > &
    TChildProps;
  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<
          TProps,
          Query,
          Variables,
          Props<TChildProps>
        >
      | undefined
  ) {
    return ReactApollo.graphql<TProps, Query, Variables, Props<TChildProps>>(
      Document,
      operationOptions
    );
  }
}
export namespace HostListUpdate {
  export const Document = gql`
    subscription HostListUpdate {
      hosts {
        value {
          ...HostListFragment
        }
        changeType
      }
    }

    ${HostListFragment.FragmentDoc}
  `;
  export class Component extends React.Component<
    Partial<ReactApollo.SubscriptionProps<Subscription, Variables>>
  > {
    render() {
      return (
        <ReactApollo.Subscription<Subscription, Variables>
          subscription={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }
  export type Props<TChildProps = any> = Partial<
    ReactApollo.DataProps<Subscription, Variables>
  > &
    TChildProps;
  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<
          TProps,
          Subscription,
          Variables,
          Props<TChildProps>
        >
      | undefined
  ) {
    return ReactApollo.graphql<
      TProps,
      Subscription,
      Variables,
      Props<TChildProps>
    >(Document, operationOptions);
  }
}
export namespace IsoList {
  export const Document = gql`
    query ISOList {
      isos {
        ...ISOListFragment
      }
    }

    ${IsoListFragment.FragmentDoc}
  `;
  export class Component extends React.Component<
    Partial<ReactApollo.QueryProps<Query, Variables>>
  > {
    render() {
      return (
        <ReactApollo.Query<Query, Variables>
          query={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }
  export type Props<TChildProps = any> = Partial<
    ReactApollo.DataProps<Query, Variables>
  > &
    TChildProps;
  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<
          TProps,
          Query,
          Variables,
          Props<TChildProps>
        >
      | undefined
  ) {
    return ReactApollo.graphql<TProps, Query, Variables, Props<TChildProps>>(
      Document,
      operationOptions
    );
  }
}
export namespace DiskAttachTableSelection {
  export const Document = gql`
    query DiskAttachTableSelection {
      selectedItems(tableId: DiskAttach) @client
    }
  `;
  export class Component extends React.Component<
    Partial<ReactApollo.QueryProps<Query, Variables>>
  > {
    render() {
      return (
        <ReactApollo.Query<Query, Variables>
          query={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }
  export type Props<TChildProps = any> = Partial<
    ReactApollo.DataProps<Query, Variables>
  > &
    TChildProps;
  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<
          TProps,
          Query,
          Variables,
          Props<TChildProps>
        >
      | undefined
  ) {
    return ReactApollo.graphql<TProps, Query, Variables, Props<TChildProps>>(
      Document,
      operationOptions
    );
  }
}
export namespace DiskAttachTableSelect {
  export const Document = gql`
    mutation DiskAttachTableSelect($item: ID!, $isSelect: Boolean!) {
      selectedItems(tableId: DiskAttach, items: [$item], isSelect: $isSelect)
        @client
    }
  `;
  export class Component extends React.Component<
    Partial<ReactApollo.MutationProps<Mutation, Variables>>
  > {
    render() {
      return (
        <ReactApollo.Mutation<Mutation, Variables>
          mutation={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }
  export type Props<TChildProps = any> = Partial<
    ReactApollo.MutateProps<Mutation, Variables>
  > &
    TChildProps;
  export type MutationFn = ReactApollo.MutationFn<Mutation, Variables>;
  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<
          TProps,
          Mutation,
          Variables,
          Props<TChildProps>
        >
      | undefined
  ) {
    return ReactApollo.graphql<TProps, Mutation, Variables, Props<TChildProps>>(
      Document,
      operationOptions
    );
  }
}
export namespace DiskAttachTableSelectAll {
  export const Document = gql`
    mutation DiskAttachTableSelectAll($items: [ID!]!, $isSelect: Boolean!) {
      selectedItems(tableId: DiskAttach, items: $items, isSelect: $isSelect)
        @client
    }
  `;
  export class Component extends React.Component<
    Partial<ReactApollo.MutationProps<Mutation, Variables>>
  > {
    render() {
      return (
        <ReactApollo.Mutation<Mutation, Variables>
          mutation={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }
  export type Props<TChildProps = any> = Partial<
    ReactApollo.MutateProps<Mutation, Variables>
  > &
    TChildProps;
  export type MutationFn = ReactApollo.MutationFn<Mutation, Variables>;
  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<
          TProps,
          Mutation,
          Variables,
          Props<TChildProps>
        >
      | undefined
  ) {
    return ReactApollo.graphql<TProps, Mutation, Variables, Props<TChildProps>>(
      Document,
      operationOptions
    );
  }
}
export namespace NetAttachTableSelection {
  export const Document = gql`
    query NetAttachTableSelection {
      selectedItems(tableId: NetworkAttach) @client
    }
  `;
  export class Component extends React.Component<
    Partial<ReactApollo.QueryProps<Query, Variables>>
  > {
    render() {
      return (
        <ReactApollo.Query<Query, Variables>
          query={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }
  export type Props<TChildProps = any> = Partial<
    ReactApollo.DataProps<Query, Variables>
  > &
    TChildProps;
  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<
          TProps,
          Query,
          Variables,
          Props<TChildProps>
        >
      | undefined
  ) {
    return ReactApollo.graphql<TProps, Query, Variables, Props<TChildProps>>(
      Document,
      operationOptions
    );
  }
}
export namespace NetAttachTableSelect {
  export const Document = gql`
    mutation NetAttachTableSelect($item: ID!, $isSelect: Boolean!) {
      selectedItems(
        tableId: NetworkAttach
        items: [$item]
        isSelect: $isSelect
      ) @client
    }
  `;
  export class Component extends React.Component<
    Partial<ReactApollo.MutationProps<Mutation, Variables>>
  > {
    render() {
      return (
        <ReactApollo.Mutation<Mutation, Variables>
          mutation={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }
  export type Props<TChildProps = any> = Partial<
    ReactApollo.MutateProps<Mutation, Variables>
  > &
    TChildProps;
  export type MutationFn = ReactApollo.MutationFn<Mutation, Variables>;
  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<
          TProps,
          Mutation,
          Variables,
          Props<TChildProps>
        >
      | undefined
  ) {
    return ReactApollo.graphql<TProps, Mutation, Variables, Props<TChildProps>>(
      Document,
      operationOptions
    );
  }
}
export namespace NetAttachTableSelectAll {
  export const Document = gql`
    mutation NetAttachTableSelectAll($items: [ID!]!, $isSelect: Boolean!) {
      selectedItems(tableId: NetworkAttach, items: $items, isSelect: $isSelect)
        @client
    }
  `;
  export class Component extends React.Component<
    Partial<ReactApollo.MutationProps<Mutation, Variables>>
  > {
    render() {
      return (
        <ReactApollo.Mutation<Mutation, Variables>
          mutation={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }
  export type Props<TChildProps = any> = Partial<
    ReactApollo.MutateProps<Mutation, Variables>
  > &
    TChildProps;
  export type MutationFn = ReactApollo.MutationFn<Mutation, Variables>;
  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<
          TProps,
          Mutation,
          Variables,
          Props<TChildProps>
        >
      | undefined
  ) {
    return ReactApollo.graphql<TProps, Mutation, Variables, Props<TChildProps>>(
      Document,
      operationOptions
    );
  }
}
export namespace SelectedItemsQuery {
  export const Document = gql`
    query SelectedItemsQuery($tableId: Table!) {
      selectedItems(tableId: $tableId) @client
    }
  `;
  export class Component extends React.Component<
    Partial<ReactApollo.QueryProps<Query, Variables>>
  > {
    render() {
      return (
        <ReactApollo.Query<Query, Variables>
          query={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }
  export type Props<TChildProps = any> = Partial<
    ReactApollo.DataProps<Query, Variables>
  > &
    TChildProps;
  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<
          TProps,
          Query,
          Variables,
          Props<TChildProps>
        >
      | undefined
  ) {
    return ReactApollo.graphql<TProps, Query, Variables, Props<TChildProps>>(
      Document,
      operationOptions
    );
  }
}
export namespace VmTableSelection {
  export const Document = gql`
    query VmTableSelection {
      selectedItems(tableId: VMS) @client
    }
  `;
  export class Component extends React.Component<
    Partial<ReactApollo.QueryProps<Query, Variables>>
  > {
    render() {
      return (
        <ReactApollo.Query<Query, Variables>
          query={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }
  export type Props<TChildProps = any> = Partial<
    ReactApollo.DataProps<Query, Variables>
  > &
    TChildProps;
  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<
          TProps,
          Query,
          Variables,
          Props<TChildProps>
        >
      | undefined
  ) {
    return ReactApollo.graphql<TProps, Query, Variables, Props<TChildProps>>(
      Document,
      operationOptions
    );
  }
}
export namespace VmTableSelect {
  export const Document = gql`
    mutation VmTableSelect($item: ID!, $isSelect: Boolean!) {
      selectedItems(tableId: VMS, items: [$item], isSelect: $isSelect) @client
    }
  `;
  export class Component extends React.Component<
    Partial<ReactApollo.MutationProps<Mutation, Variables>>
  > {
    render() {
      return (
        <ReactApollo.Mutation<Mutation, Variables>
          mutation={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }
  export type Props<TChildProps = any> = Partial<
    ReactApollo.MutateProps<Mutation, Variables>
  > &
    TChildProps;
  export type MutationFn = ReactApollo.MutationFn<Mutation, Variables>;
  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<
          TProps,
          Mutation,
          Variables,
          Props<TChildProps>
        >
      | undefined
  ) {
    return ReactApollo.graphql<TProps, Mutation, Variables, Props<TChildProps>>(
      Document,
      operationOptions
    );
  }
}
export namespace VmTableSelectAll {
  export const Document = gql`
    mutation VmTableSelectAll($items: [ID!]!, $isSelect: Boolean!) {
      selectedItems(tableId: VMS, items: $items, isSelect: $isSelect) @client
    }
  `;
  export class Component extends React.Component<
    Partial<ReactApollo.MutationProps<Mutation, Variables>>
  > {
    render() {
      return (
        <ReactApollo.Mutation<Mutation, Variables>
          mutation={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }
  export type Props<TChildProps = any> = Partial<
    ReactApollo.MutateProps<Mutation, Variables>
  > &
    TChildProps;
  export type MutationFn = ReactApollo.MutationFn<Mutation, Variables>;
  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<
          TProps,
          Mutation,
          Variables,
          Props<TChildProps>
        >
      | undefined
  ) {
    return ReactApollo.graphql<TProps, Mutation, Variables, Props<TChildProps>>(
      Document,
      operationOptions
    );
  }
}
export namespace VmPowerState {
  export const Document = gql`
    query VmPowerState {
      vms {
        uuid
        powerState
      }
    }
  `;
  export class Component extends React.Component<
    Partial<ReactApollo.QueryProps<Query, Variables>>
  > {
    render() {
      return (
        <ReactApollo.Query<Query, Variables>
          query={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }
  export type Props<TChildProps = any> = Partial<
    ReactApollo.DataProps<Query, Variables>
  > &
    TChildProps;
  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<
          TProps,
          Query,
          Variables,
          Props<TChildProps>
        >
      | undefined
  ) {
    return ReactApollo.graphql<TProps, Query, Variables, Props<TChildProps>>(
      Document,
      operationOptions
    );
  }
}
export namespace VmStateForButtonToolbar {
  export const Document = gql`
    query VMStateForButtonToolbar {
      vmSelectedReadyFor @client {
        start
        stop
        trash
      }
    }
  `;
  export class Component extends React.Component<
    Partial<ReactApollo.QueryProps<Query, Variables>>
  > {
    render() {
      return (
        <ReactApollo.Query<Query, Variables>
          query={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }
  export type Props<TChildProps = any> = Partial<
    ReactApollo.DataProps<Query, Variables>
  > &
    TChildProps;
  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<
          TProps,
          Query,
          Variables,
          Props<TChildProps>
        >
      | undefined
  ) {
    return ReactApollo.graphql<TProps, Query, Variables, Props<TChildProps>>(
      Document,
      operationOptions
    );
  }
}
export namespace NetworkList {
  export const Document = gql`
    query NetworkList {
      networks {
        ...NetworkListFragment
      }
    }

    ${NetworkListFragment.FragmentDoc}
  `;
  export class Component extends React.Component<
    Partial<ReactApollo.QueryProps<Query, Variables>>
  > {
    render() {
      return (
        <ReactApollo.Query<Query, Variables>
          query={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }
  export type Props<TChildProps = any> = Partial<
    ReactApollo.DataProps<Query, Variables>
  > &
    TChildProps;
  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<
          TProps,
          Query,
          Variables,
          Props<TChildProps>
        >
      | undefined
  ) {
    return ReactApollo.graphql<TProps, Query, Variables, Props<TChildProps>>(
      Document,
      operationOptions
    );
  }
}
export namespace PlaybookLaunch {
  export const Document = gql`
    mutation PlaybookLaunch($id: ID!, $vms: [ID], $variables: JSONString) {
      playbookLaunch(id: $id, vms: $vms, variables: $variables) {
        taskId
      }
    }
  `;
  export class Component extends React.Component<
    Partial<ReactApollo.MutationProps<Mutation, Variables>>
  > {
    render() {
      return (
        <ReactApollo.Mutation<Mutation, Variables>
          mutation={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }
  export type Props<TChildProps = any> = Partial<
    ReactApollo.MutateProps<Mutation, Variables>
  > &
    TChildProps;
  export type MutationFn = ReactApollo.MutationFn<Mutation, Variables>;
  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<
          TProps,
          Mutation,
          Variables,
          Props<TChildProps>
        >
      | undefined
  ) {
    return ReactApollo.graphql<TProps, Mutation, Variables, Props<TChildProps>>(
      Document,
      operationOptions
    );
  }
}
export namespace PlaybookList {
  export const Document = gql`
    query PlaybookList {
      playbooks {
        requires {
          osVersion {
            distro
            name
            uname
            major
            minor
          }
        }
        name
        variables
        id
        inventory
        description
      }
    }
  `;
  export class Component extends React.Component<
    Partial<ReactApollo.QueryProps<Query, Variables>>
  > {
    render() {
      return (
        <ReactApollo.Query<Query, Variables>
          query={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }
  export type Props<TChildProps = any> = Partial<
    ReactApollo.DataProps<Query, Variables>
  > &
    TChildProps;
  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<
          TProps,
          Query,
          Variables,
          Props<TChildProps>
        >
      | undefined
  ) {
    return ReactApollo.graphql<TProps, Query, Variables, Props<TChildProps>>(
      Document,
      operationOptions
    );
  }
}
export namespace PlaybookTaskUpdate {
  export const Document = gql`
    subscription PlaybookTaskUpdate($id: ID!) {
      playbookTask(id: $id) {
        id
        state
        message
      }
    }
  `;
  export class Component extends React.Component<
    Partial<ReactApollo.SubscriptionProps<Subscription, Variables>>
  > {
    render() {
      return (
        <ReactApollo.Subscription<Subscription, Variables>
          subscription={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }
  export type Props<TChildProps = any> = Partial<
    ReactApollo.DataProps<Subscription, Variables>
  > &
    TChildProps;
  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<
          TProps,
          Subscription,
          Variables,
          Props<TChildProps>
        >
      | undefined
  ) {
    return ReactApollo.graphql<
      TProps,
      Subscription,
      Variables,
      Props<TChildProps>
    >(Document, operationOptions);
  }
}
export namespace PlaybookTask {
  export const Document = gql`
    query PlaybookTask($id: ID!) {
      playbookTask(id: $id) {
        id
        state
        message
      }
    }
  `;
  export class Component extends React.Component<
    Partial<ReactApollo.QueryProps<Query, Variables>>
  > {
    render() {
      return (
        <ReactApollo.Query<Query, Variables>
          query={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }
  export type Props<TChildProps = any> = Partial<
    ReactApollo.DataProps<Query, Variables>
  > &
    TChildProps;
  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<
          TProps,
          Query,
          Variables,
          Props<TChildProps>
        >
      | undefined
  ) {
    return ReactApollo.graphql<TProps, Query, Variables, Props<TChildProps>>(
      Document,
      operationOptions
    );
  }
}
export namespace PoolList {
  export const Document = gql`
    query PoolList {
      pools {
        ...PoolListFragment
      }
    }

    ${PoolListFragment.FragmentDoc}
  `;
  export class Component extends React.Component<
    Partial<ReactApollo.QueryProps<Query, Variables>>
  > {
    render() {
      return (
        <ReactApollo.Query<Query, Variables>
          query={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }
  export type Props<TChildProps = any> = Partial<
    ReactApollo.DataProps<Query, Variables>
  > &
    TChildProps;
  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<
          TProps,
          Query,
          Variables,
          Props<TChildProps>
        >
      | undefined
  ) {
    return ReactApollo.graphql<TProps, Query, Variables, Props<TChildProps>>(
      Document,
      operationOptions
    );
  }
}
export namespace PoolListUpdate {
  export const Document = gql`
    subscription PoolListUpdate {
      pools {
        value {
          ...PoolListFragment
        }
        changeType
      }
    }

    ${PoolListFragment.FragmentDoc}
  `;
  export class Component extends React.Component<
    Partial<ReactApollo.SubscriptionProps<Subscription, Variables>>
  > {
    render() {
      return (
        <ReactApollo.Subscription<Subscription, Variables>
          subscription={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }
  export type Props<TChildProps = any> = Partial<
    ReactApollo.DataProps<Subscription, Variables>
  > &
    TChildProps;
  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<
          TProps,
          Subscription,
          Variables,
          Props<TChildProps>
        >
      | undefined
  ) {
    return ReactApollo.graphql<
      TProps,
      Subscription,
      Variables,
      Props<TChildProps>
    >(Document, operationOptions);
  }
}
export namespace RebootVm {
  export const Document = gql`
    mutation RebootVm($uuid: ID!, $force: ShutdownForce) {
      vmReboot(uuid: $uuid, force: $force) {
        taskId
      }
    }
  `;
  export class Component extends React.Component<
    Partial<ReactApollo.MutationProps<Mutation, Variables>>
  > {
    render() {
      return (
        <ReactApollo.Mutation<Mutation, Variables>
          mutation={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }
  export type Props<TChildProps = any> = Partial<
    ReactApollo.MutateProps<Mutation, Variables>
  > &
    TChildProps;
  export type MutationFn = ReactApollo.MutationFn<Mutation, Variables>;
  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<
          TProps,
          Mutation,
          Variables,
          Props<TChildProps>
        >
      | undefined
  ) {
    return ReactApollo.graphql<TProps, Mutation, Variables, Props<TChildProps>>(
      Document,
      operationOptions
    );
  }
}
export namespace ShutdownVm {
  export const Document = gql`
    mutation ShutdownVM($uuid: ID!, $force: ShutdownForce) {
      vmShutdown(uuid: $uuid, force: $force) {
        taskId
      }
    }
  `;
  export class Component extends React.Component<
    Partial<ReactApollo.MutationProps<Mutation, Variables>>
  > {
    render() {
      return (
        <ReactApollo.Mutation<Mutation, Variables>
          mutation={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }
  export type Props<TChildProps = any> = Partial<
    ReactApollo.MutateProps<Mutation, Variables>
  > &
    TChildProps;
  export type MutationFn = ReactApollo.MutationFn<Mutation, Variables>;
  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<
          TProps,
          Mutation,
          Variables,
          Props<TChildProps>
        >
      | undefined
  ) {
    return ReactApollo.graphql<TProps, Mutation, Variables, Props<TChildProps>>(
      Document,
      operationOptions
    );
  }
}
export namespace StartVm {
  export const Document = gql`
    mutation StartVM($uuid: ID!) {
      vmStart(uuid: $uuid) {
        taskId
      }
    }
  `;
  export class Component extends React.Component<
    Partial<ReactApollo.MutationProps<Mutation, Variables>>
  > {
    render() {
      return (
        <ReactApollo.Mutation<Mutation, Variables>
          mutation={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }
  export type Props<TChildProps = any> = Partial<
    ReactApollo.MutateProps<Mutation, Variables>
  > &
    TChildProps;
  export type MutationFn = ReactApollo.MutationFn<Mutation, Variables>;
  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<
          TProps,
          Mutation,
          Variables,
          Props<TChildProps>
        >
      | undefined
  ) {
    return ReactApollo.graphql<TProps, Mutation, Variables, Props<TChildProps>>(
      Document,
      operationOptions
    );
  }
}
export namespace StorageAttachList {
  export const Document = gql`
    query StorageAttachList {
      vdis {
        ...DiskFragment
      }
      isos {
        ...DiskFragment
      }
    }

    ${DiskFragment.FragmentDoc}
  `;
  export class Component extends React.Component<
    Partial<ReactApollo.QueryProps<Query, Variables>>
  > {
    render() {
      return (
        <ReactApollo.Query<Query, Variables>
          query={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }
  export type Props<TChildProps = any> = Partial<
    ReactApollo.DataProps<Query, Variables>
  > &
    TChildProps;
  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<
          TProps,
          Query,
          Variables,
          Props<TChildProps>
        >
      | undefined
  ) {
    return ReactApollo.graphql<TProps, Query, Variables, Props<TChildProps>>(
      Document,
      operationOptions
    );
  }
}
export namespace StorageList {
  export const Document = gql`
    query StorageList {
      srs {
        ...StorageListFragment
      }
    }

    ${StorageListFragment.FragmentDoc}
  `;
  export class Component extends React.Component<
    Partial<ReactApollo.QueryProps<Query, Variables>>
  > {
    render() {
      return (
        <ReactApollo.Query<Query, Variables>
          query={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }
  export type Props<TChildProps = any> = Partial<
    ReactApollo.DataProps<Query, Variables>
  > &
    TChildProps;
  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<
          TProps,
          Query,
          Variables,
          Props<TChildProps>
        >
      | undefined
  ) {
    return ReactApollo.graphql<TProps, Query, Variables, Props<TChildProps>>(
      Document,
      operationOptions
    );
  }
}
export namespace Tasks {
  export const Document = gql`
    subscription Tasks {
      tasks {
        value {
          uuid
          status
          access {
            access
            userid
          }
          created
          nameLabel
          nameDescription
          finished
          progress
          result
          residentOn
        }
        changeType
      }
    }
  `;
  export class Component extends React.Component<
    Partial<ReactApollo.SubscriptionProps<Subscription, Variables>>
  > {
    render() {
      return (
        <ReactApollo.Subscription<Subscription, Variables>
          subscription={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }
  export type Props<TChildProps = any> = Partial<
    ReactApollo.DataProps<Subscription, Variables>
  > &
    TChildProps;
  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<
          TProps,
          Subscription,
          Variables,
          Props<TChildProps>
        >
      | undefined
  ) {
    return ReactApollo.graphql<
      TProps,
      Subscription,
      Variables,
      Props<TChildProps>
    >(Document, operationOptions);
  }
}
export namespace TemplateList {
  export const Document = gql`
    query TemplateList {
      templates {
        ...TemplateListFragment
      }
    }

    ${TemplateListFragment.FragmentDoc}
  `;
  export class Component extends React.Component<
    Partial<ReactApollo.QueryProps<Query, Variables>>
  > {
    render() {
      return (
        <ReactApollo.Query<Query, Variables>
          query={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }
  export type Props<TChildProps = any> = Partial<
    ReactApollo.DataProps<Query, Variables>
  > &
    TChildProps;
  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<
          TProps,
          Query,
          Variables,
          Props<TChildProps>
        >
      | undefined
  ) {
    return ReactApollo.graphql<TProps, Query, Variables, Props<TChildProps>>(
      Document,
      operationOptions
    );
  }
}
export namespace VmInfo {
  export const Document = gql`
    query VMInfo($uuid: ID!) {
      vm(uuid: $uuid) {
        ...VMInfoFragment
      }
    }

    ${VmInfoFragment.FragmentDoc}
  `;
  export class Component extends React.Component<
    Partial<ReactApollo.QueryProps<Query, Variables>>
  > {
    render() {
      return (
        <ReactApollo.Query<Query, Variables>
          query={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }
  export type Props<TChildProps = any> = Partial<
    ReactApollo.DataProps<Query, Variables>
  > &
    TChildProps;
  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<
          TProps,
          Query,
          Variables,
          Props<TChildProps>
        >
      | undefined
  ) {
    return ReactApollo.graphql<TProps, Query, Variables, Props<TChildProps>>(
      Document,
      operationOptions
    );
  }
}
export namespace VmInfoUpdate {
  export const Document = gql`
    subscription VMInfoUpdate($uuid: ID!) {
      vm(uuid: $uuid) {
        ...VMInfoFragment
      }
    }

    ${VmInfoFragment.FragmentDoc}
  `;
  export class Component extends React.Component<
    Partial<ReactApollo.SubscriptionProps<Subscription, Variables>>
  > {
    render() {
      return (
        <ReactApollo.Subscription<Subscription, Variables>
          subscription={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }
  export type Props<TChildProps = any> = Partial<
    ReactApollo.DataProps<Subscription, Variables>
  > &
    TChildProps;
  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<
          TProps,
          Subscription,
          Variables,
          Props<TChildProps>
        >
      | undefined
  ) {
    return ReactApollo.graphql<
      TProps,
      Subscription,
      Variables,
      Props<TChildProps>
    >(Document, operationOptions);
  }
}
export namespace VmList {
  export const Document = gql`
    query VMList {
      vms {
        ...VMListFragment
      }
    }

    ${VmListFragment.FragmentDoc}
  `;
  export class Component extends React.Component<
    Partial<ReactApollo.QueryProps<Query, Variables>>
  > {
    render() {
      return (
        <ReactApollo.Query<Query, Variables>
          query={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }
  export type Props<TChildProps = any> = Partial<
    ReactApollo.DataProps<Query, Variables>
  > &
    TChildProps;
  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<
          TProps,
          Query,
          Variables,
          Props<TChildProps>
        >
      | undefined
  ) {
    return ReactApollo.graphql<TProps, Query, Variables, Props<TChildProps>>(
      Document,
      operationOptions
    );
  }
}
export namespace VmListUpdate {
  export const Document = gql`
    subscription VMListUpdate {
      vms {
        value {
          ...VMListFragment
        }
        changeType
      }
    }

    ${VmListFragment.FragmentDoc}
  `;
  export class Component extends React.Component<
    Partial<ReactApollo.SubscriptionProps<Subscription, Variables>>
  > {
    render() {
      return (
        <ReactApollo.Subscription<Subscription, Variables>
          subscription={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }
  export type Props<TChildProps = any> = Partial<
    ReactApollo.DataProps<Subscription, Variables>
  > &
    TChildProps;
  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<
          TProps,
          Subscription,
          Variables,
          Props<TChildProps>
        >
      | undefined
  ) {
    return ReactApollo.graphql<
      TProps,
      Subscription,
      Variables,
      Props<TChildProps>
    >(Document, operationOptions);
  }
}
import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig
} from "graphql";

export type Resolver<Result, Parent = {}, Context = {}, Args = {}> = (
  parent: Parent,
  args: Args,
  context: Context,
  info: GraphQLResolveInfo
) => Promise<Result> | Result;

export interface ISubscriptionResolverObject<Result, Parent, Context, Args> {
  subscribe<R = Result, P = Parent>(
    parent: P,
    args: Args,
    context: Context,
    info: GraphQLResolveInfo
  ): AsyncIterator<R | Result> | Promise<AsyncIterator<R | Result>>;
  resolve?<R = Result, P = Parent>(
    parent: P,
    args: Args,
    context: Context,
    info: GraphQLResolveInfo
  ): R | Result | Promise<R | Result>;
}

export type SubscriptionResolver<
  Result,
  Parent = {},
  Context = {},
  Args = {}
> =
  | ((
      ...args: any[]
    ) => ISubscriptionResolverObject<Result, Parent, Context, Args>)
  | ISubscriptionResolverObject<Result, Parent, Context, Args>;

export type TypeResolveFn<Types, Parent = {}, Context = {}> = (
  parent: Parent,
  context: Context,
  info: GraphQLResolveInfo
) => Maybe<Types>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult, TArgs = {}, TContext = {}> = (
  next: NextResolverFn<TResult>,
  source: any,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export namespace QueryResolvers {
  export interface Resolvers<Context = {}, TypeParent = {}> {
    /** All VMs available to user */
    vms?: VmsResolver<(Maybe<Gvm>)[], TypeParent, Context>;

    vm?: VmResolver<Maybe<Gvm>, TypeParent, Context>;
    /** All Templates available to user */
    templates?: TemplatesResolver<(Maybe<GTemplate>)[], TypeParent, Context>;

    template?: TemplateResolver<Maybe<Gvm>, TypeParent, Context>;

    hosts?: HostsResolver<(Maybe<GHost>)[], TypeParent, Context>;

    host?: HostResolver<Maybe<GHost>, TypeParent, Context>;

    pools?: PoolsResolver<(Maybe<GPool>)[], TypeParent, Context>;

    pool?: PoolResolver<Maybe<GPool>, TypeParent, Context>;
    /** All Networks available to user */
    networks?: NetworksResolver<(Maybe<GNetwork>)[], TypeParent, Context>;
    /** Information about a single network */
    network?: NetworkResolver<Maybe<GNetwork>, TypeParent, Context>;
    /** All Storage repositories available to user */
    srs?: SrsResolver<(Maybe<Gsr>)[], TypeParent, Context>;
    /** Information about a single storage repository */
    sr?: SrResolver<Maybe<Gsr>, TypeParent, Context>;
    /** All Virtual Disk Images (hard disks), available for user */
    vdis?: VdisResolver<(Maybe<Gvdi>)[], TypeParent, Context>;
    /** Information about a single virtual disk image (hard disk) */
    vdi?: VdiResolver<Maybe<Gvdi>, TypeParent, Context>;
    /** All ISO images available for user */
    isos?: IsosResolver<(Maybe<Giso>)[], TypeParent, Context>;
    /** Information about a single ISO image */
    iso?: IsoResolver<Maybe<Gvdi>, TypeParent, Context>;
    /** List of Ansible-powered playbooks */
    playbooks?: PlaybooksResolver<(Maybe<GPlaybook>)[], TypeParent, Context>;
    /** Information about Ansible-powered playbook */
    playbook?: PlaybookResolver<Maybe<GPlaybook>, TypeParent, Context>;
    /** Info about a playbook task */
    playbookTask?: PlaybookTaskResolver<
      Maybe<PlaybookTask>,
      TypeParent,
      Context
    >;
    /** All Playbook Tasks */
    playbookTasks?: PlaybookTasksResolver<
      (Maybe<PlaybookTask>)[],
      TypeParent,
      Context
    >;
    /** One-time link to RFB console for a VM */
    console?: ConsoleResolver<Maybe<string>, TypeParent, Context>;

    selectedItems?: SelectedItemsResolver<string[], TypeParent, Context>;

    vmSelectedReadyFor?: VmSelectedReadyForResolver<
      VmSelectedIdLists,
      TypeParent,
      Context
    >;
  }

  export type VmsResolver<
    R = (Maybe<Gvm>)[],
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type VmResolver<R = Maybe<Gvm>, Parent = {}, Context = {}> = Resolver<
    R,
    Parent,
    Context,
    VmArgs
  >;
  export interface VmArgs {
    uuid?: Maybe<string>;
  }

  export type TemplatesResolver<
    R = (Maybe<GTemplate>)[],
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type TemplateResolver<
    R = Maybe<Gvm>,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context, TemplateArgs>;
  export interface TemplateArgs {
    uuid?: Maybe<string>;
  }

  export type HostsResolver<
    R = (Maybe<GHost>)[],
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type HostResolver<
    R = Maybe<GHost>,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context, HostArgs>;
  export interface HostArgs {
    uuid?: Maybe<string>;
  }

  export type PoolsResolver<
    R = (Maybe<GPool>)[],
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type PoolResolver<
    R = Maybe<GPool>,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context, PoolArgs>;
  export interface PoolArgs {
    uuid?: Maybe<string>;
  }

  export type NetworksResolver<
    R = (Maybe<GNetwork>)[],
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type NetworkResolver<
    R = Maybe<GNetwork>,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context, NetworkArgs>;
  export interface NetworkArgs {
    uuid?: Maybe<string>;
  }

  export type SrsResolver<
    R = (Maybe<Gsr>)[],
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type SrResolver<R = Maybe<Gsr>, Parent = {}, Context = {}> = Resolver<
    R,
    Parent,
    Context,
    SrArgs
  >;
  export interface SrArgs {
    uuid?: Maybe<string>;
  }

  export type VdisResolver<
    R = (Maybe<Gvdi>)[],
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type VdiResolver<
    R = Maybe<Gvdi>,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context, VdiArgs>;
  export interface VdiArgs {
    uuid?: Maybe<string>;
  }

  export type IsosResolver<
    R = (Maybe<Giso>)[],
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type IsoResolver<
    R = Maybe<Gvdi>,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context, IsoArgs>;
  export interface IsoArgs {
    uuid?: Maybe<string>;
  }

  export type PlaybooksResolver<
    R = (Maybe<GPlaybook>)[],
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type PlaybookResolver<
    R = Maybe<GPlaybook>,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context, PlaybookArgs>;
  export interface PlaybookArgs {
    id?: Maybe<string>;
  }

  export type PlaybookTaskResolver<
    R = Maybe<PlaybookTask>,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context, PlaybookTaskArgs>;
  export interface PlaybookTaskArgs {
    id: string;
  }

  export type PlaybookTasksResolver<
    R = (Maybe<PlaybookTask>)[],
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type ConsoleResolver<
    R = Maybe<string>,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context, ConsoleArgs>;
  export interface ConsoleArgs {
    vmUuid: string;
  }

  export type SelectedItemsResolver<
    R = string[],
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context, SelectedItemsArgs>;
  export interface SelectedItemsArgs {
    tableId: Table;
  }

  export type VmSelectedReadyForResolver<
    R = VmSelectedIdLists,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace GvmResolvers {
  export interface Resolvers<Context = {}, TypeParent = Gvm> {
    /** a human-readable name */
    nameLabel?: NameLabelResolver<string, TypeParent, Context>;
    /** a human-readable description */
    nameDescription?: NameDescriptionResolver<string, TypeParent, Context>;
    /** Unique constant identifier/object reference */
    ref?: RefResolver<string, TypeParent, Context>;
    /** Unique session-dependent identifier/object reference */
    uuid?: UuidResolver<string, TypeParent, Context>;

    access?: AccessResolver<(Maybe<GAccessEntry>)[], TypeParent, Context>;
    /** Network adapters connected to a VM */
    interfaces?: InterfacesResolver<
      Maybe<(Maybe<Interface>)[]>,
      TypeParent,
      Context
    >;
    /** True if PV drivers are up to date, reported if Guest Additions are installed */
    PVDriversUpToDate?: PvDriversUpToDateResolver<
      Maybe<boolean>,
      TypeParent,
      Context
    >;
    /** PV drivers version, if available */
    PVDriversVersion?: PvDriversVersionResolver<
      Maybe<PvDriversVersion>,
      TypeParent,
      Context
    >;

    disks?: DisksResolver<Maybe<(Maybe<BlockDevice>)[]>, TypeParent, Context>;

    VCPUsAtStartup?: VcpUsAtStartupResolver<number, TypeParent, Context>;

    VCPUsMax?: VcpUsMaxResolver<number, TypeParent, Context>;

    domainType?: DomainTypeResolver<DomainType, TypeParent, Context>;

    guestMetrics?: GuestMetricsResolver<string, TypeParent, Context>;

    installTime?: InstallTimeResolver<DateTime, TypeParent, Context>;

    memoryActual?: MemoryActualResolver<number, TypeParent, Context>;

    memoryStaticMin?: MemoryStaticMinResolver<number, TypeParent, Context>;

    memoryStaticMax?: MemoryStaticMaxResolver<number, TypeParent, Context>;

    memoryDynamicMin?: MemoryDynamicMinResolver<number, TypeParent, Context>;

    memoryDynamicMax?: MemoryDynamicMaxResolver<number, TypeParent, Context>;

    metrics?: MetricsResolver<string, TypeParent, Context>;

    osVersion?: OsVersionResolver<Maybe<OsVersion>, TypeParent, Context>;

    powerState?: PowerStateResolver<PowerState, TypeParent, Context>;

    startTime?: StartTimeResolver<DateTime, TypeParent, Context>;
  }

  export type NameLabelResolver<
    R = string,
    Parent = Gvm,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type NameDescriptionResolver<
    R = string,
    Parent = Gvm,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type RefResolver<R = string, Parent = Gvm, Context = {}> = Resolver<
    R,
    Parent,
    Context
  >;
  export type UuidResolver<R = string, Parent = Gvm, Context = {}> = Resolver<
    R,
    Parent,
    Context
  >;
  export type AccessResolver<
    R = (Maybe<GAccessEntry>)[],
    Parent = Gvm,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type InterfacesResolver<
    R = Maybe<(Maybe<Interface>)[]>,
    Parent = Gvm,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type PvDriversUpToDateResolver<
    R = Maybe<boolean>,
    Parent = Gvm,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type PvDriversVersionResolver<
    R = Maybe<PvDriversVersion>,
    Parent = Gvm,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type DisksResolver<
    R = Maybe<(Maybe<BlockDevice>)[]>,
    Parent = Gvm,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type VcpUsAtStartupResolver<
    R = number,
    Parent = Gvm,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type VcpUsMaxResolver<
    R = number,
    Parent = Gvm,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type DomainTypeResolver<
    R = DomainType,
    Parent = Gvm,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type GuestMetricsResolver<
    R = string,
    Parent = Gvm,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type InstallTimeResolver<
    R = DateTime,
    Parent = Gvm,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type MemoryActualResolver<
    R = number,
    Parent = Gvm,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type MemoryStaticMinResolver<
    R = number,
    Parent = Gvm,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type MemoryStaticMaxResolver<
    R = number,
    Parent = Gvm,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type MemoryDynamicMinResolver<
    R = number,
    Parent = Gvm,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type MemoryDynamicMaxResolver<
    R = number,
    Parent = Gvm,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type MetricsResolver<
    R = string,
    Parent = Gvm,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type OsVersionResolver<
    R = Maybe<OsVersion>,
    Parent = Gvm,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type PowerStateResolver<
    R = PowerState,
    Parent = Gvm,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type StartTimeResolver<
    R = DateTime,
    Parent = Gvm,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace GAccessEntryResolvers {
  export interface Resolvers<Context = {}, TypeParent = GAccessEntry> {
    access?: AccessResolver<(Maybe<string>)[], TypeParent, Context>;

    userid?: UseridResolver<string, TypeParent, Context>;
  }

  export type AccessResolver<
    R = (Maybe<string>)[],
    Parent = GAccessEntry,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type UseridResolver<
    R = string,
    Parent = GAccessEntry,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace InterfaceResolvers {
  export interface Resolvers<Context = {}, TypeParent = Interface> {
    id?: IdResolver<string, TypeParent, Context>;

    MAC?: MacResolver<string, TypeParent, Context>;

    VIF?: VifResolver<string, TypeParent, Context>;

    ip?: IpResolver<Maybe<string>, TypeParent, Context>;

    ipv6?: Ipv6Resolver<Maybe<string>, TypeParent, Context>;

    network?: NetworkResolver<GNetwork, TypeParent, Context>;

    status?: StatusResolver<Maybe<string>, TypeParent, Context>;

    attached?: AttachedResolver<boolean, TypeParent, Context>;
  }

  export type IdResolver<
    R = string,
    Parent = Interface,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type MacResolver<
    R = string,
    Parent = Interface,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type VifResolver<
    R = string,
    Parent = Interface,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type IpResolver<
    R = Maybe<string>,
    Parent = Interface,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type Ipv6Resolver<
    R = Maybe<string>,
    Parent = Interface,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type NetworkResolver<
    R = GNetwork,
    Parent = Interface,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type StatusResolver<
    R = Maybe<string>,
    Parent = Interface,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type AttachedResolver<
    R = boolean,
    Parent = Interface,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace GNetworkResolvers {
  export interface Resolvers<Context = {}, TypeParent = GNetwork> {
    /** a human-readable name */
    nameLabel?: NameLabelResolver<string, TypeParent, Context>;
    /** a human-readable description */
    nameDescription?: NameDescriptionResolver<string, TypeParent, Context>;
    /** Unique constant identifier/object reference */
    ref?: RefResolver<string, TypeParent, Context>;
    /** Unique session-dependent identifier/object reference */
    uuid?: UuidResolver<string, TypeParent, Context>;

    access?: AccessResolver<(Maybe<GAccessEntry>)[], TypeParent, Context>;

    VMs?: VMsResolver<Maybe<(Maybe<Gvm>)[]>, TypeParent, Context>;

    otherConfig?: OtherConfigResolver<Maybe<JsonString>, TypeParent, Context>;
  }

  export type NameLabelResolver<
    R = string,
    Parent = GNetwork,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type NameDescriptionResolver<
    R = string,
    Parent = GNetwork,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type RefResolver<
    R = string,
    Parent = GNetwork,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type UuidResolver<
    R = string,
    Parent = GNetwork,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type AccessResolver<
    R = (Maybe<GAccessEntry>)[],
    Parent = GNetwork,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type VMsResolver<
    R = Maybe<(Maybe<Gvm>)[]>,
    Parent = GNetwork,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type OtherConfigResolver<
    R = Maybe<JsonString>,
    Parent = GNetwork,
    Context = {}
  > = Resolver<R, Parent, Context>;
}
/** Drivers version. We don't want any fancy resolver except for the thing that we know that it's a dict in VM document */
export namespace PvDriversVersionResolvers {
  export interface Resolvers<Context = {}, TypeParent = PvDriversVersion> {
    major?: MajorResolver<Maybe<number>, TypeParent, Context>;

    minor?: MinorResolver<Maybe<number>, TypeParent, Context>;

    micro?: MicroResolver<Maybe<number>, TypeParent, Context>;

    build?: BuildResolver<Maybe<number>, TypeParent, Context>;
  }

  export type MajorResolver<
    R = Maybe<number>,
    Parent = PvDriversVersion,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type MinorResolver<
    R = Maybe<number>,
    Parent = PvDriversVersion,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type MicroResolver<
    R = Maybe<number>,
    Parent = PvDriversVersion,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type BuildResolver<
    R = Maybe<number>,
    Parent = PvDriversVersion,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace BlockDeviceResolvers {
  export interface Resolvers<Context = {}, TypeParent = BlockDevice> {
    id?: IdResolver<string, TypeParent, Context>;

    attached?: AttachedResolver<boolean, TypeParent, Context>;

    bootable?: BootableResolver<boolean, TypeParent, Context>;

    device?: DeviceResolver<string, TypeParent, Context>;

    mode?: ModeResolver<string, TypeParent, Context>;

    type?: TypeResolver<string, TypeParent, Context>;

    VDI?: VdiResolver<Maybe<DiskImage>, TypeParent, Context>;
  }

  export type IdResolver<
    R = string,
    Parent = BlockDevice,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type AttachedResolver<
    R = boolean,
    Parent = BlockDevice,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type BootableResolver<
    R = boolean,
    Parent = BlockDevice,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type DeviceResolver<
    R = string,
    Parent = BlockDevice,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type ModeResolver<
    R = string,
    Parent = BlockDevice,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type TypeResolver<
    R = string,
    Parent = BlockDevice,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type VdiResolver<
    R = Maybe<DiskImage>,
    Parent = BlockDevice,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace GsrResolvers {
  export interface Resolvers<Context = {}, TypeParent = Gsr> {
    /** a human-readable name */
    nameLabel?: NameLabelResolver<string, TypeParent, Context>;
    /** a human-readable description */
    nameDescription?: NameDescriptionResolver<string, TypeParent, Context>;
    /** Unique constant identifier/object reference */
    ref?: RefResolver<string, TypeParent, Context>;
    /** Unique session-dependent identifier/object reference */
    uuid?: UuidResolver<string, TypeParent, Context>;
    /** Connections to host. Usually one, unless the storage repository is shared: e.g. iSCSI */
    PBDs?: PbDsResolver<(Maybe<Gpbd>)[], TypeParent, Context>;

    VDIs?: VdIsResolver<Maybe<(Maybe<DiskImage>)[]>, TypeParent, Context>;

    contentType?: ContentTypeResolver<SrContentType, TypeParent, Context>;

    type?: TypeResolver<string, TypeParent, Context>;
    /** Physical size in kilobytes */
    physicalSize?: PhysicalSizeResolver<number, TypeParent, Context>;
    /** Virtual allocation in kilobytes */
    virtualAllocation?: VirtualAllocationResolver<number, TypeParent, Context>;
    /** This SR contains XenServer Tools */
    isToolsSr?: IsToolsSrResolver<boolean, TypeParent, Context>;
    /** Physical utilisation in bytes */
    physicalUtilisation?: PhysicalUtilisationResolver<
      number,
      TypeParent,
      Context
    >;
    /** Available space in bytes */
    spaceAvailable?: SpaceAvailableResolver<number, TypeParent, Context>;
  }

  export type NameLabelResolver<
    R = string,
    Parent = Gsr,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type NameDescriptionResolver<
    R = string,
    Parent = Gsr,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type RefResolver<R = string, Parent = Gsr, Context = {}> = Resolver<
    R,
    Parent,
    Context
  >;
  export type UuidResolver<R = string, Parent = Gsr, Context = {}> = Resolver<
    R,
    Parent,
    Context
  >;
  export type PbDsResolver<
    R = (Maybe<Gpbd>)[],
    Parent = Gsr,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type VdIsResolver<
    R = Maybe<(Maybe<DiskImage>)[]>,
    Parent = Gsr,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type ContentTypeResolver<
    R = SrContentType,
    Parent = Gsr,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type TypeResolver<R = string, Parent = Gsr, Context = {}> = Resolver<
    R,
    Parent,
    Context
  >;
  export type PhysicalSizeResolver<
    R = number,
    Parent = Gsr,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type VirtualAllocationResolver<
    R = number,
    Parent = Gsr,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type IsToolsSrResolver<
    R = boolean,
    Parent = Gsr,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type PhysicalUtilisationResolver<
    R = number,
    Parent = Gsr,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type SpaceAvailableResolver<
    R = number,
    Parent = Gsr,
    Context = {}
  > = Resolver<R, Parent, Context>;
}
/** Fancy name for a PBD. Not a real Xen object, though a connection between a host and a SR */
export namespace GpbdResolvers {
  export interface Resolvers<Context = {}, TypeParent = Gpbd> {
    /** Unique constant identifier/object reference */
    ref?: RefResolver<string, TypeParent, Context>;
    /** Unique session-dependent identifier/object reference */
    uuid?: UuidResolver<string, TypeParent, Context>;
    /** Host to which the SR is supposed to be connected to */
    host?: HostResolver<GHost, TypeParent, Context>;

    deviceConfig?: DeviceConfigResolver<JsonString, TypeParent, Context>;

    SR?: SrResolver<Gsr, TypeParent, Context>;

    currentlyAttached?: CurrentlyAttachedResolver<boolean, TypeParent, Context>;
  }

  export type RefResolver<R = string, Parent = Gpbd, Context = {}> = Resolver<
    R,
    Parent,
    Context
  >;
  export type UuidResolver<R = string, Parent = Gpbd, Context = {}> = Resolver<
    R,
    Parent,
    Context
  >;
  export type HostResolver<R = GHost, Parent = Gpbd, Context = {}> = Resolver<
    R,
    Parent,
    Context
  >;
  export type DeviceConfigResolver<
    R = JsonString,
    Parent = Gpbd,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type SrResolver<R = Gsr, Parent = Gpbd, Context = {}> = Resolver<
    R,
    Parent,
    Context
  >;
  export type CurrentlyAttachedResolver<
    R = boolean,
    Parent = Gpbd,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace GHostResolvers {
  export interface Resolvers<Context = {}, TypeParent = GHost> {
    /** a human-readable name */
    nameLabel?: NameLabelResolver<string, TypeParent, Context>;
    /** a human-readable description */
    nameDescription?: NameDescriptionResolver<string, TypeParent, Context>;
    /** Unique constant identifier/object reference */
    ref?: RefResolver<string, TypeParent, Context>;
    /** Unique session-dependent identifier/object reference */
    uuid?: UuidResolver<string, TypeParent, Context>;
    /** Major XenAPI version number */
    APIVersionMajor?: ApiVersionMajorResolver<
      Maybe<number>,
      TypeParent,
      Context
    >;
    /** Minor XenAPI version number */
    APIVersionMinor?: ApiVersionMinorResolver<
      Maybe<number>,
      TypeParent,
      Context
    >;
    /** Connections to storage repositories */
    PBDs?: PbDsResolver<(Maybe<Gpbd>)[], TypeParent, Context>;

    PCIs?: PcIsResolver<(Maybe<string>)[], TypeParent, Context>;

    PGPUs?: PgpUsResolver<(Maybe<string>)[], TypeParent, Context>;

    PIFs?: PiFsResolver<(Maybe<string>)[], TypeParent, Context>;

    PUSBs?: PusBsResolver<(Maybe<string>)[], TypeParent, Context>;
    /** The address by which this host can be contacted from any other host in the pool */
    address?: AddressResolver<string, TypeParent, Context>;

    allowedOperations?: AllowedOperationsResolver<
      (Maybe<HostAllowedOperations>)[],
      TypeParent,
      Context
    >;

    cpuInfo?: CpuInfoResolver<CpuInfo, TypeParent, Context>;

    display?: DisplayResolver<HostDisplay, TypeParent, Context>;

    hostname?: HostnameResolver<string, TypeParent, Context>;

    softwareVersion?: SoftwareVersionResolver<
      SoftwareVersion,
      TypeParent,
      Context
    >;
    /** VMs currently resident on host */
    residentVms?: ResidentVmsResolver<(Maybe<Gvm>)[], TypeParent, Context>;

    metrics?: MetricsResolver<string, TypeParent, Context>;
    /** Total memory in kilobytes */
    memoryTotal?: MemoryTotalResolver<Maybe<number>, TypeParent, Context>;
    /** Free memory in kilobytes */
    memoryFree?: MemoryFreeResolver<Maybe<number>, TypeParent, Context>;
    /** Available memory as measured by the host in kilobytes */
    memoryAvailable?: MemoryAvailableResolver<
      Maybe<number>,
      TypeParent,
      Context
    >;
    /** Virtualization overhead in kilobytes */
    memoryOverhead?: MemoryOverheadResolver<Maybe<number>, TypeParent, Context>;
    /** True if host is up. May be null if no data */
    live?: LiveResolver<Maybe<boolean>, TypeParent, Context>;
    /** When live status was last updated */
    liveUpdated?: LiveUpdatedResolver<Maybe<DateTime>, TypeParent, Context>;
  }

  export type NameLabelResolver<
    R = string,
    Parent = GHost,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type NameDescriptionResolver<
    R = string,
    Parent = GHost,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type RefResolver<R = string, Parent = GHost, Context = {}> = Resolver<
    R,
    Parent,
    Context
  >;
  export type UuidResolver<R = string, Parent = GHost, Context = {}> = Resolver<
    R,
    Parent,
    Context
  >;
  export type ApiVersionMajorResolver<
    R = Maybe<number>,
    Parent = GHost,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type ApiVersionMinorResolver<
    R = Maybe<number>,
    Parent = GHost,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type PbDsResolver<
    R = (Maybe<Gpbd>)[],
    Parent = GHost,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type PcIsResolver<
    R = (Maybe<string>)[],
    Parent = GHost,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type PgpUsResolver<
    R = (Maybe<string>)[],
    Parent = GHost,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type PiFsResolver<
    R = (Maybe<string>)[],
    Parent = GHost,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type PusBsResolver<
    R = (Maybe<string>)[],
    Parent = GHost,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type AddressResolver<
    R = string,
    Parent = GHost,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type AllowedOperationsResolver<
    R = (Maybe<HostAllowedOperations>)[],
    Parent = GHost,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type CpuInfoResolver<
    R = CpuInfo,
    Parent = GHost,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type DisplayResolver<
    R = HostDisplay,
    Parent = GHost,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type HostnameResolver<
    R = string,
    Parent = GHost,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type SoftwareVersionResolver<
    R = SoftwareVersion,
    Parent = GHost,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type ResidentVmsResolver<
    R = (Maybe<Gvm>)[],
    Parent = GHost,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type MetricsResolver<
    R = string,
    Parent = GHost,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type MemoryTotalResolver<
    R = Maybe<number>,
    Parent = GHost,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type MemoryFreeResolver<
    R = Maybe<number>,
    Parent = GHost,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type MemoryAvailableResolver<
    R = Maybe<number>,
    Parent = GHost,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type MemoryOverheadResolver<
    R = Maybe<number>,
    Parent = GHost,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type LiveResolver<
    R = Maybe<boolean>,
    Parent = GHost,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type LiveUpdatedResolver<
    R = Maybe<DateTime>,
    Parent = GHost,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace CpuInfoResolvers {
  export interface Resolvers<Context = {}, TypeParent = CpuInfo> {
    cpuCount?: CpuCountResolver<number, TypeParent, Context>;

    modelname?: ModelnameResolver<string, TypeParent, Context>;

    socketCount?: SocketCountResolver<number, TypeParent, Context>;

    vendor?: VendorResolver<string, TypeParent, Context>;

    family?: FamilyResolver<number, TypeParent, Context>;

    features?: FeaturesResolver<string, TypeParent, Context>;

    featuresHvm?: FeaturesHvmResolver<Maybe<string>, TypeParent, Context>;

    featuresPv?: FeaturesPvResolver<Maybe<string>, TypeParent, Context>;

    flags?: FlagsResolver<string, TypeParent, Context>;

    model?: ModelResolver<number, TypeParent, Context>;

    speed?: SpeedResolver<number, TypeParent, Context>;

    stepping?: SteppingResolver<number, TypeParent, Context>;
  }

  export type CpuCountResolver<
    R = number,
    Parent = CpuInfo,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type ModelnameResolver<
    R = string,
    Parent = CpuInfo,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type SocketCountResolver<
    R = number,
    Parent = CpuInfo,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type VendorResolver<
    R = string,
    Parent = CpuInfo,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type FamilyResolver<
    R = number,
    Parent = CpuInfo,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type FeaturesResolver<
    R = string,
    Parent = CpuInfo,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type FeaturesHvmResolver<
    R = Maybe<string>,
    Parent = CpuInfo,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type FeaturesPvResolver<
    R = Maybe<string>,
    Parent = CpuInfo,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type FlagsResolver<
    R = string,
    Parent = CpuInfo,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type ModelResolver<
    R = number,
    Parent = CpuInfo,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type SpeedResolver<
    R = number,
    Parent = CpuInfo,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type SteppingResolver<
    R = number,
    Parent = CpuInfo,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace SoftwareVersionResolvers {
  export interface Resolvers<Context = {}, TypeParent = SoftwareVersion> {
    buildNumber?: BuildNumberResolver<string, TypeParent, Context>;

    date?: DateResolver<string, TypeParent, Context>;

    hostname?: HostnameResolver<string, TypeParent, Context>;
    /** Linux kernel version */
    linux?: LinuxResolver<string, TypeParent, Context>;

    networkBackend?: NetworkBackendResolver<string, TypeParent, Context>;

    platformName?: PlatformNameResolver<string, TypeParent, Context>;

    platformVersion?: PlatformVersionResolver<string, TypeParent, Context>;

    platformVersionText?: PlatformVersionTextResolver<
      string,
      TypeParent,
      Context
    >;

    platformVersionTextShort?: PlatformVersionTextShortResolver<
      string,
      TypeParent,
      Context
    >;
    /** XAPI version */
    xapi?: XapiResolver<string, TypeParent, Context>;
    /** Xen version */
    xen?: XenResolver<string, TypeParent, Context>;

    productBrand?: ProductBrandResolver<string, TypeParent, Context>;

    productVersion?: ProductVersionResolver<string, TypeParent, Context>;

    productVersionText?: ProductVersionTextResolver<
      string,
      TypeParent,
      Context
    >;
  }

  export type BuildNumberResolver<
    R = string,
    Parent = SoftwareVersion,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type DateResolver<
    R = string,
    Parent = SoftwareVersion,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type HostnameResolver<
    R = string,
    Parent = SoftwareVersion,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type LinuxResolver<
    R = string,
    Parent = SoftwareVersion,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type NetworkBackendResolver<
    R = string,
    Parent = SoftwareVersion,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type PlatformNameResolver<
    R = string,
    Parent = SoftwareVersion,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type PlatformVersionResolver<
    R = string,
    Parent = SoftwareVersion,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type PlatformVersionTextResolver<
    R = string,
    Parent = SoftwareVersion,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type PlatformVersionTextShortResolver<
    R = string,
    Parent = SoftwareVersion,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type XapiResolver<
    R = string,
    Parent = SoftwareVersion,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type XenResolver<
    R = string,
    Parent = SoftwareVersion,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type ProductBrandResolver<
    R = string,
    Parent = SoftwareVersion,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type ProductVersionResolver<
    R = string,
    Parent = SoftwareVersion,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type ProductVersionTextResolver<
    R = string,
    Parent = SoftwareVersion,
    Context = {}
  > = Resolver<R, Parent, Context>;
}
/** OS version reported by Xen tools */
export namespace OsVersionResolvers {
  export interface Resolvers<Context = {}, TypeParent = OsVersion> {
    name?: NameResolver<Maybe<string>, TypeParent, Context>;

    uname?: UnameResolver<Maybe<string>, TypeParent, Context>;

    distro?: DistroResolver<Maybe<string>, TypeParent, Context>;

    major?: MajorResolver<Maybe<number>, TypeParent, Context>;

    minor?: MinorResolver<Maybe<number>, TypeParent, Context>;
  }

  export type NameResolver<
    R = Maybe<string>,
    Parent = OsVersion,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type UnameResolver<
    R = Maybe<string>,
    Parent = OsVersion,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type DistroResolver<
    R = Maybe<string>,
    Parent = OsVersion,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type MajorResolver<
    R = Maybe<number>,
    Parent = OsVersion,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type MinorResolver<
    R = Maybe<number>,
    Parent = OsVersion,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace GTemplateResolvers {
  export interface Resolvers<Context = {}, TypeParent = GTemplate> {
    /** a human-readable name */
    nameLabel?: NameLabelResolver<string, TypeParent, Context>;
    /** a human-readable description */
    nameDescription?: NameDescriptionResolver<string, TypeParent, Context>;
    /** Unique constant identifier/object reference */
    ref?: RefResolver<string, TypeParent, Context>;
    /** Unique session-dependent identifier/object reference */
    uuid?: UuidResolver<string, TypeParent, Context>;

    access?: AccessResolver<(Maybe<GAccessEntry>)[], TypeParent, Context>;
    /** If a template supports auto-installation, here a distro name is provided */
    osKind?: OsKindResolver<Maybe<string>, TypeParent, Context>;
    /** True if this template works with hardware assisted virtualization */
    hvm?: HvmResolver<boolean, TypeParent, Context>;
    /** True if this template is available for regular users */
    enabled?: EnabledResolver<boolean, TypeParent, Context>;
  }

  export type NameLabelResolver<
    R = string,
    Parent = GTemplate,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type NameDescriptionResolver<
    R = string,
    Parent = GTemplate,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type RefResolver<
    R = string,
    Parent = GTemplate,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type UuidResolver<
    R = string,
    Parent = GTemplate,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type AccessResolver<
    R = (Maybe<GAccessEntry>)[],
    Parent = GTemplate,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type OsKindResolver<
    R = Maybe<string>,
    Parent = GTemplate,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type HvmResolver<
    R = boolean,
    Parent = GTemplate,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type EnabledResolver<
    R = boolean,
    Parent = GTemplate,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace GPoolResolvers {
  export interface Resolvers<Context = {}, TypeParent = GPool> {
    /** a human-readable name */
    nameLabel?: NameLabelResolver<string, TypeParent, Context>;
    /** a human-readable description */
    nameDescription?: NameDescriptionResolver<string, TypeParent, Context>;
    /** Unique constant identifier/object reference */
    ref?: RefResolver<string, TypeParent, Context>;
    /** Unique session-dependent identifier/object reference */
    uuid?: UuidResolver<string, TypeParent, Context>;
    /** Pool master */
    master?: MasterResolver<GHost, TypeParent, Context>;
    /** Default SR */
    defaultSr?: DefaultSrResolver<Maybe<Gsr>, TypeParent, Context>;
  }

  export type NameLabelResolver<
    R = string,
    Parent = GPool,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type NameDescriptionResolver<
    R = string,
    Parent = GPool,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type RefResolver<R = string, Parent = GPool, Context = {}> = Resolver<
    R,
    Parent,
    Context
  >;
  export type UuidResolver<R = string, Parent = GPool, Context = {}> = Resolver<
    R,
    Parent,
    Context
  >;
  export type MasterResolver<
    R = GHost,
    Parent = GPool,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type DefaultSrResolver<
    R = Maybe<Gsr>,
    Parent = GPool,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace GvdiResolvers {
  export interface Resolvers<Context = {}, TypeParent = Gvdi> {
    /** a human-readable name */
    nameLabel?: NameLabelResolver<string, TypeParent, Context>;
    /** a human-readable description */
    nameDescription?: NameDescriptionResolver<string, TypeParent, Context>;
    /** Unique constant identifier/object reference */
    ref?: RefResolver<string, TypeParent, Context>;
    /** Unique session-dependent identifier/object reference */
    uuid?: UuidResolver<string, TypeParent, Context>;

    access?: AccessResolver<(Maybe<GAccessEntry>)[], TypeParent, Context>;

    SR?: SrResolver<Maybe<Gsr>, TypeParent, Context>;

    VMs?: VMsResolver<Maybe<(Maybe<Gvm>)[]>, TypeParent, Context>;

    virtualSize?: VirtualSizeResolver<number, TypeParent, Context>;
  }

  export type NameLabelResolver<
    R = string,
    Parent = Gvdi,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type NameDescriptionResolver<
    R = string,
    Parent = Gvdi,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type RefResolver<R = string, Parent = Gvdi, Context = {}> = Resolver<
    R,
    Parent,
    Context
  >;
  export type UuidResolver<R = string, Parent = Gvdi, Context = {}> = Resolver<
    R,
    Parent,
    Context
  >;
  export type AccessResolver<
    R = (Maybe<GAccessEntry>)[],
    Parent = Gvdi,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type SrResolver<
    R = Maybe<Gsr>,
    Parent = Gvdi,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type VMsResolver<
    R = Maybe<(Maybe<Gvm>)[]>,
    Parent = Gvdi,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type VirtualSizeResolver<
    R = number,
    Parent = Gvdi,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace GisoResolvers {
  export interface Resolvers<Context = {}, TypeParent = Giso> {
    /** a human-readable name */
    nameLabel?: NameLabelResolver<string, TypeParent, Context>;
    /** a human-readable description */
    nameDescription?: NameDescriptionResolver<string, TypeParent, Context>;
    /** Unique constant identifier/object reference */
    ref?: RefResolver<string, TypeParent, Context>;
    /** Unique session-dependent identifier/object reference */
    uuid?: UuidResolver<string, TypeParent, Context>;

    access?: AccessResolver<(Maybe<GAccessEntry>)[], TypeParent, Context>;

    SR?: SrResolver<Maybe<Gsr>, TypeParent, Context>;

    VMs?: VMsResolver<Maybe<(Maybe<Gvm>)[]>, TypeParent, Context>;

    virtualSize?: VirtualSizeResolver<number, TypeParent, Context>;

    location?: LocationResolver<string, TypeParent, Context>;
  }

  export type NameLabelResolver<
    R = string,
    Parent = Giso,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type NameDescriptionResolver<
    R = string,
    Parent = Giso,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type RefResolver<R = string, Parent = Giso, Context = {}> = Resolver<
    R,
    Parent,
    Context
  >;
  export type UuidResolver<R = string, Parent = Giso, Context = {}> = Resolver<
    R,
    Parent,
    Context
  >;
  export type AccessResolver<
    R = (Maybe<GAccessEntry>)[],
    Parent = Giso,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type SrResolver<
    R = Maybe<Gsr>,
    Parent = Giso,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type VMsResolver<
    R = Maybe<(Maybe<Gvm>)[]>,
    Parent = Giso,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type VirtualSizeResolver<
    R = number,
    Parent = Giso,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type LocationResolver<
    R = string,
    Parent = Giso,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace GPlaybookResolvers {
  export interface Resolvers<Context = {}, TypeParent = GPlaybook> {
    /** Playbook ID */
    id?: IdResolver<string, TypeParent, Context>;
    /** Inventory file path */
    inventory?: InventoryResolver<Maybe<string>, TypeParent, Context>;
    /** Requirements for running this playbook */
    requires?: RequiresResolver<
      Maybe<PlaybookRequirements>,
      TypeParent,
      Context
    >;
    /** Playbook name */
    name?: NameResolver<string, TypeParent, Context>;
    /** Playbook description */
    description?: DescriptionResolver<Maybe<string>, TypeParent, Context>;
    /** Variables available for change to an user */
    variables?: VariablesResolver<Maybe<JsonString>, TypeParent, Context>;
  }

  export type IdResolver<
    R = string,
    Parent = GPlaybook,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type InventoryResolver<
    R = Maybe<string>,
    Parent = GPlaybook,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type RequiresResolver<
    R = Maybe<PlaybookRequirements>,
    Parent = GPlaybook,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type NameResolver<
    R = string,
    Parent = GPlaybook,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type DescriptionResolver<
    R = Maybe<string>,
    Parent = GPlaybook,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type VariablesResolver<
    R = Maybe<JsonString>,
    Parent = GPlaybook,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace PlaybookRequirementsResolvers {
  export interface Resolvers<Context = {}, TypeParent = PlaybookRequirements> {
    /** Minimal supported OS versions */
    osVersion?: OsVersionResolver<(Maybe<OsVersion>)[], TypeParent, Context>;
  }

  export type OsVersionResolver<
    R = (Maybe<OsVersion>)[],
    Parent = PlaybookRequirements,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace PlaybookTaskResolvers {
  export interface Resolvers<Context = {}, TypeParent = PlaybookTask> {
    /** Playbook task ID */
    id?: IdResolver<string, TypeParent, Context>;
    /** Playbook ID */
    playbookId?: PlaybookIdResolver<string, TypeParent, Context>;
    /** Playbook running state */
    state?: StateResolver<PlaybookTaskState, TypeParent, Context>;
    /** Human-readable message: error description or return code */
    message?: MessageResolver<string, TypeParent, Context>;
  }

  export type IdResolver<
    R = string,
    Parent = PlaybookTask,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type PlaybookIdResolver<
    R = string,
    Parent = PlaybookTask,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type StateResolver<
    R = PlaybookTaskState,
    Parent = PlaybookTask,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type MessageResolver<
    R = string,
    Parent = PlaybookTask,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace VmSelectedIdListsResolvers {
  export interface Resolvers<Context = {}, TypeParent = VmSelectedIdLists> {
    start?: StartResolver<Maybe<(Maybe<string>)[]>, TypeParent, Context>;

    stop?: StopResolver<Maybe<(Maybe<string>)[]>, TypeParent, Context>;

    trash?: TrashResolver<Maybe<(Maybe<string>)[]>, TypeParent, Context>;
  }

  export type StartResolver<
    R = Maybe<(Maybe<string>)[]>,
    Parent = VmSelectedIdLists,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type StopResolver<
    R = Maybe<(Maybe<string>)[]>,
    Parent = VmSelectedIdLists,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type TrashResolver<
    R = Maybe<(Maybe<string>)[]>,
    Parent = VmSelectedIdLists,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace MutationResolvers {
  export interface Resolvers<Context = {}, TypeParent = {}> {
    /** Create a new VM */
    createVm?: CreateVmResolver<Maybe<CreateVm>, TypeParent, Context>;
    /** Edit template options */
    template?: TemplateResolver<Maybe<TemplateMutation>, TypeParent, Context>;
    /** Edit VM options */
    vm?: VmResolver<Maybe<VmMutation>, TypeParent, Context>;
    /** Start VM */
    vmStart?: VmStartResolver<Maybe<VmStartMutation>, TypeParent, Context>;
    /** Shut down VM */
    vmShutdown?: VmShutdownResolver<
      Maybe<VmShutdownMutation>,
      TypeParent,
      Context
    >;
    /** Reboot VM */
    vmReboot?: VmRebootResolver<Maybe<VmRebootMutation>, TypeParent, Context>;
    /** If VM is Running, pause VM. If Paused, unpause VM */
    vmPause?: VmPauseResolver<Maybe<VmPauseMutation>, TypeParent, Context>;
    /** Launch an Ansible Playbook on specified VMs */
    playbookLaunch?: PlaybookLaunchResolver<
      Maybe<PlaybookLaunchMutation>,
      TypeParent,
      Context
    >;
    /** Delete a Halted VM */
    vmDelete?: VmDeleteResolver<Maybe<VmDeleteMutation>, TypeParent, Context>;
    /** Attach VM to a Network by creating a new Interface */
    netAttach?: NetAttachResolver<
      Maybe<AttachNetworkMutation>,
      TypeParent,
      Context
    >;
    /** Attach ISO to a VM by creating a new virtual block device */
    isoAttach?: IsoAttachResolver<
      Maybe<AttachIsoMutation>,
      TypeParent,
      Context
    >;
    /** Attach VDI to a VM by creating a new virtual block device */
    vdiAttach?: VdiAttachResolver<
      Maybe<AttachVdiMutation>,
      TypeParent,
      Context
    >;

    selectedItems?: SelectedItemsResolver<Maybe<string[]>, TypeParent, Context>;
  }

  export type CreateVmResolver<
    R = Maybe<CreateVm>,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context, CreateVmArgs>;
  export interface CreateVmArgs {
    /** Number of created virtual CPUs */
    VCPUs?: number;

    disks?: Maybe<(Maybe<NewVdi>)[]>;
    /** Automatic installation parameters, the installation is done via internet. Only available when template.os_kind is not empty */
    installParams?: Maybe<AutoInstall>;
    /** ISO image mounted if conf parameter is null */
    iso?: Maybe<string>;
    /** VM human-readable description */
    nameDescription: string;
    /** VM human-readable name */
    nameLabel: string;
    /** Network ID to connect to */
    network?: Maybe<string>;
    /** RAM size in megabytes */
    ram: number;
    /** Template ID */
    template: string;
  }

  export type TemplateResolver<
    R = Maybe<TemplateMutation>,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context, TemplateArgs>;
  export interface TemplateArgs {
    /** Template to change */
    template?: Maybe<TemplateInput>;
  }

  export type VmResolver<
    R = Maybe<VmMutation>,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context, VmArgs>;
  export interface VmArgs {
    /** VM to change */
    vm: VmInput;
  }

  export type VmStartResolver<
    R = Maybe<VmStartMutation>,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context, VmStartArgs>;
  export interface VmStartArgs {
    options?: Maybe<VmStartInput>;

    uuid: string;
  }

  export type VmShutdownResolver<
    R = Maybe<VmShutdownMutation>,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context, VmShutdownArgs>;
  export interface VmShutdownArgs {
    /** Force shutdown in a hard or clean way */
    force?: Maybe<ShutdownForce>;

    uuid: string;
  }

  export type VmRebootResolver<
    R = Maybe<VmRebootMutation>,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context, VmRebootArgs>;
  export interface VmRebootArgs {
    /** Force reboot in a hard or clean way. Default: clean */
    force?: Maybe<ShutdownForce>;

    uuid: string;
  }

  export type VmPauseResolver<
    R = Maybe<VmPauseMutation>,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context, VmPauseArgs>;
  export interface VmPauseArgs {
    uuid: string;
  }

  export type PlaybookLaunchResolver<
    R = Maybe<PlaybookLaunchMutation>,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context, PlaybookLaunchArgs>;
  export interface PlaybookLaunchArgs {
    /** Playbook ID */
    id: string;
    /** JSON with key-value pairs representing Playbook variables changed by user */
    variables?: Maybe<JsonString>;
    /** VM UUIDs to run Playbook on. Ignored if this is a Playbook with provided Inventory */
    vms?: Maybe<(Maybe<string>)[]>;
  }

  export type VmDeleteResolver<
    R = Maybe<VmDeleteMutation>,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context, VmDeleteArgs>;
  export interface VmDeleteArgs {
    uuid: string;
  }

  export type NetAttachResolver<
    R = Maybe<AttachNetworkMutation>,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context, NetAttachArgs>;
  export interface NetAttachArgs {
    /** True if attach, False if detach */
    isAttach: boolean;

    netUuid: string;

    vmUuid: string;
  }

  export type IsoAttachResolver<
    R = Maybe<AttachIsoMutation>,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context, IsoAttachArgs>;
  export interface IsoAttachArgs {
    /** True if attach, False if detach */
    isAttach: boolean;

    isoUuid: string;

    vmUuid: string;
  }

  export type VdiAttachResolver<
    R = Maybe<AttachVdiMutation>,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context, VdiAttachArgs>;
  export interface VdiAttachArgs {
    /** True if attach, False if detach */
    isAttach: boolean;

    vdiUuid: string;

    vmUuid: string;
  }

  export type SelectedItemsResolver<
    R = Maybe<string[]>,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context, SelectedItemsArgs>;
  export interface SelectedItemsArgs {
    tableId: Table;

    items: string[];

    isSelect: boolean;
  }
}

export namespace CreateVmResolvers {
  export interface Resolvers<Context = {}, TypeParent = CreateVm> {
    /** Installation task ID */
    taskId?: TaskIdResolver<string, TypeParent, Context>;
  }

  export type TaskIdResolver<
    R = string,
    Parent = CreateVm,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace TemplateMutationResolvers {
  export interface Resolvers<Context = {}, TypeParent = TemplateMutation> {
    success?: SuccessResolver<boolean, TypeParent, Context>;
  }

  export type SuccessResolver<
    R = boolean,
    Parent = TemplateMutation,
    Context = {}
  > = Resolver<R, Parent, Context>;
}
/** This class represents synchronous mutations for VM, i.e. you can change name_label, name_description, etc. */
export namespace VmMutationResolvers {
  export interface Resolvers<Context = {}, TypeParent = VmMutation> {
    success?: SuccessResolver<boolean, TypeParent, Context>;
  }

  export type SuccessResolver<
    R = boolean,
    Parent = VmMutation,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace VmStartMutationResolvers {
  export interface Resolvers<Context = {}, TypeParent = VmStartMutation> {
    /** Start task ID */
    taskId?: TaskIdResolver<string, TypeParent, Context>;
  }

  export type TaskIdResolver<
    R = string,
    Parent = VmStartMutation,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace VmShutdownMutationResolvers {
  export interface Resolvers<Context = {}, TypeParent = VmShutdownMutation> {
    /** Shutdown task ID */
    taskId?: TaskIdResolver<string, TypeParent, Context>;
  }

  export type TaskIdResolver<
    R = string,
    Parent = VmShutdownMutation,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace VmRebootMutationResolvers {
  export interface Resolvers<Context = {}, TypeParent = VmRebootMutation> {
    /** Reboot task ID */
    taskId?: TaskIdResolver<string, TypeParent, Context>;
  }

  export type TaskIdResolver<
    R = string,
    Parent = VmRebootMutation,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace VmPauseMutationResolvers {
  export interface Resolvers<Context = {}, TypeParent = VmPauseMutation> {
    /** Pause/unpause task ID */
    taskId?: TaskIdResolver<string, TypeParent, Context>;
  }

  export type TaskIdResolver<
    R = string,
    Parent = VmPauseMutation,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace PlaybookLaunchMutationResolvers {
  export interface Resolvers<
    Context = {},
    TypeParent = PlaybookLaunchMutation
  > {
    /** Playbook execution task ID */
    taskId?: TaskIdResolver<string, TypeParent, Context>;
  }

  export type TaskIdResolver<
    R = string,
    Parent = PlaybookLaunchMutation,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace VmDeleteMutationResolvers {
  export interface Resolvers<Context = {}, TypeParent = VmDeleteMutation> {
    /** Deleting task ID */
    taskId?: TaskIdResolver<string, TypeParent, Context>;
  }

  export type TaskIdResolver<
    R = string,
    Parent = VmDeleteMutation,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace AttachNetworkMutationResolvers {
  export interface Resolvers<Context = {}, TypeParent = AttachNetworkMutation> {
    /** Attach/Detach task ID. If already attached/detached, returns null */
    taskId?: TaskIdResolver<Maybe<string>, TypeParent, Context>;
  }

  export type TaskIdResolver<
    R = Maybe<string>,
    Parent = AttachNetworkMutation,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace AttachIsoMutationResolvers {
  export interface Resolvers<Context = {}, TypeParent = AttachIsoMutation> {
    /** Attach/Detach task ID. If already attached/detached, returns null */
    taskId?: TaskIdResolver<Maybe<string>, TypeParent, Context>;
  }

  export type TaskIdResolver<
    R = Maybe<string>,
    Parent = AttachIsoMutation,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace AttachVdiMutationResolvers {
  export interface Resolvers<Context = {}, TypeParent = AttachVdiMutation> {
    /** Attach/Detach task ID. If already attached/detached, returns null */
    taskId?: TaskIdResolver<Maybe<string>, TypeParent, Context>;
  }

  export type TaskIdResolver<
    R = Maybe<string>,
    Parent = AttachVdiMutation,
    Context = {}
  > = Resolver<R, Parent, Context>;
}
/** All subscriptions must return  Observable */
export namespace SubscriptionResolvers {
  export interface Resolvers<Context = {}, TypeParent = {}> {
    /** Updates for all VMs */
    vms?: VmsResolver<GvMsSubscription, TypeParent, Context>;
    /** Updates for a particular VM */
    vm?: VmResolver<Maybe<Gvm>, TypeParent, Context>;
    /** Updates for all Hosts */
    hosts?: HostsResolver<GHostsSubscription, TypeParent, Context>;
    /** Updates for a particular Host */
    host?: HostResolver<Maybe<GHost>, TypeParent, Context>;
    /** Updates for all pools available in VMEmperor */
    pools?: PoolsResolver<GPoolsSubscription, TypeParent, Context>;
    /** Updates for a particular Pool */
    pool?: PoolResolver<Maybe<GPool>, TypeParent, Context>;
    /** Updates for all user's tasks */
    tasks?: TasksResolver<GTasksSubscription, TypeParent, Context>;
    /** Updates for a particular XenServer Task */
    task?: TaskResolver<Maybe<GTask>, TypeParent, Context>;
    /** Updates for a particular Playbook installation Task */
    playbookTask?: PlaybookTaskResolver<
      Maybe<PlaybookTask>,
      TypeParent,
      Context
    >;
    /** Updates for all Playbook Tasks */
    playbookTasks?: PlaybookTasksResolver<
      PlaybookTasksSubscription,
      TypeParent,
      Context
    >;
  }

  export type VmsResolver<
    R = GvMsSubscription,
    Parent = {},
    Context = {}
  > = SubscriptionResolver<R, Parent, Context>;
  export type VmResolver<
    R = Maybe<Gvm>,
    Parent = {},
    Context = {}
  > = SubscriptionResolver<R, Parent, Context, VmArgs>;
  export interface VmArgs {
    uuid: string;
  }

  export type HostsResolver<
    R = GHostsSubscription,
    Parent = {},
    Context = {}
  > = SubscriptionResolver<R, Parent, Context>;
  export type HostResolver<
    R = Maybe<GHost>,
    Parent = {},
    Context = {}
  > = SubscriptionResolver<R, Parent, Context, HostArgs>;
  export interface HostArgs {
    uuid: string;
  }

  export type PoolsResolver<
    R = GPoolsSubscription,
    Parent = {},
    Context = {}
  > = SubscriptionResolver<R, Parent, Context>;
  export type PoolResolver<
    R = Maybe<GPool>,
    Parent = {},
    Context = {}
  > = SubscriptionResolver<R, Parent, Context, PoolArgs>;
  export interface PoolArgs {
    uuid: string;
  }

  export type TasksResolver<
    R = GTasksSubscription,
    Parent = {},
    Context = {}
  > = SubscriptionResolver<R, Parent, Context>;
  export type TaskResolver<
    R = Maybe<GTask>,
    Parent = {},
    Context = {}
  > = SubscriptionResolver<R, Parent, Context, TaskArgs>;
  export interface TaskArgs {
    uuid: string;
  }

  export type PlaybookTaskResolver<
    R = Maybe<PlaybookTask>,
    Parent = {},
    Context = {}
  > = SubscriptionResolver<R, Parent, Context, PlaybookTaskArgs>;
  export interface PlaybookTaskArgs {
    id: string;
  }

  export type PlaybookTasksResolver<
    R = PlaybookTasksSubscription,
    Parent = {},
    Context = {}
  > = SubscriptionResolver<R, Parent, Context>;
}

export namespace GvMsSubscriptionResolvers {
  export interface Resolvers<Context = {}, TypeParent = GvMsSubscription> {
    /** Change type */
    changeType?: ChangeTypeResolver<Change, TypeParent, Context>;

    value?: ValueResolver<Gvm, TypeParent, Context>;
  }

  export type ChangeTypeResolver<
    R = Change,
    Parent = GvMsSubscription,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type ValueResolver<
    R = Gvm,
    Parent = GvMsSubscription,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace GHostsSubscriptionResolvers {
  export interface Resolvers<Context = {}, TypeParent = GHostsSubscription> {
    /** Change type */
    changeType?: ChangeTypeResolver<Change, TypeParent, Context>;

    value?: ValueResolver<GHost, TypeParent, Context>;
  }

  export type ChangeTypeResolver<
    R = Change,
    Parent = GHostsSubscription,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type ValueResolver<
    R = GHost,
    Parent = GHostsSubscription,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace GPoolsSubscriptionResolvers {
  export interface Resolvers<Context = {}, TypeParent = GPoolsSubscription> {
    /** Change type */
    changeType?: ChangeTypeResolver<Change, TypeParent, Context>;

    value?: ValueResolver<GPool, TypeParent, Context>;
  }

  export type ChangeTypeResolver<
    R = Change,
    Parent = GPoolsSubscription,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type ValueResolver<
    R = GPool,
    Parent = GPoolsSubscription,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace GTasksSubscriptionResolvers {
  export interface Resolvers<Context = {}, TypeParent = GTasksSubscription> {
    /** Change type */
    changeType?: ChangeTypeResolver<Change, TypeParent, Context>;

    value?: ValueResolver<GTask, TypeParent, Context>;
  }

  export type ChangeTypeResolver<
    R = Change,
    Parent = GTasksSubscription,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type ValueResolver<
    R = GTask,
    Parent = GTasksSubscription,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace GTaskResolvers {
  export interface Resolvers<Context = {}, TypeParent = GTask> {
    /** a human-readable name */
    nameLabel?: NameLabelResolver<string, TypeParent, Context>;
    /** a human-readable description */
    nameDescription?: NameDescriptionResolver<string, TypeParent, Context>;
    /** Unique constant identifier/object reference */
    ref?: RefResolver<string, TypeParent, Context>;
    /** Unique session-dependent identifier/object reference */
    uuid?: UuidResolver<string, TypeParent, Context>;

    access?: AccessResolver<(Maybe<GAccessEntry>)[], TypeParent, Context>;
    /** Task creation time */
    created?: CreatedResolver<DateTime, TypeParent, Context>;
    /** Task finish time */
    finished?: FinishedResolver<DateTime, TypeParent, Context>;
    /** Task progress */
    progress?: ProgressResolver<number, TypeParent, Context>;
    /** Task result if available */
    result?: ResultResolver<Maybe<string>, TypeParent, Context>;
    /** Task result type */
    type?: TypeResolver<Maybe<string>, TypeParent, Context>;
    /** ref of a host that runs this task */
    residentOn?: ResidentOnResolver<Maybe<string>, TypeParent, Context>;
    /** Error strings, if failed */
    errorInfo?: ErrorInfoResolver<
      Maybe<(Maybe<string>)[]>,
      TypeParent,
      Context
    >;
    /** Task status */
    status?: StatusResolver<Maybe<string>, TypeParent, Context>;
  }

  export type NameLabelResolver<
    R = string,
    Parent = GTask,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type NameDescriptionResolver<
    R = string,
    Parent = GTask,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type RefResolver<R = string, Parent = GTask, Context = {}> = Resolver<
    R,
    Parent,
    Context
  >;
  export type UuidResolver<R = string, Parent = GTask, Context = {}> = Resolver<
    R,
    Parent,
    Context
  >;
  export type AccessResolver<
    R = (Maybe<GAccessEntry>)[],
    Parent = GTask,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type CreatedResolver<
    R = DateTime,
    Parent = GTask,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type FinishedResolver<
    R = DateTime,
    Parent = GTask,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type ProgressResolver<
    R = number,
    Parent = GTask,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type ResultResolver<
    R = Maybe<string>,
    Parent = GTask,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type TypeResolver<
    R = Maybe<string>,
    Parent = GTask,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type ResidentOnResolver<
    R = Maybe<string>,
    Parent = GTask,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type ErrorInfoResolver<
    R = Maybe<(Maybe<string>)[]>,
    Parent = GTask,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type StatusResolver<
    R = Maybe<string>,
    Parent = GTask,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace PlaybookTasksSubscriptionResolvers {
  export interface Resolvers<
    Context = {},
    TypeParent = PlaybookTasksSubscription
  > {
    /** Change type */
    changeType?: ChangeTypeResolver<Change, TypeParent, Context>;

    value?: ValueResolver<PlaybookTask, TypeParent, Context>;
  }

  export type ChangeTypeResolver<
    R = Change,
    Parent = PlaybookTasksSubscription,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type ValueResolver<
    R = PlaybookTask,
    Parent = PlaybookTasksSubscription,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace GAclXenObjectResolvers {
  export interface Resolvers {
    __resolveType: ResolveType;
  }
  export type ResolveType<
    R = "GVM" | "GNetwork" | "GTemplate" | "GVDI" | "GISO" | "GTask",
    Parent = Gvm | GNetwork | GTemplate | Gvdi | Giso | GTask,
    Context = {}
  > = TypeResolveFn<R, Parent, Context>;
}

export namespace DiskImageResolvers {
  export interface Resolvers {
    __resolveType: ResolveType;
  }
  export type ResolveType<
    R = "GVDI" | "GISO",
    Parent = Gvdi | Giso,
    Context = {}
  > = TypeResolveFn<R, Parent, Context>;
}

export namespace GXenObjectResolvers {
  export interface Resolvers {
    __resolveType: ResolveType;
  }
  export type ResolveType<
    R = "GSR" | "GHost" | "GPool",
    Parent = Gsr | GHost | GPool,
    Context = {}
  > = TypeResolveFn<R, Parent, Context>;
}

/** Directs the executor to skip this field or fragment when the `if` argument is true. */
export type SkipDirectiveResolver<Result> = DirectiveResolverFn<
  Result,
  SkipDirectiveArgs,
  {}
>;
export interface SkipDirectiveArgs {
  /** Skipped when true. */
  if: boolean;
}

/** Directs the executor to include this field or fragment only when the `if` argument is true. */
export type IncludeDirectiveResolver<Result> = DirectiveResolverFn<
  Result,
  IncludeDirectiveArgs,
  {}
>;
export interface IncludeDirectiveArgs {
  /** Included when true. */
  if: boolean;
}

/** Marks an element of a GraphQL schema as no longer supported. */
export type DeprecatedDirectiveResolver<Result> = DirectiveResolverFn<
  Result,
  DeprecatedDirectiveArgs,
  {}
>;
export interface DeprecatedDirectiveArgs {
  /** Explains why this element was deprecated, usually also including a suggestion for how to access supported similar data. Formatted using the Markdown syntax (as specified by [CommonMark](https://commonmark.org/). */
  reason?: string;
}

export interface JSONStringScalarConfig
  extends GraphQLScalarTypeConfig<JsonString, any> {
  name: "JSONString";
}
export interface DateTimeScalarConfig
  extends GraphQLScalarTypeConfig<DateTime, any> {
  name: "DateTime";
}

export interface IResolvers<Context = {}> {
  Query?: QueryResolvers.Resolvers<Context>;
  Gvm?: GvmResolvers.Resolvers<Context>;
  GAccessEntry?: GAccessEntryResolvers.Resolvers<Context>;
  Interface?: InterfaceResolvers.Resolvers<Context>;
  GNetwork?: GNetworkResolvers.Resolvers<Context>;
  PvDriversVersion?: PvDriversVersionResolvers.Resolvers<Context>;
  BlockDevice?: BlockDeviceResolvers.Resolvers<Context>;
  Gsr?: GsrResolvers.Resolvers<Context>;
  Gpbd?: GpbdResolvers.Resolvers<Context>;
  GHost?: GHostResolvers.Resolvers<Context>;
  CpuInfo?: CpuInfoResolvers.Resolvers<Context>;
  SoftwareVersion?: SoftwareVersionResolvers.Resolvers<Context>;
  OsVersion?: OsVersionResolvers.Resolvers<Context>;
  GTemplate?: GTemplateResolvers.Resolvers<Context>;
  GPool?: GPoolResolvers.Resolvers<Context>;
  Gvdi?: GvdiResolvers.Resolvers<Context>;
  Giso?: GisoResolvers.Resolvers<Context>;
  GPlaybook?: GPlaybookResolvers.Resolvers<Context>;
  PlaybookRequirements?: PlaybookRequirementsResolvers.Resolvers<Context>;
  PlaybookTask?: PlaybookTaskResolvers.Resolvers<Context>;
  VmSelectedIdLists?: VmSelectedIdListsResolvers.Resolvers<Context>;
  Mutation?: MutationResolvers.Resolvers<Context>;
  CreateVm?: CreateVmResolvers.Resolvers<Context>;
  TemplateMutation?: TemplateMutationResolvers.Resolvers<Context>;
  VmMutation?: VmMutationResolvers.Resolvers<Context>;
  VmStartMutation?: VmStartMutationResolvers.Resolvers<Context>;
  VmShutdownMutation?: VmShutdownMutationResolvers.Resolvers<Context>;
  VmRebootMutation?: VmRebootMutationResolvers.Resolvers<Context>;
  VmPauseMutation?: VmPauseMutationResolvers.Resolvers<Context>;
  PlaybookLaunchMutation?: PlaybookLaunchMutationResolvers.Resolvers<Context>;
  VmDeleteMutation?: VmDeleteMutationResolvers.Resolvers<Context>;
  AttachNetworkMutation?: AttachNetworkMutationResolvers.Resolvers<Context>;
  AttachIsoMutation?: AttachIsoMutationResolvers.Resolvers<Context>;
  AttachVdiMutation?: AttachVdiMutationResolvers.Resolvers<Context>;
  Subscription?: SubscriptionResolvers.Resolvers<Context>;
  GvMsSubscription?: GvMsSubscriptionResolvers.Resolvers<Context>;
  GHostsSubscription?: GHostsSubscriptionResolvers.Resolvers<Context>;
  GPoolsSubscription?: GPoolsSubscriptionResolvers.Resolvers<Context>;
  GTasksSubscription?: GTasksSubscriptionResolvers.Resolvers<Context>;
  GTask?: GTaskResolvers.Resolvers<Context>;
  PlaybookTasksSubscription?: PlaybookTasksSubscriptionResolvers.Resolvers<
    Context
  >;
  GAclXenObject?: GAclXenObjectResolvers.Resolvers;
  DiskImage?: DiskImageResolvers.Resolvers;
  GXenObject?: GXenObjectResolvers.Resolvers;
  JsonString?: GraphQLScalarType;
  DateTime?: GraphQLScalarType;
}

export interface IDirectiveResolvers<Result> {
  skip?: SkipDirectiveResolver<Result>;
  include?: IncludeDirectiveResolver<Result>;
  deprecated?: DeprecatedDirectiveResolver<Result>;
}

// ====================================================
// Scalars
// ====================================================

// ====================================================
// Interfaces
// ====================================================

export interface GAclXenObject {
  /** a human-readable name */
  nameLabel: string;
  /** a human-readable description */
  nameDescription: string;
  /** Unique constant identifier/object reference */
  ref: string;
  /** Unique session-dependent identifier/object reference */
  uuid: string;

  access: (Maybe<GAccessEntry>)[];
}

export interface DiskImage {
  /** a human-readable name */
  nameLabel: string;
  /** a human-readable description */
  nameDescription: string;
  /** Unique constant identifier/object reference */
  ref: string;
  /** Unique session-dependent identifier/object reference */
  uuid: string;

  SR?: Maybe<Gsr>;

  VMs?: Maybe<(Maybe<Gvm>)[]>;

  virtualSize: number;
}

export interface GXenObject {
  /** a human-readable name */
  nameLabel: string;
  /** a human-readable description */
  nameDescription: string;
  /** Unique constant identifier/object reference */
  ref: string;
  /** Unique session-dependent identifier/object reference */
  uuid: string;
}

// ====================================================
// Types
// ====================================================

export interface Query {
  /** All VMs available to user */
  vms: (Maybe<Gvm>)[];

  vm?: Maybe<Gvm>;
  /** All Templates available to user */
  templates: (Maybe<GTemplate>)[];

  template?: Maybe<Gvm>;

  hosts: (Maybe<GHost>)[];

  host?: Maybe<GHost>;

  pools: (Maybe<GPool>)[];

  pool?: Maybe<GPool>;
  /** All Networks available to user */
  networks: (Maybe<GNetwork>)[];
  /** Information about a single network */
  network?: Maybe<GNetwork>;
  /** All Storage repositories available to user */
  srs: (Maybe<Gsr>)[];
  /** Information about a single storage repository */
  sr?: Maybe<Gsr>;
  /** All Virtual Disk Images (hard disks), available for user */
  vdis: (Maybe<Gvdi>)[];
  /** Information about a single virtual disk image (hard disk) */
  vdi?: Maybe<Gvdi>;
  /** All ISO images available for user */
  isos: (Maybe<Giso>)[];
  /** Information about a single ISO image */
  iso?: Maybe<Gvdi>;
  /** List of Ansible-powered playbooks */
  playbooks: (Maybe<GPlaybook>)[];
  /** Information about Ansible-powered playbook */
  playbook?: Maybe<GPlaybook>;
  /** Info about a playbook task */
  playbookTask?: Maybe<PlaybookTask>;
  /** All Playbook Tasks */
  playbookTasks: (Maybe<PlaybookTask>)[];
  /** One-time link to RFB console for a VM */
  console?: Maybe<string>;

  selectedItems: string[];

  vmSelectedReadyFor: VmSelectedIdLists;
}

export interface Gvm extends GAclXenObject {
  /** a human-readable name */
  nameLabel: string;
  /** a human-readable description */
  nameDescription: string;
  /** Unique constant identifier/object reference */
  ref: string;
  /** Unique session-dependent identifier/object reference */
  uuid: string;

  access: (Maybe<GAccessEntry>)[];
  /** Network adapters connected to a VM */
  interfaces?: Maybe<(Maybe<Interface>)[]>;
  /** True if PV drivers are up to date, reported if Guest Additions are installed */
  PVDriversUpToDate?: Maybe<boolean>;
  /** PV drivers version, if available */
  PVDriversVersion?: Maybe<PvDriversVersion>;

  disks?: Maybe<(Maybe<BlockDevice>)[]>;

  VCPUsAtStartup: number;

  VCPUsMax: number;

  domainType: DomainType;

  guestMetrics: string;

  installTime: DateTime;

  memoryActual: number;

  memoryStaticMin: number;

  memoryStaticMax: number;

  memoryDynamicMin: number;

  memoryDynamicMax: number;

  metrics: string;

  osVersion?: Maybe<OsVersion>;

  powerState: PowerState;

  startTime: DateTime;
}

export interface GAccessEntry {
  access: (Maybe<string>)[];

  userid: string;
}

export interface Interface {
  id: string;

  MAC: string;

  VIF: string;

  ip?: Maybe<string>;

  ipv6?: Maybe<string>;

  network: GNetwork;

  status?: Maybe<string>;

  attached: boolean;
}

export interface GNetwork extends GAclXenObject {
  /** a human-readable name */
  nameLabel: string;
  /** a human-readable description */
  nameDescription: string;
  /** Unique constant identifier/object reference */
  ref: string;
  /** Unique session-dependent identifier/object reference */
  uuid: string;

  access: (Maybe<GAccessEntry>)[];

  VMs?: Maybe<(Maybe<Gvm>)[]>;

  otherConfig?: Maybe<JsonString>;
}

/** Drivers version. We don't want any fancy resolver except for the thing that we know that it's a dict in VM document */
export interface PvDriversVersion {
  major?: Maybe<number>;

  minor?: Maybe<number>;

  micro?: Maybe<number>;

  build?: Maybe<number>;
}

export interface BlockDevice {
  id: string;

  attached: boolean;

  bootable: boolean;

  device: string;

  mode: string;

  type: string;

  VDI?: Maybe<DiskImage>;
}

export interface Gsr extends GXenObject {
  /** a human-readable name */
  nameLabel: string;
  /** a human-readable description */
  nameDescription: string;
  /** Unique constant identifier/object reference */
  ref: string;
  /** Unique session-dependent identifier/object reference */
  uuid: string;
  /** Connections to host. Usually one, unless the storage repository is shared: e.g. iSCSI */
  PBDs: (Maybe<Gpbd>)[];

  VDIs?: Maybe<(Maybe<DiskImage>)[]>;

  contentType: SrContentType;

  type: string;
  /** Physical size in kilobytes */
  physicalSize: number;
  /** Virtual allocation in kilobytes */
  virtualAllocation: number;
  /** This SR contains XenServer Tools */
  isToolsSr: boolean;
  /** Physical utilisation in bytes */
  physicalUtilisation: number;
  /** Available space in bytes */
  spaceAvailable: number;
}

/** Fancy name for a PBD. Not a real Xen object, though a connection between a host and a SR */
export interface Gpbd {
  /** Unique constant identifier/object reference */
  ref: string;
  /** Unique session-dependent identifier/object reference */
  uuid: string;
  /** Host to which the SR is supposed to be connected to */
  host: GHost;

  deviceConfig: JsonString;

  SR: Gsr;

  currentlyAttached: boolean;
}

export interface GHost extends GXenObject {
  /** a human-readable name */
  nameLabel: string;
  /** a human-readable description */
  nameDescription: string;
  /** Unique constant identifier/object reference */
  ref: string;
  /** Unique session-dependent identifier/object reference */
  uuid: string;
  /** Major XenAPI version number */
  APIVersionMajor?: Maybe<number>;
  /** Minor XenAPI version number */
  APIVersionMinor?: Maybe<number>;
  /** Connections to storage repositories */
  PBDs: (Maybe<Gpbd>)[];

  PCIs: (Maybe<string>)[];

  PGPUs: (Maybe<string>)[];

  PIFs: (Maybe<string>)[];

  PUSBs: (Maybe<string>)[];
  /** The address by which this host can be contacted from any other host in the pool */
  address: string;

  allowedOperations: (Maybe<HostAllowedOperations>)[];

  cpuInfo: CpuInfo;

  display: HostDisplay;

  hostname: string;

  softwareVersion: SoftwareVersion;
  /** VMs currently resident on host */
  residentVms: (Maybe<Gvm>)[];

  metrics: string;
  /** Total memory in kilobytes */
  memoryTotal?: Maybe<number>;
  /** Free memory in kilobytes */
  memoryFree?: Maybe<number>;
  /** Available memory as measured by the host in kilobytes */
  memoryAvailable?: Maybe<number>;
  /** Virtualization overhead in kilobytes */
  memoryOverhead?: Maybe<number>;
  /** True if host is up. May be null if no data */
  live?: Maybe<boolean>;
  /** When live status was last updated */
  liveUpdated?: Maybe<DateTime>;
}

export interface CpuInfo {
  cpuCount: number;

  modelname: string;

  socketCount: number;

  vendor: string;

  family: number;

  features: string;

  featuresHvm?: Maybe<string>;

  featuresPv?: Maybe<string>;

  flags: string;

  model: number;

  speed: number;

  stepping: number;
}

export interface SoftwareVersion {
  buildNumber: string;

  date: string;

  hostname: string;
  /** Linux kernel version */
  linux: string;

  networkBackend: string;

  platformName: string;

  platformVersion: string;

  platformVersionText: string;

  platformVersionTextShort: string;
  /** XAPI version */
  xapi: string;
  /** Xen version */
  xen: string;

  productBrand: string;

  productVersion: string;

  productVersionText: string;
}

/** OS version reported by Xen tools */
export interface OsVersion {
  name?: Maybe<string>;

  uname?: Maybe<string>;

  distro?: Maybe<string>;

  major?: Maybe<number>;

  minor?: Maybe<number>;
}

export interface GTemplate extends GAclXenObject {
  /** a human-readable name */
  nameLabel: string;
  /** a human-readable description */
  nameDescription: string;
  /** Unique constant identifier/object reference */
  ref: string;
  /** Unique session-dependent identifier/object reference */
  uuid: string;

  access: (Maybe<GAccessEntry>)[];
  /** If a template supports auto-installation, here a distro name is provided */
  osKind?: Maybe<string>;
  /** True if this template works with hardware assisted virtualization */
  hvm: boolean;
  /** True if this template is available for regular users */
  enabled: boolean;
}

export interface GPool extends GXenObject {
  /** a human-readable name */
  nameLabel: string;
  /** a human-readable description */
  nameDescription: string;
  /** Unique constant identifier/object reference */
  ref: string;
  /** Unique session-dependent identifier/object reference */
  uuid: string;
  /** Pool master */
  master: GHost;
  /** Default SR */
  defaultSr?: Maybe<Gsr>;
}

export interface Gvdi extends GAclXenObject, DiskImage {
  /** a human-readable name */
  nameLabel: string;
  /** a human-readable description */
  nameDescription: string;
  /** Unique constant identifier/object reference */
  ref: string;
  /** Unique session-dependent identifier/object reference */
  uuid: string;

  access: (Maybe<GAccessEntry>)[];

  SR?: Maybe<Gsr>;

  VMs?: Maybe<(Maybe<Gvm>)[]>;

  virtualSize: number;
}

export interface Giso extends GAclXenObject, DiskImage {
  /** a human-readable name */
  nameLabel: string;
  /** a human-readable description */
  nameDescription: string;
  /** Unique constant identifier/object reference */
  ref: string;
  /** Unique session-dependent identifier/object reference */
  uuid: string;

  access: (Maybe<GAccessEntry>)[];

  SR?: Maybe<Gsr>;

  VMs?: Maybe<(Maybe<Gvm>)[]>;

  virtualSize: number;

  location: string;
}

export interface GPlaybook {
  /** Playbook ID */
  id: string;
  /** Inventory file path */
  inventory?: Maybe<string>;
  /** Requirements for running this playbook */
  requires?: Maybe<PlaybookRequirements>;
  /** Playbook name */
  name: string;
  /** Playbook description */
  description?: Maybe<string>;
  /** Variables available for change to an user */
  variables?: Maybe<JsonString>;
}

export interface PlaybookRequirements {
  /** Minimal supported OS versions */
  osVersion: (Maybe<OsVersion>)[];
}

export interface PlaybookTask {
  /** Playbook task ID */
  id: string;
  /** Playbook ID */
  playbookId: string;
  /** Playbook running state */
  state: PlaybookTaskState;
  /** Human-readable message: error description or return code */
  message: string;
}

export interface VmSelectedIdLists {
  start?: Maybe<(Maybe<string>)[]>;

  stop?: Maybe<(Maybe<string>)[]>;

  trash?: Maybe<(Maybe<string>)[]>;
}

export interface Mutation {
  /** Create a new VM */
  createVm?: Maybe<CreateVm>;
  /** Edit template options */
  template?: Maybe<TemplateMutation>;
  /** Edit VM options */
  vm?: Maybe<VmMutation>;
  /** Start VM */
  vmStart?: Maybe<VmStartMutation>;
  /** Shut down VM */
  vmShutdown?: Maybe<VmShutdownMutation>;
  /** Reboot VM */
  vmReboot?: Maybe<VmRebootMutation>;
  /** If VM is Running, pause VM. If Paused, unpause VM */
  vmPause?: Maybe<VmPauseMutation>;
  /** Launch an Ansible Playbook on specified VMs */
  playbookLaunch?: Maybe<PlaybookLaunchMutation>;
  /** Delete a Halted VM */
  vmDelete?: Maybe<VmDeleteMutation>;
  /** Attach VM to a Network by creating a new Interface */
  netAttach?: Maybe<AttachNetworkMutation>;
  /** Attach ISO to a VM by creating a new virtual block device */
  isoAttach?: Maybe<AttachIsoMutation>;
  /** Attach VDI to a VM by creating a new virtual block device */
  vdiAttach?: Maybe<AttachVdiMutation>;

  selectedItems?: Maybe<string[]>;
}

export interface CreateVm {
  /** Installation task ID */
  taskId: string;
}

export interface TemplateMutation {
  success: boolean;
}

/** This class represents synchronous mutations for VM, i.e. you can change name_label, name_description, etc. */
export interface VmMutation {
  success: boolean;
}

export interface VmStartMutation {
  /** Start task ID */
  taskId: string;
}

export interface VmShutdownMutation {
  /** Shutdown task ID */
  taskId: string;
}

export interface VmRebootMutation {
  /** Reboot task ID */
  taskId: string;
}

export interface VmPauseMutation {
  /** Pause/unpause task ID */
  taskId: string;
}

export interface PlaybookLaunchMutation {
  /** Playbook execution task ID */
  taskId: string;
}

export interface VmDeleteMutation {
  /** Deleting task ID */
  taskId: string;
}

export interface AttachNetworkMutation {
  /** Attach/Detach task ID. If already attached/detached, returns null */
  taskId?: Maybe<string>;
}

export interface AttachIsoMutation {
  /** Attach/Detach task ID. If already attached/detached, returns null */
  taskId?: Maybe<string>;
}

export interface AttachVdiMutation {
  /** Attach/Detach task ID. If already attached/detached, returns null */
  taskId?: Maybe<string>;
}

/** All subscriptions must return  Observable */
export interface Subscription {
  /** Updates for all VMs */
  vms: GvMsSubscription;
  /** Updates for a particular VM */
  vm?: Maybe<Gvm>;
  /** Updates for all Hosts */
  hosts: GHostsSubscription;
  /** Updates for a particular Host */
  host?: Maybe<GHost>;
  /** Updates for all pools available in VMEmperor */
  pools: GPoolsSubscription;
  /** Updates for a particular Pool */
  pool?: Maybe<GPool>;
  /** Updates for all user's tasks */
  tasks: GTasksSubscription;
  /** Updates for a particular XenServer Task */
  task?: Maybe<GTask>;
  /** Updates for a particular Playbook installation Task */
  playbookTask?: Maybe<PlaybookTask>;
  /** Updates for all Playbook Tasks */
  playbookTasks: PlaybookTasksSubscription;
}

export interface GvMsSubscription {
  /** Change type */
  changeType: Change;

  value: Gvm;
}

export interface GHostsSubscription {
  /** Change type */
  changeType: Change;

  value: GHost;
}

export interface GPoolsSubscription {
  /** Change type */
  changeType: Change;

  value: GPool;
}

export interface GTasksSubscription {
  /** Change type */
  changeType: Change;

  value: GTask;
}

export interface GTask extends GAclXenObject {
  /** a human-readable name */
  nameLabel: string;
  /** a human-readable description */
  nameDescription: string;
  /** Unique constant identifier/object reference */
  ref: string;
  /** Unique session-dependent identifier/object reference */
  uuid: string;

  access: (Maybe<GAccessEntry>)[];
  /** Task creation time */
  created: DateTime;
  /** Task finish time */
  finished: DateTime;
  /** Task progress */
  progress: number;
  /** Task result if available */
  result?: Maybe<string>;
  /** Task result type */
  type?: Maybe<string>;
  /** ref of a host that runs this task */
  residentOn?: Maybe<string>;
  /** Error strings, if failed */
  errorInfo?: Maybe<(Maybe<string>)[]>;
  /** Task status */
  status?: Maybe<string>;
}

export interface PlaybookTasksSubscription {
  /** Change type */
  changeType: Change;

  value: PlaybookTask;
}

// ====================================================
// Arguments
// ====================================================

export interface VmQueryArgs {
  uuid?: Maybe<string>;
}
export interface TemplateQueryArgs {
  uuid?: Maybe<string>;
}
export interface HostQueryArgs {
  uuid?: Maybe<string>;
}
export interface PoolQueryArgs {
  uuid?: Maybe<string>;
}
export interface NetworkQueryArgs {
  uuid?: Maybe<string>;
}
export interface SrQueryArgs {
  uuid?: Maybe<string>;
}
export interface VdiQueryArgs {
  uuid?: Maybe<string>;
}
export interface IsoQueryArgs {
  uuid?: Maybe<string>;
}
export interface PlaybookQueryArgs {
  id?: Maybe<string>;
}
export interface PlaybookTaskQueryArgs {
  id: string;
}
export interface ConsoleQueryArgs {
  vmUuid: string;
}
export interface SelectedItemsQueryArgs {
  tableId: Table;
}
export interface CreateVmMutationArgs {
  /** Number of created virtual CPUs */
  VCPUs?: number;

  disks?: Maybe<(Maybe<NewVdi>)[]>;
  /** Automatic installation parameters, the installation is done via internet. Only available when template.os_kind is not empty */
  installParams?: Maybe<AutoInstall>;
  /** ISO image mounted if conf parameter is null */
  iso?: Maybe<string>;
  /** VM human-readable description */
  nameDescription: string;
  /** VM human-readable name */
  nameLabel: string;
  /** Network ID to connect to */
  network?: Maybe<string>;
  /** RAM size in megabytes */
  ram: number;
  /** Template ID */
  template: string;
}
export interface TemplateMutationArgs {
  /** Template to change */
  template?: Maybe<TemplateInput>;
}
export interface VmMutationArgs {
  /** VM to change */
  vm: VmInput;
}
export interface VmStartMutationArgs {
  options?: Maybe<VmStartInput>;

  uuid: string;
}
export interface VmShutdownMutationArgs {
  /** Force shutdown in a hard or clean way */
  force?: Maybe<ShutdownForce>;

  uuid: string;
}
export interface VmRebootMutationArgs {
  /** Force reboot in a hard or clean way. Default: clean */
  force?: Maybe<ShutdownForce>;

  uuid: string;
}
export interface VmPauseMutationArgs {
  uuid: string;
}
export interface PlaybookLaunchMutationArgs {
  /** Playbook ID */
  id: string;
  /** JSON with key-value pairs representing Playbook variables changed by user */
  variables?: Maybe<JsonString>;
  /** VM UUIDs to run Playbook on. Ignored if this is a Playbook with provided Inventory */
  vms?: Maybe<(Maybe<string>)[]>;
}
export interface VmDeleteMutationArgs {
  uuid: string;
}
export interface NetAttachMutationArgs {
  /** True if attach, False if detach */
  isAttach: boolean;

  netUuid: string;

  vmUuid: string;
}
export interface IsoAttachMutationArgs {
  /** True if attach, False if detach */
  isAttach: boolean;

  isoUuid: string;

  vmUuid: string;
}
export interface VdiAttachMutationArgs {
  /** True if attach, False if detach */
  isAttach: boolean;

  vdiUuid: string;

  vmUuid: string;
}
export interface SelectedItemsMutationArgs {
  tableId: Table;

  items: string[];

  isSelect: boolean;
}
export interface VmSubscriptionArgs {
  uuid: string;
}
export interface HostSubscriptionArgs {
  uuid: string;
}
export interface PoolSubscriptionArgs {
  uuid: string;
}
export interface TaskSubscriptionArgs {
  uuid: string;
}
export interface PlaybookTaskSubscriptionArgs {
  id: string;
}

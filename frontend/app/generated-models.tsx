export type Maybe<T> = T | null;

export interface NewVdi {
  /** Storage repository to create disk on */
  SR: string;
  /** Disk size of a newly created disk in megabytes */
  size: number;
}

export interface NetworkConfiguration {
  ip: string;

  gateway: string;

  netmask: string;

  dns0: string;

  dns1?: Maybe<string>;
}

export interface VmInput {
  /** Object's ref */
  ref: string;
  /** Object's human-readable name */
  nameLabel?: Maybe<string>;
  /** Object's human-readable description */
  nameDescription?: Maybe<string>;
  /** VM domain type: 'pv', 'hvm', 'pv_in_pvh' */
  domainType?: Maybe<DomainType>;
  /** VCPU platform properties */
  platform?: Maybe<PlatformInput>;
  /** Number of VCPUs at startup */
  VCPUsAtStartup?: Maybe<number>;
  /** Maximum number of VCPUs */
  VCPUsMax?: Maybe<number>;
  /** Dynamic memory min in bytes */
  memoryDynamicMin?: Maybe<number>;
  /** Dynamic memory max in bytes */
  memoryDynamicMax?: Maybe<number>;
  /** Static memory min in bytes */
  memoryStaticMin?: Maybe<number>;
  /** Static memory max in bytes */
  memoryStaticMax?: Maybe<number>;
}

export interface PlatformInput {
  coresPerSocket?: Maybe<number>;

  timeoffset?: Maybe<number>;

  nx?: Maybe<boolean>;

  deviceModel?: Maybe<string>;

  pae?: Maybe<boolean>;

  hpet?: Maybe<boolean>;

  apic?: Maybe<boolean>;

  acpi?: Maybe<number>;

  videoram?: Maybe<number>;
}

export interface TemplateInput {
  /** Object's ref */
  ref: string;
  /** Object's human-readable name */
  nameLabel?: Maybe<string>;
  /** Object's human-readable description */
  nameDescription?: Maybe<string>;
  /** VM domain type: 'pv', 'hvm', 'pv_in_pvh' */
  domainType?: Maybe<DomainType>;
  /** VCPU platform properties */
  platform?: Maybe<PlatformInput>;
  /** Number of VCPUs at startup */
  VCPUsAtStartup?: Maybe<number>;
  /** Maximum number of VCPUs */
  VCPUsMax?: Maybe<number>;
  /** Dynamic memory min in bytes */
  memoryDynamicMin?: Maybe<number>;
  /** Dynamic memory max in bytes */
  memoryDynamicMax?: Maybe<number>;
  /** Static memory min in bytes */
  memoryStaticMin?: Maybe<number>;
  /** Static memory max in bytes */
  memoryStaticMax?: Maybe<number>;
  /** Should this template be enabled, i.e. used in VMEmperor by users */
  enabled?: Maybe<boolean>;

  installOptions?: Maybe<InstallOsOptionsInput>;
}

export interface InstallOsOptionsInput {
  distro?: Maybe<Distro>;

  arch?: Maybe<Arch>;

  release?: Maybe<string>;

  installRepository?: Maybe<string>;
}

export interface VmStartInput {
  /** Should this VM be started and immidiately paused */
  paused?: Maybe<boolean>;
  /** Host to start VM on */
  host?: Maybe<string>;
  /** Should this VM be started forcibly */
  force?: Maybe<boolean>;
}

/** An enumeration. */
export enum DomainType {
  Hvm = "HVM",
  Pv = "PV",
  PvInPvh = "PV_in_PVH"
}

/** An enumeration. */
export enum VmActions {
  AttachVdi = "attach_vdi",
  AttachNetwork = "attach_network",
  Rename = "rename",
  ChangeDomainType = "change_domain_type",
  Vnc = "VNC",
  ChangingVcpUs = "changing_VCPUs",
  ChangingMemoryLimits = "changing_memory_limits",
  Snapshot = "snapshot",
  Clone = "clone",
  Copy = "copy",
  CreateTemplate = "create_template",
  Revert = "revert",
  Checkpoint = "checkpoint",
  SnapshotWithQuiesce = "snapshot_with_quiesce",
  Start = "start",
  StartOn = "start_on",
  Pause = "pause",
  Unpause = "unpause",
  CleanShutdown = "clean_shutdown",
  CleanReboot = "clean_reboot",
  HardShutdown = "hard_shutdown",
  PowerStateReset = "power_state_reset",
  HardReboot = "hard_reboot",
  Suspend = "suspend",
  Csvm = "csvm",
  Resume = "resume",
  ResumeOn = "resume_on",
  PoolMigrate = "pool_migrate",
  MigrateSend = "migrate_send",
  Shutdown = "shutdown",
  Destroy = "destroy",
  None = "NONE",
  All = "ALL"
}

export enum PowerState {
  Halted = "Halted",
  Paused = "Paused",
  Running = "Running",
  Suspended = "Suspended"
}

/** An enumeration. */
export enum NetworkActions {
  Attaching = "attaching",
  None = "NONE",
  All = "ALL"
}

/** An enumeration. */
export enum VdiActions {
  Plug = "plug",
  None = "NONE",
  All = "ALL"
}

/** An enumeration. */
export enum SrActions {
  Scan = "scan",
  Destroy = "destroy",
  VdiCreate = "vdi_create",
  VdiIntroduce = "vdi_introduce",
  VdiClone = "vdi_clone",
  None = "NONE",
  All = "ALL"
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

/** VDI class supports only a subset of VDI types, that are listed below. */
export enum VdiType {
  System = "System",
  User = "User",
  Ephemeral = "Ephemeral"
}

export enum VbdType {
  Cd = "CD",
  Disk = "Disk",
  Floppy = "Floppy"
}

export enum VbdMode {
  Ro = "RO",
  Rw = "RW"
}

/** An enumeration. */
export enum TemplateActions {
  Clone = "clone",
  Destroy = "destroy",
  ChangeInstallOsOptions = "change_install_os_options",
  None = "NONE",
  All = "ALL"
}

/** An enumeration. */
export enum Distro {
  Debian = "Debian",
  CentOs = "CentOS",
  Suse = "SUSE"
}

/** An enumeration. */
export enum Arch {
  I386 = "I386",
  X86_64 = "X86_64"
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
  Templates = "Templates",
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

/** An enumeration. */
export enum TaskActions {
  Cancel = "cancel",
  None = "NONE",
  All = "ALL"
}

/** The `DateTime` scalar type represents a DateTime value as specified by [iso8601](https://en.wikipedia.org/wiki/ISO_8601). */
export type DateTime = any;

/** JSON String */
export type JsonString = any;

// ====================================================
// Documents
// ====================================================

export namespace VmAccessSetMutation {
  export type Variables = {
    actions: VmActions[];
    user: string;
    ref: string;
    revoke: boolean;
  };

  export type Mutation = {
    __typename?: "Mutation";

    vmAccessSet: Maybe<VmAccessSet>;
  };

  export type VmAccessSet = {
    __typename?: "VMAccessSet";

    success: boolean;
  };
}

export namespace VdiAttach {
  export type Variables = {
    vmRef: string;
    vdiRef: string;
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
    vmRef: string;
    vdiRef: string;
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
    vmRef: string;
    netRef: string;
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
    vmRef: string;
    netRef: string;
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
    vmOptions: VmInput;
    disks?: Maybe<(Maybe<NewVdi>)[]>;
    installParams?: Maybe<AutoInstall>;
    iso?: Maybe<string>;
    template: string;
    network?: Maybe<string>;
  };

  export type Mutation = {
    __typename?: "Mutation";

    createVm: Maybe<CreateVm>;
  };

  export type CreateVm = {
    __typename?: "CreateVM";

    taskId: Maybe<string>;

    granted: boolean;

    reason: Maybe<string>;
  };
}

export namespace CurrentUser {
  export type Variables = {};

  export type Query = {
    __typename?: "Query";

    currentUser: Maybe<CurrentUser>;
  };

  export type CurrentUser = {
    __typename?: "CurrentUserInformation";

    user: Maybe<User>;

    groups: Maybe<(Maybe<Groups>)[]>;

    isAdmin: boolean;
  };

  export type User = UserFragment.Fragment;

  export type Groups = UserFragment.Fragment;
}

export namespace DeleteTemplate {
  export type Variables = {
    ref: string;
  };

  export type Mutation = {
    __typename?: "Mutation";

    templateDelete: Maybe<TemplateDelete>;
  };

  export type TemplateDelete = {
    __typename?: "TemplateDestroyMutation";

    taskId: Maybe<string>;
  };
}

export namespace DeleteVm {
  export type Variables = {
    ref: string;
  };

  export type Mutation = {
    __typename?: "Mutation";

    vmDelete: Maybe<VmDelete>;
  };

  export type VmDelete = {
    __typename?: "VMDeleteMutation";

    taskId: Maybe<string>;
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

    reason: Maybe<string>;

    granted: boolean;
  };
}

export namespace FilterUsers {
  export type Variables = {
    query: string;
  };

  export type Query = {
    __typename?: "Query";

    findUser: (Maybe<FindUser>)[];
  };

  export type FindUser = UserFragment.Fragment;
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

  export type Value = HostListFragment.Fragment | DeletedFragment.Fragment;
}

export namespace IsosCreateVmList {
  export type Variables = {};

  export type Query = {
    __typename?: "Query";

    vdis: (Maybe<Vdis>)[];
  };

  export type Vdis = IsoCreateVmListFragment.Fragment;
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

export namespace TemplateTableSelection {
  export type Variables = {};

  export type Query = {
    __typename?: "Query";

    selectedItems: string[];
  };
}

export namespace TemplateTableSelect {
  export type Variables = {
    item: string;
    isSelect: boolean;
  };

  export type Mutation = {
    __typename?: "Mutation";

    selectedItems: Maybe<string[]>;
  };
}

export namespace TemplateTableSelectAll {
  export type Variables = {
    items: string[];
    isSelect: boolean;
  };

  export type Mutation = {
    __typename?: "Mutation";

    selectedItems: Maybe<string[]>;
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

    ref: string;

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

export namespace PauseVm {
  export type Variables = {
    ref: string;
  };

  export type Mutation = {
    __typename?: "Mutation";

    vmPause: Maybe<VmPause>;
  };

  export type VmPause = {
    __typename?: "VMPauseMutation";

    taskId: Maybe<string>;

    granted: boolean;

    reason: Maybe<string>;
  };
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

  export type Value = PoolListFragment.Fragment | DeletedFragment.Fragment;
}

export namespace RebootVm {
  export type Variables = {
    ref: string;
    force?: Maybe<ShutdownForce>;
  };

  export type Mutation = {
    __typename?: "Mutation";

    vmReboot: Maybe<VmReboot>;
  };

  export type VmReboot = {
    __typename?: "VMRebootMutation";

    taskId: Maybe<string>;
  };
}

export namespace TemplateSetEnabled {
  export type Variables = {
    template: TemplateInput;
  };

  export type Mutation = {
    __typename?: "Mutation";

    template: Maybe<Template>;
  };

  export type Template = {
    __typename?: "TemplateMutation";

    granted: boolean;

    reason: Maybe<string>;
  };
}

export namespace ShutdownVm {
  export type Variables = {
    ref: string;
    force?: Maybe<ShutdownForce>;
  };

  export type Mutation = {
    __typename?: "Mutation";

    vmShutdown: Maybe<VmShutdown>;
  };

  export type VmShutdown = {
    __typename?: "VMShutdownMutation";

    taskId: Maybe<string>;
  };
}

export namespace StartVm {
  export type Variables = {
    ref: string;
    options?: Maybe<VmStartInput>;
  };

  export type Mutation = {
    __typename?: "Mutation";

    vmStart: Maybe<VmStart>;
  };

  export type VmStart = {
    __typename?: "VMStartMutation";

    granted: boolean;

    taskId: Maybe<string>;

    reason: Maybe<string>;
  };
}

export namespace StorageList {
  export type Variables = {};

  export type Query = {
    __typename?: "Query";

    srs: (Maybe<Srs>)[];
  };

  export type Srs = StorageListFragment.Fragment;
}

export namespace SuspendVm {
  export type Variables = {
    ref: string;
  };

  export type Mutation = {
    __typename?: "Mutation";

    vmSuspend: Maybe<VmSuspend>;
  };

  export type VmSuspend = {
    __typename?: "VMSuspendMutation";

    taskId: Maybe<string>;

    granted: boolean;

    reason: Maybe<string>;
  };
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

  export type Value = TaskFragment.Fragment | DeletedFragment.Fragment;
}

export namespace TemplateList {
  export type Variables = {};

  export type Query = {
    __typename?: "Query";

    templates: (Maybe<Templates>)[];
  };

  export type Templates = TemplateListFragment.Fragment;
}

export namespace TemplateListUpdate {
  export type Variables = {};

  export type Subscription = {
    __typename?: "Subscription";

    templates: Templates;
  };

  export type Templates = {
    __typename?: "GTemplatesSubscription";

    value: Value;

    changeType: Change;
  };

  export type Value = TemplateListFragment.Fragment | DeletedFragment.Fragment;
}

export namespace StorageAttachVdiList {
  export type Variables = {};

  export type Query = {
    __typename?: "Query";

    vdis: (Maybe<Vdis>)[];
  };

  export type Vdis = StorageAttachVdiListFragment.Fragment;
}

export namespace StorageAttachIsoList {
  export type Variables = {};

  export type Query = {
    __typename?: "Query";

    vdis: (Maybe<Vdis>)[];
  };

  export type Vdis = StorageAttachVdiListFragment.Fragment;
}

export namespace VmInfo {
  export type Variables = {
    ref: string;
  };

  export type Query = {
    __typename?: "Query";

    vm: Maybe<Vm>;
  };

  export type Vm = VmInfoFragment.Fragment;
}

export namespace VmInfoUpdate {
  export type Variables = {
    ref: string;
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

  export type Value = VmListFragment.Fragment | DeletedFragment.Fragment;
}

export namespace DeletedFragment {
  export type Fragment = {
    __typename?: "Deleted";

    ref: string;
  };
}

export namespace HostListFragment {
  export type Fragment = {
    __typename?: "GHost";

    softwareVersion: SoftwareVersion;

    cpuInfo: CpuInfo;

    ref: string;

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

    ref: string;
  };
}

export namespace IsoCreateVmListFragment {
  export type Fragment = {
    __typename?: "GVDI";

    ref: string;

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

    ref: string;

    nameLabel: string;

    nameDescription: string;
  };
}

export namespace PoolListFragment {
  export type Fragment = {
    __typename?: "GPool";

    master: Maybe<Master>;

    nameLabel: string;

    nameDescription: string;

    ref: string;

    uuid: string;
  };

  export type Master = {
    __typename?: "GHost";

    ref: string;
  };
}

export namespace StorageListFragment {
  export type Fragment = {
    __typename?: "GSR";

    ref: string;

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

export namespace TaskFragment {
  export type Fragment = {
    __typename?: "GTask";

    ref: string;

    status: Maybe<string>;

    created: DateTime;

    nameLabel: string;

    nameDescription: string;

    finished: DateTime;

    progress: number;

    result: Maybe<string>;

    residentOn: Maybe<string>;
  };
}

export namespace TemplateListFragment {
  export type Fragment = {
    __typename?: "GTemplate";

    ref: string;

    nameLabel: string;

    enabled: boolean;

    myActions: (Maybe<TemplateActions>)[];

    access: (Maybe<Access>)[];

    installOptions: Maybe<InstallOptions>;

    enabled: boolean;

    isOwner: boolean;
  };

  export type Access = {
    __typename?: "GTemplateAccessEntry";

    userId: UserId;

    actions: TemplateActions[];
  };

  export type UserId = {
    __typename?: "User";

    id: string;

    name: string;

    username: string;
  };

  export type InstallOptions = {
    __typename?: "InstallOSOptions";

    distro: Distro;

    arch: Maybe<Arch>;

    release: Maybe<string>;

    installRepository: Maybe<string>;
  };
}

export namespace UserFragment {
  export type Fragment = {
    __typename?: "User";

    username: string;

    id: string;

    name: string;
  };
}

export namespace StorageAttachVdiListFragment {
  export type Fragment = {
    __typename?: "GVDI";

    ref: string;

    nameLabel: string;

    nameDescription: string;

    virtualSize: number;
  };
}

export namespace VmvifFragment {
  export type Fragment = {
    __typename?: "GVIF";

    network: Maybe<Network>;

    ip: Maybe<string>;

    ipv6: Maybe<string>;

    ref: string;

    MAC: string;

    currentlyAttached: boolean;
  };

  export type Network = {
    __typename?: "GNetwork";

    ref: string;

    nameLabel: string;
  };
}

export namespace VmvbdFragment {
  export type Fragment = {
    __typename?: "GVBD";

    ref: string;

    mode: VbdMode;

    type: VbdType;

    userdevice: number;

    currentlyAttached: boolean;

    bootable: boolean;

    VDI: Maybe<Vdi>;
  };

  export type Vdi = {
    __typename?: "GVDI";

    ref: string;

    nameDescription: string;

    nameLabel: string;

    virtualSize: number;
  };
}

export namespace VmAccessFragment {
  export type Fragment = {
    __typename?: "GVMAccessEntry";

    userId: UserId;

    actions: VmActions[];
  };

  export type UserId = {
    __typename?: "User";

    id: string;

    name: string;

    username: string;
  };
}

export namespace VmInfoFragment {
  export type Fragment = {
    __typename?: "GVM";

    ref: string;

    nameLabel: string;

    nameDescription: string;

    memoryStaticMin: number;

    memoryStaticMax: number;

    memoryDynamicMin: number;

    memoryDynamicMax: number;

    VCPUsAtStartup: number;

    VCPUsAtStartup: number;

    VCPUsMax: number;

    platform: Maybe<Platform>;

    VIFs: (Maybe<ViFs>)[];

    VBDs: (Maybe<VbDs>)[];

    powerState: PowerState;

    osVersion: Maybe<OsVersion>;

    startTime: Maybe<DateTime>;

    domainType: DomainType;

    access: (Maybe<Access>)[];

    myActions: (Maybe<VmActions>)[];

    isOwner: boolean;
  };

  export type Platform = {
    __typename?: "Platform";

    coresPerSocket: Maybe<number>;
  };

  export type ViFs = VmvifFragment.Fragment;

  export type VbDs = VmvbdFragment.Fragment;

  export type OsVersion = {
    __typename?: "OSVersion";

    name: Maybe<string>;
  };

  export type Access = VmAccessFragment.Fragment;
}

export namespace VmListFragment {
  export type Fragment = {
    __typename?: "GVM";

    ref: string;

    nameLabel: string;

    powerState: PowerState;

    myActions: (Maybe<VmActions>)[];

    isOwner: boolean;
  };
}

import gql from "graphql-tag";
import * as React from "react";
import * as ReactApollo from "react-apollo";

// ====================================================
// Fragments
// ====================================================

export namespace DeletedFragment {
  export const FragmentDoc = gql`
    fragment DeletedFragment on Deleted {
      ref
    }
  `;
}

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
      ref
      uuid
      nameLabel
      nameDescription
      memoryFree
      memoryTotal
      memoryAvailable
      liveUpdated
      memoryOverhead
      residentVms {
        ref
      }
    }
  `;
}

export namespace IsoCreateVmListFragment {
  export const FragmentDoc = gql`
    fragment ISOCreateVMListFragment on GVDI {
      ref
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
      ref
      nameLabel
      nameDescription
    }
  `;
}

export namespace PoolListFragment {
  export const FragmentDoc = gql`
    fragment PoolListFragment on GPool {
      master {
        ref
      }
      nameLabel
      nameDescription
      ref
      uuid
    }
  `;
}

export namespace StorageListFragment {
  export const FragmentDoc = gql`
    fragment StorageListFragment on GSR {
      ref
      nameLabel
      spaceAvailable
      contentType
      PBDs {
        currentlyAttached
      }
    }
  `;
}

export namespace TaskFragment {
  export const FragmentDoc = gql`
    fragment TaskFragment on GTask {
      ref
      status
      created
      nameLabel
      nameDescription
      finished
      progress
      result
      residentOn
    }
  `;
}

export namespace TemplateListFragment {
  export const FragmentDoc = gql`
    fragment TemplateListFragment on GTemplate {
      ref
      nameLabel
      enabled
      myActions
      access {
        userId {
          id
          name
          username
        }
        actions
      }
      installOptions {
        distro
        arch
        release
        installRepository
      }
      enabled
      isOwner
    }
  `;
}

export namespace UserFragment {
  export const FragmentDoc = gql`
    fragment UserFragment on User {
      username
      id
      name
    }
  `;
}

export namespace StorageAttachVdiListFragment {
  export const FragmentDoc = gql`
    fragment StorageAttachVDIListFragment on GVDI {
      ref
      nameLabel
      nameDescription
      virtualSize
    }
  `;
}

export namespace VmvifFragment {
  export const FragmentDoc = gql`
    fragment VMVIFFragment on GVIF {
      network {
        ref
        nameLabel
      }
      ip
      ipv6
      ref
      MAC
      currentlyAttached
    }
  `;
}

export namespace VmvbdFragment {
  export const FragmentDoc = gql`
    fragment VMVBDFragment on GVBD {
      ref
      mode
      type
      userdevice
      currentlyAttached
      bootable
      VDI {
        ref
        nameDescription
        nameLabel
        virtualSize
      }
    }
  `;
}

export namespace VmAccessFragment {
  export const FragmentDoc = gql`
    fragment VMAccessFragment on GVMAccessEntry {
      userId {
        id
        name
        username
      }
      actions
    }
  `;
}

export namespace VmInfoFragment {
  export const FragmentDoc = gql`
    fragment VMInfoFragment on GVM {
      ref
      nameLabel
      nameDescription
      memoryStaticMin
      memoryStaticMax
      memoryDynamicMin
      memoryDynamicMax
      VCPUsAtStartup
      VCPUsAtStartup
      VCPUsMax
      platform {
        coresPerSocket
      }
      VIFs {
        ...VMVIFFragment
      }
      VBDs {
        ...VMVBDFragment
      }
      powerState
      osVersion {
        name
      }
      startTime
      domainType
      access {
        ...VMAccessFragment
      }
      myActions
      isOwner
    }

    ${VmvifFragment.FragmentDoc}
    ${VmvbdFragment.FragmentDoc}
    ${VmAccessFragment.FragmentDoc}
  `;
}

export namespace VmListFragment {
  export const FragmentDoc = gql`
    fragment VMListFragment on GVM {
      ref
      nameLabel
      powerState
      myActions
      isOwner
    }
  `;
}

// ====================================================
// Components
// ====================================================

export namespace VmAccessSetMutation {
  export const Document = gql`
    mutation VMAccessSetMutation(
      $actions: [VMActions!]!
      $user: String!
      $ref: ID!
      $revoke: Boolean!
    ) {
      vmAccessSet(actions: $actions, user: $user, revoke: $revoke, ref: $ref) {
        success
      }
    }
  `;

  export class Component extends React.Component<Partial<ReactApollo.MutationProps<Mutation, Variables>>> {
    render() {
      return (
        <ReactApollo.Mutation<Mutation, Variables>
          mutation={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }

  export type Props<TChildProps = any> = Partial<ReactApollo.MutateProps<Mutation, Variables>> &
    TChildProps;
  export type MutationFn = ReactApollo.MutationFn<Mutation, Variables>;

  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<TProps,
      Mutation,
      Variables,
      Props<TChildProps>>
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
    mutation VDIAttach($vmRef: ID!, $vdiRef: ID!) {
      vdiAttach(vmRef: $vmRef, vdiRef: $vdiRef, isAttach: true) {
        taskId
      }
    }
  `;

  export class Component extends React.Component<Partial<ReactApollo.MutationProps<Mutation, Variables>>> {
    render() {
      return (
        <ReactApollo.Mutation<Mutation, Variables>
          mutation={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }

  export type Props<TChildProps = any> = Partial<ReactApollo.MutateProps<Mutation, Variables>> &
    TChildProps;
  export type MutationFn = ReactApollo.MutationFn<Mutation, Variables>;

  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<TProps,
      Mutation,
      Variables,
      Props<TChildProps>>
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
    mutation VDIDetach($vmRef: ID!, $vdiRef: ID!) {
      vdiAttach(vmRef: $vmRef, vdiRef: $vdiRef, isAttach: false) {
        taskId
      }
    }
  `;

  export class Component extends React.Component<Partial<ReactApollo.MutationProps<Mutation, Variables>>> {
    render() {
      return (
        <ReactApollo.Mutation<Mutation, Variables>
          mutation={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }

  export type Props<TChildProps = any> = Partial<ReactApollo.MutateProps<Mutation, Variables>> &
    TChildProps;
  export type MutationFn = ReactApollo.MutationFn<Mutation, Variables>;

  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<TProps,
      Mutation,
      Variables,
      Props<TChildProps>>
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
    mutation NetAttach($vmRef: ID!, $netRef: ID!) {
      netAttach(vmRef: $vmRef, netRef: $netRef, isAttach: true) {
        taskId
      }
    }
  `;

  export class Component extends React.Component<Partial<ReactApollo.MutationProps<Mutation, Variables>>> {
    render() {
      return (
        <ReactApollo.Mutation<Mutation, Variables>
          mutation={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }

  export type Props<TChildProps = any> = Partial<ReactApollo.MutateProps<Mutation, Variables>> &
    TChildProps;
  export type MutationFn = ReactApollo.MutationFn<Mutation, Variables>;

  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<TProps,
      Mutation,
      Variables,
      Props<TChildProps>>
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
    mutation NetDetach($vmRef: ID!, $netRef: ID!) {
      netAttach(vmRef: $vmRef, netRef: $netRef, isAttach: false) {
        taskId
      }
    }
  `;

  export class Component extends React.Component<Partial<ReactApollo.MutationProps<Mutation, Variables>>> {
    render() {
      return (
        <ReactApollo.Mutation<Mutation, Variables>
          mutation={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }

  export type Props<TChildProps = any> = Partial<ReactApollo.MutateProps<Mutation, Variables>> &
    TChildProps;
  export type MutationFn = ReactApollo.MutationFn<Mutation, Variables>;

  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<TProps,
      Mutation,
      Variables,
      Props<TChildProps>>
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
      console(vmRef: $id)
    }
  `;

  export class Component extends React.Component<Partial<ReactApollo.QueryProps<Query, Variables>>> {
    render() {
      return (
        <ReactApollo.Query<Query, Variables>
          query={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }

  export type Props<TChildProps = any> = Partial<ReactApollo.DataProps<Query, Variables>> &
    TChildProps;

  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<TProps,
      Query,
      Variables,
      Props<TChildProps>>
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
      $vmOptions: VMInput!
      $disks: [NewVDI]
      $installParams: AutoInstall
      $iso: ID
      $template: ID!
      $network: ID
    ) {
      createVm(
        disks: $disks
        installParams: $installParams
        template: $template
        network: $network
        iso: $iso
        vmOptions: $vmOptions
      ) {
        taskId
        granted
        reason
      }
    }
  `;

  export class Component extends React.Component<Partial<ReactApollo.MutationProps<Mutation, Variables>>> {
    render() {
      return (
        <ReactApollo.Mutation<Mutation, Variables>
          mutation={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }

  export type Props<TChildProps = any> = Partial<ReactApollo.MutateProps<Mutation, Variables>> &
    TChildProps;
  export type MutationFn = ReactApollo.MutationFn<Mutation, Variables>;

  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<TProps,
      Mutation,
      Variables,
      Props<TChildProps>>
      | undefined
  ) {
    return ReactApollo.graphql<TProps, Mutation, Variables, Props<TChildProps>>(
      Document,
      operationOptions
    );
  }
}
export namespace CurrentUser {
  export const Document = gql`
    query CurrentUser {
      currentUser {
        user {
          ...UserFragment
        }
        groups {
          ...UserFragment
        }
        isAdmin
      }
    }

    ${UserFragment.FragmentDoc}
  `;

  export class Component extends React.Component<Partial<ReactApollo.QueryProps<Query, Variables>>> {
    render() {
      return (
        <ReactApollo.Query<Query, Variables>
          query={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }

  export type Props<TChildProps = any> = Partial<ReactApollo.DataProps<Query, Variables>> &
    TChildProps;

  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<TProps,
      Query,
      Variables,
      Props<TChildProps>>
      | undefined
  ) {
    return ReactApollo.graphql<TProps, Query, Variables, Props<TChildProps>>(
      Document,
      operationOptions
    );
  }
}
export namespace DeleteTemplate {
  export const Document = gql`
    mutation DeleteTemplate($ref: ID!) {
      templateDelete(ref: $ref) {
        taskId
      }
    }
  `;

  export class Component extends React.Component<Partial<ReactApollo.MutationProps<Mutation, Variables>>> {
    render() {
      return (
        <ReactApollo.Mutation<Mutation, Variables>
          mutation={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }

  export type Props<TChildProps = any> = Partial<ReactApollo.MutateProps<Mutation, Variables>> &
    TChildProps;
  export type MutationFn = ReactApollo.MutationFn<Mutation, Variables>;

  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<TProps,
      Mutation,
      Variables,
      Props<TChildProps>>
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
    mutation DeleteVM($ref: ID!) {
      vmDelete(ref: $ref) {
        taskId
      }
    }
  `;

  export class Component extends React.Component<Partial<ReactApollo.MutationProps<Mutation, Variables>>> {
    render() {
      return (
        <ReactApollo.Mutation<Mutation, Variables>
          mutation={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }

  export type Props<TChildProps = any> = Partial<ReactApollo.MutateProps<Mutation, Variables>> &
    TChildProps;
  export type MutationFn = ReactApollo.MutationFn<Mutation, Variables>;

  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<TProps,
      Mutation,
      Variables,
      Props<TChildProps>>
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
        reason
        granted
      }
    }
  `;

  export class Component extends React.Component<Partial<ReactApollo.MutationProps<Mutation, Variables>>> {
    render() {
      return (
        <ReactApollo.Mutation<Mutation, Variables>
          mutation={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }

  export type Props<TChildProps = any> = Partial<ReactApollo.MutateProps<Mutation, Variables>> &
    TChildProps;
  export type MutationFn = ReactApollo.MutationFn<Mutation, Variables>;

  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<TProps,
      Mutation,
      Variables,
      Props<TChildProps>>
      | undefined
  ) {
    return ReactApollo.graphql<TProps, Mutation, Variables, Props<TChildProps>>(
      Document,
      operationOptions
    );
  }
}
export namespace FilterUsers {
  export const Document = gql`
    query FilterUsers($query: String!) {
      findUser(query: $query) {
        ...UserFragment
      }
    }

    ${UserFragment.FragmentDoc}
  `;

  export class Component extends React.Component<Partial<ReactApollo.QueryProps<Query, Variables>>> {
    render() {
      return (
        <ReactApollo.Query<Query, Variables>
          query={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }

  export type Props<TChildProps = any> = Partial<ReactApollo.DataProps<Query, Variables>> &
    TChildProps;

  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<TProps,
      Query,
      Variables,
      Props<TChildProps>>
      | undefined
  ) {
    return ReactApollo.graphql<TProps, Query, Variables, Props<TChildProps>>(
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

  export class Component extends React.Component<Partial<ReactApollo.QueryProps<Query, Variables>>> {
    render() {
      return (
        <ReactApollo.Query<Query, Variables>
          query={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }

  export type Props<TChildProps = any> = Partial<ReactApollo.DataProps<Query, Variables>> &
    TChildProps;

  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<TProps,
      Query,
      Variables,
      Props<TChildProps>>
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
          ...DeletedFragment
        }
        changeType
      }
    }

    ${HostListFragment.FragmentDoc}
    ${DeletedFragment.FragmentDoc}
  `;

  export class Component extends React.Component<Partial<ReactApollo.SubscriptionProps<Subscription, Variables>>> {
    render() {
      return (
        <ReactApollo.Subscription<Subscription, Variables>
          subscription={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }

  export type Props<TChildProps = any> = Partial<ReactApollo.DataProps<Subscription, Variables>> &
    TChildProps;

  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<TProps,
      Subscription,
      Variables,
      Props<TChildProps>>
      | undefined
  ) {
    return ReactApollo.graphql<TProps,
      Subscription,
      Variables,
      Props<TChildProps>>(Document, operationOptions);
  }
}
export namespace IsosCreateVmList {
  export const Document = gql`
    query ISOSCreateVMList {
      vdis(onlyIsos: true) {
        ...ISOCreateVMListFragment
      }
    }

    ${IsoCreateVmListFragment.FragmentDoc}
  `;

  export class Component extends React.Component<Partial<ReactApollo.QueryProps<Query, Variables>>> {
    render() {
      return (
        <ReactApollo.Query<Query, Variables>
          query={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }

  export type Props<TChildProps = any> = Partial<ReactApollo.DataProps<Query, Variables>> &
    TChildProps;

  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<TProps,
      Query,
      Variables,
      Props<TChildProps>>
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

  export class Component extends React.Component<Partial<ReactApollo.QueryProps<Query, Variables>>> {
    render() {
      return (
        <ReactApollo.Query<Query, Variables>
          query={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }

  export type Props<TChildProps = any> = Partial<ReactApollo.DataProps<Query, Variables>> &
    TChildProps;

  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<TProps,
      Query,
      Variables,
      Props<TChildProps>>
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

  export class Component extends React.Component<Partial<ReactApollo.MutationProps<Mutation, Variables>>> {
    render() {
      return (
        <ReactApollo.Mutation<Mutation, Variables>
          mutation={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }

  export type Props<TChildProps = any> = Partial<ReactApollo.MutateProps<Mutation, Variables>> &
    TChildProps;
  export type MutationFn = ReactApollo.MutationFn<Mutation, Variables>;

  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<TProps,
      Mutation,
      Variables,
      Props<TChildProps>>
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

  export class Component extends React.Component<Partial<ReactApollo.MutationProps<Mutation, Variables>>> {
    render() {
      return (
        <ReactApollo.Mutation<Mutation, Variables>
          mutation={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }

  export type Props<TChildProps = any> = Partial<ReactApollo.MutateProps<Mutation, Variables>> &
    TChildProps;
  export type MutationFn = ReactApollo.MutationFn<Mutation, Variables>;

  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<TProps,
      Mutation,
      Variables,
      Props<TChildProps>>
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

  export class Component extends React.Component<Partial<ReactApollo.QueryProps<Query, Variables>>> {
    render() {
      return (
        <ReactApollo.Query<Query, Variables>
          query={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }

  export type Props<TChildProps = any> = Partial<ReactApollo.DataProps<Query, Variables>> &
    TChildProps;

  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<TProps,
      Query,
      Variables,
      Props<TChildProps>>
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

  export class Component extends React.Component<Partial<ReactApollo.MutationProps<Mutation, Variables>>> {
    render() {
      return (
        <ReactApollo.Mutation<Mutation, Variables>
          mutation={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }

  export type Props<TChildProps = any> = Partial<ReactApollo.MutateProps<Mutation, Variables>> &
    TChildProps;
  export type MutationFn = ReactApollo.MutationFn<Mutation, Variables>;

  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<TProps,
      Mutation,
      Variables,
      Props<TChildProps>>
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

  export class Component extends React.Component<Partial<ReactApollo.MutationProps<Mutation, Variables>>> {
    render() {
      return (
        <ReactApollo.Mutation<Mutation, Variables>
          mutation={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }

  export type Props<TChildProps = any> = Partial<ReactApollo.MutateProps<Mutation, Variables>> &
    TChildProps;
  export type MutationFn = ReactApollo.MutationFn<Mutation, Variables>;

  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<TProps,
      Mutation,
      Variables,
      Props<TChildProps>>
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

  export class Component extends React.Component<Partial<ReactApollo.QueryProps<Query, Variables>>> {
    render() {
      return (
        <ReactApollo.Query<Query, Variables>
          query={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }

  export type Props<TChildProps = any> = Partial<ReactApollo.DataProps<Query, Variables>> &
    TChildProps;

  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<TProps,
      Query,
      Variables,
      Props<TChildProps>>
      | undefined
  ) {
    return ReactApollo.graphql<TProps, Query, Variables, Props<TChildProps>>(
      Document,
      operationOptions
    );
  }
}
export namespace TemplateTableSelection {
  export const Document = gql`
    query TemplateTableSelection {
      selectedItems(tableId: Templates) @client
    }
  `;

  export class Component extends React.Component<Partial<ReactApollo.QueryProps<Query, Variables>>> {
    render() {
      return (
        <ReactApollo.Query<Query, Variables>
          query={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }

  export type Props<TChildProps = any> = Partial<ReactApollo.DataProps<Query, Variables>> &
    TChildProps;

  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<TProps,
      Query,
      Variables,
      Props<TChildProps>>
      | undefined
  ) {
    return ReactApollo.graphql<TProps, Query, Variables, Props<TChildProps>>(
      Document,
      operationOptions
    );
  }
}
export namespace TemplateTableSelect {
  export const Document = gql`
    mutation TemplateTableSelect($item: ID!, $isSelect: Boolean!) {
      selectedItems(tableId: Templates, items: [$item], isSelect: $isSelect)
      @client
    }
  `;

  export class Component extends React.Component<Partial<ReactApollo.MutationProps<Mutation, Variables>>> {
    render() {
      return (
        <ReactApollo.Mutation<Mutation, Variables>
          mutation={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }

  export type Props<TChildProps = any> = Partial<ReactApollo.MutateProps<Mutation, Variables>> &
    TChildProps;
  export type MutationFn = ReactApollo.MutationFn<Mutation, Variables>;

  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<TProps,
      Mutation,
      Variables,
      Props<TChildProps>>
      | undefined
  ) {
    return ReactApollo.graphql<TProps, Mutation, Variables, Props<TChildProps>>(
      Document,
      operationOptions
    );
  }
}
export namespace TemplateTableSelectAll {
  export const Document = gql`
    mutation TemplateTableSelectAll($items: [ID!]!, $isSelect: Boolean!) {
      selectedItems(tableId: Templates, items: $items, isSelect: $isSelect)
      @client
    }
  `;

  export class Component extends React.Component<Partial<ReactApollo.MutationProps<Mutation, Variables>>> {
    render() {
      return (
        <ReactApollo.Mutation<Mutation, Variables>
          mutation={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }

  export type Props<TChildProps = any> = Partial<ReactApollo.MutateProps<Mutation, Variables>> &
    TChildProps;
  export type MutationFn = ReactApollo.MutationFn<Mutation, Variables>;

  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<TProps,
      Mutation,
      Variables,
      Props<TChildProps>>
      | undefined
  ) {
    return ReactApollo.graphql<TProps, Mutation, Variables, Props<TChildProps>>(
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

  export class Component extends React.Component<Partial<ReactApollo.QueryProps<Query, Variables>>> {
    render() {
      return (
        <ReactApollo.Query<Query, Variables>
          query={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }

  export type Props<TChildProps = any> = Partial<ReactApollo.DataProps<Query, Variables>> &
    TChildProps;

  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<TProps,
      Query,
      Variables,
      Props<TChildProps>>
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

  export class Component extends React.Component<Partial<ReactApollo.MutationProps<Mutation, Variables>>> {
    render() {
      return (
        <ReactApollo.Mutation<Mutation, Variables>
          mutation={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }

  export type Props<TChildProps = any> = Partial<ReactApollo.MutateProps<Mutation, Variables>> &
    TChildProps;
  export type MutationFn = ReactApollo.MutationFn<Mutation, Variables>;

  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<TProps,
      Mutation,
      Variables,
      Props<TChildProps>>
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

  export class Component extends React.Component<Partial<ReactApollo.MutationProps<Mutation, Variables>>> {
    render() {
      return (
        <ReactApollo.Mutation<Mutation, Variables>
          mutation={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }

  export type Props<TChildProps = any> = Partial<ReactApollo.MutateProps<Mutation, Variables>> &
    TChildProps;
  export type MutationFn = ReactApollo.MutationFn<Mutation, Variables>;

  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<TProps,
      Mutation,
      Variables,
      Props<TChildProps>>
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
        ref
        powerState
      }
    }
  `;

  export class Component extends React.Component<Partial<ReactApollo.QueryProps<Query, Variables>>> {
    render() {
      return (
        <ReactApollo.Query<Query, Variables>
          query={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }

  export type Props<TChildProps = any> = Partial<ReactApollo.DataProps<Query, Variables>> &
    TChildProps;

  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<TProps,
      Query,
      Variables,
      Props<TChildProps>>
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

  export class Component extends React.Component<Partial<ReactApollo.QueryProps<Query, Variables>>> {
    render() {
      return (
        <ReactApollo.Query<Query, Variables>
          query={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }

  export type Props<TChildProps = any> = Partial<ReactApollo.DataProps<Query, Variables>> &
    TChildProps;

  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<TProps,
      Query,
      Variables,
      Props<TChildProps>>
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

  export class Component extends React.Component<Partial<ReactApollo.QueryProps<Query, Variables>>> {
    render() {
      return (
        <ReactApollo.Query<Query, Variables>
          query={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }

  export type Props<TChildProps = any> = Partial<ReactApollo.DataProps<Query, Variables>> &
    TChildProps;

  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<TProps,
      Query,
      Variables,
      Props<TChildProps>>
      | undefined
  ) {
    return ReactApollo.graphql<TProps, Query, Variables, Props<TChildProps>>(
      Document,
      operationOptions
    );
  }
}
export namespace PauseVm {
  export const Document = gql`
    mutation PauseVM($ref: ID!) {
      vmPause(ref: $ref) {
        taskId
        granted
        reason
      }
    }
  `;

  export class Component extends React.Component<Partial<ReactApollo.MutationProps<Mutation, Variables>>> {
    render() {
      return (
        <ReactApollo.Mutation<Mutation, Variables>
          mutation={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }

  export type Props<TChildProps = any> = Partial<ReactApollo.MutateProps<Mutation, Variables>> &
    TChildProps;
  export type MutationFn = ReactApollo.MutationFn<Mutation, Variables>;

  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<TProps,
      Mutation,
      Variables,
      Props<TChildProps>>
      | undefined
  ) {
    return ReactApollo.graphql<TProps, Mutation, Variables, Props<TChildProps>>(
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

  export class Component extends React.Component<Partial<ReactApollo.MutationProps<Mutation, Variables>>> {
    render() {
      return (
        <ReactApollo.Mutation<Mutation, Variables>
          mutation={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }

  export type Props<TChildProps = any> = Partial<ReactApollo.MutateProps<Mutation, Variables>> &
    TChildProps;
  export type MutationFn = ReactApollo.MutationFn<Mutation, Variables>;

  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<TProps,
      Mutation,
      Variables,
      Props<TChildProps>>
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

  export class Component extends React.Component<Partial<ReactApollo.QueryProps<Query, Variables>>> {
    render() {
      return (
        <ReactApollo.Query<Query, Variables>
          query={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }

  export type Props<TChildProps = any> = Partial<ReactApollo.DataProps<Query, Variables>> &
    TChildProps;

  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<TProps,
      Query,
      Variables,
      Props<TChildProps>>
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

  export class Component extends React.Component<Partial<ReactApollo.SubscriptionProps<Subscription, Variables>>> {
    render() {
      return (
        <ReactApollo.Subscription<Subscription, Variables>
          subscription={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }

  export type Props<TChildProps = any> = Partial<ReactApollo.DataProps<Subscription, Variables>> &
    TChildProps;

  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<TProps,
      Subscription,
      Variables,
      Props<TChildProps>>
      | undefined
  ) {
    return ReactApollo.graphql<TProps,
      Subscription,
      Variables,
      Props<TChildProps>>(Document, operationOptions);
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

  export class Component extends React.Component<Partial<ReactApollo.QueryProps<Query, Variables>>> {
    render() {
      return (
        <ReactApollo.Query<Query, Variables>
          query={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }

  export type Props<TChildProps = any> = Partial<ReactApollo.DataProps<Query, Variables>> &
    TChildProps;

  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<TProps,
      Query,
      Variables,
      Props<TChildProps>>
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

  export class Component extends React.Component<Partial<ReactApollo.QueryProps<Query, Variables>>> {
    render() {
      return (
        <ReactApollo.Query<Query, Variables>
          query={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }

  export type Props<TChildProps = any> = Partial<ReactApollo.DataProps<Query, Variables>> &
    TChildProps;

  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<TProps,
      Query,
      Variables,
      Props<TChildProps>>
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
          ...DeletedFragment
        }
        changeType
      }
    }

    ${PoolListFragment.FragmentDoc}
    ${DeletedFragment.FragmentDoc}
  `;

  export class Component extends React.Component<Partial<ReactApollo.SubscriptionProps<Subscription, Variables>>> {
    render() {
      return (
        <ReactApollo.Subscription<Subscription, Variables>
          subscription={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }

  export type Props<TChildProps = any> = Partial<ReactApollo.DataProps<Subscription, Variables>> &
    TChildProps;

  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<TProps,
      Subscription,
      Variables,
      Props<TChildProps>>
      | undefined
  ) {
    return ReactApollo.graphql<TProps,
      Subscription,
      Variables,
      Props<TChildProps>>(Document, operationOptions);
  }
}
export namespace RebootVm {
  export const Document = gql`
    mutation RebootVm($ref: ID!, $force: ShutdownForce) {
      vmReboot(ref: $ref, force: $force) {
        taskId
      }
    }
  `;

  export class Component extends React.Component<Partial<ReactApollo.MutationProps<Mutation, Variables>>> {
    render() {
      return (
        <ReactApollo.Mutation<Mutation, Variables>
          mutation={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }

  export type Props<TChildProps = any> = Partial<ReactApollo.MutateProps<Mutation, Variables>> &
    TChildProps;
  export type MutationFn = ReactApollo.MutationFn<Mutation, Variables>;

  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<TProps,
      Mutation,
      Variables,
      Props<TChildProps>>
      | undefined
  ) {
    return ReactApollo.graphql<TProps, Mutation, Variables, Props<TChildProps>>(
      Document,
      operationOptions
    );
  }
}
export namespace TemplateSetEnabled {
  export const Document = gql`
    mutation TemplateSetEnabled($template: TemplateInput!) {
      template(template: $template) {
        granted
        reason
      }
    }
  `;

  export class Component extends React.Component<Partial<ReactApollo.MutationProps<Mutation, Variables>>> {
    render() {
      return (
        <ReactApollo.Mutation<Mutation, Variables>
          mutation={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }

  export type Props<TChildProps = any> = Partial<ReactApollo.MutateProps<Mutation, Variables>> &
    TChildProps;
  export type MutationFn = ReactApollo.MutationFn<Mutation, Variables>;

  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<TProps,
      Mutation,
      Variables,
      Props<TChildProps>>
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
    mutation ShutdownVM($ref: ID!, $force: ShutdownForce) {
      vmShutdown(ref: $ref, force: $force) {
        taskId
      }
    }
  `;

  export class Component extends React.Component<Partial<ReactApollo.MutationProps<Mutation, Variables>>> {
    render() {
      return (
        <ReactApollo.Mutation<Mutation, Variables>
          mutation={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }

  export type Props<TChildProps = any> = Partial<ReactApollo.MutateProps<Mutation, Variables>> &
    TChildProps;
  export type MutationFn = ReactApollo.MutationFn<Mutation, Variables>;

  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<TProps,
      Mutation,
      Variables,
      Props<TChildProps>>
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
    mutation StartVM($ref: ID!, $options: VMStartInput) {
      vmStart(ref: $ref, options: $options) {
        granted
        taskId
        reason
      }
    }
  `;

  export class Component extends React.Component<Partial<ReactApollo.MutationProps<Mutation, Variables>>> {
    render() {
      return (
        <ReactApollo.Mutation<Mutation, Variables>
          mutation={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }

  export type Props<TChildProps = any> = Partial<ReactApollo.MutateProps<Mutation, Variables>> &
    TChildProps;
  export type MutationFn = ReactApollo.MutationFn<Mutation, Variables>;

  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<TProps,
      Mutation,
      Variables,
      Props<TChildProps>>
      | undefined
  ) {
    return ReactApollo.graphql<TProps, Mutation, Variables, Props<TChildProps>>(
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

  export class Component extends React.Component<Partial<ReactApollo.QueryProps<Query, Variables>>> {
    render() {
      return (
        <ReactApollo.Query<Query, Variables>
          query={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }

  export type Props<TChildProps = any> = Partial<ReactApollo.DataProps<Query, Variables>> &
    TChildProps;

  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<TProps,
      Query,
      Variables,
      Props<TChildProps>>
      | undefined
  ) {
    return ReactApollo.graphql<TProps, Query, Variables, Props<TChildProps>>(
      Document,
      operationOptions
    );
  }
}
export namespace SuspendVm {
  export const Document = gql`
    mutation SuspendVM($ref: ID!) {
      vmSuspend(ref: $ref) {
        taskId
        granted
        reason
      }
    }
  `;

  export class Component extends React.Component<Partial<ReactApollo.MutationProps<Mutation, Variables>>> {
    render() {
      return (
        <ReactApollo.Mutation<Mutation, Variables>
          mutation={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }

  export type Props<TChildProps = any> = Partial<ReactApollo.MutateProps<Mutation, Variables>> &
    TChildProps;
  export type MutationFn = ReactApollo.MutationFn<Mutation, Variables>;

  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<TProps,
      Mutation,
      Variables,
      Props<TChildProps>>
      | undefined
  ) {
    return ReactApollo.graphql<TProps, Mutation, Variables, Props<TChildProps>>(
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
          ...TaskFragment
          ...DeletedFragment
        }
        changeType
      }
    }

    ${TaskFragment.FragmentDoc}
    ${DeletedFragment.FragmentDoc}
  `;

  export class Component extends React.Component<Partial<ReactApollo.SubscriptionProps<Subscription, Variables>>> {
    render() {
      return (
        <ReactApollo.Subscription<Subscription, Variables>
          subscription={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }

  export type Props<TChildProps = any> = Partial<ReactApollo.DataProps<Subscription, Variables>> &
    TChildProps;

  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<TProps,
      Subscription,
      Variables,
      Props<TChildProps>>
      | undefined
  ) {
    return ReactApollo.graphql<TProps,
      Subscription,
      Variables,
      Props<TChildProps>>(Document, operationOptions);
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

  export class Component extends React.Component<Partial<ReactApollo.QueryProps<Query, Variables>>> {
    render() {
      return (
        <ReactApollo.Query<Query, Variables>
          query={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }

  export type Props<TChildProps = any> = Partial<ReactApollo.DataProps<Query, Variables>> &
    TChildProps;

  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<TProps,
      Query,
      Variables,
      Props<TChildProps>>
      | undefined
  ) {
    return ReactApollo.graphql<TProps, Query, Variables, Props<TChildProps>>(
      Document,
      operationOptions
    );
  }
}
export namespace TemplateListUpdate {
  export const Document = gql`
    subscription TemplateListUpdate {
      templates {
        value {
          ...TemplateListFragment
          ...DeletedFragment
        }
        changeType
      }
    }

    ${TemplateListFragment.FragmentDoc}
    ${DeletedFragment.FragmentDoc}
  `;

  export class Component extends React.Component<Partial<ReactApollo.SubscriptionProps<Subscription, Variables>>> {
    render() {
      return (
        <ReactApollo.Subscription<Subscription, Variables>
          subscription={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }

  export type Props<TChildProps = any> = Partial<ReactApollo.DataProps<Subscription, Variables>> &
    TChildProps;

  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<TProps,
      Subscription,
      Variables,
      Props<TChildProps>>
      | undefined
  ) {
    return ReactApollo.graphql<TProps,
      Subscription,
      Variables,
      Props<TChildProps>>(Document, operationOptions);
  }
}
export namespace StorageAttachVdiList {
  export const Document = gql`
    query StorageAttachVDIList {
      vdis(onlyIsos: false) {
        ...StorageAttachVDIListFragment
      }
    }

    ${StorageAttachVdiListFragment.FragmentDoc}
  `;

  export class Component extends React.Component<Partial<ReactApollo.QueryProps<Query, Variables>>> {
    render() {
      return (
        <ReactApollo.Query<Query, Variables>
          query={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }

  export type Props<TChildProps = any> = Partial<ReactApollo.DataProps<Query, Variables>> &
    TChildProps;

  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<TProps,
      Query,
      Variables,
      Props<TChildProps>>
      | undefined
  ) {
    return ReactApollo.graphql<TProps, Query, Variables, Props<TChildProps>>(
      Document,
      operationOptions
    );
  }
}
export namespace StorageAttachIsoList {
  export const Document = gql`
    query StorageAttachISOList {
      vdis(onlyIsos: true) {
        ...StorageAttachVDIListFragment
      }
    }

    ${StorageAttachVdiListFragment.FragmentDoc}
  `;

  export class Component extends React.Component<Partial<ReactApollo.QueryProps<Query, Variables>>> {
    render() {
      return (
        <ReactApollo.Query<Query, Variables>
          query={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }

  export type Props<TChildProps = any> = Partial<ReactApollo.DataProps<Query, Variables>> &
    TChildProps;

  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<TProps,
      Query,
      Variables,
      Props<TChildProps>>
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
    query VMInfo($ref: ID!) {
      vm(ref: $ref) {
        ...VMInfoFragment
      }
    }

    ${VmInfoFragment.FragmentDoc}
  `;

  export class Component extends React.Component<Partial<ReactApollo.QueryProps<Query, Variables>>> {
    render() {
      return (
        <ReactApollo.Query<Query, Variables>
          query={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }

  export type Props<TChildProps = any> = Partial<ReactApollo.DataProps<Query, Variables>> &
    TChildProps;

  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<TProps,
      Query,
      Variables,
      Props<TChildProps>>
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
    subscription VMInfoUpdate($ref: ID!) {
      vm(ref: $ref) {
        ...VMInfoFragment
      }
    }

    ${VmInfoFragment.FragmentDoc}
  `;

  export class Component extends React.Component<Partial<ReactApollo.SubscriptionProps<Subscription, Variables>>> {
    render() {
      return (
        <ReactApollo.Subscription<Subscription, Variables>
          subscription={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }

  export type Props<TChildProps = any> = Partial<ReactApollo.DataProps<Subscription, Variables>> &
    TChildProps;

  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<TProps,
      Subscription,
      Variables,
      Props<TChildProps>>
      | undefined
  ) {
    return ReactApollo.graphql<TProps,
      Subscription,
      Variables,
      Props<TChildProps>>(Document, operationOptions);
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

  export class Component extends React.Component<Partial<ReactApollo.QueryProps<Query, Variables>>> {
    render() {
      return (
        <ReactApollo.Query<Query, Variables>
          query={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }

  export type Props<TChildProps = any> = Partial<ReactApollo.DataProps<Query, Variables>> &
    TChildProps;

  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<TProps,
      Query,
      Variables,
      Props<TChildProps>>
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
          ...DeletedFragment
        }
        changeType
      }
    }

    ${VmListFragment.FragmentDoc}
    ${DeletedFragment.FragmentDoc}
  `;

  export class Component extends React.Component<Partial<ReactApollo.SubscriptionProps<Subscription, Variables>>> {
    render() {
      return (
        <ReactApollo.Subscription<Subscription, Variables>
          subscription={Document}
          {...(this as any)["props"] as any}
        />
      );
    }
  }

  export type Props<TChildProps = any> = Partial<ReactApollo.DataProps<Subscription, Variables>> &
    TChildProps;

  export function HOC<TProps, TChildProps = any>(
    operationOptions:
      | ReactApollo.OperationOption<TProps,
      Subscription,
      Variables,
      Props<TChildProps>>
      | undefined
  ) {
    return ReactApollo.graphql<TProps,
      Subscription,
      Variables,
      Props<TChildProps>>(Document, operationOptions);
  }
}
import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig
} from "graphql";

export type Resolver<Result, Parent = {}, TContext = {}, Args = {}> = (
  parent: Parent,
  args: Args,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<Result> | Result;

export interface ISubscriptionResolverObject<Result, Parent, TContext, Args> {
  subscribe<R = Result, P = Parent>(
    parent: P,
    args: Args,
    context: TContext,
    info: GraphQLResolveInfo
  ): AsyncIterator<R | Result> | Promise<AsyncIterator<R | Result>>;

  resolve?<R = Result, P = Parent>(
    parent: P,
    args: Args,
    context: TContext,
    info: GraphQLResolveInfo
  ): R | Result | Promise<R | Result>;
}

export type SubscriptionResolver<Result,
  Parent = {},
  TContext = {},
  Args = {}> =
  | ((
  ...args: any[]
) => ISubscriptionResolverObject<Result, Parent, TContext, Args>)
  | ISubscriptionResolverObject<Result, Parent, TContext, Args>;

export type TypeResolveFn<Types, Parent = {}, TContext = {}> = (
  parent: Parent,
  context: TContext,
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
  export interface Resolvers<TContext = {}, TypeParent = {}> {
    /** All VMs available to user */
    vms?: VmsResolver<(Maybe<Gvm>)[], TypeParent, TContext>;

    vm?: VmResolver<Maybe<Gvm>, TypeParent, TContext>;
    /** All Templates available to user */
    templates?: TemplatesResolver<(Maybe<GTemplate>)[], TypeParent, TContext>;

    template?: TemplateResolver<Maybe<Gvm>, TypeParent, TContext>;

    hosts?: HostsResolver<(Maybe<GHost>)[], TypeParent, TContext>;

    host?: HostResolver<Maybe<GHost>, TypeParent, TContext>;

    pools?: PoolsResolver<(Maybe<GPool>)[], TypeParent, TContext>;

    pool?: PoolResolver<Maybe<GPool>, TypeParent, TContext>;
    /** All Networks available to user */
    networks?: NetworksResolver<(Maybe<GNetwork>)[], TypeParent, TContext>;
    /** Information about a single network */
    network?: NetworkResolver<Maybe<GNetwork>, TypeParent, TContext>;
    /** All Storage repositories available to user */
    srs?: SrsResolver<(Maybe<Gsr>)[], TypeParent, TContext>;
    /** Information about a single storage repository */
    sr?: SrResolver<Maybe<Gsr>, TypeParent, TContext>;
    /** All Virtual Disk Images (hard disks), available for user */
    vdis?: VdisResolver<(Maybe<Gvdi>)[], TypeParent, TContext>;
    /** Information about a single virtual disk image (hard disk) */
    vdi?: VdiResolver<Maybe<Gvdi>, TypeParent, TContext>;
    /** List of Ansible-powered playbooks */
    playbooks?: PlaybooksResolver<(Maybe<GPlaybook>)[], TypeParent, TContext>;
    /** Information about Ansible-powered playbook */
    playbook?: PlaybookResolver<Maybe<GPlaybook>, TypeParent, TContext>;
    /** Info about a playbook task */
    playbookTask?: PlaybookTaskResolver<Maybe<PlaybookTask>,
      TypeParent,
      TContext>;
    /** All Playbook Tasks */
    playbookTasks?: PlaybookTasksResolver<(Maybe<PlaybookTask>)[],
      TypeParent,
      TContext>;
    /** One-time link to RFB console for a VM */
    console?: ConsoleResolver<Maybe<string>, TypeParent, TContext>;
    /** All registered users (excluding root) */
    users?: UsersResolver<(Maybe<User>)[], TypeParent, TContext>;
    /** All registered groups */
    groups?: GroupsResolver<(Maybe<User>)[], TypeParent, TContext>;
    /** User or group information */
    user?: UserResolver<Maybe<User>, TypeParent, TContext>;
    /** current user or group information */
    currentUser?: CurrentUserResolver<Maybe<CurrentUserInformation>,
      TypeParent,
      TContext>;

    findUser?: FindUserResolver<(Maybe<User>)[], TypeParent, TContext>;

    selectedItems?: SelectedItemsResolver<string[], TypeParent, TContext>;

    vmSelectedReadyFor?: VmSelectedReadyForResolver<VmSelectedIdLists,
      TypeParent,
      TContext>;
  }

  export type VmsResolver<R = (Maybe<Gvm>)[],
    Parent = {},
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type VmResolver<R = Maybe<Gvm>, Parent = {}, TContext = {}> = Resolver<R,
    Parent,
    TContext,
    VmArgs>;

  export interface VmArgs {
    ref: string;
  }

  export type TemplatesResolver<R = (Maybe<GTemplate>)[],
    Parent = {},
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type TemplateResolver<R = Maybe<Gvm>,
    Parent = {},
    TContext = {}> = Resolver<R, Parent, TContext, TemplateArgs>;

  export interface TemplateArgs {
    ref: string;
  }

  export type HostsResolver<R = (Maybe<GHost>)[],
    Parent = {},
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type HostResolver<R = Maybe<GHost>,
    Parent = {},
    TContext = {}> = Resolver<R, Parent, TContext, HostArgs>;

  export interface HostArgs {
    ref: string;
  }

  export type PoolsResolver<R = (Maybe<GPool>)[],
    Parent = {},
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type PoolResolver<R = Maybe<GPool>,
    Parent = {},
    TContext = {}> = Resolver<R, Parent, TContext, PoolArgs>;

  export interface PoolArgs {
    ref: string;
  }

  export type NetworksResolver<R = (Maybe<GNetwork>)[],
    Parent = {},
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type NetworkResolver<R = Maybe<GNetwork>,
    Parent = {},
    TContext = {}> = Resolver<R, Parent, TContext, NetworkArgs>;

  export interface NetworkArgs {
    ref: string;
  }

  export type SrsResolver<R = (Maybe<Gsr>)[],
    Parent = {},
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type SrResolver<R = Maybe<Gsr>, Parent = {}, TContext = {}> = Resolver<R,
    Parent,
    TContext,
    SrArgs>;

  export interface SrArgs {
    ref: string;
  }

  export type VdisResolver<R = (Maybe<Gvdi>)[],
    Parent = {},
    TContext = {}> = Resolver<R, Parent, TContext, VdisArgs>;

  export interface VdisArgs {
    /** True - print only ISO images; False - print everything but ISO images; null - print everything */
    onlyIsos?: Maybe<boolean>;
  }

  export type VdiResolver<R = Maybe<Gvdi>,
    Parent = {},
    TContext = {}> = Resolver<R, Parent, TContext, VdiArgs>;

  export interface VdiArgs {
    ref: string;
  }

  export type PlaybooksResolver<R = (Maybe<GPlaybook>)[],
    Parent = {},
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type PlaybookResolver<R = Maybe<GPlaybook>,
    Parent = {},
    TContext = {}> = Resolver<R, Parent, TContext, PlaybookArgs>;

  export interface PlaybookArgs {
    id?: Maybe<string>;
  }

  export type PlaybookTaskResolver<R = Maybe<PlaybookTask>,
    Parent = {},
    TContext = {}> = Resolver<R, Parent, TContext, PlaybookTaskArgs>;

  export interface PlaybookTaskArgs {
    id: string;
  }

  export type PlaybookTasksResolver<R = (Maybe<PlaybookTask>)[],
    Parent = {},
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type ConsoleResolver<R = Maybe<string>,
    Parent = {},
    TContext = {}> = Resolver<R, Parent, TContext, ConsoleArgs>;

  export interface ConsoleArgs {
    vmRef: string;
  }

  export type UsersResolver<R = (Maybe<User>)[],
    Parent = {},
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type GroupsResolver<R = (Maybe<User>)[],
    Parent = {},
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type UserResolver<R = Maybe<User>,
    Parent = {},
    TContext = {}> = Resolver<R, Parent, TContext, UserArgs>;

  export interface UserArgs {
    id?: Maybe<string>;
  }

  export type CurrentUserResolver<R = Maybe<CurrentUserInformation>,
    Parent = {},
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type FindUserResolver<R = (Maybe<User>)[],
    Parent = {},
    TContext = {}> = Resolver<R, Parent, TContext, FindUserArgs>;

  export interface FindUserArgs {
    query: string;
  }

  export type SelectedItemsResolver<R = string[],
    Parent = {},
    TContext = {}> = Resolver<R, Parent, TContext, SelectedItemsArgs>;

  export interface SelectedItemsArgs {
    tableId: Table;
  }

  export type VmSelectedReadyForResolver<R = VmSelectedIdLists,
    Parent = {},
    TContext = {}> = Resolver<R, Parent, TContext>;
}

export namespace GvmResolvers {
  export interface Resolvers<TContext = {}, TypeParent = Gvm> {
    /** a human-readable name */
    nameLabel?: NameLabelResolver<string, TypeParent, TContext>;
    /** a human-readable description */
    nameDescription?: NameDescriptionResolver<string, TypeParent, TContext>;
    /** Unique constant identifier/object reference (primary) */
    ref?: RefResolver<string, TypeParent, TContext>;
    /** Unique constant identifier/object reference (used in XenCenter) */
    uuid?: UuidResolver<string, TypeParent, TContext>;

    access?: AccessResolver<(Maybe<GvmAccessEntry>)[], TypeParent, TContext>;
    /** CPU platform parameters */
    platform?: PlatformResolver<Maybe<Platform>, TypeParent, TContext>;

    VCPUsAtStartup?: VcpUsAtStartupResolver<number, TypeParent, TContext>;

    VCPUsMax?: VcpUsMaxResolver<number, TypeParent, TContext>;

    domainType?: DomainTypeResolver<DomainType, TypeParent, TContext>;

    guestMetrics?: GuestMetricsResolver<string, TypeParent, TContext>;

    installTime?: InstallTimeResolver<DateTime, TypeParent, TContext>;

    memoryActual?: MemoryActualResolver<number, TypeParent, TContext>;

    memoryStaticMin?: MemoryStaticMinResolver<number, TypeParent, TContext>;

    memoryStaticMax?: MemoryStaticMaxResolver<number, TypeParent, TContext>;

    memoryDynamicMin?: MemoryDynamicMinResolver<number, TypeParent, TContext>;

    memoryDynamicMax?: MemoryDynamicMaxResolver<number, TypeParent, TContext>;

    myActions?: MyActionsResolver<(Maybe<VmActions>)[], TypeParent, TContext>;

    isOwner?: IsOwnerResolver<boolean, TypeParent, TContext>;
    /** True if PV drivers are up to date, reported if Guest Additions are installed */
    PVDriversUpToDate?: PvDriversUpToDateResolver<Maybe<boolean>,
      TypeParent,
      TContext>;
    /** PV drivers version, if available */
    PVDriversVersion?: PvDriversVersionResolver<Maybe<PvDriversVersion>,
      TypeParent,
      TContext>;

    metrics?: MetricsResolver<string, TypeParent, TContext>;

    osVersion?: OsVersionResolver<Maybe<OsVersion>, TypeParent, TContext>;

    powerState?: PowerStateResolver<PowerState, TypeParent, TContext>;

    startTime?: StartTimeResolver<Maybe<DateTime>, TypeParent, TContext>;

    VIFs?: ViFsResolver<(Maybe<Gvif>)[], TypeParent, TContext>;
    /** Virtual block devices */
    VBDs?: VbDsResolver<(Maybe<Gvbd>)[], TypeParent, TContext>;
  }

  export type NameLabelResolver<R = string,
    Parent = Gvm,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type NameDescriptionResolver<R = string,
    Parent = Gvm,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type RefResolver<R = string, Parent = Gvm, TContext = {}> = Resolver<R,
    Parent,
    TContext>;
  export type UuidResolver<R = string, Parent = Gvm, TContext = {}> = Resolver<R,
    Parent,
    TContext>;
  export type AccessResolver<R = (Maybe<GvmAccessEntry>)[],
    Parent = Gvm,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type PlatformResolver<R = Maybe<Platform>,
    Parent = Gvm,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type VcpUsAtStartupResolver<R = number,
    Parent = Gvm,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type VcpUsMaxResolver<R = number,
    Parent = Gvm,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type DomainTypeResolver<R = DomainType,
    Parent = Gvm,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type GuestMetricsResolver<R = string,
    Parent = Gvm,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type InstallTimeResolver<R = DateTime,
    Parent = Gvm,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type MemoryActualResolver<R = number,
    Parent = Gvm,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type MemoryStaticMinResolver<R = number,
    Parent = Gvm,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type MemoryStaticMaxResolver<R = number,
    Parent = Gvm,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type MemoryDynamicMinResolver<R = number,
    Parent = Gvm,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type MemoryDynamicMaxResolver<R = number,
    Parent = Gvm,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type MyActionsResolver<R = (Maybe<VmActions>)[],
    Parent = Gvm,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type IsOwnerResolver<R = boolean,
    Parent = Gvm,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type PvDriversUpToDateResolver<R = Maybe<boolean>,
    Parent = Gvm,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type PvDriversVersionResolver<R = Maybe<PvDriversVersion>,
    Parent = Gvm,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type MetricsResolver<R = string,
    Parent = Gvm,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type OsVersionResolver<R = Maybe<OsVersion>,
    Parent = Gvm,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type PowerStateResolver<R = PowerState,
    Parent = Gvm,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type StartTimeResolver<R = Maybe<DateTime>,
    Parent = Gvm,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type ViFsResolver<R = (Maybe<Gvif>)[],
    Parent = Gvm,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type VbDsResolver<R = (Maybe<Gvbd>)[],
    Parent = Gvm,
    TContext = {}> = Resolver<R, Parent, TContext>;
}

export namespace UserResolvers {
  export interface Resolvers<TContext = {}, TypeParent = User> {
    id?: IdResolver<string, TypeParent, TContext>;

    name?: NameResolver<string, TypeParent, TContext>;

    username?: UsernameResolver<string, TypeParent, TContext>;
  }

  export type IdResolver<R = string, Parent = User, TContext = {}> = Resolver<R,
    Parent,
    TContext>;
  export type NameResolver<R = string, Parent = User, TContext = {}> = Resolver<R,
    Parent,
    TContext>;
  export type UsernameResolver<R = string,
    Parent = User,
    TContext = {}> = Resolver<R, Parent, TContext>;
}

export namespace PlatformResolvers {
  export interface Resolvers<TContext = {}, TypeParent = Platform> {
    coresPerSocket?: CoresPerSocketResolver<Maybe<number>,
      TypeParent,
      TContext>;

    timeoffset?: TimeoffsetResolver<Maybe<number>, TypeParent, TContext>;

    nx?: NxResolver<Maybe<boolean>, TypeParent, TContext>;

    deviceModel?: DeviceModelResolver<Maybe<string>, TypeParent, TContext>;

    pae?: PaeResolver<Maybe<boolean>, TypeParent, TContext>;

    hpet?: HpetResolver<Maybe<boolean>, TypeParent, TContext>;

    apic?: ApicResolver<Maybe<boolean>, TypeParent, TContext>;

    acpi?: AcpiResolver<Maybe<number>, TypeParent, TContext>;

    videoram?: VideoramResolver<Maybe<number>, TypeParent, TContext>;
  }

  export type CoresPerSocketResolver<R = Maybe<number>,
    Parent = Platform,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type TimeoffsetResolver<R = Maybe<number>,
    Parent = Platform,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type NxResolver<R = Maybe<boolean>,
    Parent = Platform,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type DeviceModelResolver<R = Maybe<string>,
    Parent = Platform,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type PaeResolver<R = Maybe<boolean>,
    Parent = Platform,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type HpetResolver<R = Maybe<boolean>,
    Parent = Platform,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type ApicResolver<R = Maybe<boolean>,
    Parent = Platform,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type AcpiResolver<R = Maybe<number>,
    Parent = Platform,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type VideoramResolver<R = Maybe<number>,
    Parent = Platform,
    TContext = {}> = Resolver<R, Parent, TContext>;
}

export namespace GvmAccessEntryResolvers {
  export interface Resolvers<TContext = {}, TypeParent = GvmAccessEntry> {
    userId?: UserIdResolver<User, TypeParent, TContext>;

    actions?: ActionsResolver<VmActions[], TypeParent, TContext>;
  }

  export type UserIdResolver<R = User,
    Parent = GvmAccessEntry,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type ActionsResolver<R = VmActions[],
    Parent = GvmAccessEntry,
    TContext = {}> = Resolver<R, Parent, TContext>;
}
/** Drivers version. We don't want any fancy resolver except for the thing that we know that it's a dict in VM document */
export namespace PvDriversVersionResolvers {
  export interface Resolvers<TContext = {}, TypeParent = PvDriversVersion> {
    major?: MajorResolver<Maybe<number>, TypeParent, TContext>;

    minor?: MinorResolver<Maybe<number>, TypeParent, TContext>;

    micro?: MicroResolver<Maybe<number>, TypeParent, TContext>;

    build?: BuildResolver<Maybe<number>, TypeParent, TContext>;
  }

  export type MajorResolver<R = Maybe<number>,
    Parent = PvDriversVersion,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type MinorResolver<R = Maybe<number>,
    Parent = PvDriversVersion,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type MicroResolver<R = Maybe<number>,
    Parent = PvDriversVersion,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type BuildResolver<R = Maybe<number>,
    Parent = PvDriversVersion,
    TContext = {}> = Resolver<R, Parent, TContext>;
}
/** OS version reported by Xen tools */
export namespace OsVersionResolvers {
  export interface Resolvers<TContext = {}, TypeParent = OsVersion> {
    name?: NameResolver<Maybe<string>, TypeParent, TContext>;

    uname?: UnameResolver<Maybe<string>, TypeParent, TContext>;

    distro?: DistroResolver<Maybe<string>, TypeParent, TContext>;

    major?: MajorResolver<Maybe<number>, TypeParent, TContext>;

    minor?: MinorResolver<Maybe<number>, TypeParent, TContext>;
  }

  export type NameResolver<R = Maybe<string>,
    Parent = OsVersion,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type UnameResolver<R = Maybe<string>,
    Parent = OsVersion,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type DistroResolver<R = Maybe<string>,
    Parent = OsVersion,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type MajorResolver<R = Maybe<number>,
    Parent = OsVersion,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type MinorResolver<R = Maybe<number>,
    Parent = OsVersion,
    TContext = {}> = Resolver<R, Parent, TContext>;
}

export namespace GvifResolvers {
  export interface Resolvers<TContext = {}, TypeParent = Gvif> {
    /** Unique constant identifier/object reference (primary) */
    ref?: RefResolver<string, TypeParent, TContext>;
    /** MAC address */
    MAC?: MacResolver<string, TypeParent, TContext>;

    VM?: VmResolver<Maybe<Gvm>, TypeParent, TContext>;
    /** Device ID */
    device?: DeviceResolver<string, TypeParent, TContext>;

    currentlyAttached?: CurrentlyAttachedResolver<boolean,
      TypeParent,
      TContext>;

    ip?: IpResolver<Maybe<string>, TypeParent, TContext>;

    ipv4?: Ipv4Resolver<Maybe<string>, TypeParent, TContext>;

    ipv6?: Ipv6Resolver<Maybe<string>, TypeParent, TContext>;

    network?: NetworkResolver<Maybe<GNetwork>, TypeParent, TContext>;
  }

  export type RefResolver<R = string, Parent = Gvif, TContext = {}> = Resolver<R,
    Parent,
    TContext>;
  export type MacResolver<R = string, Parent = Gvif, TContext = {}> = Resolver<R,
    Parent,
    TContext>;
  export type VmResolver<R = Maybe<Gvm>,
    Parent = Gvif,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type DeviceResolver<R = string,
    Parent = Gvif,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type CurrentlyAttachedResolver<R = boolean,
    Parent = Gvif,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type IpResolver<R = Maybe<string>,
    Parent = Gvif,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type Ipv4Resolver<R = Maybe<string>,
    Parent = Gvif,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type Ipv6Resolver<R = Maybe<string>,
    Parent = Gvif,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type NetworkResolver<R = Maybe<GNetwork>,
    Parent = Gvif,
    TContext = {}> = Resolver<R, Parent, TContext>;
}

export namespace GNetworkResolvers {
  export interface Resolvers<TContext = {}, TypeParent = GNetwork> {
    /** a human-readable name */
    nameLabel?: NameLabelResolver<string, TypeParent, TContext>;
    /** a human-readable description */
    nameDescription?: NameDescriptionResolver<string, TypeParent, TContext>;
    /** Unique constant identifier/object reference (primary) */
    ref?: RefResolver<string, TypeParent, TContext>;
    /** Unique constant identifier/object reference (used in XenCenter) */
    uuid?: UuidResolver<string, TypeParent, TContext>;

    access?: AccessResolver<(Maybe<GNetworkAccessEntry>)[],
      TypeParent,
      TContext>;

    myActions?: MyActionsResolver<(Maybe<NetworkActions>)[],
      TypeParent,
      TContext>;

    isOwner?: IsOwnerResolver<boolean, TypeParent, TContext>;

    VIFs?: ViFsResolver<Maybe<(Maybe<Gvif>)[]>, TypeParent, TContext>;

    otherConfig?: OtherConfigResolver<Maybe<JsonString>, TypeParent, TContext>;
  }

  export type NameLabelResolver<R = string,
    Parent = GNetwork,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type NameDescriptionResolver<R = string,
    Parent = GNetwork,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type RefResolver<R = string,
    Parent = GNetwork,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type UuidResolver<R = string,
    Parent = GNetwork,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type AccessResolver<R = (Maybe<GNetworkAccessEntry>)[],
    Parent = GNetwork,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type MyActionsResolver<R = (Maybe<NetworkActions>)[],
    Parent = GNetwork,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type IsOwnerResolver<R = boolean,
    Parent = GNetwork,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type ViFsResolver<R = Maybe<(Maybe<Gvif>)[]>,
    Parent = GNetwork,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type OtherConfigResolver<R = Maybe<JsonString>,
    Parent = GNetwork,
    TContext = {}> = Resolver<R, Parent, TContext>;
}

export namespace GNetworkAccessEntryResolvers {
  export interface Resolvers<TContext = {}, TypeParent = GNetworkAccessEntry> {
    userId?: UserIdResolver<User, TypeParent, TContext>;

    actions?: ActionsResolver<NetworkActions, TypeParent, TContext>;
  }

  export type UserIdResolver<R = User,
    Parent = GNetworkAccessEntry,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type ActionsResolver<R = NetworkActions,
    Parent = GNetworkAccessEntry,
    TContext = {}> = Resolver<R, Parent, TContext>;
}

export namespace GvbdResolvers {
  export interface Resolvers<TContext = {}, TypeParent = Gvbd> {
    /** Unique constant identifier/object reference */
    ref?: RefResolver<string, TypeParent, TContext>;
    /** Unique non-primary identifier/object reference */
    uuid?: UuidResolver<string, TypeParent, TContext>;

    VM?: VmResolver<Maybe<Gvm>, TypeParent, TContext>;

    VDI?: VdiResolver<Maybe<Gvdi>, TypeParent, TContext>;

    type?: TypeResolver<VbdType, TypeParent, TContext>;

    mode?: ModeResolver<VbdMode, TypeParent, TContext>;

    currentlyAttached?: CurrentlyAttachedResolver<boolean,
      TypeParent,
      TContext>;

    bootable?: BootableResolver<boolean, TypeParent, TContext>;

    userdevice?: UserdeviceResolver<number, TypeParent, TContext>;
  }

  export type RefResolver<R = string, Parent = Gvbd, TContext = {}> = Resolver<R,
    Parent,
    TContext>;
  export type UuidResolver<R = string, Parent = Gvbd, TContext = {}> = Resolver<R,
    Parent,
    TContext>;
  export type VmResolver<R = Maybe<Gvm>,
    Parent = Gvbd,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type VdiResolver<R = Maybe<Gvdi>,
    Parent = Gvbd,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type TypeResolver<R = VbdType,
    Parent = Gvbd,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type ModeResolver<R = VbdMode,
    Parent = Gvbd,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type CurrentlyAttachedResolver<R = boolean,
    Parent = Gvbd,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type BootableResolver<R = boolean,
    Parent = Gvbd,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type UserdeviceResolver<R = number,
    Parent = Gvbd,
    TContext = {}> = Resolver<R, Parent, TContext>;
}

export namespace GvdiResolvers {
  export interface Resolvers<TContext = {}, TypeParent = Gvdi> {
    /** a human-readable name */
    nameLabel?: NameLabelResolver<string, TypeParent, TContext>;
    /** a human-readable description */
    nameDescription?: NameDescriptionResolver<string, TypeParent, TContext>;
    /** Unique constant identifier/object reference (primary) */
    ref?: RefResolver<string, TypeParent, TContext>;
    /** Unique constant identifier/object reference (used in XenCenter) */
    uuid?: UuidResolver<string, TypeParent, TContext>;

    access?: AccessResolver<(Maybe<GAccessEntry>)[], TypeParent, TContext>;

    myActions?: MyActionsResolver<(Maybe<VdiActions>)[], TypeParent, TContext>;

    isOwner?: IsOwnerResolver<boolean, TypeParent, TContext>;

    SR?: SrResolver<Maybe<Gsr>, TypeParent, TContext>;

    virtualSize?: VirtualSizeResolver<number, TypeParent, TContext>;

    VBDs?: VbDsResolver<(Maybe<Gvbd>)[], TypeParent, TContext>;

    contentType?: ContentTypeResolver<SrContentType, TypeParent, TContext>;

    type?: TypeResolver<VdiType, TypeParent, TContext>;
  }

  export type NameLabelResolver<R = string,
    Parent = Gvdi,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type NameDescriptionResolver<R = string,
    Parent = Gvdi,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type RefResolver<R = string, Parent = Gvdi, TContext = {}> = Resolver<R,
    Parent,
    TContext>;
  export type UuidResolver<R = string, Parent = Gvdi, TContext = {}> = Resolver<R,
    Parent,
    TContext>;
  export type AccessResolver<R = (Maybe<GAccessEntry>)[],
    Parent = Gvdi,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type MyActionsResolver<R = (Maybe<VdiActions>)[],
    Parent = Gvdi,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type IsOwnerResolver<R = boolean,
    Parent = Gvdi,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type SrResolver<R = Maybe<Gsr>,
    Parent = Gvdi,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type VirtualSizeResolver<R = number,
    Parent = Gvdi,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type VbDsResolver<R = (Maybe<Gvbd>)[],
    Parent = Gvdi,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type ContentTypeResolver<R = SrContentType,
    Parent = Gvdi,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type TypeResolver<R = VdiType,
    Parent = Gvdi,
    TContext = {}> = Resolver<R, Parent, TContext>;
}

export namespace GsrResolvers {
  export interface Resolvers<TContext = {}, TypeParent = Gsr> {
    /** a human-readable name */
    nameLabel?: NameLabelResolver<string, TypeParent, TContext>;
    /** a human-readable description */
    nameDescription?: NameDescriptionResolver<string, TypeParent, TContext>;
    /** Unique constant identifier/object reference (primary) */
    ref?: RefResolver<string, TypeParent, TContext>;
    /** Unique constant identifier/object reference (used in XenCenter) */
    uuid?: UuidResolver<string, TypeParent, TContext>;

    access?: AccessResolver<(Maybe<GsrAccessEntry>)[], TypeParent, TContext>;

    myActions?: MyActionsResolver<(Maybe<SrActions>)[], TypeParent, TContext>;

    isOwner?: IsOwnerResolver<boolean, TypeParent, TContext>;
    /** Connections to host. Usually one, unless the storage repository is shared: e.g. iSCSI */
    PBDs?: PbDsResolver<(Maybe<Gpbd>)[], TypeParent, TContext>;

    VDIs?: VdIsResolver<Maybe<(Maybe<Gvdi>)[]>, TypeParent, TContext>;

    contentType?: ContentTypeResolver<SrContentType, TypeParent, TContext>;

    type?: TypeResolver<string, TypeParent, TContext>;
    /** Physical size in kilobytes */
    physicalSize?: PhysicalSizeResolver<number, TypeParent, TContext>;
    /** Virtual allocation in kilobytes */
    virtualAllocation?: VirtualAllocationResolver<number, TypeParent, TContext>;
    /** This SR contains XenServer Tools */
    isToolsSr?: IsToolsSrResolver<boolean, TypeParent, TContext>;
    /** Physical utilisation in bytes */
    physicalUtilisation?: PhysicalUtilisationResolver<number,
      TypeParent,
      TContext>;
    /** Available space in bytes */
    spaceAvailable?: SpaceAvailableResolver<number, TypeParent, TContext>;
  }

  export type NameLabelResolver<R = string,
    Parent = Gsr,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type NameDescriptionResolver<R = string,
    Parent = Gsr,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type RefResolver<R = string, Parent = Gsr, TContext = {}> = Resolver<R,
    Parent,
    TContext>;
  export type UuidResolver<R = string, Parent = Gsr, TContext = {}> = Resolver<R,
    Parent,
    TContext>;
  export type AccessResolver<R = (Maybe<GsrAccessEntry>)[],
    Parent = Gsr,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type MyActionsResolver<R = (Maybe<SrActions>)[],
    Parent = Gsr,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type IsOwnerResolver<R = boolean,
    Parent = Gsr,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type PbDsResolver<R = (Maybe<Gpbd>)[],
    Parent = Gsr,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type VdIsResolver<R = Maybe<(Maybe<Gvdi>)[]>,
    Parent = Gsr,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type ContentTypeResolver<R = SrContentType,
    Parent = Gsr,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type TypeResolver<R = string, Parent = Gsr, TContext = {}> = Resolver<R,
    Parent,
    TContext>;
  export type PhysicalSizeResolver<R = number,
    Parent = Gsr,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type VirtualAllocationResolver<R = number,
    Parent = Gsr,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type IsToolsSrResolver<R = boolean,
    Parent = Gsr,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type PhysicalUtilisationResolver<R = number,
    Parent = Gsr,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type SpaceAvailableResolver<R = number,
    Parent = Gsr,
    TContext = {}> = Resolver<R, Parent, TContext>;
}

export namespace GsrAccessEntryResolvers {
  export interface Resolvers<TContext = {}, TypeParent = GsrAccessEntry> {
    userId?: UserIdResolver<User, TypeParent, TContext>;

    actions?: ActionsResolver<SrActions, TypeParent, TContext>;
  }

  export type UserIdResolver<R = User,
    Parent = GsrAccessEntry,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type ActionsResolver<R = SrActions,
    Parent = GsrAccessEntry,
    TContext = {}> = Resolver<R, Parent, TContext>;
}
/** Fancy name for a PBD. Not a real Xen object, though a connection between a host and a SR */
export namespace GpbdResolvers {
  export interface Resolvers<TContext = {}, TypeParent = Gpbd> {
    /** Unique constant identifier/object reference */
    ref?: RefResolver<string, TypeParent, TContext>;
    /** Unique non-primary identifier/object reference */
    uuid?: UuidResolver<string, TypeParent, TContext>;
    /** Host to which the SR is supposed to be connected to */
    host?: HostResolver<GHost, TypeParent, TContext>;

    deviceConfig?: DeviceConfigResolver<JsonString, TypeParent, TContext>;

    SR?: SrResolver<Gsr, TypeParent, TContext>;

    currentlyAttached?: CurrentlyAttachedResolver<boolean,
      TypeParent,
      TContext>;
  }

  export type RefResolver<R = string, Parent = Gpbd, TContext = {}> = Resolver<R,
    Parent,
    TContext>;
  export type UuidResolver<R = string, Parent = Gpbd, TContext = {}> = Resolver<R,
    Parent,
    TContext>;
  export type HostResolver<R = GHost, Parent = Gpbd, TContext = {}> = Resolver<R,
    Parent,
    TContext>;
  export type DeviceConfigResolver<R = JsonString,
    Parent = Gpbd,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type SrResolver<R = Gsr, Parent = Gpbd, TContext = {}> = Resolver<R,
    Parent,
    TContext>;
  export type CurrentlyAttachedResolver<R = boolean,
    Parent = Gpbd,
    TContext = {}> = Resolver<R, Parent, TContext>;
}

export namespace GHostResolvers {
  export interface Resolvers<TContext = {}, TypeParent = GHost> {
    /** a human-readable name */
    nameLabel?: NameLabelResolver<string, TypeParent, TContext>;
    /** a human-readable description */
    nameDescription?: NameDescriptionResolver<string, TypeParent, TContext>;
    /** Unique constant identifier/object reference (primary) */
    ref?: RefResolver<string, TypeParent, TContext>;
    /** Unique constant identifier/object reference (used in XenCenter) */
    uuid?: UuidResolver<string, TypeParent, TContext>;
    /** Major XenAPI version number */
    APIVersionMajor?: ApiVersionMajorResolver<Maybe<number>,
      TypeParent,
      TContext>;
    /** Minor XenAPI version number */
    APIVersionMinor?: ApiVersionMinorResolver<Maybe<number>,
      TypeParent,
      TContext>;
    /** Connections to storage repositories */
    PBDs?: PbDsResolver<(Maybe<Gpbd>)[], TypeParent, TContext>;

    PCIs?: PcIsResolver<(Maybe<string>)[], TypeParent, TContext>;

    PGPUs?: PgpUsResolver<(Maybe<string>)[], TypeParent, TContext>;

    PIFs?: PiFsResolver<(Maybe<string>)[], TypeParent, TContext>;

    PUSBs?: PusBsResolver<(Maybe<string>)[], TypeParent, TContext>;
    /** The address by which this host can be contacted from any other host in the pool */
    address?: AddressResolver<string, TypeParent, TContext>;

    allowedOperations?: AllowedOperationsResolver<(Maybe<HostAllowedOperations>)[],
      TypeParent,
      TContext>;

    cpuInfo?: CpuInfoResolver<CpuInfo, TypeParent, TContext>;

    display?: DisplayResolver<HostDisplay, TypeParent, TContext>;

    hostname?: HostnameResolver<string, TypeParent, TContext>;

    softwareVersion?: SoftwareVersionResolver<SoftwareVersion,
      TypeParent,
      TContext>;
    /** VMs currently resident on host */
    residentVms?: ResidentVmsResolver<(Maybe<Gvm>)[], TypeParent, TContext>;

    metrics?: MetricsResolver<string, TypeParent, TContext>;
    /** Total memory in kilobytes */
    memoryTotal?: MemoryTotalResolver<Maybe<number>, TypeParent, TContext>;
    /** Free memory in kilobytes */
    memoryFree?: MemoryFreeResolver<Maybe<number>, TypeParent, TContext>;
    /** Available memory as measured by the host in kilobytes */
    memoryAvailable?: MemoryAvailableResolver<Maybe<number>,
      TypeParent,
      TContext>;
    /** Virtualization overhead in kilobytes */
    memoryOverhead?: MemoryOverheadResolver<Maybe<number>,
      TypeParent,
      TContext>;
    /** True if host is up. May be null if no data */
    live?: LiveResolver<Maybe<boolean>, TypeParent, TContext>;
    /** When live status was last updated */
    liveUpdated?: LiveUpdatedResolver<Maybe<DateTime>, TypeParent, TContext>;
  }

  export type NameLabelResolver<R = string,
    Parent = GHost,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type NameDescriptionResolver<R = string,
    Parent = GHost,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type RefResolver<R = string, Parent = GHost, TContext = {}> = Resolver<R,
    Parent,
    TContext>;
  export type UuidResolver<R = string,
    Parent = GHost,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type ApiVersionMajorResolver<R = Maybe<number>,
    Parent = GHost,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type ApiVersionMinorResolver<R = Maybe<number>,
    Parent = GHost,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type PbDsResolver<R = (Maybe<Gpbd>)[],
    Parent = GHost,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type PcIsResolver<R = (Maybe<string>)[],
    Parent = GHost,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type PgpUsResolver<R = (Maybe<string>)[],
    Parent = GHost,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type PiFsResolver<R = (Maybe<string>)[],
    Parent = GHost,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type PusBsResolver<R = (Maybe<string>)[],
    Parent = GHost,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type AddressResolver<R = string,
    Parent = GHost,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type AllowedOperationsResolver<R = (Maybe<HostAllowedOperations>)[],
    Parent = GHost,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type CpuInfoResolver<R = CpuInfo,
    Parent = GHost,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type DisplayResolver<R = HostDisplay,
    Parent = GHost,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type HostnameResolver<R = string,
    Parent = GHost,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type SoftwareVersionResolver<R = SoftwareVersion,
    Parent = GHost,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type ResidentVmsResolver<R = (Maybe<Gvm>)[],
    Parent = GHost,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type MetricsResolver<R = string,
    Parent = GHost,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type MemoryTotalResolver<R = Maybe<number>,
    Parent = GHost,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type MemoryFreeResolver<R = Maybe<number>,
    Parent = GHost,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type MemoryAvailableResolver<R = Maybe<number>,
    Parent = GHost,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type MemoryOverheadResolver<R = Maybe<number>,
    Parent = GHost,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type LiveResolver<R = Maybe<boolean>,
    Parent = GHost,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type LiveUpdatedResolver<R = Maybe<DateTime>,
    Parent = GHost,
    TContext = {}> = Resolver<R, Parent, TContext>;
}

export namespace CpuInfoResolvers {
  export interface Resolvers<TContext = {}, TypeParent = CpuInfo> {
    cpuCount?: CpuCountResolver<number, TypeParent, TContext>;

    modelname?: ModelnameResolver<string, TypeParent, TContext>;

    socketCount?: SocketCountResolver<number, TypeParent, TContext>;

    vendor?: VendorResolver<string, TypeParent, TContext>;

    family?: FamilyResolver<number, TypeParent, TContext>;

    features?: FeaturesResolver<string, TypeParent, TContext>;

    featuresHvm?: FeaturesHvmResolver<Maybe<string>, TypeParent, TContext>;

    featuresPv?: FeaturesPvResolver<Maybe<string>, TypeParent, TContext>;

    flags?: FlagsResolver<string, TypeParent, TContext>;

    model?: ModelResolver<number, TypeParent, TContext>;

    speed?: SpeedResolver<number, TypeParent, TContext>;

    stepping?: SteppingResolver<number, TypeParent, TContext>;
  }

  export type CpuCountResolver<R = number,
    Parent = CpuInfo,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type ModelnameResolver<R = string,
    Parent = CpuInfo,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type SocketCountResolver<R = number,
    Parent = CpuInfo,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type VendorResolver<R = string,
    Parent = CpuInfo,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type FamilyResolver<R = number,
    Parent = CpuInfo,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type FeaturesResolver<R = string,
    Parent = CpuInfo,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type FeaturesHvmResolver<R = Maybe<string>,
    Parent = CpuInfo,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type FeaturesPvResolver<R = Maybe<string>,
    Parent = CpuInfo,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type FlagsResolver<R = string,
    Parent = CpuInfo,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type ModelResolver<R = number,
    Parent = CpuInfo,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type SpeedResolver<R = number,
    Parent = CpuInfo,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type SteppingResolver<R = number,
    Parent = CpuInfo,
    TContext = {}> = Resolver<R, Parent, TContext>;
}

export namespace SoftwareVersionResolvers {
  export interface Resolvers<TContext = {}, TypeParent = SoftwareVersion> {
    buildNumber?: BuildNumberResolver<string, TypeParent, TContext>;

    date?: DateResolver<string, TypeParent, TContext>;

    hostname?: HostnameResolver<string, TypeParent, TContext>;
    /** Linux kernel version */
    linux?: LinuxResolver<string, TypeParent, TContext>;

    networkBackend?: NetworkBackendResolver<string, TypeParent, TContext>;

    platformName?: PlatformNameResolver<string, TypeParent, TContext>;

    platformVersion?: PlatformVersionResolver<string, TypeParent, TContext>;

    platformVersionText?: PlatformVersionTextResolver<string,
      TypeParent,
      TContext>;

    platformVersionTextShort?: PlatformVersionTextShortResolver<string,
      TypeParent,
      TContext>;
    /** XAPI version */
    xapi?: XapiResolver<string, TypeParent, TContext>;
    /** Xen version */
    xen?: XenResolver<string, TypeParent, TContext>;

    productBrand?: ProductBrandResolver<string, TypeParent, TContext>;

    productVersion?: ProductVersionResolver<string, TypeParent, TContext>;

    productVersionText?: ProductVersionTextResolver<string,
      TypeParent,
      TContext>;
  }

  export type BuildNumberResolver<R = string,
    Parent = SoftwareVersion,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type DateResolver<R = string,
    Parent = SoftwareVersion,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type HostnameResolver<R = string,
    Parent = SoftwareVersion,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type LinuxResolver<R = string,
    Parent = SoftwareVersion,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type NetworkBackendResolver<R = string,
    Parent = SoftwareVersion,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type PlatformNameResolver<R = string,
    Parent = SoftwareVersion,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type PlatformVersionResolver<R = string,
    Parent = SoftwareVersion,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type PlatformVersionTextResolver<R = string,
    Parent = SoftwareVersion,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type PlatformVersionTextShortResolver<R = string,
    Parent = SoftwareVersion,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type XapiResolver<R = string,
    Parent = SoftwareVersion,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type XenResolver<R = string,
    Parent = SoftwareVersion,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type ProductBrandResolver<R = string,
    Parent = SoftwareVersion,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type ProductVersionResolver<R = string,
    Parent = SoftwareVersion,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type ProductVersionTextResolver<R = string,
    Parent = SoftwareVersion,
    TContext = {}> = Resolver<R, Parent, TContext>;
}

export namespace GTemplateResolvers {
  export interface Resolvers<TContext = {}, TypeParent = GTemplate> {
    /** a human-readable name */
    nameLabel?: NameLabelResolver<string, TypeParent, TContext>;
    /** a human-readable description */
    nameDescription?: NameDescriptionResolver<string, TypeParent, TContext>;
    /** Unique constant identifier/object reference (primary) */
    ref?: RefResolver<string, TypeParent, TContext>;
    /** Unique constant identifier/object reference (used in XenCenter) */
    uuid?: UuidResolver<string, TypeParent, TContext>;

    access?: AccessResolver<(Maybe<GTemplateAccessEntry>)[],
      TypeParent,
      TContext>;
    /** CPU platform parameters */
    platform?: PlatformResolver<Maybe<Platform>, TypeParent, TContext>;

    VCPUsAtStartup?: VcpUsAtStartupResolver<number, TypeParent, TContext>;

    VCPUsMax?: VcpUsMaxResolver<number, TypeParent, TContext>;

    domainType?: DomainTypeResolver<DomainType, TypeParent, TContext>;

    guestMetrics?: GuestMetricsResolver<string, TypeParent, TContext>;

    installTime?: InstallTimeResolver<DateTime, TypeParent, TContext>;

    memoryActual?: MemoryActualResolver<number, TypeParent, TContext>;

    memoryStaticMin?: MemoryStaticMinResolver<number, TypeParent, TContext>;

    memoryStaticMax?: MemoryStaticMaxResolver<number, TypeParent, TContext>;

    memoryDynamicMin?: MemoryDynamicMinResolver<number, TypeParent, TContext>;

    memoryDynamicMax?: MemoryDynamicMaxResolver<number, TypeParent, TContext>;

    myActions?: MyActionsResolver<(Maybe<TemplateActions>)[],
      TypeParent,
      TContext>;

    isOwner?: IsOwnerResolver<boolean, TypeParent, TContext>;
    /** True if this template works with hardware assisted virtualization */
    hvm?: HvmResolver<boolean, TypeParent, TContext>;
    /** True if this template is available for regular users */
    enabled?: EnabledResolver<boolean, TypeParent, TContext>;
    /** This template is preinstalled with XenServer */
    isDefaultTemplate?: IsDefaultTemplateResolver<boolean,
      TypeParent,
      TContext>;
    /** If the template supports unattended installation, its options are there */
    installOptions?: InstallOptionsResolver<Maybe<InstallOsOptions>,
      TypeParent,
      TContext>;
  }

  export type NameLabelResolver<R = string,
    Parent = GTemplate,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type NameDescriptionResolver<R = string,
    Parent = GTemplate,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type RefResolver<R = string,
    Parent = GTemplate,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type UuidResolver<R = string,
    Parent = GTemplate,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type AccessResolver<R = (Maybe<GTemplateAccessEntry>)[],
    Parent = GTemplate,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type PlatformResolver<R = Maybe<Platform>,
    Parent = GTemplate,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type VcpUsAtStartupResolver<R = number,
    Parent = GTemplate,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type VcpUsMaxResolver<R = number,
    Parent = GTemplate,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type DomainTypeResolver<R = DomainType,
    Parent = GTemplate,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type GuestMetricsResolver<R = string,
    Parent = GTemplate,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type InstallTimeResolver<R = DateTime,
    Parent = GTemplate,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type MemoryActualResolver<R = number,
    Parent = GTemplate,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type MemoryStaticMinResolver<R = number,
    Parent = GTemplate,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type MemoryStaticMaxResolver<R = number,
    Parent = GTemplate,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type MemoryDynamicMinResolver<R = number,
    Parent = GTemplate,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type MemoryDynamicMaxResolver<R = number,
    Parent = GTemplate,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type MyActionsResolver<R = (Maybe<TemplateActions>)[],
    Parent = GTemplate,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type IsOwnerResolver<R = boolean,
    Parent = GTemplate,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type HvmResolver<R = boolean,
    Parent = GTemplate,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type EnabledResolver<R = boolean,
    Parent = GTemplate,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type IsDefaultTemplateResolver<R = boolean,
    Parent = GTemplate,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type InstallOptionsResolver<R = Maybe<InstallOsOptions>,
    Parent = GTemplate,
    TContext = {}> = Resolver<R, Parent, TContext>;
}

export namespace GTemplateAccessEntryResolvers {
  export interface Resolvers<TContext = {}, TypeParent = GTemplateAccessEntry> {
    userId?: UserIdResolver<User, TypeParent, TContext>;

    actions?: ActionsResolver<TemplateActions[], TypeParent, TContext>;
  }

  export type UserIdResolver<R = User,
    Parent = GTemplateAccessEntry,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type ActionsResolver<R = TemplateActions[],
    Parent = GTemplateAccessEntry,
    TContext = {}> = Resolver<R, Parent, TContext>;
}

export namespace InstallOsOptionsResolvers {
  export interface Resolvers<TContext = {}, TypeParent = InstallOsOptions> {
    distro?: DistroResolver<Distro, TypeParent, TContext>;

    arch?: ArchResolver<Maybe<Arch>, TypeParent, TContext>;

    release?: ReleaseResolver<Maybe<string>, TypeParent, TContext>;

    installRepository?: InstallRepositoryResolver<Maybe<string>,
      TypeParent,
      TContext>;
  }

  export type DistroResolver<R = Distro,
    Parent = InstallOsOptions,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type ArchResolver<R = Maybe<Arch>,
    Parent = InstallOsOptions,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type ReleaseResolver<R = Maybe<string>,
    Parent = InstallOsOptions,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type InstallRepositoryResolver<R = Maybe<string>,
    Parent = InstallOsOptions,
    TContext = {}> = Resolver<R, Parent, TContext>;
}

export namespace GPoolResolvers {
  export interface Resolvers<TContext = {}, TypeParent = GPool> {
    /** a human-readable name */
    nameLabel?: NameLabelResolver<string, TypeParent, TContext>;
    /** a human-readable description */
    nameDescription?: NameDescriptionResolver<string, TypeParent, TContext>;
    /** Unique constant identifier/object reference (primary) */
    ref?: RefResolver<string, TypeParent, TContext>;
    /** Unique constant identifier/object reference (used in XenCenter) */
    uuid?: UuidResolver<string, TypeParent, TContext>;
    /** Pool master */
    master?: MasterResolver<Maybe<GHost>, TypeParent, TContext>;
    /** Default SR */
    defaultSr?: DefaultSrResolver<Maybe<Gsr>, TypeParent, TContext>;
  }

  export type NameLabelResolver<R = string,
    Parent = GPool,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type NameDescriptionResolver<R = string,
    Parent = GPool,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type RefResolver<R = string, Parent = GPool, TContext = {}> = Resolver<R,
    Parent,
    TContext>;
  export type UuidResolver<R = string,
    Parent = GPool,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type MasterResolver<R = Maybe<GHost>,
    Parent = GPool,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type DefaultSrResolver<R = Maybe<Gsr>,
    Parent = GPool,
    TContext = {}> = Resolver<R, Parent, TContext>;
}

export namespace GPlaybookResolvers {
  export interface Resolvers<TContext = {}, TypeParent = GPlaybook> {
    /** Playbook ID */
    id?: IdResolver<string, TypeParent, TContext>;
    /** Inventory file path */
    inventory?: InventoryResolver<Maybe<string>, TypeParent, TContext>;
    /** Requirements for running this playbook */
    requires?: RequiresResolver<Maybe<PlaybookRequirements>,
      TypeParent,
      TContext>;
    /** Playbook name */
    name?: NameResolver<string, TypeParent, TContext>;
    /** Playbook description */
    description?: DescriptionResolver<Maybe<string>, TypeParent, TContext>;
    /** Variables available for change to an user */
    variables?: VariablesResolver<Maybe<JsonString>, TypeParent, TContext>;
  }

  export type IdResolver<R = string,
    Parent = GPlaybook,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type InventoryResolver<R = Maybe<string>,
    Parent = GPlaybook,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type RequiresResolver<R = Maybe<PlaybookRequirements>,
    Parent = GPlaybook,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type NameResolver<R = string,
    Parent = GPlaybook,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type DescriptionResolver<R = Maybe<string>,
    Parent = GPlaybook,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type VariablesResolver<R = Maybe<JsonString>,
    Parent = GPlaybook,
    TContext = {}> = Resolver<R, Parent, TContext>;
}

export namespace PlaybookRequirementsResolvers {
  export interface Resolvers<TContext = {}, TypeParent = PlaybookRequirements> {
    /** Minimal supported OS versions */
    osVersion?: OsVersionResolver<(Maybe<OsVersion>)[], TypeParent, TContext>;
  }

  export type OsVersionResolver<R = (Maybe<OsVersion>)[],
    Parent = PlaybookRequirements,
    TContext = {}> = Resolver<R, Parent, TContext>;
}

export namespace PlaybookTaskResolvers {
  export interface Resolvers<TContext = {}, TypeParent = PlaybookTask> {
    /** Playbook task ID */
    id?: IdResolver<string, TypeParent, TContext>;
    /** Playbook ID */
    playbookId?: PlaybookIdResolver<string, TypeParent, TContext>;
    /** Playbook running state */
    state?: StateResolver<PlaybookTaskState, TypeParent, TContext>;
    /** Human-readable message: error description or return code */
    message?: MessageResolver<string, TypeParent, TContext>;
  }

  export type IdResolver<R = string,
    Parent = PlaybookTask,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type PlaybookIdResolver<R = string,
    Parent = PlaybookTask,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type StateResolver<R = PlaybookTaskState,
    Parent = PlaybookTask,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type MessageResolver<R = string,
    Parent = PlaybookTask,
    TContext = {}> = Resolver<R, Parent, TContext>;
}

export namespace CurrentUserInformationResolvers {
  export interface Resolvers<TContext = {},
    TypeParent = CurrentUserInformation> {
    isAdmin?: IsAdminResolver<boolean, TypeParent, TContext>;

    user?: UserResolver<Maybe<User>, TypeParent, TContext>;

    groups?: GroupsResolver<Maybe<(Maybe<User>)[]>, TypeParent, TContext>;
  }

  export type IsAdminResolver<R = boolean,
    Parent = CurrentUserInformation,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type UserResolver<R = Maybe<User>,
    Parent = CurrentUserInformation,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type GroupsResolver<R = Maybe<(Maybe<User>)[]>,
    Parent = CurrentUserInformation,
    TContext = {}> = Resolver<R, Parent, TContext>;
}

export namespace VmSelectedIdListsResolvers {
  export interface Resolvers<TContext = {}, TypeParent = VmSelectedIdLists> {
    start?: StartResolver<Maybe<(Maybe<string>)[]>, TypeParent, TContext>;

    stop?: StopResolver<Maybe<(Maybe<string>)[]>, TypeParent, TContext>;

    trash?: TrashResolver<Maybe<(Maybe<string>)[]>, TypeParent, TContext>;
  }

  export type StartResolver<R = Maybe<(Maybe<string>)[]>,
    Parent = VmSelectedIdLists,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type StopResolver<R = Maybe<(Maybe<string>)[]>,
    Parent = VmSelectedIdLists,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type TrashResolver<R = Maybe<(Maybe<string>)[]>,
    Parent = VmSelectedIdLists,
    TContext = {}> = Resolver<R, Parent, TContext>;
}

export namespace MutationResolvers {
  export interface Resolvers<TContext = {}, TypeParent = {}> {
    /** Create a new VM */
    createVm?: CreateVmResolver<Maybe<CreateVm>, TypeParent, TContext>;
    /** Edit template options */
    template?: TemplateResolver<Maybe<TemplateMutation>, TypeParent, TContext>;
    /** Clone template */
    templateClone?: TemplateCloneResolver<Maybe<TemplateCloneMutation>,
      TypeParent,
      TContext>;
    /** Delete template */
    templateDelete?: TemplateDeleteResolver<Maybe<TemplateDestroyMutation>,
      TypeParent,
      TContext>;
    /** Edit VM options */
    vm?: VmResolver<Maybe<VmMutation>, TypeParent, TContext>;
    /** Start VM */
    vmStart?: VmStartResolver<Maybe<VmStartMutation>, TypeParent, TContext>;
    /** Shut down VM */
    vmShutdown?: VmShutdownResolver<Maybe<VmShutdownMutation>,
      TypeParent,
      TContext>;
    /** Reboot VM */
    vmReboot?: VmRebootResolver<Maybe<VmRebootMutation>, TypeParent, TContext>;
    /** If VM is Running, pause VM. If Paused, unpause VM */
    vmPause?: VmPauseResolver<Maybe<VmPauseMutation>, TypeParent, TContext>;
    /** If VM is Running, suspend VM. If Suspended, resume VM */
    vmSuspend?: VmSuspendResolver<Maybe<VmSuspendMutation>,
      TypeParent,
      TContext>;
    /** Delete a Halted VM */
    vmDelete?: VmDeleteResolver<Maybe<VmDeleteMutation>, TypeParent, TContext>;
    /** Set VM access rights */
    vmAccessSet?: VmAccessSetResolver<Maybe<VmAccessSet>, TypeParent, TContext>;
    /** Launch an Ansible Playbook on specified VMs */
    playbookLaunch?: PlaybookLaunchResolver<Maybe<PlaybookLaunchMutation>,
      TypeParent,
      TContext>;
    /** Attach VM to a Network by creating a new Interface */
    netAttach?: NetAttachResolver<Maybe<AttachNetworkMutation>,
      TypeParent,
      TContext>;
    /** Set network access rights */
    netAccessSet?: NetAccessSetResolver<Maybe<NetAccessSet>,
      TypeParent,
      TContext>;
    /** Attach VDI to a VM by creating a new virtual block device */
    vdiAttach?: VdiAttachResolver<Maybe<AttachVdiMutation>,
      TypeParent,
      TContext>;
    /** Set VDI access rights */
    vdiAccessSet?: VdiAccessSetResolver<Maybe<VdiAccessSet>,
      TypeParent,
      TContext>;
    /** Set SR access rights */
    srAccessSet?: SrAccessSetResolver<Maybe<SrAccessSet>, TypeParent, TContext>;

    selectedItems?: SelectedItemsResolver<Maybe<string[]>,
      TypeParent,
      TContext>;
  }

  export type CreateVmResolver<R = Maybe<CreateVm>,
    Parent = {},
    TContext = {}> = Resolver<R, Parent, TContext, CreateVmArgs>;

  export interface CreateVmArgs {
    disks?: Maybe<(Maybe<NewVdi>)[]>;
    /** Automatic installation parameters, the installation is done via internet. Only available when template.os_kind is not empty */
    installParams?: Maybe<AutoInstall>;
    /** ISO image mounted if conf parameter is null */
    iso?: Maybe<string>;
    /** Network ID to connect to */
    network?: Maybe<string>;
    /** Template ID */
    template: string;
    /** Basic VM options. Leave fields empty to use Template options */
    vmOptions: VmInput;
  }

  export type TemplateResolver<R = Maybe<TemplateMutation>,
    Parent = {},
    TContext = {}> = Resolver<R, Parent, TContext, TemplateArgs>;

  export interface TemplateArgs {
    /** Template to change */
    template: TemplateInput;
  }

  export type TemplateCloneResolver<R = Maybe<TemplateCloneMutation>,
    Parent = {},
    TContext = {}> = Resolver<R, Parent, TContext, TemplateCloneArgs>;

  export interface TemplateCloneArgs {
    /** New name label */
    nameLabel: string;

    ref: string;
  }

  export type TemplateDeleteResolver<R = Maybe<TemplateDestroyMutation>,
    Parent = {},
    TContext = {}> = Resolver<R, Parent, TContext, TemplateDeleteArgs>;

  export interface TemplateDeleteArgs {
    ref: string;
  }

  export type VmResolver<R = Maybe<VmMutation>,
    Parent = {},
    TContext = {}> = Resolver<R, Parent, TContext, VmArgs>;

  export interface VmArgs {
    /** VM to change */
    vm: VmInput;
  }

  export type VmStartResolver<R = Maybe<VmStartMutation>,
    Parent = {},
    TContext = {}> = Resolver<R, Parent, TContext, VmStartArgs>;

  export interface VmStartArgs {
    options?: Maybe<VmStartInput>;

    ref: string;
  }

  export type VmShutdownResolver<R = Maybe<VmShutdownMutation>,
    Parent = {},
    TContext = {}> = Resolver<R, Parent, TContext, VmShutdownArgs>;

  export interface VmShutdownArgs {
    /** Force shutdown in a hard or clean way */
    force?: Maybe<ShutdownForce>;

    ref: string;
  }

  export type VmRebootResolver<R = Maybe<VmRebootMutation>,
    Parent = {},
    TContext = {}> = Resolver<R, Parent, TContext, VmRebootArgs>;

  export interface VmRebootArgs {
    /** Force reboot in a hard or clean way. Default: clean */
    force?: Maybe<ShutdownForce>;

    ref: string;
  }

  export type VmPauseResolver<R = Maybe<VmPauseMutation>,
    Parent = {},
    TContext = {}> = Resolver<R, Parent, TContext, VmPauseArgs>;

  export interface VmPauseArgs {
    ref: string;
  }

  export type VmSuspendResolver<R = Maybe<VmSuspendMutation>,
    Parent = {},
    TContext = {}> = Resolver<R, Parent, TContext, VmSuspendArgs>;

  export interface VmSuspendArgs {
    ref: string;
  }

  export type VmDeleteResolver<R = Maybe<VmDeleteMutation>,
    Parent = {},
    TContext = {}> = Resolver<R, Parent, TContext, VmDeleteArgs>;

  export interface VmDeleteArgs {
    ref: string;
  }

  export type VmAccessSetResolver<R = Maybe<VmAccessSet>,
    Parent = {},
    TContext = {}> = Resolver<R, Parent, TContext, VmAccessSetArgs>;

  export interface VmAccessSetArgs {
    actions: VmActions[];

    ref: string;

    revoke: boolean;

    user: string;
  }

  export type PlaybookLaunchResolver<R = Maybe<PlaybookLaunchMutation>,
    Parent = {},
    TContext = {}> = Resolver<R, Parent, TContext, PlaybookLaunchArgs>;

  export interface PlaybookLaunchArgs {
    /** Playbook ID */
    id: string;
    /** JSON with key-value pairs representing Playbook variables changed by user */
    variables?: Maybe<JsonString>;
    /** VM UUIDs to run Playbook on. Ignored if this is a Playbook with provided Inventory */
    vms?: Maybe<(Maybe<string>)[]>;
  }

  export type NetAttachResolver<R = Maybe<AttachNetworkMutation>,
    Parent = {},
    TContext = {}> = Resolver<R, Parent, TContext, NetAttachArgs>;

  export interface NetAttachArgs {
    /** True if attach, False if detach */
    isAttach: boolean;

    netRef: string;

    vmRef: string;
  }

  export type NetAccessSetResolver<R = Maybe<NetAccessSet>,
    Parent = {},
    TContext = {}> = Resolver<R, Parent, TContext, NetAccessSetArgs>;

  export interface NetAccessSetArgs {
    actions: NetworkActions[];

    ref: string;

    revoke: boolean;

    user: string;
  }

  export type VdiAttachResolver<R = Maybe<AttachVdiMutation>,
    Parent = {},
    TContext = {}> = Resolver<R, Parent, TContext, VdiAttachArgs>;

  export interface VdiAttachArgs {
    /** True if attach, False if detach */
    isAttach: boolean;

    vdiRef: string;

    vmRef: string;
  }

  export type VdiAccessSetResolver<R = Maybe<VdiAccessSet>,
    Parent = {},
    TContext = {}> = Resolver<R, Parent, TContext, VdiAccessSetArgs>;

  export interface VdiAccessSetArgs {
    actions: VdiActions[];

    ref: string;

    revoke: boolean;

    user: string;
  }

  export type SrAccessSetResolver<R = Maybe<SrAccessSet>,
    Parent = {},
    TContext = {}> = Resolver<R, Parent, TContext, SrAccessSetArgs>;

  export interface SrAccessSetArgs {
    actions: SrActions[];

    ref: string;

    revoke: boolean;

    user: string;
  }

  export type SelectedItemsResolver<R = Maybe<string[]>,
    Parent = {},
    TContext = {}> = Resolver<R, Parent, TContext, SelectedItemsArgs>;

  export interface SelectedItemsArgs {
    tableId: Table;

    items: string[];

    isSelect: boolean;
  }
}

export namespace CreateVmResolvers {
  export interface Resolvers<TContext = {}, TypeParent = CreateVm> {
    /** Installation task ID */
    taskId?: TaskIdResolver<Maybe<string>, TypeParent, TContext>;

    granted?: GrantedResolver<boolean, TypeParent, TContext>;

    reason?: ReasonResolver<Maybe<string>, TypeParent, TContext>;
  }

  export type TaskIdResolver<R = Maybe<string>,
    Parent = CreateVm,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type GrantedResolver<R = boolean,
    Parent = CreateVm,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type ReasonResolver<R = Maybe<string>,
    Parent = CreateVm,
    TContext = {}> = Resolver<R, Parent, TContext>;
}

export namespace TemplateMutationResolvers {
  export interface Resolvers<TContext = {}, TypeParent = TemplateMutation> {
    /** If access is granted */
    granted?: GrantedResolver<boolean, TypeParent, TContext>;
    /** If access is not granted, return reason why */
    reason?: ReasonResolver<Maybe<string>, TypeParent, TContext>;
  }

  export type GrantedResolver<R = boolean,
    Parent = TemplateMutation,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type ReasonResolver<R = Maybe<string>,
    Parent = TemplateMutation,
    TContext = {}> = Resolver<R, Parent, TContext>;
}

export namespace TemplateCloneMutationResolvers {
  export interface Resolvers<TContext = {},
    TypeParent = TemplateCloneMutation> {
    /** clone task ID */
    taskId?: TaskIdResolver<Maybe<string>, TypeParent, TContext>;
    /** Shows if access to clone is granted */
    granted?: GrantedResolver<boolean, TypeParent, TContext>;

    reason?: ReasonResolver<Maybe<string>, TypeParent, TContext>;
  }

  export type TaskIdResolver<R = Maybe<string>,
    Parent = TemplateCloneMutation,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type GrantedResolver<R = boolean,
    Parent = TemplateCloneMutation,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type ReasonResolver<R = Maybe<string>,
    Parent = TemplateCloneMutation,
    TContext = {}> = Resolver<R, Parent, TContext>;
}

export namespace TemplateDestroyMutationResolvers {
  export interface Resolvers<TContext = {},
    TypeParent = TemplateDestroyMutation> {
    /** destroy task ID */
    taskId?: TaskIdResolver<Maybe<string>, TypeParent, TContext>;
    /** Shows if access to destroy is granted */
    granted?: GrantedResolver<boolean, TypeParent, TContext>;

    reason?: ReasonResolver<Maybe<string>, TypeParent, TContext>;
  }

  export type TaskIdResolver<R = Maybe<string>,
    Parent = TemplateDestroyMutation,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type GrantedResolver<R = boolean,
    Parent = TemplateDestroyMutation,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type ReasonResolver<R = Maybe<string>,
    Parent = TemplateDestroyMutation,
    TContext = {}> = Resolver<R, Parent, TContext>;
}
/** This class represents synchronous mutations for VM, i.e. you can change name_label, name_description, etc. */
export namespace VmMutationResolvers {
  export interface Resolvers<TContext = {}, TypeParent = VmMutation> {
    granted?: GrantedResolver<boolean, TypeParent, TContext>;

    reason?: ReasonResolver<Maybe<string>, TypeParent, TContext>;
  }

  export type GrantedResolver<R = boolean,
    Parent = VmMutation,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type ReasonResolver<R = Maybe<string>,
    Parent = VmMutation,
    TContext = {}> = Resolver<R, Parent, TContext>;
}

export namespace VmStartMutationResolvers {
  export interface Resolvers<TContext = {}, TypeParent = VmStartMutation> {
    /** Start task ID */
    taskId?: TaskIdResolver<Maybe<string>, TypeParent, TContext>;
    /** Shows if access to start is granted */
    granted?: GrantedResolver<boolean, TypeParent, TContext>;

    reason?: ReasonResolver<Maybe<string>, TypeParent, TContext>;
  }

  export type TaskIdResolver<R = Maybe<string>,
    Parent = VmStartMutation,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type GrantedResolver<R = boolean,
    Parent = VmStartMutation,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type ReasonResolver<R = Maybe<string>,
    Parent = VmStartMutation,
    TContext = {}> = Resolver<R, Parent, TContext>;
}

export namespace VmShutdownMutationResolvers {
  export interface Resolvers<TContext = {}, TypeParent = VmShutdownMutation> {
    /** Shutdown task ID */
    taskId?: TaskIdResolver<Maybe<string>, TypeParent, TContext>;
    /** Shows if access to shutdown is granted */
    granted?: GrantedResolver<boolean, TypeParent, TContext>;
  }

  export type TaskIdResolver<R = Maybe<string>,
    Parent = VmShutdownMutation,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type GrantedResolver<R = boolean,
    Parent = VmShutdownMutation,
    TContext = {}> = Resolver<R, Parent, TContext>;
}

export namespace VmRebootMutationResolvers {
  export interface Resolvers<TContext = {}, TypeParent = VmRebootMutation> {
    /** Reboot task ID */
    taskId?: TaskIdResolver<Maybe<string>, TypeParent, TContext>;
    /** Shows if access to reboot is granted */
    granted?: GrantedResolver<boolean, TypeParent, TContext>;
  }

  export type TaskIdResolver<R = Maybe<string>,
    Parent = VmRebootMutation,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type GrantedResolver<R = boolean,
    Parent = VmRebootMutation,
    TContext = {}> = Resolver<R, Parent, TContext>;
}

export namespace VmPauseMutationResolvers {
  export interface Resolvers<TContext = {}, TypeParent = VmPauseMutation> {
    /** Pause/unpause task ID */
    taskId?: TaskIdResolver<Maybe<string>, TypeParent, TContext>;
    /** Shows if access to pause/unpause is granted */
    granted?: GrantedResolver<boolean, TypeParent, TContext>;

    reason?: ReasonResolver<Maybe<string>, TypeParent, TContext>;
  }

  export type TaskIdResolver<R = Maybe<string>,
    Parent = VmPauseMutation,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type GrantedResolver<R = boolean,
    Parent = VmPauseMutation,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type ReasonResolver<R = Maybe<string>,
    Parent = VmPauseMutation,
    TContext = {}> = Resolver<R, Parent, TContext>;
}

export namespace VmSuspendMutationResolvers {
  export interface Resolvers<TContext = {}, TypeParent = VmSuspendMutation> {
    /** Suspend/resume task ID */
    taskId?: TaskIdResolver<Maybe<string>, TypeParent, TContext>;
    /** Shows if access to suspend/resume is granted */
    granted?: GrantedResolver<boolean, TypeParent, TContext>;

    reason?: ReasonResolver<Maybe<string>, TypeParent, TContext>;
  }

  export type TaskIdResolver<R = Maybe<string>,
    Parent = VmSuspendMutation,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type GrantedResolver<R = boolean,
    Parent = VmSuspendMutation,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type ReasonResolver<R = Maybe<string>,
    Parent = VmSuspendMutation,
    TContext = {}> = Resolver<R, Parent, TContext>;
}

export namespace VmDeleteMutationResolvers {
  export interface Resolvers<TContext = {}, TypeParent = VmDeleteMutation> {
    /** Deleting task ID */
    taskId?: TaskIdResolver<Maybe<string>, TypeParent, TContext>;
    /** Shows if access to delete is granted */
    granted?: GrantedResolver<boolean, TypeParent, TContext>;

    reason?: ReasonResolver<Maybe<string>, TypeParent, TContext>;
  }

  export type TaskIdResolver<R = Maybe<string>,
    Parent = VmDeleteMutation,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type GrantedResolver<R = boolean,
    Parent = VmDeleteMutation,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type ReasonResolver<R = Maybe<string>,
    Parent = VmDeleteMutation,
    TContext = {}> = Resolver<R, Parent, TContext>;
}

export namespace VmAccessSetResolvers {
  export interface Resolvers<TContext = {}, TypeParent = VmAccessSet> {
    success?: SuccessResolver<boolean, TypeParent, TContext>;
  }

  export type SuccessResolver<R = boolean,
    Parent = VmAccessSet,
    TContext = {}> = Resolver<R, Parent, TContext>;
}

export namespace PlaybookLaunchMutationResolvers {
  export interface Resolvers<TContext = {},
    TypeParent = PlaybookLaunchMutation> {
    /** Playbook execution task ID */
    taskId?: TaskIdResolver<string, TypeParent, TContext>;
  }

  export type TaskIdResolver<R = string,
    Parent = PlaybookLaunchMutation,
    TContext = {}> = Resolver<R, Parent, TContext>;
}

export namespace AttachNetworkMutationResolvers {
  export interface Resolvers<TContext = {},
    TypeParent = AttachNetworkMutation> {
    /** Attach/Detach task ID. If already attached/detached, returns null */
    taskId?: TaskIdResolver<Maybe<string>, TypeParent, TContext>;

    granted?: GrantedResolver<boolean, TypeParent, TContext>;

    reason?: ReasonResolver<Maybe<string>, TypeParent, TContext>;
  }

  export type TaskIdResolver<R = Maybe<string>,
    Parent = AttachNetworkMutation,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type GrantedResolver<R = boolean,
    Parent = AttachNetworkMutation,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type ReasonResolver<R = Maybe<string>,
    Parent = AttachNetworkMutation,
    TContext = {}> = Resolver<R, Parent, TContext>;
}

export namespace NetAccessSetResolvers {
  export interface Resolvers<TContext = {}, TypeParent = NetAccessSet> {
    success?: SuccessResolver<boolean, TypeParent, TContext>;
  }

  export type SuccessResolver<R = boolean,
    Parent = NetAccessSet,
    TContext = {}> = Resolver<R, Parent, TContext>;
}

export namespace AttachVdiMutationResolvers {
  export interface Resolvers<TContext = {}, TypeParent = AttachVdiMutation> {
    /** Attach/Detach task ID. If already attached/detached, returns null */
    taskId?: TaskIdResolver<Maybe<string>, TypeParent, TContext>;
    /** Returns True if access is granted */
    granted?: GrantedResolver<boolean, TypeParent, TContext>;
    /** If access is not granted, return the reason */
    reason?: ReasonResolver<Maybe<string>, TypeParent, TContext>;
  }

  export type TaskIdResolver<R = Maybe<string>,
    Parent = AttachVdiMutation,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type GrantedResolver<R = boolean,
    Parent = AttachVdiMutation,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type ReasonResolver<R = Maybe<string>,
    Parent = AttachVdiMutation,
    TContext = {}> = Resolver<R, Parent, TContext>;
}

export namespace VdiAccessSetResolvers {
  export interface Resolvers<TContext = {}, TypeParent = VdiAccessSet> {
    success?: SuccessResolver<boolean, TypeParent, TContext>;
  }

  export type SuccessResolver<R = boolean,
    Parent = VdiAccessSet,
    TContext = {}> = Resolver<R, Parent, TContext>;
}

export namespace SrAccessSetResolvers {
  export interface Resolvers<TContext = {}, TypeParent = SrAccessSet> {
    success?: SuccessResolver<boolean, TypeParent, TContext>;
  }

  export type SuccessResolver<R = boolean,
    Parent = SrAccessSet,
    TContext = {}> = Resolver<R, Parent, TContext>;
}
/** All subscriptions must return  Observable */
export namespace SubscriptionResolvers {
  export interface Resolvers<TContext = {}, TypeParent = {}> {
    /** Updates for all VMs */
    vms?: VmsResolver<GvMsSubscription, TypeParent, TContext>;
    /** Updates for a particular VM */
    vm?: VmResolver<Maybe<Gvm>, TypeParent, TContext>;
    /** Updates for all Templates */
    templates?: TemplatesResolver<GTemplatesSubscription, TypeParent, TContext>;
    /** Updates for a particular Template */
    template?: TemplateResolver<Maybe<GTemplate>, TypeParent, TContext>;
    /** Updates for all Hosts */
    hosts?: HostsResolver<GHostsSubscription, TypeParent, TContext>;
    /** Updates for a particular Host */
    host?: HostResolver<Maybe<GHost>, TypeParent, TContext>;
    /** Updates for all pools available in VMEmperor */
    pools?: PoolsResolver<GPoolsSubscription, TypeParent, TContext>;
    /** Updates for a particular Pool */
    pool?: PoolResolver<Maybe<GPool>, TypeParent, TContext>;
    /** Updates for all XenServer tasks */
    tasks?: TasksResolver<GTasksSubscription, TypeParent, TContext>;
    /** Updates for a particular XenServer Task */
    task?: TaskResolver<Maybe<GTask>, TypeParent, TContext>;
    /** Updates for a particular Playbook installation Task */
    playbookTask?: PlaybookTaskResolver<Maybe<PlaybookTask>,
      TypeParent,
      TContext>;
    /** Updates for all Playbook Tasks */
    playbookTasks?: PlaybookTasksResolver<PlaybookTasksSubscription,
      TypeParent,
      TContext>;
  }

  export type VmsResolver<R = GvMsSubscription,
    Parent = {},
    TContext = {}> = SubscriptionResolver<R, Parent, TContext, VmsArgs>;

  export interface VmsArgs {
    withInitials?: boolean;
  }

  export type VmResolver<R = Maybe<Gvm>,
    Parent = {},
    TContext = {}> = SubscriptionResolver<R, Parent, TContext, VmArgs>;

  export interface VmArgs {
    ref: string;
  }

  export type TemplatesResolver<R = GTemplatesSubscription,
    Parent = {},
    TContext = {}> = SubscriptionResolver<R, Parent, TContext, TemplatesArgs>;

  export interface TemplatesArgs {
    withInitials?: boolean;
  }

  export type TemplateResolver<R = Maybe<GTemplate>,
    Parent = {},
    TContext = {}> = SubscriptionResolver<R, Parent, TContext, TemplateArgs>;

  export interface TemplateArgs {
    ref: string;
  }

  export type HostsResolver<R = GHostsSubscription,
    Parent = {},
    TContext = {}> = SubscriptionResolver<R, Parent, TContext, HostsArgs>;

  export interface HostsArgs {
    withInitials?: boolean;
  }

  export type HostResolver<R = Maybe<GHost>,
    Parent = {},
    TContext = {}> = SubscriptionResolver<R, Parent, TContext, HostArgs>;

  export interface HostArgs {
    ref: string;
  }

  export type PoolsResolver<R = GPoolsSubscription,
    Parent = {},
    TContext = {}> = SubscriptionResolver<R, Parent, TContext, PoolsArgs>;

  export interface PoolsArgs {
    withInitials?: boolean;
  }

  export type PoolResolver<R = Maybe<GPool>,
    Parent = {},
    TContext = {}> = SubscriptionResolver<R, Parent, TContext, PoolArgs>;

  export interface PoolArgs {
    ref: string;
  }

  export type TasksResolver<R = GTasksSubscription,
    Parent = {},
    TContext = {}> = SubscriptionResolver<R, Parent, TContext, TasksArgs>;

  export interface TasksArgs {
    withInitials?: boolean;
  }

  export type TaskResolver<R = Maybe<GTask>,
    Parent = {},
    TContext = {}> = SubscriptionResolver<R, Parent, TContext, TaskArgs>;

  export interface TaskArgs {
    ref: string;
  }

  export type PlaybookTaskResolver<R = Maybe<PlaybookTask>,
    Parent = {},
    TContext = {}> = SubscriptionResolver<R, Parent, TContext, PlaybookTaskArgs>;

  export interface PlaybookTaskArgs {
    id: string;
  }

  export type PlaybookTasksResolver<R = PlaybookTasksSubscription,
    Parent = {},
    TContext = {}> = SubscriptionResolver<R, Parent, TContext, PlaybookTasksArgs>;

  export interface PlaybookTasksArgs {
    withInitials?: boolean;
  }
}

export namespace GvMsSubscriptionResolvers {
  export interface Resolvers<TContext = {}, TypeParent = GvMsSubscription> {
    /** Change type */
    changeType?: ChangeTypeResolver<Change, TypeParent, TContext>;

    value?: ValueResolver<GvmOrDeleted, TypeParent, TContext>;
  }

  export type ChangeTypeResolver<R = Change,
    Parent = GvMsSubscription,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type ValueResolver<R = GvmOrDeleted,
    Parent = GvMsSubscription,
    TContext = {}> = Resolver<R, Parent, TContext>;
}

export namespace DeletedResolvers {
  export interface Resolvers<TContext = {}, TypeParent = Deleted> {
    /** Deleted object's ref */
    ref?: RefResolver<string, TypeParent, TContext>;
  }

  export type RefResolver<R = string,
    Parent = Deleted,
    TContext = {}> = Resolver<R, Parent, TContext>;
}

export namespace GTemplatesSubscriptionResolvers {
  export interface Resolvers<TContext = {},
    TypeParent = GTemplatesSubscription> {
    /** Change type */
    changeType?: ChangeTypeResolver<Change, TypeParent, TContext>;

    value?: ValueResolver<GTemplateOrDeleted, TypeParent, TContext>;
  }

  export type ChangeTypeResolver<R = Change,
    Parent = GTemplatesSubscription,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type ValueResolver<R = GTemplateOrDeleted,
    Parent = GTemplatesSubscription,
    TContext = {}> = Resolver<R, Parent, TContext>;
}

export namespace GHostsSubscriptionResolvers {
  export interface Resolvers<TContext = {}, TypeParent = GHostsSubscription> {
    /** Change type */
    changeType?: ChangeTypeResolver<Change, TypeParent, TContext>;

    value?: ValueResolver<GHostOrDeleted, TypeParent, TContext>;
  }

  export type ChangeTypeResolver<R = Change,
    Parent = GHostsSubscription,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type ValueResolver<R = GHostOrDeleted,
    Parent = GHostsSubscription,
    TContext = {}> = Resolver<R, Parent, TContext>;
}

export namespace GPoolsSubscriptionResolvers {
  export interface Resolvers<TContext = {}, TypeParent = GPoolsSubscription> {
    /** Change type */
    changeType?: ChangeTypeResolver<Change, TypeParent, TContext>;

    value?: ValueResolver<GPoolOrDeleted, TypeParent, TContext>;
  }

  export type ChangeTypeResolver<R = Change,
    Parent = GPoolsSubscription,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type ValueResolver<R = GPoolOrDeleted,
    Parent = GPoolsSubscription,
    TContext = {}> = Resolver<R, Parent, TContext>;
}

export namespace GTasksSubscriptionResolvers {
  export interface Resolvers<TContext = {}, TypeParent = GTasksSubscription> {
    /** Change type */
    changeType?: ChangeTypeResolver<Change, TypeParent, TContext>;

    value?: ValueResolver<GTaskOrDeleted, TypeParent, TContext>;
  }

  export type ChangeTypeResolver<R = Change,
    Parent = GTasksSubscription,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type ValueResolver<R = GTaskOrDeleted,
    Parent = GTasksSubscription,
    TContext = {}> = Resolver<R, Parent, TContext>;
}

export namespace GTaskResolvers {
  export interface Resolvers<TContext = {}, TypeParent = GTask> {
    /** a human-readable name */
    nameLabel?: NameLabelResolver<string, TypeParent, TContext>;
    /** a human-readable description */
    nameDescription?: NameDescriptionResolver<string, TypeParent, TContext>;
    /** Unique constant identifier/object reference (primary) */
    ref?: RefResolver<string, TypeParent, TContext>;
    /** Unique constant identifier/object reference (used in XenCenter) */
    uuid?: UuidResolver<string, TypeParent, TContext>;

    access?: AccessResolver<(Maybe<GTaskAccessEntry>)[], TypeParent, TContext>;

    myActions?: MyActionsResolver<(Maybe<TaskActions>)[], TypeParent, TContext>;

    isOwner?: IsOwnerResolver<boolean, TypeParent, TContext>;
    /** Task creation time */
    created?: CreatedResolver<DateTime, TypeParent, TContext>;
    /** Task finish time */
    finished?: FinishedResolver<DateTime, TypeParent, TContext>;
    /** Task progress */
    progress?: ProgressResolver<number, TypeParent, TContext>;
    /** Task result if available */
    result?: ResultResolver<Maybe<string>, TypeParent, TContext>;
    /** Task result type */
    type?: TypeResolver<Maybe<string>, TypeParent, TContext>;
    /** ref of a host that runs this task */
    residentOn?: ResidentOnResolver<Maybe<string>, TypeParent, TContext>;
    /** Error strings, if failed */
    errorInfo?: ErrorInfoResolver<Maybe<(Maybe<string>)[]>,
      TypeParent,
      TContext>;
    /** Task status */
    status?: StatusResolver<Maybe<string>, TypeParent, TContext>;
  }

  export type NameLabelResolver<R = string,
    Parent = GTask,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type NameDescriptionResolver<R = string,
    Parent = GTask,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type RefResolver<R = string, Parent = GTask, TContext = {}> = Resolver<R,
    Parent,
    TContext>;
  export type UuidResolver<R = string,
    Parent = GTask,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type AccessResolver<R = (Maybe<GTaskAccessEntry>)[],
    Parent = GTask,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type MyActionsResolver<R = (Maybe<TaskActions>)[],
    Parent = GTask,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type IsOwnerResolver<R = boolean,
    Parent = GTask,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type CreatedResolver<R = DateTime,
    Parent = GTask,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type FinishedResolver<R = DateTime,
    Parent = GTask,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type ProgressResolver<R = number,
    Parent = GTask,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type ResultResolver<R = Maybe<string>,
    Parent = GTask,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type TypeResolver<R = Maybe<string>,
    Parent = GTask,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type ResidentOnResolver<R = Maybe<string>,
    Parent = GTask,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type ErrorInfoResolver<R = Maybe<(Maybe<string>)[]>,
    Parent = GTask,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type StatusResolver<R = Maybe<string>,
    Parent = GTask,
    TContext = {}> = Resolver<R, Parent, TContext>;
}

export namespace GTaskAccessEntryResolvers {
  export interface Resolvers<TContext = {}, TypeParent = GTaskAccessEntry> {
    userId?: UserIdResolver<User, TypeParent, TContext>;

    actions?: ActionsResolver<TaskActions[], TypeParent, TContext>;
  }

  export type UserIdResolver<R = User,
    Parent = GTaskAccessEntry,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type ActionsResolver<R = TaskActions[],
    Parent = GTaskAccessEntry,
    TContext = {}> = Resolver<R, Parent, TContext>;
}

export namespace PlaybookTasksSubscriptionResolvers {
  export interface Resolvers<TContext = {},
    TypeParent = PlaybookTasksSubscription> {
    /** Change type */
    changeType?: ChangeTypeResolver<Change, TypeParent, TContext>;

    value?: ValueResolver<PlaybookTaskOrDeleted, TypeParent, TContext>;
  }

  export type ChangeTypeResolver<R = Change,
    Parent = PlaybookTasksSubscription,
    TContext = {}> = Resolver<R, Parent, TContext>;
  export type ValueResolver<R = PlaybookTaskOrDeleted,
    Parent = PlaybookTasksSubscription,
    TContext = {}> = Resolver<R, Parent, TContext>;
}

export namespace GAclXenObjectResolvers {
  export interface Resolvers {
    __resolveType: ResolveType;
  }

  export type ResolveType<R = "GVM" | "GNetwork" | "GVDI" | "GSR" | "GTemplate" | "GTask",
    Parent = Gvm | GNetwork | Gvdi | Gsr | GTemplate | GTask,
    TContext = {}> = TypeResolveFn<R, Parent, TContext>;
}

export namespace GAccessEntryResolvers {
  export interface Resolvers {
    __resolveType: ResolveType;
  }

  export type ResolveType<R =
      | "GVMAccessEntry"
    | "GNetworkAccessEntry"
    | "GSRAccessEntry"
    | "GTemplateAccessEntry"
    | "GTaskAccessEntry",
    Parent =
        | GvmAccessEntry
      | GNetworkAccessEntry
      | GsrAccessEntry
      | GTemplateAccessEntry
      | GTaskAccessEntry,
    TContext = {}> = TypeResolveFn<R, Parent, TContext>;
}

export namespace GAbstractVmResolvers {
  export interface Resolvers {
    __resolveType: ResolveType;
  }

  export type ResolveType<R = "GVM" | "GTemplate",
    Parent = Gvm | GTemplate,
    TContext = {}> = TypeResolveFn<R, Parent, TContext>;
}

export namespace GXenObjectResolvers {
  export interface Resolvers {
    __resolveType: ResolveType;
  }

  export type ResolveType<R = "GHost" | "GPool",
    Parent = GHost | GPool,
    TContext = {}> = TypeResolveFn<R, Parent, TContext>;
}

export namespace GvmOrDeletedResolvers {
  export interface Resolvers {
    __resolveType: ResolveType;
  }

  export type ResolveType<R = "GVM" | "Deleted",
    Parent = Gvm | Deleted,
    TContext = {}> = TypeResolveFn<R, Parent, TContext>;
}

export namespace GTemplateOrDeletedResolvers {
  export interface Resolvers {
    __resolveType: ResolveType;
  }

  export type ResolveType<R = "GTemplate" | "Deleted",
    Parent = GTemplate | Deleted,
    TContext = {}> = TypeResolveFn<R, Parent, TContext>;
}

export namespace GHostOrDeletedResolvers {
  export interface Resolvers {
    __resolveType: ResolveType;
  }

  export type ResolveType<R = "GHost" | "Deleted",
    Parent = GHost | Deleted,
    TContext = {}> = TypeResolveFn<R, Parent, TContext>;
}

export namespace GPoolOrDeletedResolvers {
  export interface Resolvers {
    __resolveType: ResolveType;
  }

  export type ResolveType<R = "GPool" | "Deleted",
    Parent = GPool | Deleted,
    TContext = {}> = TypeResolveFn<R, Parent, TContext>;
}

export namespace GTaskOrDeletedResolvers {
  export interface Resolvers {
    __resolveType: ResolveType;
  }

  export type ResolveType<R = "GTask" | "Deleted",
    Parent = GTask | Deleted,
    TContext = {}> = TypeResolveFn<R, Parent, TContext>;
}

export namespace PlaybookTaskOrDeletedResolvers {
  export interface Resolvers {
    __resolveType: ResolveType;
  }

  export type ResolveType<R = "PlaybookTask" | "Deleted",
    Parent = PlaybookTask | Deleted,
    TContext = {}> = TypeResolveFn<R, Parent, TContext>;
}

/** Directs the executor to skip this field or fragment when the `if` argument is true. */
export type SkipDirectiveResolver<Result> = DirectiveResolverFn<Result,
  SkipDirectiveArgs,
  {}>;

export interface SkipDirectiveArgs {
  /** Skipped when true. */
  if: boolean;
}

/** Directs the executor to include this field or fragment only when the `if` argument is true. */
export type IncludeDirectiveResolver<Result> = DirectiveResolverFn<Result,
  IncludeDirectiveArgs,
  {}>;

export interface IncludeDirectiveArgs {
  /** Included when true. */
  if: boolean;
}

/** Marks an element of a GraphQL schema as no longer supported. */
export type DeprecatedDirectiveResolver<Result> = DirectiveResolverFn<Result,
  DeprecatedDirectiveArgs,
  {}>;

export interface DeprecatedDirectiveArgs {
  /** Explains why this element was deprecated, usually also including a suggestion for how to access supported similar data. Formatted using the Markdown syntax (as specified by [CommonMark](https://commonmark.org/). */
  reason?: string;
}

export interface DateTimeScalarConfig
  extends GraphQLScalarTypeConfig<DateTime, any> {
  name: "DateTime";
}

export interface JSONStringScalarConfig
  extends GraphQLScalarTypeConfig<JsonString, any> {
  name: "JSONString";
}

export type IResolvers<TContext = {}> = {
  Query?: QueryResolvers.Resolvers<TContext>;
  Gvm?: GvmResolvers.Resolvers<TContext>;
  User?: UserResolvers.Resolvers<TContext>;
  Platform?: PlatformResolvers.Resolvers<TContext>;
  GvmAccessEntry?: GvmAccessEntryResolvers.Resolvers<TContext>;
  PvDriversVersion?: PvDriversVersionResolvers.Resolvers<TContext>;
  OsVersion?: OsVersionResolvers.Resolvers<TContext>;
  Gvif?: GvifResolvers.Resolvers<TContext>;
  GNetwork?: GNetworkResolvers.Resolvers<TContext>;
  GNetworkAccessEntry?: GNetworkAccessEntryResolvers.Resolvers<TContext>;
  Gvbd?: GvbdResolvers.Resolvers<TContext>;
  Gvdi?: GvdiResolvers.Resolvers<TContext>;
  Gsr?: GsrResolvers.Resolvers<TContext>;
  GsrAccessEntry?: GsrAccessEntryResolvers.Resolvers<TContext>;
  Gpbd?: GpbdResolvers.Resolvers<TContext>;
  GHost?: GHostResolvers.Resolvers<TContext>;
  CpuInfo?: CpuInfoResolvers.Resolvers<TContext>;
  SoftwareVersion?: SoftwareVersionResolvers.Resolvers<TContext>;
  GTemplate?: GTemplateResolvers.Resolvers<TContext>;
  GTemplateAccessEntry?: GTemplateAccessEntryResolvers.Resolvers<TContext>;
  InstallOsOptions?: InstallOsOptionsResolvers.Resolvers<TContext>;
  GPool?: GPoolResolvers.Resolvers<TContext>;
  GPlaybook?: GPlaybookResolvers.Resolvers<TContext>;
  PlaybookRequirements?: PlaybookRequirementsResolvers.Resolvers<TContext>;
  PlaybookTask?: PlaybookTaskResolvers.Resolvers<TContext>;
  CurrentUserInformation?: CurrentUserInformationResolvers.Resolvers<TContext>;
  VmSelectedIdLists?: VmSelectedIdListsResolvers.Resolvers<TContext>;
  Mutation?: MutationResolvers.Resolvers<TContext>;
  CreateVm?: CreateVmResolvers.Resolvers<TContext>;
  TemplateMutation?: TemplateMutationResolvers.Resolvers<TContext>;
  TemplateCloneMutation?: TemplateCloneMutationResolvers.Resolvers<TContext>;
  TemplateDestroyMutation?: TemplateDestroyMutationResolvers.Resolvers<TContext>;
  VmMutation?: VmMutationResolvers.Resolvers<TContext>;
  VmStartMutation?: VmStartMutationResolvers.Resolvers<TContext>;
  VmShutdownMutation?: VmShutdownMutationResolvers.Resolvers<TContext>;
  VmRebootMutation?: VmRebootMutationResolvers.Resolvers<TContext>;
  VmPauseMutation?: VmPauseMutationResolvers.Resolvers<TContext>;
  VmSuspendMutation?: VmSuspendMutationResolvers.Resolvers<TContext>;
  VmDeleteMutation?: VmDeleteMutationResolvers.Resolvers<TContext>;
  VmAccessSet?: VmAccessSetResolvers.Resolvers<TContext>;
  PlaybookLaunchMutation?: PlaybookLaunchMutationResolvers.Resolvers<TContext>;
  AttachNetworkMutation?: AttachNetworkMutationResolvers.Resolvers<TContext>;
  NetAccessSet?: NetAccessSetResolvers.Resolvers<TContext>;
  AttachVdiMutation?: AttachVdiMutationResolvers.Resolvers<TContext>;
  VdiAccessSet?: VdiAccessSetResolvers.Resolvers<TContext>;
  SrAccessSet?: SrAccessSetResolvers.Resolvers<TContext>;
  Subscription?: SubscriptionResolvers.Resolvers<TContext>;
  GvMsSubscription?: GvMsSubscriptionResolvers.Resolvers<TContext>;
  Deleted?: DeletedResolvers.Resolvers<TContext>;
  GTemplatesSubscription?: GTemplatesSubscriptionResolvers.Resolvers<TContext>;
  GHostsSubscription?: GHostsSubscriptionResolvers.Resolvers<TContext>;
  GPoolsSubscription?: GPoolsSubscriptionResolvers.Resolvers<TContext>;
  GTasksSubscription?: GTasksSubscriptionResolvers.Resolvers<TContext>;
  GTask?: GTaskResolvers.Resolvers<TContext>;
  GTaskAccessEntry?: GTaskAccessEntryResolvers.Resolvers<TContext>;
  PlaybookTasksSubscription?: PlaybookTasksSubscriptionResolvers.Resolvers<TContext>;
  GAclXenObject?: GAclXenObjectResolvers.Resolvers;
  GAccessEntry?: GAccessEntryResolvers.Resolvers;
  GAbstractVm?: GAbstractVmResolvers.Resolvers;
  GXenObject?: GXenObjectResolvers.Resolvers;
  GvmOrDeleted?: GvmOrDeletedResolvers.Resolvers;
  GTemplateOrDeleted?: GTemplateOrDeletedResolvers.Resolvers;
  GHostOrDeleted?: GHostOrDeletedResolvers.Resolvers;
  GPoolOrDeleted?: GPoolOrDeletedResolvers.Resolvers;
  GTaskOrDeleted?: GTaskOrDeletedResolvers.Resolvers;
  PlaybookTaskOrDeleted?: PlaybookTaskOrDeletedResolvers.Resolvers;
  DateTime?: GraphQLScalarType;
  JsonString?: GraphQLScalarType;
} & { [typeName: string]: never };

export type IDirectiveResolvers<Result> = {
  skip?: SkipDirectiveResolver<Result>;
  include?: IncludeDirectiveResolver<Result>;
  deprecated?: DeprecatedDirectiveResolver<Result>;
} & { [directiveName: string]: never };

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
  /** Unique constant identifier/object reference (primary) */
  ref: string;
  /** Unique constant identifier/object reference (used in XenCenter) */
  uuid: string;

  access: (Maybe<GAccessEntry>)[];
}

export interface GAccessEntry {
  userId: User;
}

export interface GAbstractVm {
  /** CPU platform parameters */
  platform?: Maybe<Platform>;

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
}

export interface GXenObject {
  /** a human-readable name */
  nameLabel: string;
  /** a human-readable description */
  nameDescription: string;
  /** Unique constant identifier/object reference (primary) */
  ref: string;
  /** Unique constant identifier/object reference (used in XenCenter) */
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
  /** All registered users (excluding root) */
  users: (Maybe<User>)[];
  /** All registered groups */
  groups: (Maybe<User>)[];
  /** User or group information */
  user?: Maybe<User>;
  /** current user or group information */
  currentUser?: Maybe<CurrentUserInformation>;

  findUser: (Maybe<User>)[];

  selectedItems: string[];

  vmSelectedReadyFor: VmSelectedIdLists;
}

export interface Gvm extends GAclXenObject, GAbstractVm {
  /** a human-readable name */
  nameLabel: string;
  /** a human-readable description */
  nameDescription: string;
  /** Unique constant identifier/object reference (primary) */
  ref: string;
  /** Unique constant identifier/object reference (used in XenCenter) */
  uuid: string;

  access: (Maybe<GvmAccessEntry>)[];
  /** CPU platform parameters */
  platform?: Maybe<Platform>;

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

  myActions: (Maybe<VmActions>)[];

  isOwner: boolean;
  /** True if PV drivers are up to date, reported if Guest Additions are installed */
  PVDriversUpToDate?: Maybe<boolean>;
  /** PV drivers version, if available */
  PVDriversVersion?: Maybe<PvDriversVersion>;

  metrics: string;

  osVersion?: Maybe<OsVersion>;

  powerState: PowerState;

  startTime?: Maybe<DateTime>;

  VIFs: (Maybe<Gvif>)[];
  /** Virtual block devices */
  VBDs: (Maybe<Gvbd>)[];
}

export interface User {
  id: string;

  name: string;

  username: string;
}

export interface Platform {
  coresPerSocket?: Maybe<number>;

  timeoffset?: Maybe<number>;

  nx?: Maybe<boolean>;

  deviceModel?: Maybe<string>;

  pae?: Maybe<boolean>;

  hpet?: Maybe<boolean>;

  apic?: Maybe<boolean>;

  acpi?: Maybe<number>;

  videoram?: Maybe<number>;
}

export interface GvmAccessEntry extends GAccessEntry {
  userId: User;

  actions: VmActions[];
}

/** Drivers version. We don't want any fancy resolver except for the thing that we know that it's a dict in VM document */
export interface PvDriversVersion {
  major?: Maybe<number>;

  minor?: Maybe<number>;

  micro?: Maybe<number>;

  build?: Maybe<number>;
}

/** OS version reported by Xen tools */
export interface OsVersion {
  name?: Maybe<string>;

  uname?: Maybe<string>;

  distro?: Maybe<string>;

  major?: Maybe<number>;

  minor?: Maybe<number>;
}

export interface Gvif {
  /** Unique constant identifier/object reference (primary) */
  ref: string;
  /** MAC address */
  MAC: string;

  VM?: Maybe<Gvm>;
  /** Device ID */
  device: string;

  currentlyAttached: boolean;

  ip?: Maybe<string>;

  ipv4?: Maybe<string>;

  ipv6?: Maybe<string>;

  network?: Maybe<GNetwork>;
}

export interface GNetwork extends GAclXenObject {
  /** a human-readable name */
  nameLabel: string;
  /** a human-readable description */
  nameDescription: string;
  /** Unique constant identifier/object reference (primary) */
  ref: string;
  /** Unique constant identifier/object reference (used in XenCenter) */
  uuid: string;

  access: (Maybe<GNetworkAccessEntry>)[];

  myActions: (Maybe<NetworkActions>)[];

  isOwner: boolean;

  VIFs?: Maybe<(Maybe<Gvif>)[]>;

  otherConfig?: Maybe<JsonString>;
}

export interface GNetworkAccessEntry extends GAccessEntry {
  userId: User;

  actions: NetworkActions;
}

export interface Gvbd {
  /** Unique constant identifier/object reference */
  ref: string;
  /** Unique non-primary identifier/object reference */
  uuid: string;

  VM?: Maybe<Gvm>;

  VDI?: Maybe<Gvdi>;

  type: VbdType;

  mode: VbdMode;

  currentlyAttached: boolean;

  bootable: boolean;

  userdevice: number;
}

export interface Gvdi extends GAclXenObject {
  /** a human-readable name */
  nameLabel: string;
  /** a human-readable description */
  nameDescription: string;
  /** Unique constant identifier/object reference (primary) */
  ref: string;
  /** Unique constant identifier/object reference (used in XenCenter) */
  uuid: string;

  access: (Maybe<GAccessEntry>)[];

  myActions: (Maybe<VdiActions>)[];

  isOwner: boolean;

  SR?: Maybe<Gsr>;

  virtualSize: number;

  VBDs: (Maybe<Gvbd>)[];

  contentType: SrContentType;

  type: VdiType;
}

export interface Gsr extends GAclXenObject {
  /** a human-readable name */
  nameLabel: string;
  /** a human-readable description */
  nameDescription: string;
  /** Unique constant identifier/object reference (primary) */
  ref: string;
  /** Unique constant identifier/object reference (used in XenCenter) */
  uuid: string;

  access: (Maybe<GsrAccessEntry>)[];

  myActions: (Maybe<SrActions>)[];

  isOwner: boolean;
  /** Connections to host. Usually one, unless the storage repository is shared: e.g. iSCSI */
  PBDs: (Maybe<Gpbd>)[];

  VDIs?: Maybe<(Maybe<Gvdi>)[]>;

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

export interface GsrAccessEntry extends GAccessEntry {
  userId: User;

  actions: SrActions;
}

/** Fancy name for a PBD. Not a real Xen object, though a connection between a host and a SR */
export interface Gpbd {
  /** Unique constant identifier/object reference */
  ref: string;
  /** Unique non-primary identifier/object reference */
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
  /** Unique constant identifier/object reference (primary) */
  ref: string;
  /** Unique constant identifier/object reference (used in XenCenter) */
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

export interface GTemplate extends GAclXenObject, GAbstractVm {
  /** a human-readable name */
  nameLabel: string;
  /** a human-readable description */
  nameDescription: string;
  /** Unique constant identifier/object reference (primary) */
  ref: string;
  /** Unique constant identifier/object reference (used in XenCenter) */
  uuid: string;

  access: (Maybe<GTemplateAccessEntry>)[];
  /** CPU platform parameters */
  platform?: Maybe<Platform>;

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

  myActions: (Maybe<TemplateActions>)[];

  isOwner: boolean;
  /** True if this template works with hardware assisted virtualization */
  hvm: boolean;
  /** True if this template is available for regular users */
  enabled: boolean;
  /** This template is preinstalled with XenServer */
  isDefaultTemplate: boolean;
  /** If the template supports unattended installation, its options are there */
  installOptions?: Maybe<InstallOsOptions>;
}

export interface GTemplateAccessEntry extends GAccessEntry {
  userId: User;

  actions: TemplateActions[];
}

export interface InstallOsOptions {
  distro: Distro;

  arch?: Maybe<Arch>;

  release?: Maybe<string>;

  installRepository?: Maybe<string>;
}

export interface GPool extends GXenObject {
  /** a human-readable name */
  nameLabel: string;
  /** a human-readable description */
  nameDescription: string;
  /** Unique constant identifier/object reference (primary) */
  ref: string;
  /** Unique constant identifier/object reference (used in XenCenter) */
  uuid: string;
  /** Pool master */
  master?: Maybe<GHost>;
  /** Default SR */
  defaultSr?: Maybe<Gsr>;
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

export interface CurrentUserInformation {
  isAdmin: boolean;

  user?: Maybe<User>;

  groups?: Maybe<(Maybe<User>)[]>;
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
  /** Clone template */
  templateClone?: Maybe<TemplateCloneMutation>;
  /** Delete template */
  templateDelete?: Maybe<TemplateDestroyMutation>;
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
  /** If VM is Running, suspend VM. If Suspended, resume VM */
  vmSuspend?: Maybe<VmSuspendMutation>;
  /** Delete a Halted VM */
  vmDelete?: Maybe<VmDeleteMutation>;
  /** Set VM access rights */
  vmAccessSet?: Maybe<VmAccessSet>;
  /** Launch an Ansible Playbook on specified VMs */
  playbookLaunch?: Maybe<PlaybookLaunchMutation>;
  /** Attach VM to a Network by creating a new Interface */
  netAttach?: Maybe<AttachNetworkMutation>;
  /** Set network access rights */
  netAccessSet?: Maybe<NetAccessSet>;
  /** Attach VDI to a VM by creating a new virtual block device */
  vdiAttach?: Maybe<AttachVdiMutation>;
  /** Set VDI access rights */
  vdiAccessSet?: Maybe<VdiAccessSet>;
  /** Set SR access rights */
  srAccessSet?: Maybe<SrAccessSet>;

  selectedItems?: Maybe<string[]>;
}

export interface CreateVm {
  /** Installation task ID */
  taskId?: Maybe<string>;

  granted: boolean;

  reason?: Maybe<string>;
}

export interface TemplateMutation {
  /** If access is granted */
  granted: boolean;
  /** If access is not granted, return reason why */
  reason?: Maybe<string>;
}

export interface TemplateCloneMutation {
  /** clone task ID */
  taskId?: Maybe<string>;
  /** Shows if access to clone is granted */
  granted: boolean;

  reason?: Maybe<string>;
}

export interface TemplateDestroyMutation {
  /** destroy task ID */
  taskId?: Maybe<string>;
  /** Shows if access to destroy is granted */
  granted: boolean;

  reason?: Maybe<string>;
}

/** This class represents synchronous mutations for VM, i.e. you can change name_label, name_description, etc. */
export interface VmMutation {
  granted: boolean;

  reason?: Maybe<string>;
}

export interface VmStartMutation {
  /** Start task ID */
  taskId?: Maybe<string>;
  /** Shows if access to start is granted */
  granted: boolean;

  reason?: Maybe<string>;
}

export interface VmShutdownMutation {
  /** Shutdown task ID */
  taskId?: Maybe<string>;
  /** Shows if access to shutdown is granted */
  granted: boolean;
}

export interface VmRebootMutation {
  /** Reboot task ID */
  taskId?: Maybe<string>;
  /** Shows if access to reboot is granted */
  granted: boolean;
}

export interface VmPauseMutation {
  /** Pause/unpause task ID */
  taskId?: Maybe<string>;
  /** Shows if access to pause/unpause is granted */
  granted: boolean;

  reason?: Maybe<string>;
}

export interface VmSuspendMutation {
  /** Suspend/resume task ID */
  taskId?: Maybe<string>;
  /** Shows if access to suspend/resume is granted */
  granted: boolean;

  reason?: Maybe<string>;
}

export interface VmDeleteMutation {
  /** Deleting task ID */
  taskId?: Maybe<string>;
  /** Shows if access to delete is granted */
  granted: boolean;

  reason?: Maybe<string>;
}

export interface VmAccessSet {
  success: boolean;
}

export interface PlaybookLaunchMutation {
  /** Playbook execution task ID */
  taskId: string;
}

export interface AttachNetworkMutation {
  /** Attach/Detach task ID. If already attached/detached, returns null */
  taskId?: Maybe<string>;

  granted: boolean;

  reason?: Maybe<string>;
}

export interface NetAccessSet {
  success: boolean;
}

export interface AttachVdiMutation {
  /** Attach/Detach task ID. If already attached/detached, returns null */
  taskId?: Maybe<string>;
  /** Returns True if access is granted */
  granted: boolean;
  /** If access is not granted, return the reason */
  reason?: Maybe<string>;
}

export interface VdiAccessSet {
  success: boolean;
}

export interface SrAccessSet {
  success: boolean;
}

/** All subscriptions must return  Observable */
export interface Subscription {
  /** Updates for all VMs */
  vms: GvMsSubscription;
  /** Updates for a particular VM */
  vm?: Maybe<Gvm>;
  /** Updates for all Templates */
  templates: GTemplatesSubscription;
  /** Updates for a particular Template */
  template?: Maybe<GTemplate>;
  /** Updates for all Hosts */
  hosts: GHostsSubscription;
  /** Updates for a particular Host */
  host?: Maybe<GHost>;
  /** Updates for all pools available in VMEmperor */
  pools: GPoolsSubscription;
  /** Updates for a particular Pool */
  pool?: Maybe<GPool>;
  /** Updates for all XenServer tasks */
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

  value: GvmOrDeleted;
}

export interface Deleted {
  /** Deleted object's ref */
  ref: string;
}

export interface GTemplatesSubscription {
  /** Change type */
  changeType: Change;

  value: GTemplateOrDeleted;
}

export interface GHostsSubscription {
  /** Change type */
  changeType: Change;

  value: GHostOrDeleted;
}

export interface GPoolsSubscription {
  /** Change type */
  changeType: Change;

  value: GPoolOrDeleted;
}

export interface GTasksSubscription {
  /** Change type */
  changeType: Change;

  value: GTaskOrDeleted;
}

export interface GTask extends GAclXenObject {
  /** a human-readable name */
  nameLabel: string;
  /** a human-readable description */
  nameDescription: string;
  /** Unique constant identifier/object reference (primary) */
  ref: string;
  /** Unique constant identifier/object reference (used in XenCenter) */
  uuid: string;

  access: (Maybe<GTaskAccessEntry>)[];

  myActions: (Maybe<TaskActions>)[];

  isOwner: boolean;
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

export interface GTaskAccessEntry extends GAccessEntry {
  userId: User;

  actions: TaskActions[];
}

export interface PlaybookTasksSubscription {
  /** Change type */
  changeType: Change;

  value: PlaybookTaskOrDeleted;
}

// ====================================================
// Arguments
// ====================================================

export interface VmQueryArgs {
  ref: string;
}

export interface TemplateQueryArgs {
  ref: string;
}

export interface HostQueryArgs {
  ref: string;
}

export interface PoolQueryArgs {
  ref: string;
}

export interface NetworkQueryArgs {
  ref: string;
}

export interface SrQueryArgs {
  ref: string;
}

export interface VdisQueryArgs {
  /** True - print only ISO images; False - print everything but ISO images; null - print everything */
  onlyIsos?: Maybe<boolean>;
}

export interface VdiQueryArgs {
  ref: string;
}

export interface PlaybookQueryArgs {
  id?: Maybe<string>;
}

export interface PlaybookTaskQueryArgs {
  id: string;
}

export interface ConsoleQueryArgs {
  vmRef: string;
}

export interface UserQueryArgs {
  id?: Maybe<string>;
}

export interface FindUserQueryArgs {
  query: string;
}

export interface SelectedItemsQueryArgs {
  tableId: Table;
}

export interface CreateVmMutationArgs {
  disks?: Maybe<(Maybe<NewVdi>)[]>;
  /** Automatic installation parameters, the installation is done via internet. Only available when template.os_kind is not empty */
  installParams?: Maybe<AutoInstall>;
  /** ISO image mounted if conf parameter is null */
  iso?: Maybe<string>;
  /** Network ID to connect to */
  network?: Maybe<string>;
  /** Template ID */
  template: string;
  /** Basic VM options. Leave fields empty to use Template options */
  vmOptions: VmInput;
}

export interface TemplateMutationArgs {
  /** Template to change */
  template: TemplateInput;
}

export interface TemplateCloneMutationArgs {
  /** New name label */
  nameLabel: string;

  ref: string;
}

export interface TemplateDeleteMutationArgs {
  ref: string;
}

export interface VmMutationArgs {
  /** VM to change */
  vm: VmInput;
}

export interface VmStartMutationArgs {
  options?: Maybe<VmStartInput>;

  ref: string;
}

export interface VmShutdownMutationArgs {
  /** Force shutdown in a hard or clean way */
  force?: Maybe<ShutdownForce>;

  ref: string;
}

export interface VmRebootMutationArgs {
  /** Force reboot in a hard or clean way. Default: clean */
  force?: Maybe<ShutdownForce>;

  ref: string;
}

export interface VmPauseMutationArgs {
  ref: string;
}

export interface VmSuspendMutationArgs {
  ref: string;
}

export interface VmDeleteMutationArgs {
  ref: string;
}

export interface VmAccessSetMutationArgs {
  actions: VmActions[];

  ref: string;

  revoke: boolean;

  user: string;
}

export interface PlaybookLaunchMutationArgs {
  /** Playbook ID */
  id: string;
  /** JSON with key-value pairs representing Playbook variables changed by user */
  variables?: Maybe<JsonString>;
  /** VM UUIDs to run Playbook on. Ignored if this is a Playbook with provided Inventory */
  vms?: Maybe<(Maybe<string>)[]>;
}

export interface NetAttachMutationArgs {
  /** True if attach, False if detach */
  isAttach: boolean;

  netRef: string;

  vmRef: string;
}

export interface NetAccessSetMutationArgs {
  actions: NetworkActions[];

  ref: string;

  revoke: boolean;

  user: string;
}

export interface VdiAttachMutationArgs {
  /** True if attach, False if detach */
  isAttach: boolean;

  vdiRef: string;

  vmRef: string;
}

export interface VdiAccessSetMutationArgs {
  actions: VdiActions[];

  ref: string;

  revoke: boolean;

  user: string;
}

export interface SrAccessSetMutationArgs {
  actions: SrActions[];

  ref: string;

  revoke: boolean;

  user: string;
}

export interface SelectedItemsMutationArgs {
  tableId: Table;

  items: string[];

  isSelect: boolean;
}

export interface VmsSubscriptionArgs {
  withInitials?: Maybe<boolean>;
}

export interface VmSubscriptionArgs {
  ref: string;
}

export interface TemplatesSubscriptionArgs {
  withInitials?: Maybe<boolean>;
}

export interface TemplateSubscriptionArgs {
  ref: string;
}

export interface HostsSubscriptionArgs {
  withInitials?: Maybe<boolean>;
}

export interface HostSubscriptionArgs {
  ref: string;
}

export interface PoolsSubscriptionArgs {
  withInitials?: Maybe<boolean>;
}

export interface PoolSubscriptionArgs {
  ref: string;
}

export interface TasksSubscriptionArgs {
  withInitials?: Maybe<boolean>;
}

export interface TaskSubscriptionArgs {
  ref: string;
}

export interface PlaybookTaskSubscriptionArgs {
  id: string;
}

export interface PlaybookTasksSubscriptionArgs {
  withInitials?: Maybe<boolean>;
}

// ====================================================
// Unions
// ====================================================

export type GvmOrDeleted = Gvm | Deleted;

export type GTemplateOrDeleted = GTemplate | Deleted;

export type GHostOrDeleted = GHost | Deleted;

export type GPoolOrDeleted = GPool | Deleted;

export type GTaskOrDeleted = GTask | Deleted;

export type PlaybookTaskOrDeleted = PlaybookTask | Deleted;

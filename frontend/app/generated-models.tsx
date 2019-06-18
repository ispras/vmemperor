type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `DateTime` scalar type represents a DateTime
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
   */
  DateTime: any;
  /** JSON String */
  JSONString: any;
};

/** An enumeration. */
export enum Arch {
  I386 = "I386",
  X86_64 = "X86_64"
}

export type AttachNetworkMutation = {
  /** Attach/Detach task ID. If already attached/detached, returns null */
  taskId?: Maybe<Scalars["ID"]>;
  granted: Scalars["Boolean"];
  reason?: Maybe<Scalars["String"]>;
};

export type AttachVDIMutation = {
  /** Attach/Detach task ID. If already attached/detached, returns null */
  taskId?: Maybe<Scalars["ID"]>;
  /** Returns True if access is granted */
  granted: Scalars["Boolean"];
  /** If access is not granted, return the reason */
  reason?: Maybe<Scalars["String"]>;
};

export type AutoInstall = {
  /** VM hostname */
  hostname: Scalars["String"];
  /** Name of the newly created user */
  username: Scalars["String"];
  /** User and root password */
  password: Scalars["String"];
  /** User's full name */
  fullname?: Maybe<Scalars["String"]>;
  /** Partition scheme (TODO) */
  partition: Scalars["String"];
  /** Static IP configuration, if needed */
  staticIpConfig?: Maybe<NetworkConfiguration>;
};

export enum Change {
  Initial = "Initial",
  Add = "Add",
  Remove = "Remove",
  Change = "Change"
}

export type CpuInfo = {
  cpuCount: Scalars["Int"];
  modelname: Scalars["String"];
  socketCount: Scalars["Int"];
  vendor: Scalars["String"];
  family: Scalars["Int"];
  features: Scalars["ID"];
  featuresHvm?: Maybe<Scalars["ID"]>;
  featuresPv?: Maybe<Scalars["ID"]>;
  flags: Scalars["String"];
  model: Scalars["Int"];
  speed: Scalars["Float"];
  stepping: Scalars["Int"];
};

export type CreateVM = {
  /** Installation task ID */
  taskId?: Maybe<Scalars["ID"]>;
  granted: Scalars["Boolean"];
  reason?: Maybe<Scalars["String"]>;
};

export type CurrentUserInformation = {
  isAdmin: Scalars["Boolean"];
  user?: Maybe<User>;
  groups?: Maybe<Array<Maybe<User>>>;
};

export type Deleted = {
  /** Deleted object's ref */
  ref: Scalars["ID"];
};

/** An enumeration. */
export enum Distro {
  Debian = "Debian",
  CentOS = "CentOS",
  SUSE = "SUSE"
}

/** An enumeration. */
export enum DomainType {
  HVM = "HVM",
  PV = "PV",
  PV_in_PVH = "PV_in_PVH"
}

export type GAbstractVM = {
  /** CPU platform parameters */
  platform?: Maybe<Platform>;
  VCPUsAtStartup: Scalars["Int"];
  VCPUsMax: Scalars["Int"];
  domainType: DomainType;
  guestMetrics: Scalars["ID"];
  installTime: Scalars["DateTime"];
  memoryActual: Scalars["Float"];
  memoryStaticMin: Scalars["Float"];
  memoryStaticMax: Scalars["Float"];
  memoryDynamicMin: Scalars["Float"];
  memoryDynamicMax: Scalars["Float"];
  PVBootloader: Scalars["String"];
};

export type GAccessEntry = {
  userId: User;
  isOwner: Scalars["Boolean"];
};

export type GAclXenObject = {
  /** a human-readable name */
  nameLabel: Scalars["String"];
  /** a human-readable description */
  nameDescription: Scalars["String"];
  /** Unique constant identifier/object reference (primary) */
  ref: Scalars["ID"];
  /** Unique constant identifier/object reference (used in XenCenter) */
  uuid: Scalars["ID"];
  access: Array<Maybe<GAccessEntry>>;
  isOwner: Scalars["Boolean"];
};

export type GHost = GXenObject & {
  /** a human-readable name */
  nameLabel: Scalars["String"];
  /** a human-readable description */
  nameDescription: Scalars["String"];
  /** Unique constant identifier/object reference (primary) */
  ref: Scalars["ID"];
  /** Unique constant identifier/object reference (used in XenCenter) */
  uuid: Scalars["ID"];
  /** Major XenAPI version number */
  APIVersionMajor?: Maybe<Scalars["Int"]>;
  /** Minor XenAPI version number */
  APIVersionMinor?: Maybe<Scalars["Int"]>;
  /** Connections to storage repositories */
  PBDs: Array<Maybe<GPBD>>;
  PCIs: Array<Maybe<Scalars["ID"]>>;
  PGPUs: Array<Maybe<Scalars["ID"]>>;
  PIFs: Array<Maybe<Scalars["ID"]>>;
  PUSBs: Array<Maybe<Scalars["ID"]>>;
  /** The address by which this host can be contacted from any other host in the pool */
  address: Scalars["String"];
  allowedOperations: Array<Maybe<HostAllowedOperations>>;
  cpuInfo: CpuInfo;
  display: HostDisplay;
  hostname: Scalars["String"];
  softwareVersion: SoftwareVersion;
  /** VMs currently resident on host */
  residentVms: Array<Maybe<GVM>>;
  metrics: Scalars["ID"];
  /** Total memory in kilobytes */
  memoryTotal?: Maybe<Scalars["Float"]>;
  /** Free memory in kilobytes */
  memoryFree?: Maybe<Scalars["Float"]>;
  /** Available memory as measured by the host in kilobytes */
  memoryAvailable?: Maybe<Scalars["Float"]>;
  /** Virtualization overhead in kilobytes */
  memoryOverhead?: Maybe<Scalars["Float"]>;
  /** True if host is up. May be null if no data */
  live?: Maybe<Scalars["Boolean"]>;
  /** When live status was last updated */
  liveUpdated?: Maybe<Scalars["DateTime"]>;
};

export type GHostOrDeleted = GHost | Deleted;

export type GHostsSubscription = {
  /** Change type */
  changeType: Change;
  value: GHostOrDeleted;
};

export type GNetwork = GAclXenObject & {
  /** a human-readable name */
  nameLabel: Scalars["String"];
  /** a human-readable description */
  nameDescription: Scalars["String"];
  /** Unique constant identifier/object reference (primary) */
  ref: Scalars["ID"];
  /** Unique constant identifier/object reference (used in XenCenter) */
  uuid: Scalars["ID"];
  access: Array<Maybe<GNetworkAccessEntry>>;
  isOwner: Scalars["Boolean"];
  myActions: Array<Maybe<NetworkActions>>;
  VIFs?: Maybe<Array<Maybe<GVIF>>>;
  otherConfig?: Maybe<Scalars["JSONString"]>;
};

export type GNetworkAccessEntry = GAccessEntry & {
  userId: User;
  isOwner: Scalars["Boolean"];
  actions: Array<NetworkActions>;
};

export type GNetworkOrDeleted = GNetwork | Deleted;

export type GNetworksSubscription = {
  /** Change type */
  changeType: Change;
  value: GNetworkOrDeleted;
};

/** Fancy name for a PBD. Not a real Xen object, though a connection
 * between a host and a SR
 */
export type GPBD = {
  /** Unique constant identifier/object reference */
  ref: Scalars["ID"];
  /** Unique non-primary identifier/object reference */
  uuid: Scalars["ID"];
  /** Host to which the SR is supposed to be connected to */
  host: GHost;
  deviceConfig: Scalars["JSONString"];
  SR: GSR;
  currentlyAttached: Scalars["Boolean"];
};

export type GPlaybook = {
  /** Playbook ID */
  id: Scalars["ID"];
  /** Inventory file path */
  inventory?: Maybe<Scalars["String"]>;
  /** Requirements for running this playbook */
  requires?: Maybe<PlaybookRequirements>;
  /** Playbook name */
  name: Scalars["String"];
  /** Playbook description */
  description?: Maybe<Scalars["String"]>;
  /** Variables available for change to an user */
  variables?: Maybe<Scalars["JSONString"]>;
};

export type GPool = GAclXenObject & {
  /** a human-readable name */
  nameLabel: Scalars["String"];
  /** a human-readable description */
  nameDescription: Scalars["String"];
  /** Unique constant identifier/object reference (primary) */
  ref: Scalars["ID"];
  /** Unique constant identifier/object reference (used in XenCenter) */
  uuid: Scalars["ID"];
  access: Array<Maybe<GPoolAccessEntry>>;
  isOwner: Scalars["Boolean"];
  myActions: Array<Maybe<PoolActions>>;
  /** Pool master */
  master?: Maybe<GHost>;
  /** Default SR */
  defaultSr?: Maybe<GSR>;
};

export type GPoolAccessEntry = GAccessEntry & {
  userId: User;
  isOwner: Scalars["Boolean"];
  actions: Array<PoolActions>;
};

export type GPoolOrDeleted = GPool | Deleted;

export type GPoolsSubscription = {
  /** Change type */
  changeType: Change;
  value: GPoolOrDeleted;
};

export type GQuotaObject = {
  /** The user against whom the quotas for this object are calculated */
  mainOwner?: Maybe<User>;
};

export type GSR = GAclXenObject & {
  /** a human-readable name */
  nameLabel: Scalars["String"];
  /** a human-readable description */
  nameDescription: Scalars["String"];
  /** Unique constant identifier/object reference (primary) */
  ref: Scalars["ID"];
  /** Unique constant identifier/object reference (used in XenCenter) */
  uuid: Scalars["ID"];
  access: Array<Maybe<GSRAccessEntry>>;
  isOwner: Scalars["Boolean"];
  myActions: Array<Maybe<SRActions>>;
  /** Connections to host. Usually one, unless the storage repository is shared: e.g. iSCSI */
  PBDs: Array<Maybe<GPBD>>;
  VDIs?: Maybe<Array<Maybe<GVDI>>>;
  contentType: SRContentType;
  type: Scalars["String"];
  /** Physical size in kilobytes */
  physicalSize: Scalars["Float"];
  /** Virtual allocation in kilobytes */
  virtualAllocation: Scalars["Float"];
  /** This SR contains XenServer Tools */
  isToolsSr: Scalars["Boolean"];
  /** Physical utilisation in bytes */
  physicalUtilisation: Scalars["Float"];
  /** Available space in bytes */
  spaceAvailable: Scalars["Float"];
};

export type GSRAccessEntry = GAccessEntry & {
  userId: User;
  isOwner: Scalars["Boolean"];
  actions: Array<SRActions>;
};

export type GSROrDeleted = GSR | Deleted;

export type GSRsSubscription = {
  /** Change type */
  changeType: Change;
  value: GSROrDeleted;
};

export type GTask = GAclXenObject & {
  /** a human-readable name */
  nameLabel: Scalars["String"];
  /** a human-readable description */
  nameDescription: Scalars["String"];
  /** Unique constant identifier/object reference (primary) */
  ref: Scalars["ID"];
  /** Unique constant identifier/object reference (used in XenCenter) */
  uuid: Scalars["ID"];
  access: Array<Maybe<GTaskAccessEntry>>;
  isOwner: Scalars["Boolean"];
  myActions: Array<Maybe<TaskActions>>;
  /** Task creation time */
  created: Scalars["DateTime"];
  /** Task finish time */
  finished?: Maybe<Scalars["DateTime"]>;
  /** Task progress */
  progress: Scalars["Float"];
  /** Task result if available */
  result?: Maybe<Scalars["ID"]>;
  who?: Maybe<User>;
  /** ref of a host that runs this task */
  residentOn?: Maybe<Scalars["ID"]>;
  /** Error strings, if failed */
  errorInfo?: Maybe<Array<Maybe<Scalars["String"]>>>;
  /** Task status */
  status: TaskStatus;
  /** An object this task is running on */
  objectRef?: Maybe<Scalars["ID"]>;
  /** Object type */
  objectType?: Maybe<Scalars["String"]>;
  /** Action kind, if detected. Must be of object_type's action enum (See also: myActions on type corresponding to object_type) */
  action?: Maybe<Scalars["String"]>;
};

export type GTaskAccessEntry = GAccessEntry & {
  userId: User;
  isOwner: Scalars["Boolean"];
  actions: Array<TaskActions>;
};

export type GTaskOrDeleted = GTask | Deleted;

export type GTasksSubscription = {
  /** Change type */
  changeType: Change;
  value: GTaskOrDeleted;
};

export type GTemplate = GAclXenObject &
  GAbstractVM & {
    /** a human-readable name */
    nameLabel: Scalars["String"];
    /** a human-readable description */
    nameDescription: Scalars["String"];
    /** Unique constant identifier/object reference (primary) */
    ref: Scalars["ID"];
    /** Unique constant identifier/object reference (used in XenCenter) */
    uuid: Scalars["ID"];
    access: Array<Maybe<GTemplateAccessEntry>>;
    isOwner: Scalars["Boolean"];
    /** CPU platform parameters */
    platform?: Maybe<Platform>;
    VCPUsAtStartup: Scalars["Int"];
    VCPUsMax: Scalars["Int"];
    domainType: DomainType;
    guestMetrics: Scalars["ID"];
    installTime: Scalars["DateTime"];
    memoryActual: Scalars["Float"];
    memoryStaticMin: Scalars["Float"];
    memoryStaticMax: Scalars["Float"];
    memoryDynamicMin: Scalars["Float"];
    memoryDynamicMax: Scalars["Float"];
    PVBootloader: Scalars["String"];
    myActions: Array<Maybe<TemplateActions>>;
    /** This template is preinstalled with XenServer */
    isDefaultTemplate: Scalars["Boolean"];
    /** If the template supports unattended installation, its options are there */
    installOptions?: Maybe<InstallOSOptions>;
  };

export type GTemplateAccessEntry = GAccessEntry & {
  userId: User;
  isOwner: Scalars["Boolean"];
  actions: Array<TemplateActions>;
};

export type GTemplateOrDeleted = GTemplate | Deleted;

export type GTemplatesSubscription = {
  /** Change type */
  changeType: Change;
  value: GTemplateOrDeleted;
};

export type GVBD = {
  /** Unique constant identifier/object reference */
  ref: Scalars["ID"];
  /** Unique non-primary identifier/object reference */
  uuid: Scalars["ID"];
  VM?: Maybe<GVM>;
  VDI?: Maybe<GVDI>;
  type: VBDType;
  mode: VBDMode;
  currentlyAttached: Scalars["Boolean"];
  bootable: Scalars["Boolean"];
  userdevice: Scalars["Int"];
};

export type GVDI = GAclXenObject &
  GQuotaObject & {
    /** a human-readable name */
    nameLabel: Scalars["String"];
    /** a human-readable description */
    nameDescription: Scalars["String"];
    /** Unique constant identifier/object reference (primary) */
    ref: Scalars["ID"];
    /** Unique constant identifier/object reference (used in XenCenter) */
    uuid: Scalars["ID"];
    access: Array<Maybe<GVDIAccessEntry>>;
    isOwner: Scalars["Boolean"];
    /** The user against whom the quotas for this object are calculated */
    mainOwner?: Maybe<User>;
    myActions: Array<Maybe<VDIActions>>;
    SR?: Maybe<GSR>;
    virtualSize: Scalars["Float"];
    VBDs: Array<Maybe<GVBD>>;
    contentType: SRContentType;
    type: VDIType;
  };

export type GVDIAccessEntry = GAccessEntry & {
  userId: User;
  isOwner: Scalars["Boolean"];
  actions: Array<VDIActions>;
};

export type GVDIOrDeleted = GVDI | Deleted;

export type GVDIsSubscription = {
  /** Change type */
  changeType: Change;
  value: GVDIOrDeleted;
};

export type GVIF = {
  /** Unique constant identifier/object reference (primary) */
  ref: Scalars["ID"];
  /** MAC address */
  MAC: Scalars["ID"];
  VM?: Maybe<GVM>;
  /** Device ID */
  device: Scalars["ID"];
  currentlyAttached: Scalars["Boolean"];
  ip?: Maybe<Scalars["String"]>;
  ipv4?: Maybe<Scalars["String"]>;
  ipv6?: Maybe<Scalars["String"]>;
  network?: Maybe<GNetwork>;
};

export type GVM = GAclXenObject &
  GAbstractVM &
  GQuotaObject & {
    /** a human-readable name */
    nameLabel: Scalars["String"];
    /** a human-readable description */
    nameDescription: Scalars["String"];
    /** Unique constant identifier/object reference (primary) */
    ref: Scalars["ID"];
    /** Unique constant identifier/object reference (used in XenCenter) */
    uuid: Scalars["ID"];
    access: Array<Maybe<GVMAccessEntry>>;
    isOwner: Scalars["Boolean"];
    /** CPU platform parameters */
    platform?: Maybe<Platform>;
    VCPUsAtStartup: Scalars["Int"];
    VCPUsMax: Scalars["Int"];
    domainType: DomainType;
    guestMetrics: Scalars["ID"];
    installTime: Scalars["DateTime"];
    memoryActual: Scalars["Float"];
    memoryStaticMin: Scalars["Float"];
    memoryStaticMax: Scalars["Float"];
    memoryDynamicMin: Scalars["Float"];
    memoryDynamicMax: Scalars["Float"];
    PVBootloader: Scalars["String"];
    /** The user against whom the quotas for this object are calculated */
    mainOwner?: Maybe<User>;
    myActions: Array<Maybe<VMActions>>;
    /** True if PV drivers are up to date, reported if Guest Additions are installed */
    PVDriversUpToDate?: Maybe<Scalars["Boolean"]>;
    /** PV drivers version, if available */
    PVDriversVersion?: Maybe<PvDriversVersion>;
    metrics: Scalars["ID"];
    osVersion?: Maybe<OSVersion>;
    powerState: PowerState;
    startTime?: Maybe<Scalars["DateTime"]>;
    VIFs: Array<Maybe<GVIF>>;
    /** Virtual block devices */
    VBDs: Array<Maybe<GVBD>>;
    snapshots: Array<Maybe<GVMSnapshot>>;
  };

export type GVMAccessEntry = GAccessEntry & {
  userId: User;
  isOwner: Scalars["Boolean"];
  actions: Array<VMActions>;
};

export type GVMOrDeleted = GVM | Deleted;

export type GVMSnapshot = GAclXenObject &
  GAbstractVM &
  GQuotaObject & {
    /** a human-readable name */
    nameLabel: Scalars["String"];
    /** a human-readable description */
    nameDescription: Scalars["String"];
    /** Unique constant identifier/object reference (primary) */
    ref: Scalars["ID"];
    /** Unique constant identifier/object reference (used in XenCenter) */
    uuid: Scalars["ID"];
    access: Array<Maybe<GVMAccessEntry>>;
    isOwner: Scalars["Boolean"];
    /** CPU platform parameters */
    platform?: Maybe<Platform>;
    VCPUsAtStartup: Scalars["Int"];
    VCPUsMax: Scalars["Int"];
    domainType: DomainType;
    guestMetrics: Scalars["ID"];
    installTime: Scalars["DateTime"];
    memoryActual: Scalars["Float"];
    memoryStaticMin: Scalars["Float"];
    memoryStaticMax: Scalars["Float"];
    memoryDynamicMin: Scalars["Float"];
    memoryDynamicMax: Scalars["Float"];
    PVBootloader: Scalars["String"];
    /** The user against whom the quotas for this object are calculated */
    mainOwner?: Maybe<User>;
    myActions: Array<Maybe<VMActions>>;
    VIFs: Array<Maybe<GVIF>>;
    /** Virtual block devices */
    VBDs: Array<Maybe<GVBD>>;
    snapshotTime: Scalars["DateTime"];
    snapshotOf: GVM;
  };

export type GVMsSubscription = {
  /** Change type */
  changeType: Change;
  value: GVMOrDeleted;
};

export type GXenObject = {
  /** a human-readable name */
  nameLabel: Scalars["String"];
  /** a human-readable description */
  nameDescription: Scalars["String"];
  /** Unique constant identifier/object reference (primary) */
  ref: Scalars["ID"];
  /** Unique constant identifier/object reference (used in XenCenter) */
  uuid: Scalars["ID"];
};

export enum HostAllowedOperations {
  /** Indicates this host is able to provision another VM */
  Provision = "Provision",
  /** Indicates this host is evacuating */
  Evacuate = "Evacuate",
  /** Indicates this host is in the process of shutting itself down */
  Shutdown = "Shutdown",
  /** Indicates this host is in the process of rebooting */
  Reboot = "Reboot",
  /** Indicates this host is in the process of being powered on */
  PowerOn = "PowerOn",
  /** This host is starting a VM */
  VmStart = "VmStart",
  /** This host is resuming a VM */
  VmResume = "VmResume",
  /** This host is the migration target of a VM */
  VmMigrate = "VmMigrate"
}

export enum HostDisplay {
  /** This host is outputting its console to a physical display device */
  Enabled = "Enabled",
  /** The host will stop outputting its console to a physical display device on next boot */
  DisableOnReboot = "DisableOnReboot",
  /** This host is not outputting its console to a physical display device */
  Disabled = "Disabled",
  /** The host will start outputting its console to a physical display device on next boot */
  EnableOnReboot = "EnableOnReboot"
}

export type InstallOSOptions = {
  distro: Distro;
  arch?: Maybe<Arch>;
  release?: Maybe<Scalars["String"]>;
  installRepository?: Maybe<Scalars["String"]>;
};

export type InstallOSOptionsInput = {
  distro?: Maybe<Distro>;
  arch?: Maybe<Arch>;
  release?: Maybe<Scalars["String"]>;
  installRepository?: Maybe<Scalars["String"]>;
};

export type Mutation = {
  /** Create a new VM */
  createVm?: Maybe<CreateVM>;
  /** Edit template options */
  template?: Maybe<TemplateMutation>;
  /** Clone template */
  templateClone?: Maybe<TemplateCloneMutation>;
  /** Delete template */
  templateDelete?: Maybe<TemplateDestroyMutation>;
  /** Set template access rights */
  templateAccessSet?: Maybe<TemplateAccessSet>;
  /** Edit VM options */
  vm?: Maybe<VMMutation>;
  /** Start VM */
  vmStart?: Maybe<VMStartMutation>;
  /** Shut down VM */
  vmShutdown?: Maybe<VMShutdownMutation>;
  /** Reboot VM */
  vmReboot?: Maybe<VMRebootMutation>;
  /** If VM is Running, pause VM. If Paused, unpause VM */
  vmPause?: Maybe<VMPauseMutation>;
  /** If VM is Running, suspend VM. If Suspended, resume VM */
  vmSuspend?: Maybe<VMSuspendMutation>;
  /** Make a snapshot */
  vmSnapshot?: Maybe<VMSnapshotMutation>;
  /** Restore VM state from a snapshot */
  vmRevert?: Maybe<VMRevertMutation>;
  /** Destroy a VM Snapshot */
  vmSnapshotDestroy?: Maybe<VMSnapshotDestroyMutation>;
  /** Delete a Halted VM */
  vmDelete?: Maybe<VMDestroyMutation>;
  /** Set VM access rights */
  vmAccessSet?: Maybe<VMAccessSet>;
  /** Launch an Ansible Playbook on specified VMs */
  playbookLaunch?: Maybe<PlaybookLaunchMutation>;
  /** Edit Network options */
  network?: Maybe<NetworkMutation>;
  /** Attach VM to a Network by creating a new Interface */
  netAttach?: Maybe<AttachNetworkMutation>;
  /** Set network access rights */
  netAccessSet?: Maybe<NetAccessSet>;
  /** Edit VDI options */
  vdi?: Maybe<VDIMutation>;
  /** Create a new VDI */
  vdiCreate?: Maybe<VDICreateMutation>;
  /** Attach VDI to a VM by creating a new virtual block device */
  vdiAttach?: Maybe<AttachVDIMutation>;
  /** Set VDI access rights */
  vdiAccessSet?: Maybe<VDIAccessSet>;
  /** Delete a VDI */
  vdiDelete?: Maybe<VDIDestroyMutation>;
  /** Edit SR options */
  sr?: Maybe<SRMutation>;
  /** Set SR access rights */
  srAccessSet?: Maybe<SRAccessSet>;
  /** Delete a SR */
  srDelete?: Maybe<SRDestroyMutation>;
  /** Edit pool options */
  pool?: Maybe<PoolMutation>;
  /** Set pool access rights */
  poolAccessSet?: Maybe<PoolAccessSet>;
  /** Delete a Task */
  taskDelete?: Maybe<TaskRemoveMutation>;
  /** Adjust quota */
  quotaSet?: Maybe<QuotaMutation>;
  selectedItems?: Maybe<Array<Scalars["ID"]>>;
};

export type MutationcreateVmArgs = {
  disks?: Maybe<Array<Maybe<NewVDI>>>;
  installParams?: Maybe<AutoInstall>;
  iso?: Maybe<Scalars["ID"]>;
  network?: Maybe<Scalars["ID"]>;
  template: Scalars["ID"];
  vmOptions: VMInput;
};

export type MutationtemplateArgs = {
  ref: Scalars["ID"];
  template: TemplateInput;
};

export type MutationtemplateCloneArgs = {
  nameLabel: Scalars["String"];
  ref: Scalars["ID"];
  user?: Maybe<Scalars["String"]>;
};

export type MutationtemplateDeleteArgs = {
  ref: Scalars["ID"];
};

export type MutationtemplateAccessSetArgs = {
  actions: Array<TemplateActions>;
  ref: Scalars["ID"];
  revoke: Scalars["Boolean"];
  user: Scalars["String"];
};

export type MutationvmArgs = {
  ref: Scalars["ID"];
  vm: VMInput;
};

export type MutationvmStartArgs = {
  options?: Maybe<VMStartInput>;
  ref: Scalars["ID"];
};

export type MutationvmShutdownArgs = {
  force?: Maybe<ShutdownForce>;
  ref: Scalars["ID"];
};

export type MutationvmRebootArgs = {
  force?: Maybe<ShutdownForce>;
  ref: Scalars["ID"];
};

export type MutationvmPauseArgs = {
  ref: Scalars["ID"];
};

export type MutationvmSuspendArgs = {
  ref: Scalars["ID"];
};

export type MutationvmSnapshotArgs = {
  nameLabel: Scalars["String"];
  ref: Scalars["ID"];
};

export type MutationvmRevertArgs = {
  ref: Scalars["ID"];
};

export type MutationvmSnapshotDestroyArgs = {
  ref: Scalars["ID"];
};

export type MutationvmDeleteArgs = {
  ref: Scalars["ID"];
};

export type MutationvmAccessSetArgs = {
  actions: Array<VMActions>;
  ref: Scalars["ID"];
  revoke: Scalars["Boolean"];
  user: Scalars["String"];
};

export type MutationplaybookLaunchArgs = {
  id: Scalars["ID"];
  variables?: Maybe<Scalars["JSONString"]>;
  vms?: Maybe<Array<Maybe<Scalars["ID"]>>>;
};

export type MutationnetworkArgs = {
  network: NetworkInput;
  ref: Scalars["ID"];
};

export type MutationnetAttachArgs = {
  isAttach: Scalars["Boolean"];
  netRef: Scalars["ID"];
  vmRef: Scalars["ID"];
};

export type MutationnetAccessSetArgs = {
  actions: Array<NetworkActions>;
  ref: Scalars["ID"];
  revoke: Scalars["Boolean"];
  user: Scalars["String"];
};

export type MutationvdiArgs = {
  ref: Scalars["ID"];
  vdi: VDIInput;
};

export type MutationvdiCreateArgs = {
  nameLabel: Scalars["String"];
  size: Scalars["Float"];
  srRef: Scalars["ID"];
  user?: Maybe<Scalars["String"]>;
};

export type MutationvdiAttachArgs = {
  isAttach: Scalars["Boolean"];
  vdiRef: Scalars["ID"];
  vmRef: Scalars["ID"];
};

export type MutationvdiAccessSetArgs = {
  actions: Array<VDIActions>;
  ref: Scalars["ID"];
  revoke: Scalars["Boolean"];
  user: Scalars["String"];
};

export type MutationvdiDeleteArgs = {
  ref: Scalars["ID"];
};

export type MutationsrArgs = {
  ref: Scalars["ID"];
  sr: SRInput;
};

export type MutationsrAccessSetArgs = {
  actions: Array<SRActions>;
  ref: Scalars["ID"];
  revoke: Scalars["Boolean"];
  user: Scalars["String"];
};

export type MutationsrDeleteArgs = {
  ref: Scalars["ID"];
};

export type MutationpoolArgs = {
  pool: PoolInput;
  ref: Scalars["ID"];
};

export type MutationpoolAccessSetArgs = {
  actions: Array<PoolActions>;
  ref: Scalars["ID"];
  revoke: Scalars["Boolean"];
  user: Scalars["String"];
};

export type MutationtaskDeleteArgs = {
  ref: Scalars["ID"];
};

export type MutationquotaSetArgs = {
  quota: QuotaInput;
  userId: Scalars["String"];
};

export type MutationselectedItemsArgs = {
  tableId: Table;
  items: Array<Scalars["ID"]>;
  isSelect: Scalars["Boolean"];
};

export type NetAccessSet = {
  success: Scalars["Boolean"];
};

/** An enumeration. */
export enum NetworkActions {
  rename = "rename",
  attaching = "attaching",
  NONE = "NONE",
  ALL = "ALL"
}

export type NetworkConfiguration = {
  ip: Scalars["String"];
  gateway: Scalars["String"];
  netmask: Scalars["String"];
  dns0: Scalars["String"];
  dns1?: Maybe<Scalars["String"]>;
};

export type NetworkInput = {
  /** Object's human-readable name */
  nameLabel?: Maybe<Scalars["String"]>;
  /** Object's human-readable description */
  nameDescription?: Maybe<Scalars["String"]>;
};

export type NetworkMutation = {
  granted: Scalars["Boolean"];
  reason?: Maybe<Scalars["String"]>;
};

export type NewVDI = {
  /** Storage repository to create disk on */
  SR: Scalars["ID"];
  /** Disk size of a newly created disk in bytes */
  size: Scalars["Float"];
};

/** OS version reported by Xen tools */
export type OSVersion = {
  name?: Maybe<Scalars["String"]>;
  uname?: Maybe<Scalars["String"]>;
  distro?: Maybe<Scalars["String"]>;
  major?: Maybe<Scalars["Int"]>;
  minor?: Maybe<Scalars["Int"]>;
};

export type Platform = {
  coresPerSocket?: Maybe<Scalars["Int"]>;
  timeoffset?: Maybe<Scalars["Int"]>;
  nx?: Maybe<Scalars["Boolean"]>;
  deviceModel?: Maybe<Scalars["String"]>;
  pae?: Maybe<Scalars["Boolean"]>;
  hpet?: Maybe<Scalars["Boolean"]>;
  apic?: Maybe<Scalars["Boolean"]>;
  acpi?: Maybe<Scalars["Int"]>;
  videoram?: Maybe<Scalars["Int"]>;
};

export type PlatformInput = {
  coresPerSocket?: Maybe<Scalars["Int"]>;
  timeoffset?: Maybe<Scalars["Int"]>;
  nx?: Maybe<Scalars["Boolean"]>;
  deviceModel?: Maybe<Scalars["String"]>;
  pae?: Maybe<Scalars["Boolean"]>;
  hpet?: Maybe<Scalars["Boolean"]>;
  apic?: Maybe<Scalars["Boolean"]>;
  acpi?: Maybe<Scalars["Int"]>;
  videoram?: Maybe<Scalars["Int"]>;
};

export type PlaybookLaunchMutation = {
  /** Playbook execution task ID */
  taskId: Scalars["ID"];
};

export type PlaybookRequirements = {
  /** Minimal supported OS versions */
  osVersion: Array<Maybe<OSVersion>>;
};

export type PoolAccessSet = {
  success: Scalars["Boolean"];
};

/** An enumeration. */
export enum PoolActions {
  create_vm = "create_vm",
  rename = "rename",
  NONE = "NONE",
  ALL = "ALL"
}

export type PoolInput = {
  /** Object's human-readable name */
  nameLabel?: Maybe<Scalars["String"]>;
  /** Object's human-readable description */
  nameDescription?: Maybe<Scalars["String"]>;
};

export type PoolMutation = {
  granted: Scalars["Boolean"];
  reason?: Maybe<Scalars["String"]>;
};

export enum PowerState {
  Halted = "Halted",
  Paused = "Paused",
  Running = "Running",
  Suspended = "Suspended"
}

/** Drivers version. We don't want any fancy resolver except for the thing that we know that it's a dict in VM document */
export type PvDriversVersion = {
  major?: Maybe<Scalars["Int"]>;
  minor?: Maybe<Scalars["Int"]>;
  micro?: Maybe<Scalars["Int"]>;
  build?: Maybe<Scalars["Int"]>;
};

export type Query = {
  /** All VMs available to user */
  vms: Array<Maybe<GVM>>;
  vm?: Maybe<GVM>;
  vmSnapshot?: Maybe<GVMSnapshot>;
  /** All Templates available to user */
  templates: Array<Maybe<GTemplate>>;
  template?: Maybe<GTemplate>;
  hosts: Array<Maybe<GHost>>;
  host?: Maybe<GHost>;
  pools: Array<Maybe<GPool>>;
  pool?: Maybe<GPool>;
  /** All Networks available to user */
  networks: Array<Maybe<GNetwork>>;
  /** Information about a single network */
  network?: Maybe<GNetwork>;
  /** All Storage repositories available to user */
  srs: Array<Maybe<GSR>>;
  /** Information about a single storage repository */
  sr?: Maybe<GSR>;
  /** All Virtual Disk Images (hard disks), available for user */
  vdis: Array<Maybe<GVDI>>;
  /** Information about a single virtual disk image (hard disk) */
  vdi?: Maybe<GVDI>;
  /** Information about a virtual block device of a VM */
  vbd?: Maybe<GVBD>;
  /** ISO VDIs available for using as install ISO images */
  isosForInstall?: Maybe<Array<Maybe<GVDI>>>;
  /** List of Ansible-powered playbooks */
  playbooks: Array<Maybe<GPlaybook>>;
  /** Information about Ansible-powered playbook */
  playbook?: Maybe<GPlaybook>;
  /** All Tasks available to user */
  tasks: Array<Maybe<GTask>>;
  /** Single Task */
  task?: Maybe<GTask>;
  /** One-time link to RFB console for a VM */
  console?: Maybe<Scalars["String"]>;
  /** All registered users (excluding root) */
  users: Array<Maybe<User>>;
  /** All registered groups */
  groups: Array<Maybe<User>>;
  /** User or group information */
  user?: Maybe<User>;
  /** current user or group information */
  currentUser?: Maybe<CurrentUserInformation>;
  findUser: Array<Maybe<User>>;
  quotas: Array<Maybe<Quota>>;
  quota: Quota;
  /** Amount of quota left for user, in bytes for memory and disk usage */
  quotaLeft: Quota;
  /** Amount of quota usage by user, in bytes for memory and disk usage */
  quotaUsage: Quota;
  selectedItems: Array<Scalars["ID"]>;
  vmSelectedReadyFor: VMSelectedIDLists;
};

export type QueryvmArgs = {
  ref: Scalars["ID"];
};

export type QueryvmSnapshotArgs = {
  ref: Scalars["ID"];
};

export type QuerytemplateArgs = {
  ref: Scalars["ID"];
};

export type QueryhostArgs = {
  ref: Scalars["ID"];
};

export type QuerypoolArgs = {
  ref: Scalars["ID"];
};

export type QuerynetworkArgs = {
  ref: Scalars["ID"];
};

export type QuerysrArgs = {
  ref: Scalars["ID"];
};

export type QueryvdisArgs = {
  onlyIsos?: Maybe<Scalars["Boolean"]>;
};

export type QueryvdiArgs = {
  ref: Scalars["ID"];
};

export type QueryvbdArgs = {
  ref: Scalars["ID"];
};

export type QueryplaybookArgs = {
  id?: Maybe<Scalars["ID"]>;
};

export type QuerytasksArgs = {
  startDate?: Maybe<Scalars["DateTime"]>;
  endDate?: Maybe<Scalars["DateTime"]>;
};

export type QuerytaskArgs = {
  ref: Scalars["ID"];
};

export type QueryconsoleArgs = {
  vmRef: Scalars["ID"];
};

export type QueryuserArgs = {
  id?: Maybe<Scalars["ID"]>;
};

export type QueryfindUserArgs = {
  query: Scalars["String"];
};

export type QueryquotaArgs = {
  user: Scalars["String"];
};

export type QueryquotaLeftArgs = {
  user: Scalars["String"];
};

export type QueryquotaUsageArgs = {
  user: Scalars["String"];
};

export type QueryselectedItemsArgs = {
  tableId: Table;
};

export type Quota = {
  memory?: Maybe<Scalars["Float"]>;
  vdiSize?: Maybe<Scalars["Float"]>;
  vcpuCount?: Maybe<Scalars["Int"]>;
  vmCount?: Maybe<Scalars["Int"]>;
  user: User;
};

export type QuotaInput = {
  memory?: Maybe<Scalars["Float"]>;
  vdiSize?: Maybe<Scalars["Float"]>;
  vcpuCount?: Maybe<Scalars["Int"]>;
  vmCount?: Maybe<Scalars["Int"]>;
};

export type QuotaMutation = {
  success: Scalars["Boolean"];
};

export enum ShutdownForce {
  HARD = "HARD",
  CLEAN = "CLEAN"
}

export type SoftwareVersion = {
  buildNumber: Scalars["String"];
  date: Scalars["String"];
  hostname: Scalars["String"];
  /** Linux kernel version */
  linux: Scalars["String"];
  networkBackend: Scalars["String"];
  platformName: Scalars["String"];
  platformVersion: Scalars["String"];
  platformVersionText: Scalars["String"];
  platformVersionTextShort: Scalars["String"];
  /** XAPI version */
  xapi: Scalars["String"];
  /** Xen version */
  xen: Scalars["String"];
  productBrand: Scalars["String"];
  productVersion: Scalars["String"];
  productVersionText: Scalars["String"];
};

export type SRAccessSet = {
  success: Scalars["Boolean"];
};

/** An enumeration. */
export enum SRActions {
  rename = "rename",
  scan = "scan",
  destroy = "destroy",
  vdi_create = "vdi_create",
  vdi_introduce = "vdi_introduce",
  vdi_clone = "vdi_clone",
  NONE = "NONE",
  ALL = "ALL"
}

export enum SRContentType {
  User = "User",
  Disk = "Disk",
  ISO = "ISO"
}

export type SRDestroyMutation = {
  /** Task ID */
  taskId?: Maybe<Scalars["ID"]>;
  /** Shows if access to destroy is granted */
  granted: Scalars["Boolean"];
  reason?: Maybe<Scalars["String"]>;
};

export type SRInput = {
  /** Object's human-readable name */
  nameLabel?: Maybe<Scalars["String"]>;
  /** Object's human-readable description */
  nameDescription?: Maybe<Scalars["String"]>;
};

export type SRMutation = {
  granted: Scalars["Boolean"];
  reason?: Maybe<Scalars["String"]>;
};

/** All subscriptions must return  Observable */
export type Subscription = {
  /** Updates for all VMs */
  vms: GVMsSubscription;
  /** Updates for a particular VM */
  vm?: Maybe<GVM>;
  /** Updates for a VM Snapshot */
  vmSnapshot?: Maybe<GVMSnapshot>;
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
  /** Updates for all Networks */
  networks: GNetworksSubscription;
  /** Updates for a particular Network */
  network?: Maybe<GNetwork>;
  /** Updates for all Storage Repositories */
  srs: GSRsSubscription;
  /** Updates for a particular Storage Repository */
  sr?: Maybe<GSR>;
  /** Updates for all VDIs */
  vdis: GVDIsSubscription;
  /** Updates for a particular VDI */
  vdi?: Maybe<GVDI>;
  /** Updates for all XenServer tasks */
  tasks: GTasksSubscription;
  /** Updates for a particular XenServer Task */
  task?: Maybe<GTask>;
};

/** All subscriptions must return  Observable */
export type SubscriptionvmsArgs = {
  withInitials: Scalars["Boolean"];
};

/** All subscriptions must return  Observable */
export type SubscriptionvmArgs = {
  ref: Scalars["ID"];
};

/** All subscriptions must return  Observable */
export type SubscriptionvmSnapshotArgs = {
  ref: Scalars["ID"];
};

/** All subscriptions must return  Observable */
export type SubscriptiontemplatesArgs = {
  withInitials: Scalars["Boolean"];
};

/** All subscriptions must return  Observable */
export type SubscriptiontemplateArgs = {
  ref: Scalars["ID"];
};

/** All subscriptions must return  Observable */
export type SubscriptionhostsArgs = {
  withInitials: Scalars["Boolean"];
};

/** All subscriptions must return  Observable */
export type SubscriptionhostArgs = {
  ref: Scalars["ID"];
};

/** All subscriptions must return  Observable */
export type SubscriptionpoolsArgs = {
  withInitials: Scalars["Boolean"];
};

/** All subscriptions must return  Observable */
export type SubscriptionpoolArgs = {
  ref: Scalars["ID"];
};

/** All subscriptions must return  Observable */
export type SubscriptionnetworksArgs = {
  withInitials: Scalars["Boolean"];
};

/** All subscriptions must return  Observable */
export type SubscriptionnetworkArgs = {
  ref: Scalars["ID"];
};

/** All subscriptions must return  Observable */
export type SubscriptionsrsArgs = {
  withInitials: Scalars["Boolean"];
};

/** All subscriptions must return  Observable */
export type SubscriptionsrArgs = {
  ref: Scalars["ID"];
};

/** All subscriptions must return  Observable */
export type SubscriptionvdisArgs = {
  withInitials: Scalars["Boolean"];
  onlyIsos?: Maybe<Scalars["Boolean"]>;
};

/** All subscriptions must return  Observable */
export type SubscriptionvdiArgs = {
  ref: Scalars["ID"];
};

/** All subscriptions must return  Observable */
export type SubscriptiontasksArgs = {
  withInitials: Scalars["Boolean"];
};

/** All subscriptions must return  Observable */
export type SubscriptiontaskArgs = {
  ref: Scalars["ID"];
};

export enum Table {
  VMS = "VMS",
  Templates = "Templates",
  Networks = "Networks",
  ISOs = "ISOs",
  VDIs = "VDIs",
  SRs = "SRs",
  NetworkAttach = "NetworkAttach",
  DiskAttach = "DiskAttach",
  Tasks = "Tasks"
}

/** An enumeration. */
export enum TaskActions {
  cancel = "cancel",
  remove = "remove",
  NONE = "NONE",
  ALL = "ALL"
}

export type TaskRemoveMutation = {
  /** always null, provided for compatibility */
  taskId?: Maybe<Scalars["ID"]>;
  /** Shows if access to task remove is granted */
  granted: Scalars["Boolean"];
  reason?: Maybe<Scalars["String"]>;
};

/** An enumeration. */
export enum TaskStatus {
  Pending = "Pending",
  Success = "Success",
  Failure = "Failure",
  Cancelling = "Cancelling",
  Cancelled = "Cancelled"
}

export type TemplateAccessSet = {
  success: Scalars["Boolean"];
};

/** An enumeration. */
export enum TemplateActions {
  rename = "rename",
  create_vm = "create_vm",
  clone = "clone",
  destroy = "destroy",
  change_install_os_options = "change_install_os_options",
  change_domain_type = "change_domain_type",
  changing_VCPUs = "changing_VCPUs",
  changing_memory_limits = "changing_memory_limits",
  NONE = "NONE",
  ALL = "ALL"
}

export type TemplateCloneMutation = {
  /** clone task ID */
  taskId?: Maybe<Scalars["ID"]>;
  /** Shows if access to clone is granted */
  granted: Scalars["Boolean"];
  reason?: Maybe<Scalars["String"]>;
};

export type TemplateDestroyMutation = {
  /** Task ID */
  taskId?: Maybe<Scalars["ID"]>;
  /** Shows if access to destroy is granted */
  granted: Scalars["Boolean"];
  reason?: Maybe<Scalars["String"]>;
};

export type TemplateInput = {
  /** Object's human-readable name */
  nameLabel?: Maybe<Scalars["String"]>;
  /** Object's human-readable description */
  nameDescription?: Maybe<Scalars["String"]>;
  /** VM domain type: 'pv', 'hvm', 'pv_in_pvh' */
  domainType?: Maybe<DomainType>;
  /** VCPU platform properties */
  platform?: Maybe<PlatformInput>;
  /** Number of VCPUs at startup */
  VCPUsAtStartup?: Maybe<Scalars["Int"]>;
  /** Maximum number of VCPUs */
  VCPUsMax?: Maybe<Scalars["Int"]>;
  /** Dynamic memory min in bytes */
  memoryDynamicMin?: Maybe<Scalars["Float"]>;
  /** Dynamic memory max in bytes */
  memoryDynamicMax?: Maybe<Scalars["Float"]>;
  /** Static memory min in bytes */
  memoryStaticMin?: Maybe<Scalars["Float"]>;
  /** Static memory max in bytes */
  memoryStaticMax?: Maybe<Scalars["Float"]>;
  installOptions?: Maybe<InstallOSOptionsInput>;
};

export type TemplateMutation = {
  granted: Scalars["Boolean"];
  reason?: Maybe<Scalars["String"]>;
};

export type User = {
  id: Scalars["ID"];
  name: Scalars["String"];
  username: Scalars["String"];
};

export enum VBDMode {
  RO = "RO",
  RW = "RW"
}

export enum VBDType {
  CD = "CD",
  Disk = "Disk",
  Floppy = "Floppy"
}

export type VDIAccessSet = {
  success: Scalars["Boolean"];
};

/** An enumeration. */
export enum VDIActions {
  rename = "rename",
  plug = "plug",
  destroy = "destroy",
  NONE = "NONE",
  ALL = "ALL"
}

export type VDICreateMutation = {
  /** Create VDI task ID */
  taskId?: Maybe<Scalars["ID"]>;
  /** Shows if access to VDI creation is granted */
  granted: Scalars["Boolean"];
  reason?: Maybe<Scalars["String"]>;
};

export type VDIDestroyMutation = {
  /** Task ID */
  taskId?: Maybe<Scalars["ID"]>;
  /** Shows if access to destroy is granted */
  granted: Scalars["Boolean"];
  reason?: Maybe<Scalars["String"]>;
};

export type VDIInput = {
  /** Object's human-readable name */
  nameLabel?: Maybe<Scalars["String"]>;
  /** Object's human-readable description */
  nameDescription?: Maybe<Scalars["String"]>;
  /** A user against whom the quotes are calculated */
  mainOwner?: Maybe<Scalars["ID"]>;
};

export type VDIMutation = {
  granted: Scalars["Boolean"];
  reason?: Maybe<Scalars["String"]>;
};

/** VDI class supports only a subset of VDI types, that are listed below. */
export enum VDIType {
  System = "System",
  User = "User",
  Ephemeral = "Ephemeral"
}

export type VMAccessSet = {
  success: Scalars["Boolean"];
};

/** An enumeration. */
export enum VMActions {
  attach_vdi = "attach_vdi",
  attach_network = "attach_network",
  rename = "rename",
  change_domain_type = "change_domain_type",
  VNC = "VNC",
  launch_playbook = "launch_playbook",
  changing_VCPUs = "changing_VCPUs",
  changing_memory_limits = "changing_memory_limits",
  snapshot = "snapshot",
  clone = "clone",
  copy = "copy",
  create_template = "create_template",
  revert = "revert",
  checkpoint = "checkpoint",
  snapshot_with_quiesce = "snapshot_with_quiesce",
  start = "start",
  start_on = "start_on",
  pause = "pause",
  unpause = "unpause",
  clean_shutdown = "clean_shutdown",
  clean_reboot = "clean_reboot",
  hard_shutdown = "hard_shutdown",
  power_state_reset = "power_state_reset",
  hard_reboot = "hard_reboot",
  suspend = "suspend",
  csvm = "csvm",
  resume = "resume",
  resume_on = "resume_on",
  pool_migrate = "pool_migrate",
  migrate_send = "migrate_send",
  shutdown = "shutdown",
  destroy = "destroy",
  NONE = "NONE",
  ALL = "ALL"
}

export type VMDestroyMutation = {
  /** Deleting task ID */
  taskId?: Maybe<Scalars["ID"]>;
  /** Shows if access to delete is granted */
  granted: Scalars["Boolean"];
  reason?: Maybe<Scalars["String"]>;
};

export type VMInput = {
  /** Object's human-readable name */
  nameLabel?: Maybe<Scalars["String"]>;
  /** Object's human-readable description */
  nameDescription?: Maybe<Scalars["String"]>;
  /** VM domain type: 'pv', 'hvm', 'pv_in_pvh' */
  domainType?: Maybe<DomainType>;
  /** VCPU platform properties */
  platform?: Maybe<PlatformInput>;
  /** Number of VCPUs at startup */
  VCPUsAtStartup?: Maybe<Scalars["Int"]>;
  /** Maximum number of VCPUs */
  VCPUsMax?: Maybe<Scalars["Int"]>;
  /** Dynamic memory min in bytes */
  memoryDynamicMin?: Maybe<Scalars["Float"]>;
  /** Dynamic memory max in bytes */
  memoryDynamicMax?: Maybe<Scalars["Float"]>;
  /** Static memory min in bytes */
  memoryStaticMin?: Maybe<Scalars["Float"]>;
  /** Static memory max in bytes */
  memoryStaticMax?: Maybe<Scalars["Float"]>;
  /** A user against whom the quotes are calculated */
  mainOwner?: Maybe<Scalars["ID"]>;
};

export type VMMutation = {
  granted: Scalars["Boolean"];
  reason?: Maybe<Scalars["String"]>;
};

export type VMPauseMutation = {
  /** Pause/unpause task ID */
  taskId?: Maybe<Scalars["ID"]>;
  /** Shows if access to pause/unpause is granted */
  granted: Scalars["Boolean"];
  reason?: Maybe<Scalars["String"]>;
};

export type VMRebootMutation = {
  /** Reboot task ID */
  taskId?: Maybe<Scalars["ID"]>;
  /** Shows if access to reboot is granted */
  granted: Scalars["Boolean"];
};

export type VMRevertMutation = {
  /** Task ID */
  taskId?: Maybe<Scalars["ID"]>;
  /** Shows if access to destroy is granted */
  granted: Scalars["Boolean"];
  reason?: Maybe<Scalars["String"]>;
};

export type VMSelectedIDLists = {
  start?: Maybe<Array<Maybe<Scalars["ID"]>>>;
  stop?: Maybe<Array<Maybe<Scalars["ID"]>>>;
  trash?: Maybe<Array<Maybe<Scalars["ID"]>>>;
};

export type VMShutdownMutation = {
  /** Shutdown task ID */
  taskId?: Maybe<Scalars["ID"]>;
  /** Shows if access to shutdown is granted */
  granted: Scalars["Boolean"];
};

export type VMSnapshotDestroyMutation = {
  /** Task ID */
  taskId?: Maybe<Scalars["ID"]>;
  /** Shows if access to destroy is granted */
  granted: Scalars["Boolean"];
  reason?: Maybe<Scalars["String"]>;
};

export type VMSnapshotMutation = {
  /** Snapshot task ID */
  taskId?: Maybe<Scalars["ID"]>;
  /** Shows if access to snapshot is granted */
  granted: Scalars["Boolean"];
  reason?: Maybe<Scalars["String"]>;
};

export type VMStartInput = {
  /** Should this VM be started and immidiately paused */
  paused?: Maybe<Scalars["Boolean"]>;
  /** Host to start VM on */
  host?: Maybe<Scalars["ID"]>;
  /** Should this VM be started forcibly */
  force?: Maybe<Scalars["Boolean"]>;
};

export type VMStartMutation = {
  /** Start task ID */
  taskId?: Maybe<Scalars["ID"]>;
  /** Shows if access to start is granted */
  granted: Scalars["Boolean"];
  reason?: Maybe<Scalars["String"]>;
};

export type VMSuspendMutation = {
  /** Task ID */
  taskId?: Maybe<Scalars["ID"]>;
  /** Shows if access to destroy is granted */
  granted: Scalars["Boolean"];
  reason?: Maybe<Scalars["String"]>;
};
export type AbstractVMFragmentFragment = {
  __typename?: "GVM" | "GVMSnapshot" | "GTemplate";
} & Pick<
  GAbstractVM,
  | "memoryStaticMin"
  | "memoryStaticMax"
  | "memoryDynamicMin"
  | "memoryDynamicMax"
  | "VCPUsAtStartup"
  | "VCPUsMax"
  | "domainType"
> & {
    platform: Maybe<
      { __typename?: "Platform" } & Pick<Platform, "coresPerSocket">
    >;
  };

export type VMAccessSetMutationMutationVariables = {
  actions: Array<VMActions>;
  user: Scalars["String"];
  ref: Scalars["ID"];
  revoke: Scalars["Boolean"];
};

export type VMAccessSetMutationMutation = { __typename?: "Mutation" } & {
  vmAccessSet: Maybe<
    { __typename?: "VMAccessSet" } & Pick<VMAccessSet, "success">
  >;
};

export type TemplateAccessSetMutationMutationVariables = {
  actions: Array<TemplateActions>;
  user: Scalars["String"];
  ref: Scalars["ID"];
  revoke: Scalars["Boolean"];
};

export type TemplateAccessSetMutationMutation = { __typename?: "Mutation" } & {
  templateAccessSet: Maybe<
    { __typename?: "TemplateAccessSet" } & Pick<TemplateAccessSet, "success">
  >;
};

export type NetworkAccessSetMutationMutationVariables = {
  actions: Array<NetworkActions>;
  user: Scalars["String"];
  ref: Scalars["ID"];
  revoke: Scalars["Boolean"];
};

export type NetworkAccessSetMutationMutation = { __typename?: "Mutation" } & {
  netAccessSet: Maybe<
    { __typename?: "NetAccessSet" } & Pick<NetAccessSet, "success">
  >;
};

export type SRAccessSetMutationMutationVariables = {
  actions: Array<SRActions>;
  user: Scalars["String"];
  ref: Scalars["ID"];
  revoke: Scalars["Boolean"];
};

export type SRAccessSetMutationMutation = { __typename?: "Mutation" } & {
  srAccessSet: Maybe<
    { __typename?: "SRAccessSet" } & Pick<SRAccessSet, "success">
  >;
};

export type VDIAccessSetMutationMutationVariables = {
  actions: Array<VDIActions>;
  user: Scalars["String"];
  ref: Scalars["ID"];
  revoke: Scalars["Boolean"];
};

export type VDIAccessSetMutationMutation = { __typename?: "Mutation" } & {
  vdiAccessSet: Maybe<
    { __typename?: "VDIAccessSet" } & Pick<VDIAccessSet, "success">
  >;
};

export type PoolAccessSetMutationMutationVariables = {
  actions: Array<PoolActions>;
  user: Scalars["String"];
  ref: Scalars["ID"];
  revoke: Scalars["Boolean"];
};

export type PoolAccessSetMutationMutation = { __typename?: "Mutation" } & {
  poolAccessSet: Maybe<
    { __typename?: "PoolAccessSet" } & Pick<PoolAccessSet, "success">
  >;
};

export type AccessFragmentFragment = {
  __typename?:
    | "GVMAccessEntry"
    | "GNetworkAccessEntry"
    | "GVDIAccessEntry"
    | "GSRAccessEntry"
    | "GTemplateAccessEntry"
    | "GPoolAccessEntry"
    | "GTaskAccessEntry";
} & Pick<GAccessEntry, "isOwner"> & {
    userId: { __typename?: "User" } & Pick<User, "username" | "name" | "id">;
  };

export type VDIAttachMutationVariables = {
  vmRef: Scalars["ID"];
  vdiRef: Scalars["ID"];
};

export type VDIAttachMutation = { __typename?: "Mutation" } & {
  vdiAttach: Maybe<
    { __typename?: "AttachVDIMutation" } & Pick<AttachVDIMutation, "taskId">
  >;
};

export type VDIDetachMutationVariables = {
  vmRef: Scalars["ID"];
  vdiRef: Scalars["ID"];
};

export type VDIDetachMutation = { __typename?: "Mutation" } & {
  vdiAttach: Maybe<
    { __typename?: "AttachVDIMutation" } & Pick<AttachVDIMutation, "taskId">
  >;
};

export type NetAttachMutationVariables = {
  vmRef: Scalars["ID"];
  netRef: Scalars["ID"];
};

export type NetAttachMutation = { __typename?: "Mutation" } & {
  netAttach: Maybe<
    { __typename?: "AttachNetworkMutation" } & Pick<
      AttachNetworkMutation,
      "taskId"
    >
  >;
};

export type NetDetachMutationVariables = {
  vmRef: Scalars["ID"];
  netRef: Scalars["ID"];
};

export type NetDetachMutation = { __typename?: "Mutation" } & {
  netAttach: Maybe<
    { __typename?: "AttachNetworkMutation" } & Pick<
      AttachNetworkMutation,
      "taskId"
    >
  >;
};

export type TemplateCloneMutationVariables = {
  ref: Scalars["ID"];
  nameLabel: Scalars["String"];
};

export type TemplateCloneMutation = { __typename?: "Mutation" } & {
  templateClone: Maybe<
    { __typename?: "TemplateCloneMutation" } & Pick<
      TemplateCloneMutation,
      "granted" | "reason" | "taskId"
    >
  >;
};

export type ConsoleQueryVariables = {
  id: Scalars["ID"];
};

export type ConsoleQuery = { __typename?: "Query" } & Pick<Query, "console">;

export type CreateVdiMutationVariables = {
  nameLabel: Scalars["String"];
  user?: Maybe<Scalars["String"]>;
  size: Scalars["Float"];
  srRef: Scalars["ID"];
};

export type CreateVdiMutation = { __typename?: "Mutation" } & {
  vdiCreate: Maybe<
    { __typename?: "VDICreateMutation" } & Pick<
      VDICreateMutation,
      "reason" | "granted" | "taskId"
    >
  >;
};

export type createVmMutationVariables = {
  vmOptions: VMInput;
  disks?: Maybe<Array<Maybe<NewVDI>>>;
  installParams?: Maybe<AutoInstall>;
  iso?: Maybe<Scalars["ID"]>;
  template: Scalars["ID"];
  network?: Maybe<Scalars["ID"]>;
};

export type createVmMutation = { __typename?: "Mutation" } & {
  createVm: Maybe<
    { __typename?: "CreateVM" } & Pick<
      CreateVM,
      "taskId" | "granted" | "reason"
    >
  >;
};

export type TemplateNewVMOptionsQueryVariables = {
  ref: Scalars["ID"];
};

export type TemplateNewVMOptionsQuery = { __typename?: "Query" } & {
  template: Maybe<{ __typename?: "GTemplate" } & AbstractVMFragmentFragment>;
};

export type CurrentUserQueryVariables = {};

export type CurrentUserQuery = { __typename?: "Query" } & {
  currentUser: Maybe<
    { __typename?: "CurrentUserInformation" } & Pick<
      CurrentUserInformation,
      "isAdmin"
    > & {
        user: Maybe<{ __typename?: "User" } & UserFragmentFragment>;
        groups: Maybe<
          Array<Maybe<{ __typename?: "User" } & UserFragmentFragment>>
        >;
      }
  >;
};

export type DeletedFragmentFragment = { __typename?: "Deleted" } & Pick<
  Deleted,
  "ref"
>;

export type DeleteTemplateMutationVariables = {
  ref: Scalars["ID"];
};

export type DeleteTemplateMutation = { __typename?: "Mutation" } & {
  templateDelete: Maybe<
    { __typename?: "TemplateDestroyMutation" } & Pick<
      TemplateDestroyMutation,
      "taskId"
    >
  >;
};

export type DeleteVDIMutationVariables = {
  ref: Scalars["ID"];
};

export type DeleteVDIMutation = { __typename?: "Mutation" } & {
  vdiDelete: Maybe<
    { __typename?: "VDIDestroyMutation" } & Pick<VDIDestroyMutation, "taskId">
  >;
};

export type DeleteVMMutationVariables = {
  ref: Scalars["ID"];
};

export type DeleteVMMutation = { __typename?: "Mutation" } & {
  vmDelete: Maybe<
    { __typename?: "VMDestroyMutation" } & Pick<VMDestroyMutation, "taskId">
  >;
};

export type NetworkEditOptionsMutationVariables = {
  network: NetworkInput;
  ref: Scalars["ID"];
};

export type NetworkEditOptionsMutation = { __typename?: "Mutation" } & {
  network: Maybe<
    { __typename?: "NetworkMutation" } & Pick<
      NetworkMutation,
      "granted" | "reason"
    >
  >;
};

export type PoolEditOptionsMutationVariables = {
  pool: PoolInput;
  ref: Scalars["ID"];
};

export type PoolEditOptionsMutation = { __typename?: "Mutation" } & {
  pool: Maybe<
    { __typename?: "PoolMutation" } & Pick<PoolMutation, "granted" | "reason">
  >;
};

export type SREditOptionsMutationVariables = {
  sr: SRInput;
  ref: Scalars["ID"];
};

export type SREditOptionsMutation = { __typename?: "Mutation" } & {
  sr: Maybe<
    { __typename?: "SRMutation" } & Pick<SRMutation, "granted" | "reason">
  >;
};

export type TemplateEditOptionsMutationVariables = {
  template: TemplateInput;
  ref: Scalars["ID"];
};

export type TemplateEditOptionsMutation = { __typename?: "Mutation" } & {
  template: Maybe<
    { __typename?: "TemplateMutation" } & Pick<
      TemplateMutation,
      "reason" | "granted"
    >
  >;
};

export type VDIEditOptionsMutationVariables = {
  vdi: VDIInput;
  ref: Scalars["ID"];
};

export type VDIEditOptionsMutation = { __typename?: "Mutation" } & {
  vdi: Maybe<
    { __typename?: "VDIMutation" } & Pick<VDIMutation, "reason" | "granted">
  >;
};

export type VMEditOptionsMutationVariables = {
  vm: VMInput;
  ref: Scalars["ID"];
};

export type VMEditOptionsMutation = { __typename?: "Mutation" } & {
  vm: Maybe<
    { __typename?: "VMMutation" } & Pick<VMMutation, "reason" | "granted">
  >;
};

export type FilterUsersQueryVariables = {
  query: Scalars["String"];
};

export type FilterUsersQuery = { __typename?: "Query" } & {
  findUser: Array<Maybe<{ __typename?: "User" } & UserFragmentFragment>>;
};

export type HostListFragmentFragment = { __typename?: "GHost" } & Pick<
  GHost,
  | "ref"
  | "uuid"
  | "nameLabel"
  | "nameDescription"
  | "memoryFree"
  | "memoryTotal"
  | "memoryAvailable"
  | "liveUpdated"
  | "memoryOverhead"
> & {
    softwareVersion: { __typename?: "SoftwareVersion" } & Pick<
      SoftwareVersion,
      "platformVersion" | "productBrand" | "productVersion" | "xen"
    >;
    cpuInfo: { __typename?: "CpuInfo" } & Pick<
      CpuInfo,
      "speed" | "cpuCount" | "socketCount" | "modelname"
    >;
    residentVms: Array<Maybe<{ __typename?: "GVM" } & Pick<GVM, "ref">>>;
  };

export type HostListQueryVariables = {};

export type HostListQuery = { __typename?: "Query" } & {
  hosts: Array<Maybe<{ __typename?: "GHost" } & HostListFragmentFragment>>;
};

export type HostListUpdateSubscriptionVariables = {};

export type HostListUpdateSubscription = { __typename?: "Subscription" } & {
  hosts: { __typename?: "GHostsSubscription" } & Pick<
    GHostsSubscription,
    "changeType"
  > & { value: HostListFragmentFragment | DeletedFragmentFragment };
};

export type ISOCreateVMListFragmentFragment = { __typename?: "GVDI" } & Pick<
  GVDI,
  "ref" | "nameLabel"
>;

export type ISOSCreateVMListQueryVariables = {};

export type ISOSCreateVMListQuery = { __typename?: "Query" } & {
  isosForInstall: Maybe<
    Array<Maybe<{ __typename?: "GVDI" } & Pick<GVDI, "ref" | "nameLabel">>>
  >;
};

export type ISOListQueryVariables = {};

export type ISOListQuery = { __typename?: "Query" } & {
  vdis: Array<Maybe<{ __typename?: "GVDI" } & VDIListFragmentFragment>>;
};

export type ISOListUpdateSubscriptionVariables = {};

export type ISOListUpdateSubscription = { __typename?: "Subscription" } & {
  vdis: { __typename?: "GVDIsSubscription" } & Pick<
    GVDIsSubscription,
    "changeType"
  > & { value: VDIListFragmentFragment | DeletedFragmentFragment };
};

export type DiskAttachTableSelectionQueryVariables = {};

export type DiskAttachTableSelectionQuery = { __typename?: "Query" } & Pick<
  Query,
  "selectedItems"
>;

export type DiskAttachTableSelectMutationVariables = {
  item: Scalars["ID"];
  isSelect: Scalars["Boolean"];
};

export type DiskAttachTableSelectMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "selectedItems"
>;

export type DiskAttachTableSelectAllMutationVariables = {
  items: Array<Scalars["ID"]>;
  isSelect: Scalars["Boolean"];
};

export type DiskAttachTableSelectAllMutation = {
  __typename?: "Mutation";
} & Pick<Mutation, "selectedItems">;

export type ISOTableSelectionQueryVariables = {};

export type ISOTableSelectionQuery = { __typename?: "Query" } & Pick<
  Query,
  "selectedItems"
>;

export type ISOTableSelectMutationVariables = {
  item: Scalars["ID"];
  isSelect: Scalars["Boolean"];
};

export type ISOTableSelectMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "selectedItems"
>;

export type ISOTableSelectAllMutationVariables = {
  items: Array<Scalars["ID"]>;
  isSelect: Scalars["Boolean"];
};

export type ISOTableSelectAllMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "selectedItems"
>;

export type NetAttachTableSelectionQueryVariables = {};

export type NetAttachTableSelectionQuery = { __typename?: "Query" } & Pick<
  Query,
  "selectedItems"
>;

export type NetAttachTableSelectMutationVariables = {
  item: Scalars["ID"];
  isSelect: Scalars["Boolean"];
};

export type NetAttachTableSelectMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "selectedItems"
>;

export type NetAttachTableSelectAllMutationVariables = {
  items: Array<Scalars["ID"]>;
  isSelect: Scalars["Boolean"];
};

export type NetAttachTableSelectAllMutation = {
  __typename?: "Mutation";
} & Pick<Mutation, "selectedItems">;

export type NetworkTableSelectionQueryVariables = {};

export type NetworkTableSelectionQuery = { __typename?: "Query" } & Pick<
  Query,
  "selectedItems"
>;

export type NetworkTableSelectMutationVariables = {
  item: Scalars["ID"];
  isSelect: Scalars["Boolean"];
};

export type NetworkTableSelectMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "selectedItems"
>;

export type NetworkTableSelectAllMutationVariables = {
  items: Array<Scalars["ID"]>;
  isSelect: Scalars["Boolean"];
};

export type NetworkTableSelectAllMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "selectedItems"
>;

export type SelectedItemsQueryQueryVariables = {
  tableId: Table;
};

export type SelectedItemsQueryQuery = { __typename?: "Query" } & Pick<
  Query,
  "selectedItems"
>;

export type SRTableSelectionQueryVariables = {};

export type SRTableSelectionQuery = { __typename?: "Query" } & Pick<
  Query,
  "selectedItems"
>;

export type SRTableSelectMutationVariables = {
  item: Scalars["ID"];
  isSelect: Scalars["Boolean"];
};

export type SRTableSelectMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "selectedItems"
>;

export type SRTableSelectAllMutationVariables = {
  items: Array<Scalars["ID"]>;
  isSelect: Scalars["Boolean"];
};

export type SRTableSelectAllMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "selectedItems"
>;

export type TaskTableSelectionQueryVariables = {};

export type TaskTableSelectionQuery = { __typename?: "Query" } & Pick<
  Query,
  "selectedItems"
>;

export type TaskTableSelectMutationVariables = {
  item: Scalars["ID"];
  isSelect: Scalars["Boolean"];
};

export type TaskTableSelectMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "selectedItems"
>;

export type TaskTableSelectAllMutationVariables = {
  items: Array<Scalars["ID"]>;
  isSelect: Scalars["Boolean"];
};

export type TaskTableSelectAllMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "selectedItems"
>;

export type TemplateTableSelectionQueryVariables = {};

export type TemplateTableSelectionQuery = { __typename?: "Query" } & Pick<
  Query,
  "selectedItems"
>;

export type TemplateTableSelectMutationVariables = {
  item: Scalars["ID"];
  isSelect: Scalars["Boolean"];
};

export type TemplateTableSelectMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "selectedItems"
>;

export type TemplateTableSelectAllMutationVariables = {
  items: Array<Scalars["ID"]>;
  isSelect: Scalars["Boolean"];
};

export type TemplateTableSelectAllMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "selectedItems"
>;

export type VDITableSelectionQueryVariables = {};

export type VDITableSelectionQuery = { __typename?: "Query" } & Pick<
  Query,
  "selectedItems"
>;

export type VDITableSelectMutationVariables = {
  item: Scalars["ID"];
  isSelect: Scalars["Boolean"];
};

export type VDITableSelectMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "selectedItems"
>;

export type VDITableSelectAllMutationVariables = {
  items: Array<Scalars["ID"]>;
  isSelect: Scalars["Boolean"];
};

export type VDITableSelectAllMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "selectedItems"
>;

export type VmTableSelectionQueryVariables = {};

export type VmTableSelectionQuery = { __typename?: "Query" } & Pick<
  Query,
  "selectedItems"
>;

export type VmTableSelectMutationVariables = {
  item: Scalars["ID"];
  isSelect: Scalars["Boolean"];
};

export type VmTableSelectMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "selectedItems"
>;

export type VmTableSelectAllMutationVariables = {
  items: Array<Scalars["ID"]>;
  isSelect: Scalars["Boolean"];
};

export type VmTableSelectAllMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "selectedItems"
>;

export type VmPowerStateQueryVariables = {};

export type VmPowerStateQuery = { __typename?: "Query" } & {
  vms: Array<Maybe<{ __typename?: "GVM" } & Pick<GVM, "ref" | "powerState">>>;
};

export type VMStateForButtonToolbarQueryVariables = {};

export type VMStateForButtonToolbarQuery = { __typename?: "Query" } & {
  vmSelectedReadyFor: { __typename?: "VMSelectedIDLists" } & Pick<
    VMSelectedIDLists,
    "start" | "stop" | "trash"
  >;
};

export type NetworkInfoFragmentFragment = { __typename?: "GNetwork" } & Pick<
  GNetwork,
  "myActions" | "isOwner"
> & {
    access: Array<
      Maybe<
        { __typename?: "GNetworkAccessEntry" } & Pick<
          GNetworkAccessEntry,
          "actions"
        > & {
            userId: { __typename?: "User" } & Pick<
              User,
              "id" | "name" | "username"
            >;
          }
      >
    >;
  } & ACLXenObjectFragmentFragment;

export type NetworkInfoQueryVariables = {
  ref: Scalars["ID"];
};

export type NetworkInfoQuery = { __typename?: "Query" } & {
  network: Maybe<{ __typename?: "GNetwork" } & NetworkInfoFragmentFragment>;
};

export type NetworkInfoUpdateSubscriptionVariables = {
  ref: Scalars["ID"];
};

export type NetworkInfoUpdateSubscription = { __typename?: "Subscription" } & {
  network: Maybe<{ __typename?: "GNetwork" } & NetworkInfoFragmentFragment>;
};

export type NetworkListFragmentFragment = { __typename?: "GNetwork" } & Pick<
  GNetwork,
  "ref" | "nameLabel" | "myActions" | "isOwner"
>;

export type NetworkListQueryVariables = {};

export type NetworkListQuery = { __typename?: "Query" } & {
  networks: Array<
    Maybe<{ __typename?: "GNetwork" } & NetworkListFragmentFragment>
  >;
};

export type NetworkListUpdateSubscriptionVariables = {};

export type NetworkListUpdateSubscription = { __typename?: "Subscription" } & {
  networks: { __typename?: "GNetworksSubscription" } & Pick<
    GNetworksSubscription,
    "changeType"
  > & { value: NetworkListFragmentFragment | DeletedFragmentFragment };
};

export type PauseVMMutationVariables = {
  ref: Scalars["ID"];
};

export type PauseVMMutation = { __typename?: "Mutation" } & {
  vmPause: Maybe<
    { __typename?: "VMPauseMutation" } & Pick<
      VMPauseMutation,
      "taskId" | "granted" | "reason"
    >
  >;
};

export type LaunchPlaybookMutationVariables = {
  id: Scalars["ID"];
  vms?: Maybe<Array<Maybe<Scalars["ID"]>>>;
  variables?: Maybe<Scalars["JSONString"]>;
};

export type LaunchPlaybookMutation = { __typename?: "Mutation" } & {
  playbookLaunch: Maybe<
    { __typename?: "PlaybookLaunchMutation" } & Pick<
      PlaybookLaunchMutation,
      "taskId"
    >
  >;
};

export type PlaybookListQueryVariables = {};

export type PlaybookListQuery = { __typename?: "Query" } & {
  playbooks: Array<
    Maybe<
      { __typename?: "GPlaybook" } & Pick<
        GPlaybook,
        "name" | "variables" | "id" | "inventory" | "description"
      > & {
          requires: Maybe<
            { __typename?: "PlaybookRequirements" } & {
              osVersion: Array<
                Maybe<
                  { __typename?: "OSVersion" } & Pick<
                    OSVersion,
                    "distro" | "name" | "uname" | "major" | "minor"
                  >
                >
              >;
            }
          >;
        }
    >
  >;
};

export type PoolListFragmentFragment = { __typename?: "GPool" } & Pick<
  GPool,
  "nameLabel" | "nameDescription" | "ref" | "uuid"
> & { master: Maybe<{ __typename?: "GHost" } & Pick<GHost, "ref">> };

export type PoolInfoFragmentFragment = { __typename?: "GPool" } & Pick<
  GPool,
  "myActions" | "isOwner"
> & {
    access: Array<
      Maybe<
        { __typename?: "GPoolAccessEntry" } & Pick<
          GPoolAccessEntry,
          "actions"
        > &
          AccessFragmentFragment
      >
    >;
  } & ACLXenObjectFragmentFragment;

export type PoolListQueryVariables = {};

export type PoolListQuery = { __typename?: "Query" } & {
  pools: Array<Maybe<{ __typename?: "GPool" } & PoolListFragmentFragment>>;
};

export type PoolInfoQueryVariables = {
  ref: Scalars["ID"];
};

export type PoolInfoQuery = { __typename?: "Query" } & {
  pool: Maybe<{ __typename?: "GPool" } & PoolInfoFragmentFragment>;
};

export type PoolInfoUpdateSubscriptionVariables = {
  ref: Scalars["ID"];
};

export type PoolInfoUpdateSubscription = { __typename?: "Subscription" } & {
  pool: Maybe<{ __typename?: "GPool" } & PoolInfoFragmentFragment>;
};

export type PoolListUpdateSubscriptionVariables = {};

export type PoolListUpdateSubscription = { __typename?: "Subscription" } & {
  pools: { __typename?: "GPoolsSubscription" } & Pick<
    GPoolsSubscription,
    "changeType"
  > & { value: PoolListFragmentFragment | DeletedFragmentFragment };
};

export type QuotaSetMutationVariables = {
  userId: Scalars["String"];
  quota: QuotaInput;
};

export type QuotaSetMutation = { __typename?: "Mutation" } & {
  quotaSet: Maybe<
    { __typename?: "QuotaMutation" } & Pick<QuotaMutation, "success">
  >;
};

export type QuotaGetQueryVariables = {
  userId: Scalars["String"];
};

export type QuotaGetQuery = { __typename?: "Query" } & {
  quota: { __typename?: "Quota" } & Pick<
    Quota,
    "vdiSize" | "vcpuCount" | "vmCount" | "memory"
  > & { user: { __typename?: "User" } & UserFragmentFragment };
};

export type QuotaSizeQueryVariables = {
  userId: Scalars["String"];
};

export type QuotaSizeQuery = { __typename?: "Query" } & {
  quotaUsage: { __typename?: "Quota" } & Pick<
    Quota,
    "vdiSize" | "vcpuCount" | "vmCount" | "memory"
  >;
  quotaLeft: { __typename?: "Quota" } & Pick<
    Quota,
    "vdiSize" | "vcpuCount" | "vmCount" | "memory"
  >;
};

export type RebootVmMutationVariables = {
  ref: Scalars["ID"];
  force?: Maybe<ShutdownForce>;
};

export type RebootVmMutation = { __typename?: "Mutation" } & {
  vmReboot: Maybe<
    { __typename?: "VMRebootMutation" } & Pick<
      VMRebootMutation,
      "taskId" | "granted"
    >
  >;
};

export type RevertVMMutationVariables = {
  ref: Scalars["ID"];
};

export type RevertVMMutation = { __typename?: "Mutation" } & {
  vmRevert: Maybe<
    { __typename?: "VMRevertMutation" } & Pick<
      VMRevertMutation,
      "granted" | "reason" | "taskId"
    >
  >;
};

export type ShutdownVMMutationVariables = {
  ref: Scalars["ID"];
  force?: Maybe<ShutdownForce>;
};

export type ShutdownVMMutation = { __typename?: "Mutation" } & {
  vmShutdown: Maybe<
    { __typename?: "VMShutdownMutation" } & Pick<
      VMShutdownMutation,
      "taskId" | "granted"
    >
  >;
};

export type SnapshotVMMutationVariables = {
  ref: Scalars["ID"];
  nameLabel: Scalars["String"];
};

export type SnapshotVMMutation = { __typename?: "Mutation" } & {
  vmSnapshot: Maybe<
    { __typename?: "VMSnapshotMutation" } & Pick<
      VMSnapshotMutation,
      "granted" | "reason" | "taskId"
    >
  >;
};

export type DestroyVMSnapshotMutationVariables = {
  ref: Scalars["ID"];
};

export type DestroyVMSnapshotMutation = { __typename?: "Mutation" } & {
  vmSnapshotDestroy: Maybe<
    { __typename?: "VMSnapshotDestroyMutation" } & Pick<
      VMSnapshotDestroyMutation,
      "granted" | "reason" | "taskId"
    >
  >;
};

export type SRInfoFragmentFragment = { __typename?: "GSR" } & Pick<
  GSR,
  "myActions" | "isOwner"
> & {
    access: Array<
      Maybe<
        { __typename?: "GSRAccessEntry" } & Pick<GSRAccessEntry, "actions"> &
          AccessFragmentFragment
      >
    >;
  } & ACLXenObjectFragmentFragment;

export type SRInfoQueryVariables = {
  ref: Scalars["ID"];
};

export type SRInfoQuery = { __typename?: "Query" } & {
  sr: Maybe<{ __typename?: "GSR" } & SRInfoFragmentFragment>;
};

export type SRInfoUpdateSubscriptionVariables = {
  ref: Scalars["ID"];
};

export type SRInfoUpdateSubscription = { __typename?: "Subscription" } & {
  sr: Maybe<{ __typename?: "GSR" } & SRInfoFragmentFragment>;
};

export type SRListFragmentFragment = { __typename?: "GSR" } & Pick<
  GSR,
  "ref" | "nameLabel" | "myActions" | "isOwner"
>;

export type SRListQueryVariables = {};

export type SRListQuery = { __typename?: "Query" } & {
  srs: Array<Maybe<{ __typename?: "GSR" } & SRListFragmentFragment>>;
};

export type SRListUpdateSubscriptionVariables = {};

export type SRListUpdateSubscription = { __typename?: "Subscription" } & {
  srs: { __typename?: "GSRsSubscription" } & Pick<
    GSRsSubscription,
    "changeType"
  > & { value: SRListFragmentFragment | DeletedFragmentFragment };
};

export type StartVMMutationVariables = {
  ref: Scalars["ID"];
  options?: Maybe<VMStartInput>;
};

export type StartVMMutation = { __typename?: "Mutation" } & {
  vmStart: Maybe<
    { __typename?: "VMStartMutation" } & Pick<
      VMStartMutation,
      "granted" | "taskId" | "reason"
    >
  >;
};

export type StorageListFragmentFragment = { __typename?: "GSR" } & Pick<
  GSR,
  "ref" | "nameLabel" | "spaceAvailable" | "contentType"
> & {
    PBDs: Array<
      Maybe<{ __typename?: "GPBD" } & Pick<GPBD, "currentlyAttached">>
    >;
  };

export type StorageListQueryVariables = {};

export type StorageListQuery = { __typename?: "Query" } & {
  srs: Array<Maybe<{ __typename?: "GSR" } & StorageListFragmentFragment>>;
};

export type SuspendVMMutationVariables = {
  ref: Scalars["ID"];
};

export type SuspendVMMutation = { __typename?: "Mutation" } & {
  vmSuspend: Maybe<
    { __typename?: "VMSuspendMutation" } & Pick<
      VMSuspendMutation,
      "taskId" | "granted" | "reason"
    >
  >;
};

export type TaskFragmentFragment = { __typename?: "GTask" } & Pick<
  GTask,
  | "ref"
  | "status"
  | "created"
  | "nameLabel"
  | "nameDescription"
  | "finished"
  | "progress"
  | "result"
  | "residentOn"
  | "objectRef"
  | "objectType"
  | "errorInfo"
  | "isOwner"
  | "myActions"
  | "action"
> & { who: Maybe<{ __typename?: "User" } & UserFragmentFragment> };

export type TaskListUpdateSubscriptionVariables = {};

export type TaskListUpdateSubscription = { __typename?: "Subscription" } & {
  tasks: { __typename?: "GTasksSubscription" } & Pick<
    GTasksSubscription,
    "changeType"
  > & { value: TaskFragmentFragment | DeletedFragmentFragment };
};

export type TaskListQueryVariables = {
  startDate?: Maybe<Scalars["DateTime"]>;
  endDate?: Maybe<Scalars["DateTime"]>;
};

export type TaskListQuery = { __typename?: "Query" } & {
  tasks: Array<Maybe<{ __typename?: "GTask" } & TaskFragmentFragment>>;
};

export type TaskInfoQueryVariables = {
  ref: Scalars["ID"];
};

export type TaskInfoQuery = { __typename?: "Query" } & {
  task: Maybe<{ __typename?: "GTask" } & TaskFragmentFragment>;
};

export type TaskInfoUpdateSubscriptionVariables = {
  ref: Scalars["ID"];
};

export type TaskInfoUpdateSubscription = { __typename?: "Subscription" } & {
  task: Maybe<{ __typename?: "GTask" } & TaskFragmentFragment>;
};

export type TaskDeleteMutationVariables = {
  ref: Scalars["ID"];
};

export type TaskDeleteMutation = { __typename?: "Mutation" } & {
  taskDelete: Maybe<
    { __typename?: "TaskRemoveMutation" } & Pick<
      TaskRemoveMutation,
      "granted" | "reason" | "taskId"
    >
  >;
};

export type VMForTaskListQueryVariables = {
  vmRef: Scalars["ID"];
};

export type VMForTaskListQuery = { __typename?: "Query" } & {
  vm: Maybe<{ __typename?: "GVM" } & Pick<GVM, "ref" | "nameLabel">>;
};

export type TemplateForTaskListQueryVariables = {
  templateRef: Scalars["ID"];
};

export type TemplateForTaskListQuery = { __typename?: "Query" } & {
  template: Maybe<
    { __typename?: "GTemplate" } & Pick<GTemplate, "ref" | "nameLabel">
  >;
};

export type PlaybookNameForTaskListQueryVariables = {
  playbookId: Scalars["ID"];
};

export type PlaybookNameForTaskListQuery = { __typename?: "Query" } & {
  playbook: Maybe<
    { __typename?: "GPlaybook" } & Pick<GPlaybook, "id" | "name">
  >;
};

export type VBDForTaskListQueryVariables = {
  vbdRef: Scalars["ID"];
};

export type VBDForTaskListQuery = { __typename?: "Query" } & {
  vbd: Maybe<
    { __typename?: "GVBD" } & Pick<GVBD, "ref" | "type" | "userdevice">
  >;
};

export type VDIForTaskListQueryVariables = {
  vdiRef: Scalars["ID"];
};

export type VDIForTaskListQuery = { __typename?: "Query" } & {
  vdi: Maybe<{ __typename?: "GVDI" } & Pick<GVDI, "ref" | "nameLabel">>;
};

export type SRForTaskListQueryVariables = {
  srRef: Scalars["ID"];
};

export type SRForTaskListQuery = { __typename?: "Query" } & {
  sr: Maybe<{ __typename?: "GSR" } & Pick<GSR, "ref" | "nameLabel">>;
};

export type TemplateSettingsFragmentFragment = {
  __typename?: "GTemplate";
} & Pick<GTemplate, "PVBootloader"> & {
    installOptions: Maybe<
      { __typename?: "InstallOSOptions" } & Pick<
        InstallOSOptions,
        "distro" | "arch" | "release" | "installRepository"
      >
    >;
  } & AbstractVMFragmentFragment;

export type TemplateInfoFragmentFragment = { __typename?: "GTemplate" } & Pick<
  GTemplate,
  "myActions"
> & {
    access: Array<
      Maybe<
        { __typename?: "GTemplateAccessEntry" } & Pick<
          GTemplateAccessEntry,
          "actions"
        > & {
            userId: { __typename?: "User" } & Pick<
              User,
              "id" | "name" | "username"
            >;
          }
      >
    >;
  } & (TemplateSettingsFragmentFragment & ACLXenObjectFragmentFragment);

export type TemplateInfoQueryVariables = {
  ref: Scalars["ID"];
};

export type TemplateInfoQuery = { __typename?: "Query" } & {
  template: Maybe<{ __typename?: "GTemplate" } & TemplateInfoFragmentFragment>;
};

export type TemplateInfoUpdateSubscriptionVariables = {
  ref: Scalars["ID"];
};

export type TemplateInfoUpdateSubscription = { __typename?: "Subscription" } & {
  template: Maybe<{ __typename?: "GTemplate" } & TemplateInfoFragmentFragment>;
};

export type TemplateListFragmentFragment = { __typename?: "GTemplate" } & Pick<
  GTemplate,
  "ref" | "nameLabel" | "myActions" | "isOwner" | "domainType"
> & {
    access: Array<
      Maybe<
        { __typename?: "GTemplateAccessEntry" } & Pick<
          GTemplateAccessEntry,
          "actions"
        > & {
            userId: { __typename?: "User" } & Pick<
              User,
              "id" | "name" | "username"
            >;
          }
      >
    >;
    installOptions: Maybe<
      { __typename?: "InstallOSOptions" } & Pick<
        InstallOSOptions,
        "distro" | "arch" | "release" | "installRepository"
      >
    >;
  };

export type TemplateListQueryVariables = {};

export type TemplateListQuery = { __typename?: "Query" } & {
  templates: Array<
    Maybe<{ __typename?: "GTemplate" } & TemplateListFragmentFragment>
  >;
};

export type TemplateListUpdateSubscriptionVariables = {};

export type TemplateListUpdateSubscription = { __typename?: "Subscription" } & {
  templates: { __typename?: "GTemplatesSubscription" } & Pick<
    GTemplatesSubscription,
    "changeType"
  > & { value: TemplateListFragmentFragment | DeletedFragmentFragment };
};

export type UserFragmentFragment = { __typename?: "User" } & Pick<
  User,
  "username" | "id" | "name"
>;

export type UserGetQueryVariables = {
  userId: Scalars["ID"];
};

export type UserGetQuery = { __typename?: "Query" } & {
  user: Maybe<{ __typename?: "User" } & UserFragmentFragment>;
};

export type VDISettingsFragmentFragment = { __typename?: "GVDI" } & {
  mainOwner: Maybe<{ __typename?: "User" } & UserFragmentFragment>;
};

export type VDIInfoFragmentFragment = { __typename?: "GVDI" } & Pick<
  GVDI,
  "myActions"
> & {
    access: Array<
      Maybe<
        { __typename?: "GVDIAccessEntry" } & Pick<GVDIAccessEntry, "actions"> &
          AccessFragmentFragment
      >
    >;
  } & (ACLXenObjectFragmentFragment & VDISettingsFragmentFragment);

export type VDIInfoQueryVariables = {
  ref: Scalars["ID"];
};

export type VDIInfoQuery = { __typename?: "Query" } & {
  vdi: Maybe<{ __typename?: "GVDI" } & VDIInfoFragmentFragment>;
};

export type VDIInfoUpdateSubscriptionVariables = {
  ref: Scalars["ID"];
};

export type VDIInfoUpdateSubscription = { __typename?: "Subscription" } & {
  vdi: Maybe<{ __typename?: "GVDI" } & VDIInfoFragmentFragment>;
};

export type VDIListFragmentFragment = { __typename?: "GVDI" } & Pick<
  GVDI,
  "ref" | "nameLabel" | "myActions" | "isOwner" | "virtualSize"
> & {
    VBDs: Array<
      Maybe<
        { __typename?: "GVBD" } & Pick<GVBD, "currentlyAttached"> & {
            VM: Maybe<{ __typename?: "GVM" } & Pick<GVM, "nameLabel">>;
          }
      >
    >;
  };

export type StorageAttachVDIListFragmentFragment = {
  __typename?: "GVDI";
} & Pick<GVDI, "ref" | "nameLabel" | "nameDescription" | "virtualSize">;

export type StorageAttachVDIListQueryVariables = {};

export type StorageAttachVDIListQuery = { __typename?: "Query" } & {
  vdis: Array<
    Maybe<{ __typename?: "GVDI" } & StorageAttachVDIListFragmentFragment>
  >;
};

export type StorageAttachISOListQueryVariables = {};

export type StorageAttachISOListQuery = { __typename?: "Query" } & {
  vdis: Array<
    Maybe<{ __typename?: "GVDI" } & StorageAttachVDIListFragmentFragment>
  >;
};

export type VDIListQueryVariables = {};

export type VDIListQuery = { __typename?: "Query" } & {
  vdis: Array<Maybe<{ __typename?: "GVDI" } & VDIListFragmentFragment>>;
};

export type VDIListUpdateSubscriptionVariables = {};

export type VDIListUpdateSubscription = { __typename?: "Subscription" } & {
  vdis: { __typename?: "GVDIsSubscription" } & Pick<
    GVDIsSubscription,
    "changeType"
  > & { value: VDIListFragmentFragment | DeletedFragmentFragment };
};

export type VMVIFFragmentFragment = { __typename?: "GVIF" } & Pick<
  GVIF,
  "ipv4" | "ipv6" | "ref" | "MAC" | "currentlyAttached" | "device"
> & {
    network: Maybe<
      { __typename?: "GNetwork" } & Pick<GNetwork, "ref" | "nameLabel">
    >;
  };

export type VMVBDFragmentFragment = { __typename?: "GVBD" } & Pick<
  GVBD,
  "ref" | "mode" | "type" | "userdevice" | "currentlyAttached" | "bootable"
> & {
    VDI: Maybe<
      { __typename?: "GVDI" } & Pick<
        GVDI,
        "ref" | "nameDescription" | "nameLabel" | "virtualSize"
      >
    >;
  };

export type VMSnapshotFragmentFragment = { __typename?: "GVMSnapshot" } & Pick<
  GVMSnapshot,
  "ref" | "nameLabel" | "snapshotTime" | "myActions"
>;

export type VMAccessFragmentFragment = { __typename?: "GVMAccessEntry" } & Pick<
  GVMAccessEntry,
  "actions"
> &
  AccessFragmentFragment;

export type VMSettingsFragmentFragment = { __typename?: "GVM" } & {
  mainOwner: Maybe<{ __typename?: "User" } & UserFragmentFragment>;
} & AbstractVMFragmentFragment;

export type VMInfoFragmentFragment = { __typename?: "GVM" } & Pick<
  GVM,
  "PVBootloader" | "powerState" | "startTime" | "myActions" | "uuid"
> & {
    VIFs: Array<Maybe<{ __typename?: "GVIF" } & VMVIFFragmentFragment>>;
    VBDs: Array<Maybe<{ __typename?: "GVBD" } & VMVBDFragmentFragment>>;
    osVersion: Maybe<{ __typename?: "OSVersion" } & Pick<OSVersion, "name">>;
    access: Array<
      Maybe<{ __typename?: "GVMAccessEntry" } & VMAccessFragmentFragment>
    >;
    snapshots: Array<
      Maybe<{ __typename?: "GVMSnapshot" } & VMSnapshotFragmentFragment>
    >;
  } & (ACLXenObjectFragmentFragment & VMSettingsFragmentFragment);

export type VMInfoQueryVariables = {
  ref: Scalars["ID"];
};

export type VMInfoQuery = { __typename?: "Query" } & {
  vm: Maybe<{ __typename?: "GVM" } & VMInfoFragmentFragment>;
};

export type VMInfoUpdateSubscriptionVariables = {
  ref: Scalars["ID"];
};

export type VMInfoUpdateSubscription = { __typename?: "Subscription" } & {
  vm: Maybe<{ __typename?: "GVM" } & VMInfoFragmentFragment>;
};

export type VMListVIFFragmentFragment = { __typename?: "GVIF" } & Pick<
  GVIF,
  "ref" | "ipv4" | "ipv6"
> & {
    network: Maybe<
      { __typename?: "GNetwork" } & Pick<GNetwork, "ref" | "nameLabel">
    >;
  };

export type VMListFragmentFragment = { __typename?: "GVM" } & Pick<
  GVM,
  "ref" | "nameLabel" | "powerState" | "myActions" | "isOwner" | "startTime"
> & { VIFs: Array<Maybe<{ __typename?: "GVIF" } & VMListVIFFragmentFragment>> };

export type VMListQueryVariables = {};

export type VMListQuery = { __typename?: "Query" } & {
  vms: Array<Maybe<{ __typename?: "GVM" } & VMListFragmentFragment>>;
};

export type VMListUpdateSubscriptionVariables = {};

export type VMListUpdateSubscription = { __typename?: "Subscription" } & {
  vms: { __typename?: "GVMsSubscription" } & Pick<
    GVMsSubscription,
    "changeType"
  > & { value: VMListFragmentFragment | DeletedFragmentFragment };
};

export type VMSnapshotInfoFragmentFragment = {
  __typename?: "GVMSnapshot";
} & Pick<GVMSnapshot, "snapshotTime"> &
  ACLXenObjectFragmentFragment;

export type VMSnapshotInfoQueryVariables = {
  ref: Scalars["ID"];
};

export type VMSnapshotInfoQuery = { __typename?: "Query" } & {
  vmSnapshot: Maybe<
    { __typename?: "GVMSnapshot" } & VMSnapshotInfoFragmentFragment
  >;
};

export type VMSnapshotInfoUpdateSubscriptionVariables = {
  ref: Scalars["ID"];
};

export type VMSnapshotInfoUpdateSubscription = {
  __typename?: "Subscription";
} & {
  vmSnapshot: Maybe<
    { __typename?: "GVMSnapshot" } & VMSnapshotInfoFragmentFragment
  >;
};

export type XenObjectFragmentFragment = { __typename?: "GHost" } & Pick<
  GXenObject,
  "ref" | "nameLabel" | "nameDescription"
>;

export type ACLXenObjectFragmentFragment = {
  __typename?:
    | "GVM"
    | "GNetwork"
    | "GVDI"
    | "GSR"
    | "GVMSnapshot"
    | "GTemplate"
    | "GPool"
    | "GTask";
} & Pick<GAclXenObject, "ref" | "nameLabel" | "nameDescription" | "isOwner">;

import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig
} from "graphql";

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, TParent, TContext, TArgs>;
}

export type SubscriptionResolver<
  TResult,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionResolverObject<TResult, TParent, TContext, TArgs>)
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Query: {};
  GVM: GVM;
  GAclXenObject: GAclXenObject;
  String: Scalars["String"];
  ID: Scalars["ID"];
  GAccessEntry: GAccessEntry;
  User: User;
  Boolean: Scalars["Boolean"];
  GAbstractVM: GAbstractVM;
  Platform: Platform;
  Int: Scalars["Int"];
  DomainType: DomainType;
  DateTime: Scalars["DateTime"];
  Float: Scalars["Float"];
  GQuotaObject: GQuotaObject;
  GVMAccessEntry: GVMAccessEntry;
  VMActions: VMActions;
  PvDriversVersion: PvDriversVersion;
  OSVersion: OSVersion;
  PowerState: PowerState;
  GVIF: GVIF;
  GNetwork: GNetwork;
  GNetworkAccessEntry: GNetworkAccessEntry;
  NetworkActions: NetworkActions;
  JSONString: Scalars["JSONString"];
  GVBD: GVBD;
  GVDI: GVDI;
  GVDIAccessEntry: GVDIAccessEntry;
  VDIActions: VDIActions;
  GSR: GSR;
  GSRAccessEntry: GSRAccessEntry;
  SRActions: SRActions;
  GPBD: GPBD;
  GHost: GHost;
  GXenObject: GXenObject;
  HostAllowedOperations: HostAllowedOperations;
  CpuInfo: CpuInfo;
  HostDisplay: HostDisplay;
  SoftwareVersion: SoftwareVersion;
  SRContentType: SRContentType;
  VDIType: VDIType;
  VBDType: VBDType;
  VBDMode: VBDMode;
  GVMSnapshot: GVMSnapshot;
  GTemplate: GTemplate;
  GTemplateAccessEntry: GTemplateAccessEntry;
  TemplateActions: TemplateActions;
  InstallOSOptions: InstallOSOptions;
  Distro: Distro;
  Arch: Arch;
  GPool: GPool;
  GPoolAccessEntry: GPoolAccessEntry;
  PoolActions: PoolActions;
  GPlaybook: GPlaybook;
  PlaybookRequirements: PlaybookRequirements;
  GTask: GTask;
  GTaskAccessEntry: GTaskAccessEntry;
  TaskActions: TaskActions;
  TaskStatus: TaskStatus;
  CurrentUserInformation: CurrentUserInformation;
  Quota: Quota;
  Table: Table;
  VMSelectedIDLists: VMSelectedIDLists;
  Mutation: {};
  NewVDI: NewVDI;
  AutoInstall: AutoInstall;
  NetworkConfiguration: NetworkConfiguration;
  VMInput: VMInput;
  PlatformInput: PlatformInput;
  CreateVM: CreateVM;
  TemplateInput: TemplateInput;
  InstallOSOptionsInput: InstallOSOptionsInput;
  TemplateMutation: TemplateMutation;
  TemplateCloneMutation: TemplateCloneMutation;
  TemplateDestroyMutation: TemplateDestroyMutation;
  TemplateAccessSet: TemplateAccessSet;
  VMMutation: VMMutation;
  VMStartInput: VMStartInput;
  VMStartMutation: VMStartMutation;
  ShutdownForce: ShutdownForce;
  VMShutdownMutation: VMShutdownMutation;
  VMRebootMutation: VMRebootMutation;
  VMPauseMutation: VMPauseMutation;
  VMSuspendMutation: VMSuspendMutation;
  VMSnapshotMutation: VMSnapshotMutation;
  VMRevertMutation: VMRevertMutation;
  VMSnapshotDestroyMutation: VMSnapshotDestroyMutation;
  VMDestroyMutation: VMDestroyMutation;
  VMAccessSet: VMAccessSet;
  PlaybookLaunchMutation: PlaybookLaunchMutation;
  NetworkInput: NetworkInput;
  NetworkMutation: NetworkMutation;
  AttachNetworkMutation: AttachNetworkMutation;
  NetAccessSet: NetAccessSet;
  VDIInput: VDIInput;
  VDIMutation: VDIMutation;
  VDICreateMutation: VDICreateMutation;
  AttachVDIMutation: AttachVDIMutation;
  VDIAccessSet: VDIAccessSet;
  VDIDestroyMutation: VDIDestroyMutation;
  SRInput: SRInput;
  SRMutation: SRMutation;
  SRAccessSet: SRAccessSet;
  SRDestroyMutation: SRDestroyMutation;
  PoolInput: PoolInput;
  PoolMutation: PoolMutation;
  PoolAccessSet: PoolAccessSet;
  TaskRemoveMutation: TaskRemoveMutation;
  QuotaInput: QuotaInput;
  QuotaMutation: QuotaMutation;
  Subscription: {};
  GVMsSubscription: GVMsSubscription;
  Change: Change;
  GVMOrDeleted: ResolversTypes["GVM"] | ResolversTypes["Deleted"];
  Deleted: Deleted;
  GTemplatesSubscription: GTemplatesSubscription;
  GTemplateOrDeleted: ResolversTypes["GTemplate"] | ResolversTypes["Deleted"];
  GHostsSubscription: GHostsSubscription;
  GHostOrDeleted: ResolversTypes["GHost"] | ResolversTypes["Deleted"];
  GPoolsSubscription: GPoolsSubscription;
  GPoolOrDeleted: ResolversTypes["GPool"] | ResolversTypes["Deleted"];
  GNetworksSubscription: GNetworksSubscription;
  GNetworkOrDeleted: ResolversTypes["GNetwork"] | ResolversTypes["Deleted"];
  GSRsSubscription: GSRsSubscription;
  GSROrDeleted: ResolversTypes["GSR"] | ResolversTypes["Deleted"];
  GVDIsSubscription: GVDIsSubscription;
  GVDIOrDeleted: ResolversTypes["GVDI"] | ResolversTypes["Deleted"];
  GTasksSubscription: GTasksSubscription;
  GTaskOrDeleted: ResolversTypes["GTask"] | ResolversTypes["Deleted"];
};

export type AttachNetworkMutationResolvers<
  ContextType = any,
  ParentType = ResolversTypes["AttachNetworkMutation"]
> = {
  taskId?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  granted?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
};

export type AttachVDIMutationResolvers<
  ContextType = any,
  ParentType = ResolversTypes["AttachVDIMutation"]
> = {
  taskId?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  granted?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
};

export type CpuInfoResolvers<
  ContextType = any,
  ParentType = ResolversTypes["CpuInfo"]
> = {
  cpuCount?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  modelname?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  socketCount?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  vendor?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  family?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  features?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  featuresHvm?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  featuresPv?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  flags?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  model?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  speed?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
  stepping?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
};

export type CreateVMResolvers<
  ContextType = any,
  ParentType = ResolversTypes["CreateVM"]
> = {
  taskId?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  granted?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
};

export type CurrentUserInformationResolvers<
  ContextType = any,
  ParentType = ResolversTypes["CurrentUserInformation"]
> = {
  isAdmin?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes["User"]>, ParentType, ContextType>;
  groups?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["User"]>>>,
    ParentType,
    ContextType
  >;
};

export interface DateTimeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["DateTime"], any> {
  name: "DateTime";
}

export type DeletedResolvers<
  ContextType = any,
  ParentType = ResolversTypes["Deleted"]
> = {
  ref?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
};

export type GAbstractVMResolvers<
  ContextType = any,
  ParentType = ResolversTypes["GAbstractVM"]
> = {
  __resolveType: TypeResolveFn<
    "GVM" | "GVMSnapshot" | "GTemplate",
    ParentType,
    ContextType
  >;
  platform?: Resolver<
    Maybe<ResolversTypes["Platform"]>,
    ParentType,
    ContextType
  >;
  VCPUsAtStartup?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  VCPUsMax?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  domainType?: Resolver<ResolversTypes["DomainType"], ParentType, ContextType>;
  guestMetrics?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  installTime?: Resolver<ResolversTypes["DateTime"], ParentType, ContextType>;
  memoryActual?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
  memoryStaticMin?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
  memoryStaticMax?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
  memoryDynamicMin?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
  memoryDynamicMax?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
  PVBootloader?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
};

export type GAccessEntryResolvers<
  ContextType = any,
  ParentType = ResolversTypes["GAccessEntry"]
> = {
  __resolveType: TypeResolveFn<
    | "GVMAccessEntry"
    | "GNetworkAccessEntry"
    | "GVDIAccessEntry"
    | "GSRAccessEntry"
    | "GTemplateAccessEntry"
    | "GPoolAccessEntry"
    | "GTaskAccessEntry",
    ParentType,
    ContextType
  >;
  userId?: Resolver<ResolversTypes["User"], ParentType, ContextType>;
  isOwner?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
};

export type GAclXenObjectResolvers<
  ContextType = any,
  ParentType = ResolversTypes["GAclXenObject"]
> = {
  __resolveType: TypeResolveFn<
    | "GVM"
    | "GNetwork"
    | "GVDI"
    | "GSR"
    | "GVMSnapshot"
    | "GTemplate"
    | "GPool"
    | "GTask",
    ParentType,
    ContextType
  >;
  nameLabel?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  nameDescription?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  ref?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  uuid?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  access?: Resolver<
    Array<Maybe<ResolversTypes["GAccessEntry"]>>,
    ParentType,
    ContextType
  >;
  isOwner?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
};

export type GHostResolvers<
  ContextType = any,
  ParentType = ResolversTypes["GHost"]
> = {
  nameLabel?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  nameDescription?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  ref?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  uuid?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  APIVersionMajor?: Resolver<
    Maybe<ResolversTypes["Int"]>,
    ParentType,
    ContextType
  >;
  APIVersionMinor?: Resolver<
    Maybe<ResolversTypes["Int"]>,
    ParentType,
    ContextType
  >;
  PBDs?: Resolver<
    Array<Maybe<ResolversTypes["GPBD"]>>,
    ParentType,
    ContextType
  >;
  PCIs?: Resolver<Array<Maybe<ResolversTypes["ID"]>>, ParentType, ContextType>;
  PGPUs?: Resolver<Array<Maybe<ResolversTypes["ID"]>>, ParentType, ContextType>;
  PIFs?: Resolver<Array<Maybe<ResolversTypes["ID"]>>, ParentType, ContextType>;
  PUSBs?: Resolver<Array<Maybe<ResolversTypes["ID"]>>, ParentType, ContextType>;
  address?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  allowedOperations?: Resolver<
    Array<Maybe<ResolversTypes["HostAllowedOperations"]>>,
    ParentType,
    ContextType
  >;
  cpuInfo?: Resolver<ResolversTypes["CpuInfo"], ParentType, ContextType>;
  display?: Resolver<ResolversTypes["HostDisplay"], ParentType, ContextType>;
  hostname?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  softwareVersion?: Resolver<
    ResolversTypes["SoftwareVersion"],
    ParentType,
    ContextType
  >;
  residentVms?: Resolver<
    Array<Maybe<ResolversTypes["GVM"]>>,
    ParentType,
    ContextType
  >;
  metrics?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  memoryTotal?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
  memoryFree?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
  memoryAvailable?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
  memoryOverhead?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
  live?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  liveUpdated?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
};

export type GHostOrDeletedResolvers<
  ContextType = any,
  ParentType = ResolversTypes["GHostOrDeleted"]
> = {
  __resolveType: TypeResolveFn<"GHost" | "Deleted", ParentType, ContextType>;
};

export type GHostsSubscriptionResolvers<
  ContextType = any,
  ParentType = ResolversTypes["GHostsSubscription"]
> = {
  changeType?: Resolver<ResolversTypes["Change"], ParentType, ContextType>;
  value?: Resolver<ResolversTypes["GHostOrDeleted"], ParentType, ContextType>;
};

export type GNetworkResolvers<
  ContextType = any,
  ParentType = ResolversTypes["GNetwork"]
> = {
  nameLabel?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  nameDescription?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  ref?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  uuid?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  access?: Resolver<
    Array<Maybe<ResolversTypes["GNetworkAccessEntry"]>>,
    ParentType,
    ContextType
  >;
  isOwner?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  myActions?: Resolver<
    Array<Maybe<ResolversTypes["NetworkActions"]>>,
    ParentType,
    ContextType
  >;
  VIFs?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["GVIF"]>>>,
    ParentType,
    ContextType
  >;
  otherConfig?: Resolver<
    Maybe<ResolversTypes["JSONString"]>,
    ParentType,
    ContextType
  >;
};

export type GNetworkAccessEntryResolvers<
  ContextType = any,
  ParentType = ResolversTypes["GNetworkAccessEntry"]
> = {
  userId?: Resolver<ResolversTypes["User"], ParentType, ContextType>;
  isOwner?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  actions?: Resolver<
    Array<ResolversTypes["NetworkActions"]>,
    ParentType,
    ContextType
  >;
};

export type GNetworkOrDeletedResolvers<
  ContextType = any,
  ParentType = ResolversTypes["GNetworkOrDeleted"]
> = {
  __resolveType: TypeResolveFn<"GNetwork" | "Deleted", ParentType, ContextType>;
};

export type GNetworksSubscriptionResolvers<
  ContextType = any,
  ParentType = ResolversTypes["GNetworksSubscription"]
> = {
  changeType?: Resolver<ResolversTypes["Change"], ParentType, ContextType>;
  value?: Resolver<
    ResolversTypes["GNetworkOrDeleted"],
    ParentType,
    ContextType
  >;
};

export type GPBDResolvers<
  ContextType = any,
  ParentType = ResolversTypes["GPBD"]
> = {
  ref?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  uuid?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  host?: Resolver<ResolversTypes["GHost"], ParentType, ContextType>;
  deviceConfig?: Resolver<
    ResolversTypes["JSONString"],
    ParentType,
    ContextType
  >;
  SR?: Resolver<ResolversTypes["GSR"], ParentType, ContextType>;
  currentlyAttached?: Resolver<
    ResolversTypes["Boolean"],
    ParentType,
    ContextType
  >;
};

export type GPlaybookResolvers<
  ContextType = any,
  ParentType = ResolversTypes["GPlaybook"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  inventory?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  requires?: Resolver<
    Maybe<ResolversTypes["PlaybookRequirements"]>,
    ParentType,
    ContextType
  >;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  description?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  variables?: Resolver<
    Maybe<ResolversTypes["JSONString"]>,
    ParentType,
    ContextType
  >;
};

export type GPoolResolvers<
  ContextType = any,
  ParentType = ResolversTypes["GPool"]
> = {
  nameLabel?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  nameDescription?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  ref?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  uuid?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  access?: Resolver<
    Array<Maybe<ResolversTypes["GPoolAccessEntry"]>>,
    ParentType,
    ContextType
  >;
  isOwner?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  myActions?: Resolver<
    Array<Maybe<ResolversTypes["PoolActions"]>>,
    ParentType,
    ContextType
  >;
  master?: Resolver<Maybe<ResolversTypes["GHost"]>, ParentType, ContextType>;
  defaultSr?: Resolver<Maybe<ResolversTypes["GSR"]>, ParentType, ContextType>;
};

export type GPoolAccessEntryResolvers<
  ContextType = any,
  ParentType = ResolversTypes["GPoolAccessEntry"]
> = {
  userId?: Resolver<ResolversTypes["User"], ParentType, ContextType>;
  isOwner?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  actions?: Resolver<
    Array<ResolversTypes["PoolActions"]>,
    ParentType,
    ContextType
  >;
};

export type GPoolOrDeletedResolvers<
  ContextType = any,
  ParentType = ResolversTypes["GPoolOrDeleted"]
> = {
  __resolveType: TypeResolveFn<"GPool" | "Deleted", ParentType, ContextType>;
};

export type GPoolsSubscriptionResolvers<
  ContextType = any,
  ParentType = ResolversTypes["GPoolsSubscription"]
> = {
  changeType?: Resolver<ResolversTypes["Change"], ParentType, ContextType>;
  value?: Resolver<ResolversTypes["GPoolOrDeleted"], ParentType, ContextType>;
};

export type GQuotaObjectResolvers<
  ContextType = any,
  ParentType = ResolversTypes["GQuotaObject"]
> = {
  __resolveType: TypeResolveFn<
    "GVM" | "GVDI" | "GVMSnapshot",
    ParentType,
    ContextType
  >;
  mainOwner?: Resolver<Maybe<ResolversTypes["User"]>, ParentType, ContextType>;
};

export type GSRResolvers<
  ContextType = any,
  ParentType = ResolversTypes["GSR"]
> = {
  nameLabel?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  nameDescription?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  ref?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  uuid?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  access?: Resolver<
    Array<Maybe<ResolversTypes["GSRAccessEntry"]>>,
    ParentType,
    ContextType
  >;
  isOwner?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  myActions?: Resolver<
    Array<Maybe<ResolversTypes["SRActions"]>>,
    ParentType,
    ContextType
  >;
  PBDs?: Resolver<
    Array<Maybe<ResolversTypes["GPBD"]>>,
    ParentType,
    ContextType
  >;
  VDIs?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["GVDI"]>>>,
    ParentType,
    ContextType
  >;
  contentType?: Resolver<
    ResolversTypes["SRContentType"],
    ParentType,
    ContextType
  >;
  type?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  physicalSize?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
  virtualAllocation?: Resolver<
    ResolversTypes["Float"],
    ParentType,
    ContextType
  >;
  isToolsSr?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  physicalUtilisation?: Resolver<
    ResolversTypes["Float"],
    ParentType,
    ContextType
  >;
  spaceAvailable?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
};

export type GSRAccessEntryResolvers<
  ContextType = any,
  ParentType = ResolversTypes["GSRAccessEntry"]
> = {
  userId?: Resolver<ResolversTypes["User"], ParentType, ContextType>;
  isOwner?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  actions?: Resolver<
    Array<ResolversTypes["SRActions"]>,
    ParentType,
    ContextType
  >;
};

export type GSROrDeletedResolvers<
  ContextType = any,
  ParentType = ResolversTypes["GSROrDeleted"]
> = {
  __resolveType: TypeResolveFn<"GSR" | "Deleted", ParentType, ContextType>;
};

export type GSRsSubscriptionResolvers<
  ContextType = any,
  ParentType = ResolversTypes["GSRsSubscription"]
> = {
  changeType?: Resolver<ResolversTypes["Change"], ParentType, ContextType>;
  value?: Resolver<ResolversTypes["GSROrDeleted"], ParentType, ContextType>;
};

export type GTaskResolvers<
  ContextType = any,
  ParentType = ResolversTypes["GTask"]
> = {
  nameLabel?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  nameDescription?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  ref?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  uuid?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  access?: Resolver<
    Array<Maybe<ResolversTypes["GTaskAccessEntry"]>>,
    ParentType,
    ContextType
  >;
  isOwner?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  myActions?: Resolver<
    Array<Maybe<ResolversTypes["TaskActions"]>>,
    ParentType,
    ContextType
  >;
  created?: Resolver<ResolversTypes["DateTime"], ParentType, ContextType>;
  finished?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  progress?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
  result?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  who?: Resolver<Maybe<ResolversTypes["User"]>, ParentType, ContextType>;
  residentOn?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  errorInfo?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["String"]>>>,
    ParentType,
    ContextType
  >;
  status?: Resolver<ResolversTypes["TaskStatus"], ParentType, ContextType>;
  objectRef?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  objectType?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  action?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
};

export type GTaskAccessEntryResolvers<
  ContextType = any,
  ParentType = ResolversTypes["GTaskAccessEntry"]
> = {
  userId?: Resolver<ResolversTypes["User"], ParentType, ContextType>;
  isOwner?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  actions?: Resolver<
    Array<ResolversTypes["TaskActions"]>,
    ParentType,
    ContextType
  >;
};

export type GTaskOrDeletedResolvers<
  ContextType = any,
  ParentType = ResolversTypes["GTaskOrDeleted"]
> = {
  __resolveType: TypeResolveFn<"GTask" | "Deleted", ParentType, ContextType>;
};

export type GTasksSubscriptionResolvers<
  ContextType = any,
  ParentType = ResolversTypes["GTasksSubscription"]
> = {
  changeType?: Resolver<ResolversTypes["Change"], ParentType, ContextType>;
  value?: Resolver<ResolversTypes["GTaskOrDeleted"], ParentType, ContextType>;
};

export type GTemplateResolvers<
  ContextType = any,
  ParentType = ResolversTypes["GTemplate"]
> = {
  nameLabel?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  nameDescription?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  ref?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  uuid?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  access?: Resolver<
    Array<Maybe<ResolversTypes["GTemplateAccessEntry"]>>,
    ParentType,
    ContextType
  >;
  isOwner?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  platform?: Resolver<
    Maybe<ResolversTypes["Platform"]>,
    ParentType,
    ContextType
  >;
  VCPUsAtStartup?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  VCPUsMax?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  domainType?: Resolver<ResolversTypes["DomainType"], ParentType, ContextType>;
  guestMetrics?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  installTime?: Resolver<ResolversTypes["DateTime"], ParentType, ContextType>;
  memoryActual?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
  memoryStaticMin?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
  memoryStaticMax?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
  memoryDynamicMin?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
  memoryDynamicMax?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
  PVBootloader?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  myActions?: Resolver<
    Array<Maybe<ResolversTypes["TemplateActions"]>>,
    ParentType,
    ContextType
  >;
  isDefaultTemplate?: Resolver<
    ResolversTypes["Boolean"],
    ParentType,
    ContextType
  >;
  installOptions?: Resolver<
    Maybe<ResolversTypes["InstallOSOptions"]>,
    ParentType,
    ContextType
  >;
};

export type GTemplateAccessEntryResolvers<
  ContextType = any,
  ParentType = ResolversTypes["GTemplateAccessEntry"]
> = {
  userId?: Resolver<ResolversTypes["User"], ParentType, ContextType>;
  isOwner?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  actions?: Resolver<
    Array<ResolversTypes["TemplateActions"]>,
    ParentType,
    ContextType
  >;
};

export type GTemplateOrDeletedResolvers<
  ContextType = any,
  ParentType = ResolversTypes["GTemplateOrDeleted"]
> = {
  __resolveType: TypeResolveFn<
    "GTemplate" | "Deleted",
    ParentType,
    ContextType
  >;
};

export type GTemplatesSubscriptionResolvers<
  ContextType = any,
  ParentType = ResolversTypes["GTemplatesSubscription"]
> = {
  changeType?: Resolver<ResolversTypes["Change"], ParentType, ContextType>;
  value?: Resolver<
    ResolversTypes["GTemplateOrDeleted"],
    ParentType,
    ContextType
  >;
};

export type GVBDResolvers<
  ContextType = any,
  ParentType = ResolversTypes["GVBD"]
> = {
  ref?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  uuid?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  VM?: Resolver<Maybe<ResolversTypes["GVM"]>, ParentType, ContextType>;
  VDI?: Resolver<Maybe<ResolversTypes["GVDI"]>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes["VBDType"], ParentType, ContextType>;
  mode?: Resolver<ResolversTypes["VBDMode"], ParentType, ContextType>;
  currentlyAttached?: Resolver<
    ResolversTypes["Boolean"],
    ParentType,
    ContextType
  >;
  bootable?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  userdevice?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
};

export type GVDIResolvers<
  ContextType = any,
  ParentType = ResolversTypes["GVDI"]
> = {
  nameLabel?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  nameDescription?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  ref?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  uuid?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  access?: Resolver<
    Array<Maybe<ResolversTypes["GVDIAccessEntry"]>>,
    ParentType,
    ContextType
  >;
  isOwner?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  mainOwner?: Resolver<Maybe<ResolversTypes["User"]>, ParentType, ContextType>;
  myActions?: Resolver<
    Array<Maybe<ResolversTypes["VDIActions"]>>,
    ParentType,
    ContextType
  >;
  SR?: Resolver<Maybe<ResolversTypes["GSR"]>, ParentType, ContextType>;
  virtualSize?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
  VBDs?: Resolver<
    Array<Maybe<ResolversTypes["GVBD"]>>,
    ParentType,
    ContextType
  >;
  contentType?: Resolver<
    ResolversTypes["SRContentType"],
    ParentType,
    ContextType
  >;
  type?: Resolver<ResolversTypes["VDIType"], ParentType, ContextType>;
};

export type GVDIAccessEntryResolvers<
  ContextType = any,
  ParentType = ResolversTypes["GVDIAccessEntry"]
> = {
  userId?: Resolver<ResolversTypes["User"], ParentType, ContextType>;
  isOwner?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  actions?: Resolver<
    Array<ResolversTypes["VDIActions"]>,
    ParentType,
    ContextType
  >;
};

export type GVDIOrDeletedResolvers<
  ContextType = any,
  ParentType = ResolversTypes["GVDIOrDeleted"]
> = {
  __resolveType: TypeResolveFn<"GVDI" | "Deleted", ParentType, ContextType>;
};

export type GVDIsSubscriptionResolvers<
  ContextType = any,
  ParentType = ResolversTypes["GVDIsSubscription"]
> = {
  changeType?: Resolver<ResolversTypes["Change"], ParentType, ContextType>;
  value?: Resolver<ResolversTypes["GVDIOrDeleted"], ParentType, ContextType>;
};

export type GVIFResolvers<
  ContextType = any,
  ParentType = ResolversTypes["GVIF"]
> = {
  ref?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  MAC?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  VM?: Resolver<Maybe<ResolversTypes["GVM"]>, ParentType, ContextType>;
  device?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  currentlyAttached?: Resolver<
    ResolversTypes["Boolean"],
    ParentType,
    ContextType
  >;
  ip?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  ipv4?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  ipv6?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  network?: Resolver<
    Maybe<ResolversTypes["GNetwork"]>,
    ParentType,
    ContextType
  >;
};

export type GVMResolvers<
  ContextType = any,
  ParentType = ResolversTypes["GVM"]
> = {
  nameLabel?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  nameDescription?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  ref?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  uuid?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  access?: Resolver<
    Array<Maybe<ResolversTypes["GVMAccessEntry"]>>,
    ParentType,
    ContextType
  >;
  isOwner?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  platform?: Resolver<
    Maybe<ResolversTypes["Platform"]>,
    ParentType,
    ContextType
  >;
  VCPUsAtStartup?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  VCPUsMax?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  domainType?: Resolver<ResolversTypes["DomainType"], ParentType, ContextType>;
  guestMetrics?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  installTime?: Resolver<ResolversTypes["DateTime"], ParentType, ContextType>;
  memoryActual?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
  memoryStaticMin?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
  memoryStaticMax?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
  memoryDynamicMin?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
  memoryDynamicMax?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
  PVBootloader?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  mainOwner?: Resolver<Maybe<ResolversTypes["User"]>, ParentType, ContextType>;
  myActions?: Resolver<
    Array<Maybe<ResolversTypes["VMActions"]>>,
    ParentType,
    ContextType
  >;
  PVDriversUpToDate?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
  PVDriversVersion?: Resolver<
    Maybe<ResolversTypes["PvDriversVersion"]>,
    ParentType,
    ContextType
  >;
  metrics?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  osVersion?: Resolver<
    Maybe<ResolversTypes["OSVersion"]>,
    ParentType,
    ContextType
  >;
  powerState?: Resolver<ResolversTypes["PowerState"], ParentType, ContextType>;
  startTime?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  VIFs?: Resolver<
    Array<Maybe<ResolversTypes["GVIF"]>>,
    ParentType,
    ContextType
  >;
  VBDs?: Resolver<
    Array<Maybe<ResolversTypes["GVBD"]>>,
    ParentType,
    ContextType
  >;
  snapshots?: Resolver<
    Array<Maybe<ResolversTypes["GVMSnapshot"]>>,
    ParentType,
    ContextType
  >;
};

export type GVMAccessEntryResolvers<
  ContextType = any,
  ParentType = ResolversTypes["GVMAccessEntry"]
> = {
  userId?: Resolver<ResolversTypes["User"], ParentType, ContextType>;
  isOwner?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  actions?: Resolver<
    Array<ResolversTypes["VMActions"]>,
    ParentType,
    ContextType
  >;
};

export type GVMOrDeletedResolvers<
  ContextType = any,
  ParentType = ResolversTypes["GVMOrDeleted"]
> = {
  __resolveType: TypeResolveFn<"GVM" | "Deleted", ParentType, ContextType>;
};

export type GVMSnapshotResolvers<
  ContextType = any,
  ParentType = ResolversTypes["GVMSnapshot"]
> = {
  nameLabel?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  nameDescription?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  ref?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  uuid?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  access?: Resolver<
    Array<Maybe<ResolversTypes["GVMAccessEntry"]>>,
    ParentType,
    ContextType
  >;
  isOwner?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  platform?: Resolver<
    Maybe<ResolversTypes["Platform"]>,
    ParentType,
    ContextType
  >;
  VCPUsAtStartup?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  VCPUsMax?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  domainType?: Resolver<ResolversTypes["DomainType"], ParentType, ContextType>;
  guestMetrics?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  installTime?: Resolver<ResolversTypes["DateTime"], ParentType, ContextType>;
  memoryActual?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
  memoryStaticMin?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
  memoryStaticMax?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
  memoryDynamicMin?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
  memoryDynamicMax?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
  PVBootloader?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  mainOwner?: Resolver<Maybe<ResolversTypes["User"]>, ParentType, ContextType>;
  myActions?: Resolver<
    Array<Maybe<ResolversTypes["VMActions"]>>,
    ParentType,
    ContextType
  >;
  VIFs?: Resolver<
    Array<Maybe<ResolversTypes["GVIF"]>>,
    ParentType,
    ContextType
  >;
  VBDs?: Resolver<
    Array<Maybe<ResolversTypes["GVBD"]>>,
    ParentType,
    ContextType
  >;
  snapshotTime?: Resolver<ResolversTypes["DateTime"], ParentType, ContextType>;
  snapshotOf?: Resolver<ResolversTypes["GVM"], ParentType, ContextType>;
};

export type GVMsSubscriptionResolvers<
  ContextType = any,
  ParentType = ResolversTypes["GVMsSubscription"]
> = {
  changeType?: Resolver<ResolversTypes["Change"], ParentType, ContextType>;
  value?: Resolver<ResolversTypes["GVMOrDeleted"], ParentType, ContextType>;
};

export type GXenObjectResolvers<
  ContextType = any,
  ParentType = ResolversTypes["GXenObject"]
> = {
  __resolveType: TypeResolveFn<"GHost", ParentType, ContextType>;
  nameLabel?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  nameDescription?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  ref?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  uuid?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
};

export type InstallOSOptionsResolvers<
  ContextType = any,
  ParentType = ResolversTypes["InstallOSOptions"]
> = {
  distro?: Resolver<ResolversTypes["Distro"], ParentType, ContextType>;
  arch?: Resolver<Maybe<ResolversTypes["Arch"]>, ParentType, ContextType>;
  release?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  installRepository?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
};

export interface JSONStringScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["JSONString"], any> {
  name: "JSONString";
}

export type MutationResolvers<
  ContextType = any,
  ParentType = ResolversTypes["Mutation"]
> = {
  createVm?: Resolver<
    Maybe<ResolversTypes["CreateVM"]>,
    ParentType,
    ContextType,
    MutationcreateVmArgs
  >;
  template?: Resolver<
    Maybe<ResolversTypes["TemplateMutation"]>,
    ParentType,
    ContextType,
    MutationtemplateArgs
  >;
  templateClone?: Resolver<
    Maybe<ResolversTypes["TemplateCloneMutation"]>,
    ParentType,
    ContextType,
    MutationtemplateCloneArgs
  >;
  templateDelete?: Resolver<
    Maybe<ResolversTypes["TemplateDestroyMutation"]>,
    ParentType,
    ContextType,
    MutationtemplateDeleteArgs
  >;
  templateAccessSet?: Resolver<
    Maybe<ResolversTypes["TemplateAccessSet"]>,
    ParentType,
    ContextType,
    MutationtemplateAccessSetArgs
  >;
  vm?: Resolver<
    Maybe<ResolversTypes["VMMutation"]>,
    ParentType,
    ContextType,
    MutationvmArgs
  >;
  vmStart?: Resolver<
    Maybe<ResolversTypes["VMStartMutation"]>,
    ParentType,
    ContextType,
    MutationvmStartArgs
  >;
  vmShutdown?: Resolver<
    Maybe<ResolversTypes["VMShutdownMutation"]>,
    ParentType,
    ContextType,
    MutationvmShutdownArgs
  >;
  vmReboot?: Resolver<
    Maybe<ResolversTypes["VMRebootMutation"]>,
    ParentType,
    ContextType,
    MutationvmRebootArgs
  >;
  vmPause?: Resolver<
    Maybe<ResolversTypes["VMPauseMutation"]>,
    ParentType,
    ContextType,
    MutationvmPauseArgs
  >;
  vmSuspend?: Resolver<
    Maybe<ResolversTypes["VMSuspendMutation"]>,
    ParentType,
    ContextType,
    MutationvmSuspendArgs
  >;
  vmSnapshot?: Resolver<
    Maybe<ResolversTypes["VMSnapshotMutation"]>,
    ParentType,
    ContextType,
    MutationvmSnapshotArgs
  >;
  vmRevert?: Resolver<
    Maybe<ResolversTypes["VMRevertMutation"]>,
    ParentType,
    ContextType,
    MutationvmRevertArgs
  >;
  vmSnapshotDestroy?: Resolver<
    Maybe<ResolversTypes["VMSnapshotDestroyMutation"]>,
    ParentType,
    ContextType,
    MutationvmSnapshotDestroyArgs
  >;
  vmDelete?: Resolver<
    Maybe<ResolversTypes["VMDestroyMutation"]>,
    ParentType,
    ContextType,
    MutationvmDeleteArgs
  >;
  vmAccessSet?: Resolver<
    Maybe<ResolversTypes["VMAccessSet"]>,
    ParentType,
    ContextType,
    MutationvmAccessSetArgs
  >;
  playbookLaunch?: Resolver<
    Maybe<ResolversTypes["PlaybookLaunchMutation"]>,
    ParentType,
    ContextType,
    MutationplaybookLaunchArgs
  >;
  network?: Resolver<
    Maybe<ResolversTypes["NetworkMutation"]>,
    ParentType,
    ContextType,
    MutationnetworkArgs
  >;
  netAttach?: Resolver<
    Maybe<ResolversTypes["AttachNetworkMutation"]>,
    ParentType,
    ContextType,
    MutationnetAttachArgs
  >;
  netAccessSet?: Resolver<
    Maybe<ResolversTypes["NetAccessSet"]>,
    ParentType,
    ContextType,
    MutationnetAccessSetArgs
  >;
  vdi?: Resolver<
    Maybe<ResolversTypes["VDIMutation"]>,
    ParentType,
    ContextType,
    MutationvdiArgs
  >;
  vdiCreate?: Resolver<
    Maybe<ResolversTypes["VDICreateMutation"]>,
    ParentType,
    ContextType,
    MutationvdiCreateArgs
  >;
  vdiAttach?: Resolver<
    Maybe<ResolversTypes["AttachVDIMutation"]>,
    ParentType,
    ContextType,
    MutationvdiAttachArgs
  >;
  vdiAccessSet?: Resolver<
    Maybe<ResolversTypes["VDIAccessSet"]>,
    ParentType,
    ContextType,
    MutationvdiAccessSetArgs
  >;
  vdiDelete?: Resolver<
    Maybe<ResolversTypes["VDIDestroyMutation"]>,
    ParentType,
    ContextType,
    MutationvdiDeleteArgs
  >;
  sr?: Resolver<
    Maybe<ResolversTypes["SRMutation"]>,
    ParentType,
    ContextType,
    MutationsrArgs
  >;
  srAccessSet?: Resolver<
    Maybe<ResolversTypes["SRAccessSet"]>,
    ParentType,
    ContextType,
    MutationsrAccessSetArgs
  >;
  srDelete?: Resolver<
    Maybe<ResolversTypes["SRDestroyMutation"]>,
    ParentType,
    ContextType,
    MutationsrDeleteArgs
  >;
  pool?: Resolver<
    Maybe<ResolversTypes["PoolMutation"]>,
    ParentType,
    ContextType,
    MutationpoolArgs
  >;
  poolAccessSet?: Resolver<
    Maybe<ResolversTypes["PoolAccessSet"]>,
    ParentType,
    ContextType,
    MutationpoolAccessSetArgs
  >;
  taskDelete?: Resolver<
    Maybe<ResolversTypes["TaskRemoveMutation"]>,
    ParentType,
    ContextType,
    MutationtaskDeleteArgs
  >;
  quotaSet?: Resolver<
    Maybe<ResolversTypes["QuotaMutation"]>,
    ParentType,
    ContextType,
    MutationquotaSetArgs
  >;
  selectedItems?: Resolver<
    Maybe<Array<ResolversTypes["ID"]>>,
    ParentType,
    ContextType,
    MutationselectedItemsArgs
  >;
};

export type NetAccessSetResolvers<
  ContextType = any,
  ParentType = ResolversTypes["NetAccessSet"]
> = {
  success?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
};

export type NetworkMutationResolvers<
  ContextType = any,
  ParentType = ResolversTypes["NetworkMutation"]
> = {
  granted?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
};

export type OSVersionResolvers<
  ContextType = any,
  ParentType = ResolversTypes["OSVersion"]
> = {
  name?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  uname?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  distro?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  major?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  minor?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
};

export type PlatformResolvers<
  ContextType = any,
  ParentType = ResolversTypes["Platform"]
> = {
  coresPerSocket?: Resolver<
    Maybe<ResolversTypes["Int"]>,
    ParentType,
    ContextType
  >;
  timeoffset?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  nx?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  deviceModel?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  pae?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  hpet?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  apic?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  acpi?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  videoram?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
};

export type PlaybookLaunchMutationResolvers<
  ContextType = any,
  ParentType = ResolversTypes["PlaybookLaunchMutation"]
> = {
  taskId?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
};

export type PlaybookRequirementsResolvers<
  ContextType = any,
  ParentType = ResolversTypes["PlaybookRequirements"]
> = {
  osVersion?: Resolver<
    Array<Maybe<ResolversTypes["OSVersion"]>>,
    ParentType,
    ContextType
  >;
};

export type PoolAccessSetResolvers<
  ContextType = any,
  ParentType = ResolversTypes["PoolAccessSet"]
> = {
  success?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
};

export type PoolMutationResolvers<
  ContextType = any,
  ParentType = ResolversTypes["PoolMutation"]
> = {
  granted?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
};

export type PvDriversVersionResolvers<
  ContextType = any,
  ParentType = ResolversTypes["PvDriversVersion"]
> = {
  major?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  minor?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  micro?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  build?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
};

export type QueryResolvers<
  ContextType = any,
  ParentType = ResolversTypes["Query"]
> = {
  vms?: Resolver<Array<Maybe<ResolversTypes["GVM"]>>, ParentType, ContextType>;
  vm?: Resolver<
    Maybe<ResolversTypes["GVM"]>,
    ParentType,
    ContextType,
    QueryvmArgs
  >;
  vmSnapshot?: Resolver<
    Maybe<ResolversTypes["GVMSnapshot"]>,
    ParentType,
    ContextType,
    QueryvmSnapshotArgs
  >;
  templates?: Resolver<
    Array<Maybe<ResolversTypes["GTemplate"]>>,
    ParentType,
    ContextType
  >;
  template?: Resolver<
    Maybe<ResolversTypes["GTemplate"]>,
    ParentType,
    ContextType,
    QuerytemplateArgs
  >;
  hosts?: Resolver<
    Array<Maybe<ResolversTypes["GHost"]>>,
    ParentType,
    ContextType
  >;
  host?: Resolver<
    Maybe<ResolversTypes["GHost"]>,
    ParentType,
    ContextType,
    QueryhostArgs
  >;
  pools?: Resolver<
    Array<Maybe<ResolversTypes["GPool"]>>,
    ParentType,
    ContextType
  >;
  pool?: Resolver<
    Maybe<ResolversTypes["GPool"]>,
    ParentType,
    ContextType,
    QuerypoolArgs
  >;
  networks?: Resolver<
    Array<Maybe<ResolversTypes["GNetwork"]>>,
    ParentType,
    ContextType
  >;
  network?: Resolver<
    Maybe<ResolversTypes["GNetwork"]>,
    ParentType,
    ContextType,
    QuerynetworkArgs
  >;
  srs?: Resolver<Array<Maybe<ResolversTypes["GSR"]>>, ParentType, ContextType>;
  sr?: Resolver<
    Maybe<ResolversTypes["GSR"]>,
    ParentType,
    ContextType,
    QuerysrArgs
  >;
  vdis?: Resolver<
    Array<Maybe<ResolversTypes["GVDI"]>>,
    ParentType,
    ContextType,
    QueryvdisArgs
  >;
  vdi?: Resolver<
    Maybe<ResolversTypes["GVDI"]>,
    ParentType,
    ContextType,
    QueryvdiArgs
  >;
  vbd?: Resolver<
    Maybe<ResolversTypes["GVBD"]>,
    ParentType,
    ContextType,
    QueryvbdArgs
  >;
  isosForInstall?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["GVDI"]>>>,
    ParentType,
    ContextType
  >;
  playbooks?: Resolver<
    Array<Maybe<ResolversTypes["GPlaybook"]>>,
    ParentType,
    ContextType
  >;
  playbook?: Resolver<
    Maybe<ResolversTypes["GPlaybook"]>,
    ParentType,
    ContextType,
    QueryplaybookArgs
  >;
  tasks?: Resolver<
    Array<Maybe<ResolversTypes["GTask"]>>,
    ParentType,
    ContextType,
    QuerytasksArgs
  >;
  task?: Resolver<
    Maybe<ResolversTypes["GTask"]>,
    ParentType,
    ContextType,
    QuerytaskArgs
  >;
  console?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType,
    QueryconsoleArgs
  >;
  users?: Resolver<
    Array<Maybe<ResolversTypes["User"]>>,
    ParentType,
    ContextType
  >;
  groups?: Resolver<
    Array<Maybe<ResolversTypes["User"]>>,
    ParentType,
    ContextType
  >;
  user?: Resolver<
    Maybe<ResolversTypes["User"]>,
    ParentType,
    ContextType,
    QueryuserArgs
  >;
  currentUser?: Resolver<
    Maybe<ResolversTypes["CurrentUserInformation"]>,
    ParentType,
    ContextType
  >;
  findUser?: Resolver<
    Array<Maybe<ResolversTypes["User"]>>,
    ParentType,
    ContextType,
    QueryfindUserArgs
  >;
  quotas?: Resolver<
    Array<Maybe<ResolversTypes["Quota"]>>,
    ParentType,
    ContextType
  >;
  quota?: Resolver<
    ResolversTypes["Quota"],
    ParentType,
    ContextType,
    QueryquotaArgs
  >;
  quotaLeft?: Resolver<
    ResolversTypes["Quota"],
    ParentType,
    ContextType,
    QueryquotaLeftArgs
  >;
  quotaUsage?: Resolver<
    ResolversTypes["Quota"],
    ParentType,
    ContextType,
    QueryquotaUsageArgs
  >;
  selectedItems?: Resolver<
    Array<ResolversTypes["ID"]>,
    ParentType,
    ContextType,
    QueryselectedItemsArgs
  >;
  vmSelectedReadyFor?: Resolver<
    ResolversTypes["VMSelectedIDLists"],
    ParentType,
    ContextType
  >;
};

export type QuotaResolvers<
  ContextType = any,
  ParentType = ResolversTypes["Quota"]
> = {
  memory?: Resolver<Maybe<ResolversTypes["Float"]>, ParentType, ContextType>;
  vdiSize?: Resolver<Maybe<ResolversTypes["Float"]>, ParentType, ContextType>;
  vcpuCount?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  vmCount?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  user?: Resolver<ResolversTypes["User"], ParentType, ContextType>;
};

export type QuotaMutationResolvers<
  ContextType = any,
  ParentType = ResolversTypes["QuotaMutation"]
> = {
  success?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
};

export type SoftwareVersionResolvers<
  ContextType = any,
  ParentType = ResolversTypes["SoftwareVersion"]
> = {
  buildNumber?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  date?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  hostname?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  linux?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  networkBackend?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  platformName?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  platformVersion?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  platformVersionText?: Resolver<
    ResolversTypes["String"],
    ParentType,
    ContextType
  >;
  platformVersionTextShort?: Resolver<
    ResolversTypes["String"],
    ParentType,
    ContextType
  >;
  xapi?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  xen?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  productBrand?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  productVersion?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  productVersionText?: Resolver<
    ResolversTypes["String"],
    ParentType,
    ContextType
  >;
};

export type SRAccessSetResolvers<
  ContextType = any,
  ParentType = ResolversTypes["SRAccessSet"]
> = {
  success?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
};

export type SRDestroyMutationResolvers<
  ContextType = any,
  ParentType = ResolversTypes["SRDestroyMutation"]
> = {
  taskId?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  granted?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
};

export type SRMutationResolvers<
  ContextType = any,
  ParentType = ResolversTypes["SRMutation"]
> = {
  granted?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
};

export type SubscriptionResolvers<
  ContextType = any,
  ParentType = ResolversTypes["Subscription"]
> = {
  vms?: SubscriptionResolver<
    ResolversTypes["GVMsSubscription"],
    ParentType,
    ContextType,
    SubscriptionvmsArgs
  >;
  vm?: SubscriptionResolver<
    Maybe<ResolversTypes["GVM"]>,
    ParentType,
    ContextType,
    SubscriptionvmArgs
  >;
  vmSnapshot?: SubscriptionResolver<
    Maybe<ResolversTypes["GVMSnapshot"]>,
    ParentType,
    ContextType,
    SubscriptionvmSnapshotArgs
  >;
  templates?: SubscriptionResolver<
    ResolversTypes["GTemplatesSubscription"],
    ParentType,
    ContextType,
    SubscriptiontemplatesArgs
  >;
  template?: SubscriptionResolver<
    Maybe<ResolversTypes["GTemplate"]>,
    ParentType,
    ContextType,
    SubscriptiontemplateArgs
  >;
  hosts?: SubscriptionResolver<
    ResolversTypes["GHostsSubscription"],
    ParentType,
    ContextType,
    SubscriptionhostsArgs
  >;
  host?: SubscriptionResolver<
    Maybe<ResolversTypes["GHost"]>,
    ParentType,
    ContextType,
    SubscriptionhostArgs
  >;
  pools?: SubscriptionResolver<
    ResolversTypes["GPoolsSubscription"],
    ParentType,
    ContextType,
    SubscriptionpoolsArgs
  >;
  pool?: SubscriptionResolver<
    Maybe<ResolversTypes["GPool"]>,
    ParentType,
    ContextType,
    SubscriptionpoolArgs
  >;
  networks?: SubscriptionResolver<
    ResolversTypes["GNetworksSubscription"],
    ParentType,
    ContextType,
    SubscriptionnetworksArgs
  >;
  network?: SubscriptionResolver<
    Maybe<ResolversTypes["GNetwork"]>,
    ParentType,
    ContextType,
    SubscriptionnetworkArgs
  >;
  srs?: SubscriptionResolver<
    ResolversTypes["GSRsSubscription"],
    ParentType,
    ContextType,
    SubscriptionsrsArgs
  >;
  sr?: SubscriptionResolver<
    Maybe<ResolversTypes["GSR"]>,
    ParentType,
    ContextType,
    SubscriptionsrArgs
  >;
  vdis?: SubscriptionResolver<
    ResolversTypes["GVDIsSubscription"],
    ParentType,
    ContextType,
    SubscriptionvdisArgs
  >;
  vdi?: SubscriptionResolver<
    Maybe<ResolversTypes["GVDI"]>,
    ParentType,
    ContextType,
    SubscriptionvdiArgs
  >;
  tasks?: SubscriptionResolver<
    ResolversTypes["GTasksSubscription"],
    ParentType,
    ContextType,
    SubscriptiontasksArgs
  >;
  task?: SubscriptionResolver<
    Maybe<ResolversTypes["GTask"]>,
    ParentType,
    ContextType,
    SubscriptiontaskArgs
  >;
};

export type TaskRemoveMutationResolvers<
  ContextType = any,
  ParentType = ResolversTypes["TaskRemoveMutation"]
> = {
  taskId?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  granted?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
};

export type TemplateAccessSetResolvers<
  ContextType = any,
  ParentType = ResolversTypes["TemplateAccessSet"]
> = {
  success?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
};

export type TemplateCloneMutationResolvers<
  ContextType = any,
  ParentType = ResolversTypes["TemplateCloneMutation"]
> = {
  taskId?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  granted?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
};

export type TemplateDestroyMutationResolvers<
  ContextType = any,
  ParentType = ResolversTypes["TemplateDestroyMutation"]
> = {
  taskId?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  granted?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
};

export type TemplateMutationResolvers<
  ContextType = any,
  ParentType = ResolversTypes["TemplateMutation"]
> = {
  granted?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
};

export type UserResolvers<
  ContextType = any,
  ParentType = ResolversTypes["User"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  username?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
};

export type VDIAccessSetResolvers<
  ContextType = any,
  ParentType = ResolversTypes["VDIAccessSet"]
> = {
  success?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
};

export type VDICreateMutationResolvers<
  ContextType = any,
  ParentType = ResolversTypes["VDICreateMutation"]
> = {
  taskId?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  granted?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
};

export type VDIDestroyMutationResolvers<
  ContextType = any,
  ParentType = ResolversTypes["VDIDestroyMutation"]
> = {
  taskId?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  granted?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
};

export type VDIMutationResolvers<
  ContextType = any,
  ParentType = ResolversTypes["VDIMutation"]
> = {
  granted?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
};

export type VMAccessSetResolvers<
  ContextType = any,
  ParentType = ResolversTypes["VMAccessSet"]
> = {
  success?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
};

export type VMDestroyMutationResolvers<
  ContextType = any,
  ParentType = ResolversTypes["VMDestroyMutation"]
> = {
  taskId?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  granted?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
};

export type VMMutationResolvers<
  ContextType = any,
  ParentType = ResolversTypes["VMMutation"]
> = {
  granted?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
};

export type VMPauseMutationResolvers<
  ContextType = any,
  ParentType = ResolversTypes["VMPauseMutation"]
> = {
  taskId?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  granted?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
};

export type VMRebootMutationResolvers<
  ContextType = any,
  ParentType = ResolversTypes["VMRebootMutation"]
> = {
  taskId?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  granted?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
};

export type VMRevertMutationResolvers<
  ContextType = any,
  ParentType = ResolversTypes["VMRevertMutation"]
> = {
  taskId?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  granted?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
};

export type VMSelectedIDListsResolvers<
  ContextType = any,
  ParentType = ResolversTypes["VMSelectedIDLists"]
> = {
  start?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["ID"]>>>,
    ParentType,
    ContextType
  >;
  stop?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["ID"]>>>,
    ParentType,
    ContextType
  >;
  trash?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["ID"]>>>,
    ParentType,
    ContextType
  >;
};

export type VMShutdownMutationResolvers<
  ContextType = any,
  ParentType = ResolversTypes["VMShutdownMutation"]
> = {
  taskId?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  granted?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
};

export type VMSnapshotDestroyMutationResolvers<
  ContextType = any,
  ParentType = ResolversTypes["VMSnapshotDestroyMutation"]
> = {
  taskId?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  granted?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
};

export type VMSnapshotMutationResolvers<
  ContextType = any,
  ParentType = ResolversTypes["VMSnapshotMutation"]
> = {
  taskId?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  granted?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
};

export type VMStartMutationResolvers<
  ContextType = any,
  ParentType = ResolversTypes["VMStartMutation"]
> = {
  taskId?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  granted?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
};

export type VMSuspendMutationResolvers<
  ContextType = any,
  ParentType = ResolversTypes["VMSuspendMutation"]
> = {
  taskId?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  granted?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  AttachNetworkMutation?: AttachNetworkMutationResolvers<ContextType>;
  AttachVDIMutation?: AttachVDIMutationResolvers<ContextType>;
  CpuInfo?: CpuInfoResolvers<ContextType>;
  CreateVM?: CreateVMResolvers<ContextType>;
  CurrentUserInformation?: CurrentUserInformationResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Deleted?: DeletedResolvers<ContextType>;
  GAbstractVM?: GAbstractVMResolvers;
  GAccessEntry?: GAccessEntryResolvers;
  GAclXenObject?: GAclXenObjectResolvers;
  GHost?: GHostResolvers<ContextType>;
  GHostOrDeleted?: GHostOrDeletedResolvers;
  GHostsSubscription?: GHostsSubscriptionResolvers<ContextType>;
  GNetwork?: GNetworkResolvers<ContextType>;
  GNetworkAccessEntry?: GNetworkAccessEntryResolvers<ContextType>;
  GNetworkOrDeleted?: GNetworkOrDeletedResolvers;
  GNetworksSubscription?: GNetworksSubscriptionResolvers<ContextType>;
  GPBD?: GPBDResolvers<ContextType>;
  GPlaybook?: GPlaybookResolvers<ContextType>;
  GPool?: GPoolResolvers<ContextType>;
  GPoolAccessEntry?: GPoolAccessEntryResolvers<ContextType>;
  GPoolOrDeleted?: GPoolOrDeletedResolvers;
  GPoolsSubscription?: GPoolsSubscriptionResolvers<ContextType>;
  GQuotaObject?: GQuotaObjectResolvers;
  GSR?: GSRResolvers<ContextType>;
  GSRAccessEntry?: GSRAccessEntryResolvers<ContextType>;
  GSROrDeleted?: GSROrDeletedResolvers;
  GSRsSubscription?: GSRsSubscriptionResolvers<ContextType>;
  GTask?: GTaskResolvers<ContextType>;
  GTaskAccessEntry?: GTaskAccessEntryResolvers<ContextType>;
  GTaskOrDeleted?: GTaskOrDeletedResolvers;
  GTasksSubscription?: GTasksSubscriptionResolvers<ContextType>;
  GTemplate?: GTemplateResolvers<ContextType>;
  GTemplateAccessEntry?: GTemplateAccessEntryResolvers<ContextType>;
  GTemplateOrDeleted?: GTemplateOrDeletedResolvers;
  GTemplatesSubscription?: GTemplatesSubscriptionResolvers<ContextType>;
  GVBD?: GVBDResolvers<ContextType>;
  GVDI?: GVDIResolvers<ContextType>;
  GVDIAccessEntry?: GVDIAccessEntryResolvers<ContextType>;
  GVDIOrDeleted?: GVDIOrDeletedResolvers;
  GVDIsSubscription?: GVDIsSubscriptionResolvers<ContextType>;
  GVIF?: GVIFResolvers<ContextType>;
  GVM?: GVMResolvers<ContextType>;
  GVMAccessEntry?: GVMAccessEntryResolvers<ContextType>;
  GVMOrDeleted?: GVMOrDeletedResolvers;
  GVMSnapshot?: GVMSnapshotResolvers<ContextType>;
  GVMsSubscription?: GVMsSubscriptionResolvers<ContextType>;
  GXenObject?: GXenObjectResolvers;
  InstallOSOptions?: InstallOSOptionsResolvers<ContextType>;
  JSONString?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  NetAccessSet?: NetAccessSetResolvers<ContextType>;
  NetworkMutation?: NetworkMutationResolvers<ContextType>;
  OSVersion?: OSVersionResolvers<ContextType>;
  Platform?: PlatformResolvers<ContextType>;
  PlaybookLaunchMutation?: PlaybookLaunchMutationResolvers<ContextType>;
  PlaybookRequirements?: PlaybookRequirementsResolvers<ContextType>;
  PoolAccessSet?: PoolAccessSetResolvers<ContextType>;
  PoolMutation?: PoolMutationResolvers<ContextType>;
  PvDriversVersion?: PvDriversVersionResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Quota?: QuotaResolvers<ContextType>;
  QuotaMutation?: QuotaMutationResolvers<ContextType>;
  SoftwareVersion?: SoftwareVersionResolvers<ContextType>;
  SRAccessSet?: SRAccessSetResolvers<ContextType>;
  SRDestroyMutation?: SRDestroyMutationResolvers<ContextType>;
  SRMutation?: SRMutationResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  TaskRemoveMutation?: TaskRemoveMutationResolvers<ContextType>;
  TemplateAccessSet?: TemplateAccessSetResolvers<ContextType>;
  TemplateCloneMutation?: TemplateCloneMutationResolvers<ContextType>;
  TemplateDestroyMutation?: TemplateDestroyMutationResolvers<ContextType>;
  TemplateMutation?: TemplateMutationResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  VDIAccessSet?: VDIAccessSetResolvers<ContextType>;
  VDICreateMutation?: VDICreateMutationResolvers<ContextType>;
  VDIDestroyMutation?: VDIDestroyMutationResolvers<ContextType>;
  VDIMutation?: VDIMutationResolvers<ContextType>;
  VMAccessSet?: VMAccessSetResolvers<ContextType>;
  VMDestroyMutation?: VMDestroyMutationResolvers<ContextType>;
  VMMutation?: VMMutationResolvers<ContextType>;
  VMPauseMutation?: VMPauseMutationResolvers<ContextType>;
  VMRebootMutation?: VMRebootMutationResolvers<ContextType>;
  VMRevertMutation?: VMRevertMutationResolvers<ContextType>;
  VMSelectedIDLists?: VMSelectedIDListsResolvers<ContextType>;
  VMShutdownMutation?: VMShutdownMutationResolvers<ContextType>;
  VMSnapshotDestroyMutation?: VMSnapshotDestroyMutationResolvers<ContextType>;
  VMSnapshotMutation?: VMSnapshotMutationResolvers<ContextType>;
  VMStartMutation?: VMStartMutationResolvers<ContextType>;
  VMSuspendMutation?: VMSuspendMutationResolvers<ContextType>;
};

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;

import gql from "graphql-tag";
import * as ReactApollo from "react-apollo";
import * as ReactApolloHooks from "./hooks/apollo";
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export const DeletedFragmentFragmentDoc = gql`
  fragment DeletedFragment on Deleted {
    ref
  }
`;
export const HostListFragmentFragmentDoc = gql`
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
export const ISOCreateVMListFragmentFragmentDoc = gql`
  fragment ISOCreateVMListFragment on GVDI {
    ref
    nameLabel
  }
`;
export const ACLXenObjectFragmentFragmentDoc = gql`
  fragment ACLXenObjectFragment on GAclXenObject {
    ref
    nameLabel
    nameDescription
    isOwner
  }
`;
export const NetworkInfoFragmentFragmentDoc = gql`
  fragment NetworkInfoFragment on GNetwork {
    ...ACLXenObjectFragment
    access {
      actions
      userId {
        id
        name
        username
      }
    }
    myActions
    isOwner
  }
  ${ACLXenObjectFragmentFragmentDoc}
`;
export const NetworkListFragmentFragmentDoc = gql`
  fragment NetworkListFragment on GNetwork {
    ref
    nameLabel
    myActions
    isOwner
  }
`;
export const PoolListFragmentFragmentDoc = gql`
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
export const AccessFragmentFragmentDoc = gql`
  fragment AccessFragment on GAccessEntry {
    isOwner
    userId {
      username
      name
      id
    }
  }
`;
export const PoolInfoFragmentFragmentDoc = gql`
  fragment PoolInfoFragment on GPool {
    ...ACLXenObjectFragment
    access {
      ...AccessFragment
      actions
    }
    myActions
    isOwner
  }
  ${ACLXenObjectFragmentFragmentDoc}
  ${AccessFragmentFragmentDoc}
`;
export const SRInfoFragmentFragmentDoc = gql`
  fragment SRInfoFragment on GSR {
    ...ACLXenObjectFragment
    access {
      ...AccessFragment
      actions
    }
    myActions
    isOwner
  }
  ${ACLXenObjectFragmentFragmentDoc}
  ${AccessFragmentFragmentDoc}
`;
export const SRListFragmentFragmentDoc = gql`
  fragment SRListFragment on GSR {
    ref
    nameLabel
    myActions
    isOwner
  }
`;
export const StorageListFragmentFragmentDoc = gql`
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
export const UserFragmentFragmentDoc = gql`
  fragment UserFragment on User {
    username
    id
    name
  }
`;
export const TaskFragmentFragmentDoc = gql`
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
    objectRef
    objectType
    errorInfo
    isOwner
    myActions
    who {
      ...UserFragment
    }
    action
  }
  ${UserFragmentFragmentDoc}
`;
export const AbstractVMFragmentFragmentDoc = gql`
  fragment AbstractVMFragment on GAbstractVM {
    memoryStaticMin
    memoryStaticMax
    memoryDynamicMin
    memoryDynamicMax
    VCPUsAtStartup
    VCPUsMax
    platform {
      coresPerSocket
    }
    domainType
  }
`;
export const TemplateSettingsFragmentFragmentDoc = gql`
  fragment TemplateSettingsFragment on GTemplate {
    ...AbstractVMFragment
    PVBootloader
    installOptions {
      distro
      arch
      release
      installRepository
    }
  }
  ${AbstractVMFragmentFragmentDoc}
`;
export const TemplateInfoFragmentFragmentDoc = gql`
  fragment TemplateInfoFragment on GTemplate {
    ...TemplateSettingsFragment
    ...ACLXenObjectFragment
    myActions
    access {
      userId {
        id
        name
        username
      }
      actions
    }
  }
  ${TemplateSettingsFragmentFragmentDoc}
  ${ACLXenObjectFragmentFragmentDoc}
`;
export const TemplateListFragmentFragmentDoc = gql`
  fragment TemplateListFragment on GTemplate {
    ref
    nameLabel
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
    isOwner
    domainType
  }
`;
export const VDISettingsFragmentFragmentDoc = gql`
  fragment VDISettingsFragment on GVDI {
    mainOwner {
      ...UserFragment
    }
  }
  ${UserFragmentFragmentDoc}
`;
export const VDIInfoFragmentFragmentDoc = gql`
  fragment VDIInfoFragment on GVDI {
    ...ACLXenObjectFragment
    access {
      actions
      ...AccessFragment
    }
    ...VDISettingsFragment
    myActions
  }
  ${ACLXenObjectFragmentFragmentDoc}
  ${AccessFragmentFragmentDoc}
  ${VDISettingsFragmentFragmentDoc}
`;
export const VDIListFragmentFragmentDoc = gql`
  fragment VDIListFragment on GVDI {
    ref
    nameLabel
    myActions
    isOwner
    virtualSize
    VBDs {
      VM {
        nameLabel
      }
      currentlyAttached
    }
  }
`;
export const StorageAttachVDIListFragmentFragmentDoc = gql`
  fragment StorageAttachVDIListFragment on GVDI {
    ref
    nameLabel
    nameDescription
    virtualSize
  }
`;
export const VMSettingsFragmentFragmentDoc = gql`
  fragment VMSettingsFragment on GVM {
    ...AbstractVMFragment
    mainOwner {
      ...UserFragment
    }
  }
  ${AbstractVMFragmentFragmentDoc}
  ${UserFragmentFragmentDoc}
`;
export const VMVIFFragmentFragmentDoc = gql`
  fragment VMVIFFragment on GVIF {
    network {
      ref
      nameLabel
    }
    ipv4
    ipv6
    ref
    MAC
    currentlyAttached
    device
  }
`;
export const VMVBDFragmentFragmentDoc = gql`
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
export const VMAccessFragmentFragmentDoc = gql`
  fragment VMAccessFragment on GVMAccessEntry {
    ...AccessFragment
    actions
  }
  ${AccessFragmentFragmentDoc}
`;
export const VMSnapshotFragmentFragmentDoc = gql`
  fragment VMSnapshotFragment on GVMSnapshot {
    ref
    nameLabel
    snapshotTime
    myActions
  }
`;
export const VMInfoFragmentFragmentDoc = gql`
  fragment VMInfoFragment on GVM {
    PVBootloader
    ...ACLXenObjectFragment
    ...VMSettingsFragment
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
    access {
      ...VMAccessFragment
    }
    myActions
    snapshots {
      ...VMSnapshotFragment
    }
    uuid
  }
  ${ACLXenObjectFragmentFragmentDoc}
  ${VMSettingsFragmentFragmentDoc}
  ${VMVIFFragmentFragmentDoc}
  ${VMVBDFragmentFragmentDoc}
  ${VMAccessFragmentFragmentDoc}
  ${VMSnapshotFragmentFragmentDoc}
`;
export const VMListVIFFragmentFragmentDoc = gql`
  fragment VMListVIFFragment on GVIF {
    network {
      ref
      nameLabel
    }
    ref
    ipv4
    ipv6
  }
`;
export const VMListFragmentFragmentDoc = gql`
  fragment VMListFragment on GVM {
    ref
    nameLabel
    powerState
    myActions
    isOwner
    startTime
    VIFs {
      ...VMListVIFFragment
    }
  }
  ${VMListVIFFragmentFragmentDoc}
`;
export const VMSnapshotInfoFragmentFragmentDoc = gql`
  fragment VMSnapshotInfoFragment on GVMSnapshot {
    ...ACLXenObjectFragment
    snapshotTime
  }
  ${ACLXenObjectFragmentFragmentDoc}
`;
export const XenObjectFragmentFragmentDoc = gql`
  fragment XenObjectFragment on GXenObject {
    ref
    nameLabel
    nameDescription
  }
`;
export const VMAccessSetMutationDocument = gql`
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
export type VMAccessSetMutationMutationFn = ReactApollo.MutationFn<
  VMAccessSetMutationMutation,
  VMAccessSetMutationMutationVariables
>;

export function useVMAccessSetMutationMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    VMAccessSetMutationMutation,
    VMAccessSetMutationMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    VMAccessSetMutationMutation,
    VMAccessSetMutationMutationVariables
  >(VMAccessSetMutationDocument, baseOptions);
}
export const TemplateAccessSetMutationDocument = gql`
  mutation TemplateAccessSetMutation(
    $actions: [TemplateActions!]!
    $user: String!
    $ref: ID!
    $revoke: Boolean!
  ) {
    templateAccessSet(
      actions: $actions
      user: $user
      revoke: $revoke
      ref: $ref
    ) {
      success
    }
  }
`;
export type TemplateAccessSetMutationMutationFn = ReactApollo.MutationFn<
  TemplateAccessSetMutationMutation,
  TemplateAccessSetMutationMutationVariables
>;

export function useTemplateAccessSetMutationMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    TemplateAccessSetMutationMutation,
    TemplateAccessSetMutationMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    TemplateAccessSetMutationMutation,
    TemplateAccessSetMutationMutationVariables
  >(TemplateAccessSetMutationDocument, baseOptions);
}
export const NetworkAccessSetMutationDocument = gql`
  mutation NetworkAccessSetMutation(
    $actions: [NetworkActions!]!
    $user: String!
    $ref: ID!
    $revoke: Boolean!
  ) {
    netAccessSet(actions: $actions, user: $user, revoke: $revoke, ref: $ref) {
      success
    }
  }
`;
export type NetworkAccessSetMutationMutationFn = ReactApollo.MutationFn<
  NetworkAccessSetMutationMutation,
  NetworkAccessSetMutationMutationVariables
>;

export function useNetworkAccessSetMutationMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    NetworkAccessSetMutationMutation,
    NetworkAccessSetMutationMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    NetworkAccessSetMutationMutation,
    NetworkAccessSetMutationMutationVariables
  >(NetworkAccessSetMutationDocument, baseOptions);
}
export const SRAccessSetMutationDocument = gql`
  mutation SRAccessSetMutation(
    $actions: [SRActions!]!
    $user: String!
    $ref: ID!
    $revoke: Boolean!
  ) {
    srAccessSet(actions: $actions, user: $user, revoke: $revoke, ref: $ref) {
      success
    }
  }
`;
export type SRAccessSetMutationMutationFn = ReactApollo.MutationFn<
  SRAccessSetMutationMutation,
  SRAccessSetMutationMutationVariables
>;

export function useSRAccessSetMutationMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    SRAccessSetMutationMutation,
    SRAccessSetMutationMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    SRAccessSetMutationMutation,
    SRAccessSetMutationMutationVariables
  >(SRAccessSetMutationDocument, baseOptions);
}
export const VDIAccessSetMutationDocument = gql`
  mutation VDIAccessSetMutation(
    $actions: [VDIActions!]!
    $user: String!
    $ref: ID!
    $revoke: Boolean!
  ) {
    vdiAccessSet(actions: $actions, user: $user, revoke: $revoke, ref: $ref) {
      success
    }
  }
`;
export type VDIAccessSetMutationMutationFn = ReactApollo.MutationFn<
  VDIAccessSetMutationMutation,
  VDIAccessSetMutationMutationVariables
>;

export function useVDIAccessSetMutationMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    VDIAccessSetMutationMutation,
    VDIAccessSetMutationMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    VDIAccessSetMutationMutation,
    VDIAccessSetMutationMutationVariables
  >(VDIAccessSetMutationDocument, baseOptions);
}
export const PoolAccessSetMutationDocument = gql`
  mutation PoolAccessSetMutation(
    $actions: [PoolActions!]!
    $user: String!
    $ref: ID!
    $revoke: Boolean!
  ) {
    poolAccessSet(actions: $actions, user: $user, revoke: $revoke, ref: $ref) {
      success
    }
  }
`;
export type PoolAccessSetMutationMutationFn = ReactApollo.MutationFn<
  PoolAccessSetMutationMutation,
  PoolAccessSetMutationMutationVariables
>;

export function usePoolAccessSetMutationMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    PoolAccessSetMutationMutation,
    PoolAccessSetMutationMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    PoolAccessSetMutationMutation,
    PoolAccessSetMutationMutationVariables
  >(PoolAccessSetMutationDocument, baseOptions);
}
export const VDIAttachDocument = gql`
  mutation VDIAttach($vmRef: ID!, $vdiRef: ID!) {
    vdiAttach(vmRef: $vmRef, vdiRef: $vdiRef, isAttach: true) {
      taskId
    }
  }
`;
export type VDIAttachMutationFn = ReactApollo.MutationFn<
  VDIAttachMutation,
  VDIAttachMutationVariables
>;

export function useVDIAttachMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    VDIAttachMutation,
    VDIAttachMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    VDIAttachMutation,
    VDIAttachMutationVariables
  >(VDIAttachDocument, baseOptions);
}
export const VDIDetachDocument = gql`
  mutation VDIDetach($vmRef: ID!, $vdiRef: ID!) {
    vdiAttach(vmRef: $vmRef, vdiRef: $vdiRef, isAttach: false) {
      taskId
    }
  }
`;
export type VDIDetachMutationFn = ReactApollo.MutationFn<
  VDIDetachMutation,
  VDIDetachMutationVariables
>;

export function useVDIDetachMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    VDIDetachMutation,
    VDIDetachMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    VDIDetachMutation,
    VDIDetachMutationVariables
  >(VDIDetachDocument, baseOptions);
}
export const NetAttachDocument = gql`
  mutation NetAttach($vmRef: ID!, $netRef: ID!) {
    netAttach(vmRef: $vmRef, netRef: $netRef, isAttach: true) {
      taskId
    }
  }
`;
export type NetAttachMutationFn = ReactApollo.MutationFn<
  NetAttachMutation,
  NetAttachMutationVariables
>;

export function useNetAttachMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    NetAttachMutation,
    NetAttachMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    NetAttachMutation,
    NetAttachMutationVariables
  >(NetAttachDocument, baseOptions);
}
export const NetDetachDocument = gql`
  mutation NetDetach($vmRef: ID!, $netRef: ID!) {
    netAttach(vmRef: $vmRef, netRef: $netRef, isAttach: false) {
      taskId
    }
  }
`;
export type NetDetachMutationFn = ReactApollo.MutationFn<
  NetDetachMutation,
  NetDetachMutationVariables
>;

export function useNetDetachMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    NetDetachMutation,
    NetDetachMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    NetDetachMutation,
    NetDetachMutationVariables
  >(NetDetachDocument, baseOptions);
}
export const TemplateCloneDocument = gql`
  mutation TemplateClone($ref: ID!, $nameLabel: String!) {
    templateClone(ref: $ref, nameLabel: $nameLabel) {
      granted
      reason
      taskId
    }
  }
`;
export type TemplateCloneMutationFn = ReactApollo.MutationFn<
  TemplateCloneMutation,
  TemplateCloneMutationVariables
>;

export function useTemplateCloneMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    TemplateCloneMutation,
    TemplateCloneMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    TemplateCloneMutation,
    TemplateCloneMutationVariables
  >(TemplateCloneDocument, baseOptions);
}
export const ConsoleDocument = gql`
  query Console($id: ID!) {
    console(vmRef: $id)
  }
`;

export function useConsoleQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<ConsoleQueryVariables>
) {
  return ReactApolloHooks.useQuery<ConsoleQuery, ConsoleQueryVariables>(
    ConsoleDocument,
    baseOptions
  );
}
export const CreateVdiDocument = gql`
  mutation CreateVdi(
    $nameLabel: String!
    $user: String
    $size: Float!
    $srRef: ID!
  ) {
    vdiCreate(nameLabel: $nameLabel, user: $user, size: $size, srRef: $srRef) {
      reason
      granted
      taskId
    }
  }
`;
export type CreateVdiMutationFn = ReactApollo.MutationFn<
  CreateVdiMutation,
  CreateVdiMutationVariables
>;

export function useCreateVdiMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    CreateVdiMutation,
    CreateVdiMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    CreateVdiMutation,
    CreateVdiMutationVariables
  >(CreateVdiDocument, baseOptions);
}
export const createVmDocument = gql`
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
export type createVmMutationFn = ReactApollo.MutationFn<
  createVmMutation,
  createVmMutationVariables
>;

export function usecreateVmMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    createVmMutation,
    createVmMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    createVmMutation,
    createVmMutationVariables
  >(createVmDocument, baseOptions);
}
export const TemplateNewVMOptionsDocument = gql`
  query TemplateNewVMOptions($ref: ID!) {
    template(ref: $ref) {
      ...AbstractVMFragment
    }
  }
  ${AbstractVMFragmentFragmentDoc}
`;

export function useTemplateNewVMOptionsQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<
    TemplateNewVMOptionsQueryVariables
  >
) {
  return ReactApolloHooks.useQuery<
    TemplateNewVMOptionsQuery,
    TemplateNewVMOptionsQueryVariables
  >(TemplateNewVMOptionsDocument, baseOptions);
}
export const CurrentUserDocument = gql`
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
  ${UserFragmentFragmentDoc}
`;

export function useCurrentUserQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<CurrentUserQueryVariables>
) {
  return ReactApolloHooks.useQuery<CurrentUserQuery, CurrentUserQueryVariables>(
    CurrentUserDocument,
    baseOptions
  );
}
export const DeleteTemplateDocument = gql`
  mutation DeleteTemplate($ref: ID!) {
    templateDelete(ref: $ref) {
      taskId
    }
  }
`;
export type DeleteTemplateMutationFn = ReactApollo.MutationFn<
  DeleteTemplateMutation,
  DeleteTemplateMutationVariables
>;

export function useDeleteTemplateMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    DeleteTemplateMutation,
    DeleteTemplateMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    DeleteTemplateMutation,
    DeleteTemplateMutationVariables
  >(DeleteTemplateDocument, baseOptions);
}
export const DeleteVDIDocument = gql`
  mutation DeleteVDI($ref: ID!) {
    vdiDelete(ref: $ref) {
      taskId
    }
  }
`;
export type DeleteVDIMutationFn = ReactApollo.MutationFn<
  DeleteVDIMutation,
  DeleteVDIMutationVariables
>;

export function useDeleteVDIMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    DeleteVDIMutation,
    DeleteVDIMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    DeleteVDIMutation,
    DeleteVDIMutationVariables
  >(DeleteVDIDocument, baseOptions);
}
export const DeleteVMDocument = gql`
  mutation DeleteVM($ref: ID!) {
    vmDelete(ref: $ref) {
      taskId
    }
  }
`;
export type DeleteVMMutationFn = ReactApollo.MutationFn<
  DeleteVMMutation,
  DeleteVMMutationVariables
>;

export function useDeleteVMMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    DeleteVMMutation,
    DeleteVMMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    DeleteVMMutation,
    DeleteVMMutationVariables
  >(DeleteVMDocument, baseOptions);
}
export const NetworkEditOptionsDocument = gql`
  mutation NetworkEditOptions($network: NetworkInput!, $ref: ID!) {
    network(network: $network, ref: $ref) {
      granted
      reason
    }
  }
`;
export type NetworkEditOptionsMutationFn = ReactApollo.MutationFn<
  NetworkEditOptionsMutation,
  NetworkEditOptionsMutationVariables
>;

export function useNetworkEditOptionsMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    NetworkEditOptionsMutation,
    NetworkEditOptionsMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    NetworkEditOptionsMutation,
    NetworkEditOptionsMutationVariables
  >(NetworkEditOptionsDocument, baseOptions);
}
export const PoolEditOptionsDocument = gql`
  mutation PoolEditOptions($pool: PoolInput!, $ref: ID!) {
    pool(ref: $ref, pool: $pool) {
      granted
      reason
    }
  }
`;
export type PoolEditOptionsMutationFn = ReactApollo.MutationFn<
  PoolEditOptionsMutation,
  PoolEditOptionsMutationVariables
>;

export function usePoolEditOptionsMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    PoolEditOptionsMutation,
    PoolEditOptionsMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    PoolEditOptionsMutation,
    PoolEditOptionsMutationVariables
  >(PoolEditOptionsDocument, baseOptions);
}
export const SREditOptionsDocument = gql`
  mutation SREditOptions($sr: SRInput!, $ref: ID!) {
    sr(sr: $sr, ref: $ref) {
      granted
      reason
    }
  }
`;
export type SREditOptionsMutationFn = ReactApollo.MutationFn<
  SREditOptionsMutation,
  SREditOptionsMutationVariables
>;

export function useSREditOptionsMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    SREditOptionsMutation,
    SREditOptionsMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    SREditOptionsMutation,
    SREditOptionsMutationVariables
  >(SREditOptionsDocument, baseOptions);
}
export const TemplateEditOptionsDocument = gql`
  mutation TemplateEditOptions($template: TemplateInput!, $ref: ID!) {
    template(template: $template, ref: $ref) {
      reason
      granted
    }
  }
`;
export type TemplateEditOptionsMutationFn = ReactApollo.MutationFn<
  TemplateEditOptionsMutation,
  TemplateEditOptionsMutationVariables
>;

export function useTemplateEditOptionsMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    TemplateEditOptionsMutation,
    TemplateEditOptionsMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    TemplateEditOptionsMutation,
    TemplateEditOptionsMutationVariables
  >(TemplateEditOptionsDocument, baseOptions);
}
export const VDIEditOptionsDocument = gql`
  mutation VDIEditOptions($vdi: VDIInput!, $ref: ID!) {
    vdi(vdi: $vdi, ref: $ref) {
      reason
      granted
    }
  }
`;
export type VDIEditOptionsMutationFn = ReactApollo.MutationFn<
  VDIEditOptionsMutation,
  VDIEditOptionsMutationVariables
>;

export function useVDIEditOptionsMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    VDIEditOptionsMutation,
    VDIEditOptionsMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    VDIEditOptionsMutation,
    VDIEditOptionsMutationVariables
  >(VDIEditOptionsDocument, baseOptions);
}
export const VMEditOptionsDocument = gql`
  mutation VMEditOptions($vm: VMInput!, $ref: ID!) {
    vm(vm: $vm, ref: $ref) {
      reason
      granted
    }
  }
`;
export type VMEditOptionsMutationFn = ReactApollo.MutationFn<
  VMEditOptionsMutation,
  VMEditOptionsMutationVariables
>;

export function useVMEditOptionsMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    VMEditOptionsMutation,
    VMEditOptionsMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    VMEditOptionsMutation,
    VMEditOptionsMutationVariables
  >(VMEditOptionsDocument, baseOptions);
}
export const FilterUsersDocument = gql`
  query FilterUsers($query: String!) {
    findUser(query: $query) {
      ...UserFragment
    }
  }
  ${UserFragmentFragmentDoc}
`;

export function useFilterUsersQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<FilterUsersQueryVariables>
) {
  return ReactApolloHooks.useQuery<FilterUsersQuery, FilterUsersQueryVariables>(
    FilterUsersDocument,
    baseOptions
  );
}
export const HostListDocument = gql`
  query HostList {
    hosts {
      ...HostListFragment
    }
  }
  ${HostListFragmentFragmentDoc}
`;

export function useHostListQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<HostListQueryVariables>
) {
  return ReactApolloHooks.useQuery<HostListQuery, HostListQueryVariables>(
    HostListDocument,
    baseOptions
  );
}
export const HostListUpdateDocument = gql`
  subscription HostListUpdate {
    hosts {
      value {
        ...HostListFragment
        ...DeletedFragment
      }
      changeType
    }
  }
  ${HostListFragmentFragmentDoc}
  ${DeletedFragmentFragmentDoc}
`;

export function useHostListUpdateSubscription(
  baseOptions?: ReactApolloHooks.SubscriptionHookOptions<
    HostListUpdateSubscription,
    HostListUpdateSubscriptionVariables
  >
) {
  return ReactApolloHooks.useSubscription<
    HostListUpdateSubscription,
    HostListUpdateSubscriptionVariables
  >(HostListUpdateDocument, baseOptions);
}
export const ISOSCreateVMListDocument = gql`
  query ISOSCreateVMList {
    isosForInstall {
      ref
      nameLabel
    }
  }
`;

export function useISOSCreateVMListQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<
    ISOSCreateVMListQueryVariables
  >
) {
  return ReactApolloHooks.useQuery<
    ISOSCreateVMListQuery,
    ISOSCreateVMListQueryVariables
  >(ISOSCreateVMListDocument, baseOptions);
}
export const ISOListDocument = gql`
  query ISOList {
    vdis(onlyIsos: true) {
      ...VDIListFragment
    }
  }
  ${VDIListFragmentFragmentDoc}
`;

export function useISOListQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<ISOListQueryVariables>
) {
  return ReactApolloHooks.useQuery<ISOListQuery, ISOListQueryVariables>(
    ISOListDocument,
    baseOptions
  );
}
export const ISOListUpdateDocument = gql`
  subscription ISOListUpdate {
    vdis(onlyIsos: true) {
      changeType
      value {
        ...VDIListFragment
        ...DeletedFragment
      }
    }
  }
  ${VDIListFragmentFragmentDoc}
  ${DeletedFragmentFragmentDoc}
`;

export function useISOListUpdateSubscription(
  baseOptions?: ReactApolloHooks.SubscriptionHookOptions<
    ISOListUpdateSubscription,
    ISOListUpdateSubscriptionVariables
  >
) {
  return ReactApolloHooks.useSubscription<
    ISOListUpdateSubscription,
    ISOListUpdateSubscriptionVariables
  >(ISOListUpdateDocument, baseOptions);
}
export const DiskAttachTableSelectionDocument = gql`
  query DiskAttachTableSelection {
    selectedItems(tableId: DiskAttach) @client
  }
`;

export function useDiskAttachTableSelectionQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<
    DiskAttachTableSelectionQueryVariables
  >
) {
  return ReactApolloHooks.useQuery<
    DiskAttachTableSelectionQuery,
    DiskAttachTableSelectionQueryVariables
  >(DiskAttachTableSelectionDocument, baseOptions);
}
export const DiskAttachTableSelectDocument = gql`
  mutation DiskAttachTableSelect($item: ID!, $isSelect: Boolean!) {
    selectedItems(tableId: DiskAttach, items: [$item], isSelect: $isSelect)
      @client
  }
`;
export type DiskAttachTableSelectMutationFn = ReactApollo.MutationFn<
  DiskAttachTableSelectMutation,
  DiskAttachTableSelectMutationVariables
>;

export function useDiskAttachTableSelectMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    DiskAttachTableSelectMutation,
    DiskAttachTableSelectMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    DiskAttachTableSelectMutation,
    DiskAttachTableSelectMutationVariables
  >(DiskAttachTableSelectDocument, baseOptions);
}
export const DiskAttachTableSelectAllDocument = gql`
  mutation DiskAttachTableSelectAll($items: [ID!]!, $isSelect: Boolean!) {
    selectedItems(tableId: DiskAttach, items: $items, isSelect: $isSelect)
      @client
  }
`;
export type DiskAttachTableSelectAllMutationFn = ReactApollo.MutationFn<
  DiskAttachTableSelectAllMutation,
  DiskAttachTableSelectAllMutationVariables
>;

export function useDiskAttachTableSelectAllMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    DiskAttachTableSelectAllMutation,
    DiskAttachTableSelectAllMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    DiskAttachTableSelectAllMutation,
    DiskAttachTableSelectAllMutationVariables
  >(DiskAttachTableSelectAllDocument, baseOptions);
}
export const ISOTableSelectionDocument = gql`
  query ISOTableSelection {
    selectedItems(tableId: ISOs) @client
  }
`;

export function useISOTableSelectionQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<
    ISOTableSelectionQueryVariables
  >
) {
  return ReactApolloHooks.useQuery<
    ISOTableSelectionQuery,
    ISOTableSelectionQueryVariables
  >(ISOTableSelectionDocument, baseOptions);
}
export const ISOTableSelectDocument = gql`
  mutation ISOTableSelect($item: ID!, $isSelect: Boolean!) {
    selectedItems(tableId: ISOs, items: [$item], isSelect: $isSelect) @client
  }
`;
export type ISOTableSelectMutationFn = ReactApollo.MutationFn<
  ISOTableSelectMutation,
  ISOTableSelectMutationVariables
>;

export function useISOTableSelectMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    ISOTableSelectMutation,
    ISOTableSelectMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    ISOTableSelectMutation,
    ISOTableSelectMutationVariables
  >(ISOTableSelectDocument, baseOptions);
}
export const ISOTableSelectAllDocument = gql`
  mutation ISOTableSelectAll($items: [ID!]!, $isSelect: Boolean!) {
    selectedItems(tableId: ISOs, items: $items, isSelect: $isSelect) @client
  }
`;
export type ISOTableSelectAllMutationFn = ReactApollo.MutationFn<
  ISOTableSelectAllMutation,
  ISOTableSelectAllMutationVariables
>;

export function useISOTableSelectAllMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    ISOTableSelectAllMutation,
    ISOTableSelectAllMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    ISOTableSelectAllMutation,
    ISOTableSelectAllMutationVariables
  >(ISOTableSelectAllDocument, baseOptions);
}
export const NetAttachTableSelectionDocument = gql`
  query NetAttachTableSelection {
    selectedItems(tableId: NetworkAttach) @client
  }
`;

export function useNetAttachTableSelectionQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<
    NetAttachTableSelectionQueryVariables
  >
) {
  return ReactApolloHooks.useQuery<
    NetAttachTableSelectionQuery,
    NetAttachTableSelectionQueryVariables
  >(NetAttachTableSelectionDocument, baseOptions);
}
export const NetAttachTableSelectDocument = gql`
  mutation NetAttachTableSelect($item: ID!, $isSelect: Boolean!) {
    selectedItems(tableId: NetworkAttach, items: [$item], isSelect: $isSelect)
      @client
  }
`;
export type NetAttachTableSelectMutationFn = ReactApollo.MutationFn<
  NetAttachTableSelectMutation,
  NetAttachTableSelectMutationVariables
>;

export function useNetAttachTableSelectMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    NetAttachTableSelectMutation,
    NetAttachTableSelectMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    NetAttachTableSelectMutation,
    NetAttachTableSelectMutationVariables
  >(NetAttachTableSelectDocument, baseOptions);
}
export const NetAttachTableSelectAllDocument = gql`
  mutation NetAttachTableSelectAll($items: [ID!]!, $isSelect: Boolean!) {
    selectedItems(tableId: NetworkAttach, items: $items, isSelect: $isSelect)
      @client
  }
`;
export type NetAttachTableSelectAllMutationFn = ReactApollo.MutationFn<
  NetAttachTableSelectAllMutation,
  NetAttachTableSelectAllMutationVariables
>;

export function useNetAttachTableSelectAllMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    NetAttachTableSelectAllMutation,
    NetAttachTableSelectAllMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    NetAttachTableSelectAllMutation,
    NetAttachTableSelectAllMutationVariables
  >(NetAttachTableSelectAllDocument, baseOptions);
}
export const NetworkTableSelectionDocument = gql`
  query NetworkTableSelection {
    selectedItems(tableId: Networks) @client
  }
`;

export function useNetworkTableSelectionQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<
    NetworkTableSelectionQueryVariables
  >
) {
  return ReactApolloHooks.useQuery<
    NetworkTableSelectionQuery,
    NetworkTableSelectionQueryVariables
  >(NetworkTableSelectionDocument, baseOptions);
}
export const NetworkTableSelectDocument = gql`
  mutation NetworkTableSelect($item: ID!, $isSelect: Boolean!) {
    selectedItems(tableId: Networks, items: [$item], isSelect: $isSelect)
      @client
  }
`;
export type NetworkTableSelectMutationFn = ReactApollo.MutationFn<
  NetworkTableSelectMutation,
  NetworkTableSelectMutationVariables
>;

export function useNetworkTableSelectMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    NetworkTableSelectMutation,
    NetworkTableSelectMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    NetworkTableSelectMutation,
    NetworkTableSelectMutationVariables
  >(NetworkTableSelectDocument, baseOptions);
}
export const NetworkTableSelectAllDocument = gql`
  mutation NetworkTableSelectAll($items: [ID!]!, $isSelect: Boolean!) {
    selectedItems(tableId: Networks, items: $items, isSelect: $isSelect) @client
  }
`;
export type NetworkTableSelectAllMutationFn = ReactApollo.MutationFn<
  NetworkTableSelectAllMutation,
  NetworkTableSelectAllMutationVariables
>;

export function useNetworkTableSelectAllMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    NetworkTableSelectAllMutation,
    NetworkTableSelectAllMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    NetworkTableSelectAllMutation,
    NetworkTableSelectAllMutationVariables
  >(NetworkTableSelectAllDocument, baseOptions);
}
export const SelectedItemsQueryDocument = gql`
  query SelectedItemsQuery($tableId: Table!) {
    selectedItems(tableId: $tableId) @client
  }
`;

export function useSelectedItemsQueryQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<
    SelectedItemsQueryQueryVariables
  >
) {
  return ReactApolloHooks.useQuery<
    SelectedItemsQueryQuery,
    SelectedItemsQueryQueryVariables
  >(SelectedItemsQueryDocument, baseOptions);
}
export const SRTableSelectionDocument = gql`
  query SRTableSelection {
    selectedItems(tableId: SRs) @client
  }
`;

export function useSRTableSelectionQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<
    SRTableSelectionQueryVariables
  >
) {
  return ReactApolloHooks.useQuery<
    SRTableSelectionQuery,
    SRTableSelectionQueryVariables
  >(SRTableSelectionDocument, baseOptions);
}
export const SRTableSelectDocument = gql`
  mutation SRTableSelect($item: ID!, $isSelect: Boolean!) {
    selectedItems(tableId: SRs, items: [$item], isSelect: $isSelect) @client
  }
`;
export type SRTableSelectMutationFn = ReactApollo.MutationFn<
  SRTableSelectMutation,
  SRTableSelectMutationVariables
>;

export function useSRTableSelectMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    SRTableSelectMutation,
    SRTableSelectMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    SRTableSelectMutation,
    SRTableSelectMutationVariables
  >(SRTableSelectDocument, baseOptions);
}
export const SRTableSelectAllDocument = gql`
  mutation SRTableSelectAll($items: [ID!]!, $isSelect: Boolean!) {
    selectedItems(tableId: SRs, items: $items, isSelect: $isSelect) @client
  }
`;
export type SRTableSelectAllMutationFn = ReactApollo.MutationFn<
  SRTableSelectAllMutation,
  SRTableSelectAllMutationVariables
>;

export function useSRTableSelectAllMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    SRTableSelectAllMutation,
    SRTableSelectAllMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    SRTableSelectAllMutation,
    SRTableSelectAllMutationVariables
  >(SRTableSelectAllDocument, baseOptions);
}
export const TaskTableSelectionDocument = gql`
  query TaskTableSelection {
    selectedItems(tableId: Tasks) @client
  }
`;

export function useTaskTableSelectionQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<
    TaskTableSelectionQueryVariables
  >
) {
  return ReactApolloHooks.useQuery<
    TaskTableSelectionQuery,
    TaskTableSelectionQueryVariables
  >(TaskTableSelectionDocument, baseOptions);
}
export const TaskTableSelectDocument = gql`
  mutation TaskTableSelect($item: ID!, $isSelect: Boolean!) {
    selectedItems(tableId: Tasks, items: [$item], isSelect: $isSelect) @client
  }
`;
export type TaskTableSelectMutationFn = ReactApollo.MutationFn<
  TaskTableSelectMutation,
  TaskTableSelectMutationVariables
>;

export function useTaskTableSelectMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    TaskTableSelectMutation,
    TaskTableSelectMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    TaskTableSelectMutation,
    TaskTableSelectMutationVariables
  >(TaskTableSelectDocument, baseOptions);
}
export const TaskTableSelectAllDocument = gql`
  mutation TaskTableSelectAll($items: [ID!]!, $isSelect: Boolean!) {
    selectedItems(tableId: Tasks, items: $items, isSelect: $isSelect) @client
  }
`;
export type TaskTableSelectAllMutationFn = ReactApollo.MutationFn<
  TaskTableSelectAllMutation,
  TaskTableSelectAllMutationVariables
>;

export function useTaskTableSelectAllMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    TaskTableSelectAllMutation,
    TaskTableSelectAllMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    TaskTableSelectAllMutation,
    TaskTableSelectAllMutationVariables
  >(TaskTableSelectAllDocument, baseOptions);
}
export const TemplateTableSelectionDocument = gql`
  query TemplateTableSelection {
    selectedItems(tableId: Templates) @client
  }
`;

export function useTemplateTableSelectionQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<
    TemplateTableSelectionQueryVariables
  >
) {
  return ReactApolloHooks.useQuery<
    TemplateTableSelectionQuery,
    TemplateTableSelectionQueryVariables
  >(TemplateTableSelectionDocument, baseOptions);
}
export const TemplateTableSelectDocument = gql`
  mutation TemplateTableSelect($item: ID!, $isSelect: Boolean!) {
    selectedItems(tableId: Templates, items: [$item], isSelect: $isSelect)
      @client
  }
`;
export type TemplateTableSelectMutationFn = ReactApollo.MutationFn<
  TemplateTableSelectMutation,
  TemplateTableSelectMutationVariables
>;

export function useTemplateTableSelectMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    TemplateTableSelectMutation,
    TemplateTableSelectMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    TemplateTableSelectMutation,
    TemplateTableSelectMutationVariables
  >(TemplateTableSelectDocument, baseOptions);
}
export const TemplateTableSelectAllDocument = gql`
  mutation TemplateTableSelectAll($items: [ID!]!, $isSelect: Boolean!) {
    selectedItems(tableId: Templates, items: $items, isSelect: $isSelect)
      @client
  }
`;
export type TemplateTableSelectAllMutationFn = ReactApollo.MutationFn<
  TemplateTableSelectAllMutation,
  TemplateTableSelectAllMutationVariables
>;

export function useTemplateTableSelectAllMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    TemplateTableSelectAllMutation,
    TemplateTableSelectAllMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    TemplateTableSelectAllMutation,
    TemplateTableSelectAllMutationVariables
  >(TemplateTableSelectAllDocument, baseOptions);
}
export const VDITableSelectionDocument = gql`
  query VDITableSelection {
    selectedItems(tableId: VDIs) @client
  }
`;

export function useVDITableSelectionQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<
    VDITableSelectionQueryVariables
  >
) {
  return ReactApolloHooks.useQuery<
    VDITableSelectionQuery,
    VDITableSelectionQueryVariables
  >(VDITableSelectionDocument, baseOptions);
}
export const VDITableSelectDocument = gql`
  mutation VDITableSelect($item: ID!, $isSelect: Boolean!) {
    selectedItems(tableId: VDIs, items: [$item], isSelect: $isSelect) @client
  }
`;
export type VDITableSelectMutationFn = ReactApollo.MutationFn<
  VDITableSelectMutation,
  VDITableSelectMutationVariables
>;

export function useVDITableSelectMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    VDITableSelectMutation,
    VDITableSelectMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    VDITableSelectMutation,
    VDITableSelectMutationVariables
  >(VDITableSelectDocument, baseOptions);
}
export const VDITableSelectAllDocument = gql`
  mutation VDITableSelectAll($items: [ID!]!, $isSelect: Boolean!) {
    selectedItems(tableId: VDIs, items: $items, isSelect: $isSelect) @client
  }
`;
export type VDITableSelectAllMutationFn = ReactApollo.MutationFn<
  VDITableSelectAllMutation,
  VDITableSelectAllMutationVariables
>;

export function useVDITableSelectAllMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    VDITableSelectAllMutation,
    VDITableSelectAllMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    VDITableSelectAllMutation,
    VDITableSelectAllMutationVariables
  >(VDITableSelectAllDocument, baseOptions);
}
export const VmTableSelectionDocument = gql`
  query VmTableSelection {
    selectedItems(tableId: VMS) @client
  }
`;

export function useVmTableSelectionQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<
    VmTableSelectionQueryVariables
  >
) {
  return ReactApolloHooks.useQuery<
    VmTableSelectionQuery,
    VmTableSelectionQueryVariables
  >(VmTableSelectionDocument, baseOptions);
}
export const VmTableSelectDocument = gql`
  mutation VmTableSelect($item: ID!, $isSelect: Boolean!) {
    selectedItems(tableId: VMS, items: [$item], isSelect: $isSelect) @client
  }
`;
export type VmTableSelectMutationFn = ReactApollo.MutationFn<
  VmTableSelectMutation,
  VmTableSelectMutationVariables
>;

export function useVmTableSelectMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    VmTableSelectMutation,
    VmTableSelectMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    VmTableSelectMutation,
    VmTableSelectMutationVariables
  >(VmTableSelectDocument, baseOptions);
}
export const VmTableSelectAllDocument = gql`
  mutation VmTableSelectAll($items: [ID!]!, $isSelect: Boolean!) {
    selectedItems(tableId: VMS, items: $items, isSelect: $isSelect) @client
  }
`;
export type VmTableSelectAllMutationFn = ReactApollo.MutationFn<
  VmTableSelectAllMutation,
  VmTableSelectAllMutationVariables
>;

export function useVmTableSelectAllMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    VmTableSelectAllMutation,
    VmTableSelectAllMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    VmTableSelectAllMutation,
    VmTableSelectAllMutationVariables
  >(VmTableSelectAllDocument, baseOptions);
}
export const VmPowerStateDocument = gql`
  query VmPowerState {
    vms {
      ref
      powerState
    }
  }
`;

export function useVmPowerStateQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<VmPowerStateQueryVariables>
) {
  return ReactApolloHooks.useQuery<
    VmPowerStateQuery,
    VmPowerStateQueryVariables
  >(VmPowerStateDocument, baseOptions);
}
export const VMStateForButtonToolbarDocument = gql`
  query VMStateForButtonToolbar {
    vmSelectedReadyFor @client {
      start
      stop
      trash
    }
  }
`;

export function useVMStateForButtonToolbarQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<
    VMStateForButtonToolbarQueryVariables
  >
) {
  return ReactApolloHooks.useQuery<
    VMStateForButtonToolbarQuery,
    VMStateForButtonToolbarQueryVariables
  >(VMStateForButtonToolbarDocument, baseOptions);
}
export const NetworkInfoDocument = gql`
  query NetworkInfo($ref: ID!) {
    network(ref: $ref) {
      ...NetworkInfoFragment
    }
  }
  ${NetworkInfoFragmentFragmentDoc}
`;

export function useNetworkInfoQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<NetworkInfoQueryVariables>
) {
  return ReactApolloHooks.useQuery<NetworkInfoQuery, NetworkInfoQueryVariables>(
    NetworkInfoDocument,
    baseOptions
  );
}
export const NetworkInfoUpdateDocument = gql`
  subscription NetworkInfoUpdate($ref: ID!) {
    network(ref: $ref) {
      ...NetworkInfoFragment
    }
  }
  ${NetworkInfoFragmentFragmentDoc}
`;

export function useNetworkInfoUpdateSubscription(
  baseOptions?: ReactApolloHooks.SubscriptionHookOptions<
    NetworkInfoUpdateSubscription,
    NetworkInfoUpdateSubscriptionVariables
  >
) {
  return ReactApolloHooks.useSubscription<
    NetworkInfoUpdateSubscription,
    NetworkInfoUpdateSubscriptionVariables
  >(NetworkInfoUpdateDocument, baseOptions);
}
export const NetworkListDocument = gql`
  query NetworkList {
    networks {
      ...NetworkListFragment
    }
  }
  ${NetworkListFragmentFragmentDoc}
`;

export function useNetworkListQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<NetworkListQueryVariables>
) {
  return ReactApolloHooks.useQuery<NetworkListQuery, NetworkListQueryVariables>(
    NetworkListDocument,
    baseOptions
  );
}
export const NetworkListUpdateDocument = gql`
  subscription NetworkListUpdate {
    networks {
      changeType
      value {
        ...NetworkListFragment
        ...DeletedFragment
      }
    }
  }
  ${NetworkListFragmentFragmentDoc}
  ${DeletedFragmentFragmentDoc}
`;

export function useNetworkListUpdateSubscription(
  baseOptions?: ReactApolloHooks.SubscriptionHookOptions<
    NetworkListUpdateSubscription,
    NetworkListUpdateSubscriptionVariables
  >
) {
  return ReactApolloHooks.useSubscription<
    NetworkListUpdateSubscription,
    NetworkListUpdateSubscriptionVariables
  >(NetworkListUpdateDocument, baseOptions);
}
export const PauseVMDocument = gql`
  mutation PauseVM($ref: ID!) {
    vmPause(ref: $ref) {
      taskId
      granted
      reason
    }
  }
`;
export type PauseVMMutationFn = ReactApollo.MutationFn<
  PauseVMMutation,
  PauseVMMutationVariables
>;

export function usePauseVMMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    PauseVMMutation,
    PauseVMMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    PauseVMMutation,
    PauseVMMutationVariables
  >(PauseVMDocument, baseOptions);
}
export const LaunchPlaybookDocument = gql`
  mutation LaunchPlaybook($id: ID!, $vms: [ID], $variables: JSONString) {
    playbookLaunch(id: $id, vms: $vms, variables: $variables) {
      taskId
    }
  }
`;
export type LaunchPlaybookMutationFn = ReactApollo.MutationFn<
  LaunchPlaybookMutation,
  LaunchPlaybookMutationVariables
>;

export function useLaunchPlaybookMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    LaunchPlaybookMutation,
    LaunchPlaybookMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    LaunchPlaybookMutation,
    LaunchPlaybookMutationVariables
  >(LaunchPlaybookDocument, baseOptions);
}
export const PlaybookListDocument = gql`
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

export function usePlaybookListQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<PlaybookListQueryVariables>
) {
  return ReactApolloHooks.useQuery<
    PlaybookListQuery,
    PlaybookListQueryVariables
  >(PlaybookListDocument, baseOptions);
}
export const PoolListDocument = gql`
  query PoolList {
    pools {
      ...PoolListFragment
    }
  }
  ${PoolListFragmentFragmentDoc}
`;

export function usePoolListQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<PoolListQueryVariables>
) {
  return ReactApolloHooks.useQuery<PoolListQuery, PoolListQueryVariables>(
    PoolListDocument,
    baseOptions
  );
}
export const PoolInfoDocument = gql`
  query PoolInfo($ref: ID!) {
    pool(ref: $ref) {
      ...PoolInfoFragment
    }
  }
  ${PoolInfoFragmentFragmentDoc}
`;

export function usePoolInfoQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<PoolInfoQueryVariables>
) {
  return ReactApolloHooks.useQuery<PoolInfoQuery, PoolInfoQueryVariables>(
    PoolInfoDocument,
    baseOptions
  );
}
export const PoolInfoUpdateDocument = gql`
  subscription PoolInfoUpdate($ref: ID!) {
    pool(ref: $ref) {
      ...PoolInfoFragment
    }
  }
  ${PoolInfoFragmentFragmentDoc}
`;

export function usePoolInfoUpdateSubscription(
  baseOptions?: ReactApolloHooks.SubscriptionHookOptions<
    PoolInfoUpdateSubscription,
    PoolInfoUpdateSubscriptionVariables
  >
) {
  return ReactApolloHooks.useSubscription<
    PoolInfoUpdateSubscription,
    PoolInfoUpdateSubscriptionVariables
  >(PoolInfoUpdateDocument, baseOptions);
}
export const PoolListUpdateDocument = gql`
  subscription PoolListUpdate {
    pools {
      value {
        ...PoolListFragment
        ...DeletedFragment
      }
      changeType
    }
  }
  ${PoolListFragmentFragmentDoc}
  ${DeletedFragmentFragmentDoc}
`;

export function usePoolListUpdateSubscription(
  baseOptions?: ReactApolloHooks.SubscriptionHookOptions<
    PoolListUpdateSubscription,
    PoolListUpdateSubscriptionVariables
  >
) {
  return ReactApolloHooks.useSubscription<
    PoolListUpdateSubscription,
    PoolListUpdateSubscriptionVariables
  >(PoolListUpdateDocument, baseOptions);
}
export const QuotaSetDocument = gql`
  mutation QuotaSet($userId: String!, $quota: QuotaInput!) {
    quotaSet(userId: $userId, quota: $quota) {
      success
    }
  }
`;
export type QuotaSetMutationFn = ReactApollo.MutationFn<
  QuotaSetMutation,
  QuotaSetMutationVariables
>;

export function useQuotaSetMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    QuotaSetMutation,
    QuotaSetMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    QuotaSetMutation,
    QuotaSetMutationVariables
  >(QuotaSetDocument, baseOptions);
}
export const QuotaGetDocument = gql`
  query QuotaGet($userId: String!) {
    quota(user: $userId) {
      user {
        ...UserFragment
      }
      vdiSize
      vcpuCount
      vmCount
      memory
    }
  }
  ${UserFragmentFragmentDoc}
`;

export function useQuotaGetQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<QuotaGetQueryVariables>
) {
  return ReactApolloHooks.useQuery<QuotaGetQuery, QuotaGetQueryVariables>(
    QuotaGetDocument,
    baseOptions
  );
}
export const QuotaSizeDocument = gql`
  query QuotaSize($userId: String!) {
    quotaUsage(user: $userId) {
      vdiSize
      vcpuCount
      vmCount
      memory
    }
    quotaLeft(user: $userId) {
      vdiSize
      vcpuCount
      vmCount
      memory
    }
  }
`;

export function useQuotaSizeQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<QuotaSizeQueryVariables>
) {
  return ReactApolloHooks.useQuery<QuotaSizeQuery, QuotaSizeQueryVariables>(
    QuotaSizeDocument,
    baseOptions
  );
}
export const RebootVmDocument = gql`
  mutation RebootVm($ref: ID!, $force: ShutdownForce) {
    vmReboot(ref: $ref, force: $force) {
      taskId
      granted
    }
  }
`;
export type RebootVmMutationFn = ReactApollo.MutationFn<
  RebootVmMutation,
  RebootVmMutationVariables
>;

export function useRebootVmMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    RebootVmMutation,
    RebootVmMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    RebootVmMutation,
    RebootVmMutationVariables
  >(RebootVmDocument, baseOptions);
}
export const RevertVMDocument = gql`
  mutation RevertVM($ref: ID!) {
    vmRevert(ref: $ref) {
      granted
      reason
      taskId
    }
  }
`;
export type RevertVMMutationFn = ReactApollo.MutationFn<
  RevertVMMutation,
  RevertVMMutationVariables
>;

export function useRevertVMMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    RevertVMMutation,
    RevertVMMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    RevertVMMutation,
    RevertVMMutationVariables
  >(RevertVMDocument, baseOptions);
}
export const ShutdownVMDocument = gql`
  mutation ShutdownVM($ref: ID!, $force: ShutdownForce) {
    vmShutdown(ref: $ref, force: $force) {
      taskId
      granted
    }
  }
`;
export type ShutdownVMMutationFn = ReactApollo.MutationFn<
  ShutdownVMMutation,
  ShutdownVMMutationVariables
>;

export function useShutdownVMMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    ShutdownVMMutation,
    ShutdownVMMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    ShutdownVMMutation,
    ShutdownVMMutationVariables
  >(ShutdownVMDocument, baseOptions);
}
export const SnapshotVMDocument = gql`
  mutation SnapshotVM($ref: ID!, $nameLabel: String!) {
    vmSnapshot(ref: $ref, nameLabel: $nameLabel) {
      granted
      reason
      taskId
    }
  }
`;
export type SnapshotVMMutationFn = ReactApollo.MutationFn<
  SnapshotVMMutation,
  SnapshotVMMutationVariables
>;

export function useSnapshotVMMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    SnapshotVMMutation,
    SnapshotVMMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    SnapshotVMMutation,
    SnapshotVMMutationVariables
  >(SnapshotVMDocument, baseOptions);
}
export const DestroyVMSnapshotDocument = gql`
  mutation DestroyVMSnapshot($ref: ID!) {
    vmSnapshotDestroy(ref: $ref) {
      granted
      reason
      taskId
    }
  }
`;
export type DestroyVMSnapshotMutationFn = ReactApollo.MutationFn<
  DestroyVMSnapshotMutation,
  DestroyVMSnapshotMutationVariables
>;

export function useDestroyVMSnapshotMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    DestroyVMSnapshotMutation,
    DestroyVMSnapshotMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    DestroyVMSnapshotMutation,
    DestroyVMSnapshotMutationVariables
  >(DestroyVMSnapshotDocument, baseOptions);
}
export const SRInfoDocument = gql`
  query SRInfo($ref: ID!) {
    sr(ref: $ref) {
      ...SRInfoFragment
    }
  }
  ${SRInfoFragmentFragmentDoc}
`;

export function useSRInfoQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<SRInfoQueryVariables>
) {
  return ReactApolloHooks.useQuery<SRInfoQuery, SRInfoQueryVariables>(
    SRInfoDocument,
    baseOptions
  );
}
export const SRInfoUpdateDocument = gql`
  subscription SRInfoUpdate($ref: ID!) {
    sr(ref: $ref) {
      ...SRInfoFragment
    }
  }
  ${SRInfoFragmentFragmentDoc}
`;

export function useSRInfoUpdateSubscription(
  baseOptions?: ReactApolloHooks.SubscriptionHookOptions<
    SRInfoUpdateSubscription,
    SRInfoUpdateSubscriptionVariables
  >
) {
  return ReactApolloHooks.useSubscription<
    SRInfoUpdateSubscription,
    SRInfoUpdateSubscriptionVariables
  >(SRInfoUpdateDocument, baseOptions);
}
export const SRListDocument = gql`
  query SRList {
    srs {
      ...SRListFragment
    }
  }
  ${SRListFragmentFragmentDoc}
`;

export function useSRListQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<SRListQueryVariables>
) {
  return ReactApolloHooks.useQuery<SRListQuery, SRListQueryVariables>(
    SRListDocument,
    baseOptions
  );
}
export const SRListUpdateDocument = gql`
  subscription SRListUpdate {
    srs {
      changeType
      value {
        ...SRListFragment
        ...DeletedFragment
      }
    }
  }
  ${SRListFragmentFragmentDoc}
  ${DeletedFragmentFragmentDoc}
`;

export function useSRListUpdateSubscription(
  baseOptions?: ReactApolloHooks.SubscriptionHookOptions<
    SRListUpdateSubscription,
    SRListUpdateSubscriptionVariables
  >
) {
  return ReactApolloHooks.useSubscription<
    SRListUpdateSubscription,
    SRListUpdateSubscriptionVariables
  >(SRListUpdateDocument, baseOptions);
}
export const StartVMDocument = gql`
  mutation StartVM($ref: ID!, $options: VMStartInput) {
    vmStart(ref: $ref, options: $options) {
      granted
      taskId
      reason
    }
  }
`;
export type StartVMMutationFn = ReactApollo.MutationFn<
  StartVMMutation,
  StartVMMutationVariables
>;

export function useStartVMMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    StartVMMutation,
    StartVMMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    StartVMMutation,
    StartVMMutationVariables
  >(StartVMDocument, baseOptions);
}
export const StorageListDocument = gql`
  query StorageList {
    srs {
      ...StorageListFragment
    }
  }
  ${StorageListFragmentFragmentDoc}
`;

export function useStorageListQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<StorageListQueryVariables>
) {
  return ReactApolloHooks.useQuery<StorageListQuery, StorageListQueryVariables>(
    StorageListDocument,
    baseOptions
  );
}
export const SuspendVMDocument = gql`
  mutation SuspendVM($ref: ID!) {
    vmSuspend(ref: $ref) {
      taskId
      granted
      reason
    }
  }
`;
export type SuspendVMMutationFn = ReactApollo.MutationFn<
  SuspendVMMutation,
  SuspendVMMutationVariables
>;

export function useSuspendVMMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    SuspendVMMutation,
    SuspendVMMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    SuspendVMMutation,
    SuspendVMMutationVariables
  >(SuspendVMDocument, baseOptions);
}
export const TaskListUpdateDocument = gql`
  subscription TaskListUpdate {
    tasks {
      value {
        ...TaskFragment
        ...DeletedFragment
      }
      changeType
    }
  }
  ${TaskFragmentFragmentDoc}
  ${DeletedFragmentFragmentDoc}
`;

export function useTaskListUpdateSubscription(
  baseOptions?: ReactApolloHooks.SubscriptionHookOptions<
    TaskListUpdateSubscription,
    TaskListUpdateSubscriptionVariables
  >
) {
  return ReactApolloHooks.useSubscription<
    TaskListUpdateSubscription,
    TaskListUpdateSubscriptionVariables
  >(TaskListUpdateDocument, baseOptions);
}
export const TaskListDocument = gql`
  query TaskList($startDate: DateTime, $endDate: DateTime) {
    tasks(startDate: $startDate, endDate: $endDate) {
      ...TaskFragment
    }
  }
  ${TaskFragmentFragmentDoc}
`;

export function useTaskListQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<TaskListQueryVariables>
) {
  return ReactApolloHooks.useQuery<TaskListQuery, TaskListQueryVariables>(
    TaskListDocument,
    baseOptions
  );
}
export const TaskInfoDocument = gql`
  query TaskInfo($ref: ID!) {
    task(ref: $ref) {
      ...TaskFragment
    }
  }
  ${TaskFragmentFragmentDoc}
`;

export function useTaskInfoQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<TaskInfoQueryVariables>
) {
  return ReactApolloHooks.useQuery<TaskInfoQuery, TaskInfoQueryVariables>(
    TaskInfoDocument,
    baseOptions
  );
}
export const TaskInfoUpdateDocument = gql`
  subscription TaskInfoUpdate($ref: ID!) {
    task(ref: $ref) {
      ...TaskFragment
    }
  }
  ${TaskFragmentFragmentDoc}
`;

export function useTaskInfoUpdateSubscription(
  baseOptions?: ReactApolloHooks.SubscriptionHookOptions<
    TaskInfoUpdateSubscription,
    TaskInfoUpdateSubscriptionVariables
  >
) {
  return ReactApolloHooks.useSubscription<
    TaskInfoUpdateSubscription,
    TaskInfoUpdateSubscriptionVariables
  >(TaskInfoUpdateDocument, baseOptions);
}
export const TaskDeleteDocument = gql`
  mutation TaskDelete($ref: ID!) {
    taskDelete(ref: $ref) {
      granted
      reason
      taskId
    }
  }
`;
export type TaskDeleteMutationFn = ReactApollo.MutationFn<
  TaskDeleteMutation,
  TaskDeleteMutationVariables
>;

export function useTaskDeleteMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    TaskDeleteMutation,
    TaskDeleteMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    TaskDeleteMutation,
    TaskDeleteMutationVariables
  >(TaskDeleteDocument, baseOptions);
}
export const VMForTaskListDocument = gql`
  query VMForTaskList($vmRef: ID!) {
    vm(ref: $vmRef) {
      ref
      nameLabel
    }
  }
`;

export function useVMForTaskListQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<VMForTaskListQueryVariables>
) {
  return ReactApolloHooks.useQuery<
    VMForTaskListQuery,
    VMForTaskListQueryVariables
  >(VMForTaskListDocument, baseOptions);
}
export const TemplateForTaskListDocument = gql`
  query TemplateForTaskList($templateRef: ID!) {
    template(ref: $templateRef) {
      ref
      nameLabel
    }
  }
`;

export function useTemplateForTaskListQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<
    TemplateForTaskListQueryVariables
  >
) {
  return ReactApolloHooks.useQuery<
    TemplateForTaskListQuery,
    TemplateForTaskListQueryVariables
  >(TemplateForTaskListDocument, baseOptions);
}
export const PlaybookNameForTaskListDocument = gql`
  query PlaybookNameForTaskList($playbookId: ID!) {
    playbook(id: $playbookId) {
      id
      name
    }
  }
`;

export function usePlaybookNameForTaskListQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<
    PlaybookNameForTaskListQueryVariables
  >
) {
  return ReactApolloHooks.useQuery<
    PlaybookNameForTaskListQuery,
    PlaybookNameForTaskListQueryVariables
  >(PlaybookNameForTaskListDocument, baseOptions);
}
export const VBDForTaskListDocument = gql`
  query VBDForTaskList($vbdRef: ID!) {
    vbd(ref: $vbdRef) {
      ref
      type
      userdevice
    }
  }
`;

export function useVBDForTaskListQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<VBDForTaskListQueryVariables>
) {
  return ReactApolloHooks.useQuery<
    VBDForTaskListQuery,
    VBDForTaskListQueryVariables
  >(VBDForTaskListDocument, baseOptions);
}
export const VDIForTaskListDocument = gql`
  query VDIForTaskList($vdiRef: ID!) {
    vdi(ref: $vdiRef) {
      ref
      nameLabel
    }
  }
`;

export function useVDIForTaskListQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<VDIForTaskListQueryVariables>
) {
  return ReactApolloHooks.useQuery<
    VDIForTaskListQuery,
    VDIForTaskListQueryVariables
  >(VDIForTaskListDocument, baseOptions);
}
export const SRForTaskListDocument = gql`
  query SRForTaskList($srRef: ID!) {
    sr(ref: $srRef) {
      ref
      nameLabel
    }
  }
`;

export function useSRForTaskListQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<SRForTaskListQueryVariables>
) {
  return ReactApolloHooks.useQuery<
    SRForTaskListQuery,
    SRForTaskListQueryVariables
  >(SRForTaskListDocument, baseOptions);
}
export const TemplateInfoDocument = gql`
  query TemplateInfo($ref: ID!) {
    template(ref: $ref) {
      ...TemplateInfoFragment
    }
  }
  ${TemplateInfoFragmentFragmentDoc}
`;

export function useTemplateInfoQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<TemplateInfoQueryVariables>
) {
  return ReactApolloHooks.useQuery<
    TemplateInfoQuery,
    TemplateInfoQueryVariables
  >(TemplateInfoDocument, baseOptions);
}
export const TemplateInfoUpdateDocument = gql`
  subscription TemplateInfoUpdate($ref: ID!) {
    template(ref: $ref) {
      ...TemplateInfoFragment
    }
  }
  ${TemplateInfoFragmentFragmentDoc}
`;

export function useTemplateInfoUpdateSubscription(
  baseOptions?: ReactApolloHooks.SubscriptionHookOptions<
    TemplateInfoUpdateSubscription,
    TemplateInfoUpdateSubscriptionVariables
  >
) {
  return ReactApolloHooks.useSubscription<
    TemplateInfoUpdateSubscription,
    TemplateInfoUpdateSubscriptionVariables
  >(TemplateInfoUpdateDocument, baseOptions);
}
export const TemplateListDocument = gql`
  query TemplateList {
    templates {
      ...TemplateListFragment
    }
  }
  ${TemplateListFragmentFragmentDoc}
`;

export function useTemplateListQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<TemplateListQueryVariables>
) {
  return ReactApolloHooks.useQuery<
    TemplateListQuery,
    TemplateListQueryVariables
  >(TemplateListDocument, baseOptions);
}
export const TemplateListUpdateDocument = gql`
  subscription TemplateListUpdate {
    templates {
      value {
        ...TemplateListFragment
        ...DeletedFragment
      }
      changeType
    }
  }
  ${TemplateListFragmentFragmentDoc}
  ${DeletedFragmentFragmentDoc}
`;

export function useTemplateListUpdateSubscription(
  baseOptions?: ReactApolloHooks.SubscriptionHookOptions<
    TemplateListUpdateSubscription,
    TemplateListUpdateSubscriptionVariables
  >
) {
  return ReactApolloHooks.useSubscription<
    TemplateListUpdateSubscription,
    TemplateListUpdateSubscriptionVariables
  >(TemplateListUpdateDocument, baseOptions);
}
export const UserGetDocument = gql`
  query UserGet($userId: ID!) {
    user(id: $userId) {
      ...UserFragment
    }
  }
  ${UserFragmentFragmentDoc}
`;

export function useUserGetQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<UserGetQueryVariables>
) {
  return ReactApolloHooks.useQuery<UserGetQuery, UserGetQueryVariables>(
    UserGetDocument,
    baseOptions
  );
}
export const VDIInfoDocument = gql`
  query VDIInfo($ref: ID!) {
    vdi(ref: $ref) {
      ...VDIInfoFragment
    }
  }
  ${VDIInfoFragmentFragmentDoc}
`;

export function useVDIInfoQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<VDIInfoQueryVariables>
) {
  return ReactApolloHooks.useQuery<VDIInfoQuery, VDIInfoQueryVariables>(
    VDIInfoDocument,
    baseOptions
  );
}
export const VDIInfoUpdateDocument = gql`
  subscription VDIInfoUpdate($ref: ID!) {
    vdi(ref: $ref) {
      ...VDIInfoFragment
    }
  }
  ${VDIInfoFragmentFragmentDoc}
`;

export function useVDIInfoUpdateSubscription(
  baseOptions?: ReactApolloHooks.SubscriptionHookOptions<
    VDIInfoUpdateSubscription,
    VDIInfoUpdateSubscriptionVariables
  >
) {
  return ReactApolloHooks.useSubscription<
    VDIInfoUpdateSubscription,
    VDIInfoUpdateSubscriptionVariables
  >(VDIInfoUpdateDocument, baseOptions);
}
export const StorageAttachVDIListDocument = gql`
  query StorageAttachVDIList {
    vdis(onlyIsos: false) {
      ...StorageAttachVDIListFragment
    }
  }
  ${StorageAttachVDIListFragmentFragmentDoc}
`;

export function useStorageAttachVDIListQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<
    StorageAttachVDIListQueryVariables
  >
) {
  return ReactApolloHooks.useQuery<
    StorageAttachVDIListQuery,
    StorageAttachVDIListQueryVariables
  >(StorageAttachVDIListDocument, baseOptions);
}
export const StorageAttachISOListDocument = gql`
  query StorageAttachISOList {
    vdis(onlyIsos: true) {
      ...StorageAttachVDIListFragment
    }
  }
  ${StorageAttachVDIListFragmentFragmentDoc}
`;

export function useStorageAttachISOListQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<
    StorageAttachISOListQueryVariables
  >
) {
  return ReactApolloHooks.useQuery<
    StorageAttachISOListQuery,
    StorageAttachISOListQueryVariables
  >(StorageAttachISOListDocument, baseOptions);
}
export const VDIListDocument = gql`
  query VDIList {
    vdis(onlyIsos: false) {
      ...VDIListFragment
    }
  }
  ${VDIListFragmentFragmentDoc}
`;

export function useVDIListQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<VDIListQueryVariables>
) {
  return ReactApolloHooks.useQuery<VDIListQuery, VDIListQueryVariables>(
    VDIListDocument,
    baseOptions
  );
}
export const VDIListUpdateDocument = gql`
  subscription VDIListUpdate {
    vdis(onlyIsos: false) {
      changeType
      value {
        ...VDIListFragment
        ...DeletedFragment
      }
    }
  }
  ${VDIListFragmentFragmentDoc}
  ${DeletedFragmentFragmentDoc}
`;

export function useVDIListUpdateSubscription(
  baseOptions?: ReactApolloHooks.SubscriptionHookOptions<
    VDIListUpdateSubscription,
    VDIListUpdateSubscriptionVariables
  >
) {
  return ReactApolloHooks.useSubscription<
    VDIListUpdateSubscription,
    VDIListUpdateSubscriptionVariables
  >(VDIListUpdateDocument, baseOptions);
}
export const VMInfoDocument = gql`
  query VMInfo($ref: ID!) {
    vm(ref: $ref) {
      ...VMInfoFragment
    }
  }
  ${VMInfoFragmentFragmentDoc}
`;

export function useVMInfoQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<VMInfoQueryVariables>
) {
  return ReactApolloHooks.useQuery<VMInfoQuery, VMInfoQueryVariables>(
    VMInfoDocument,
    baseOptions
  );
}
export const VMInfoUpdateDocument = gql`
  subscription VMInfoUpdate($ref: ID!) {
    vm(ref: $ref) {
      ...VMInfoFragment
    }
  }
  ${VMInfoFragmentFragmentDoc}
`;

export function useVMInfoUpdateSubscription(
  baseOptions?: ReactApolloHooks.SubscriptionHookOptions<
    VMInfoUpdateSubscription,
    VMInfoUpdateSubscriptionVariables
  >
) {
  return ReactApolloHooks.useSubscription<
    VMInfoUpdateSubscription,
    VMInfoUpdateSubscriptionVariables
  >(VMInfoUpdateDocument, baseOptions);
}
export const VMListDocument = gql`
  query VMList {
    vms {
      ...VMListFragment
    }
  }
  ${VMListFragmentFragmentDoc}
`;

export function useVMListQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<VMListQueryVariables>
) {
  return ReactApolloHooks.useQuery<VMListQuery, VMListQueryVariables>(
    VMListDocument,
    baseOptions
  );
}
export const VMListUpdateDocument = gql`
  subscription VMListUpdate {
    vms {
      value {
        ...VMListFragment
        ...DeletedFragment
      }
      changeType
    }
  }
  ${VMListFragmentFragmentDoc}
  ${DeletedFragmentFragmentDoc}
`;

export function useVMListUpdateSubscription(
  baseOptions?: ReactApolloHooks.SubscriptionHookOptions<
    VMListUpdateSubscription,
    VMListUpdateSubscriptionVariables
  >
) {
  return ReactApolloHooks.useSubscription<
    VMListUpdateSubscription,
    VMListUpdateSubscriptionVariables
  >(VMListUpdateDocument, baseOptions);
}
export const VMSnapshotInfoDocument = gql`
  query VMSnapshotInfo($ref: ID!) {
    vmSnapshot(ref: $ref) {
      ...VMSnapshotInfoFragment
    }
  }
  ${VMSnapshotInfoFragmentFragmentDoc}
`;

export function useVMSnapshotInfoQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<VMSnapshotInfoQueryVariables>
) {
  return ReactApolloHooks.useQuery<
    VMSnapshotInfoQuery,
    VMSnapshotInfoQueryVariables
  >(VMSnapshotInfoDocument, baseOptions);
}
export const VMSnapshotInfoUpdateDocument = gql`
  subscription VMSnapshotInfoUpdate($ref: ID!) {
    vmSnapshot(ref: $ref) {
      ...VMSnapshotInfoFragment
    }
  }
  ${VMSnapshotInfoFragmentFragmentDoc}
`;

export function useVMSnapshotInfoUpdateSubscription(
  baseOptions?: ReactApolloHooks.SubscriptionHookOptions<
    VMSnapshotInfoUpdateSubscription,
    VMSnapshotInfoUpdateSubscriptionVariables
  >
) {
  return ReactApolloHooks.useSubscription<
    VMSnapshotInfoUpdateSubscription,
    VMSnapshotInfoUpdateSubscriptionVariables
  >(VMSnapshotInfoUpdateDocument, baseOptions);
}

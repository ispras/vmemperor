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
  };

export type GVMAccessEntry = GAccessEntry & {
  userId: User;
  isOwner: Scalars["Boolean"];
  actions: Array<VMActions>;
};

export type GVMOrDeleted = GVM | Deleted;

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
  selectedItems: Array<Scalars["ID"]>;
  vmSelectedReadyFor: VMSelectedIDLists;
};

export type QueryvmArgs = {
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
export type AbstractVMFragmentFragment = Pick<
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

export type AccessFragmentFragment = Pick<GAccessEntry, "isOwner"> & {
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
> & {
    SR: Maybe<
      { __typename?: "GSR" } & Pick<GSR, "isToolsSr"> & {
          PBDs: Array<
            Maybe<{ __typename?: "GPBD" } & Pick<GPBD, "currentlyAttached">>
          >;
        }
    >;
  };

export type ISOSCreateVMListQueryVariables = {};

export type ISOSCreateVMListQuery = { __typename?: "Query" } & {
  vdis: Array<Maybe<{ __typename?: "GVDI" } & ISOCreateVMListFragmentFragment>>;
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

export type RebootVmMutationVariables = {
  ref: Scalars["ID"];
  force?: Maybe<ShutdownForce>;
};

export type RebootVmMutation = { __typename?: "Mutation" } & {
  vmReboot: Maybe<
    { __typename?: "VMRebootMutation" } & Pick<VMRebootMutation, "taskId">
  >;
};

export type ShutdownVMMutationVariables = {
  ref: Scalars["ID"];
  force?: Maybe<ShutdownForce>;
};

export type ShutdownVMMutation = { __typename?: "Mutation" } & {
  vmShutdown: Maybe<
    { __typename?: "VMShutdownMutation" } & Pick<VMShutdownMutation, "taskId">
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
  "ref" | "nameLabel" | "myActions" | "isOwner"
>;

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
  "PVBootloader" | "powerState" | "startTime" | "myActions"
> & {
    VIFs: Array<Maybe<{ __typename?: "GVIF" } & VMVIFFragmentFragment>>;
    VBDs: Array<Maybe<{ __typename?: "GVBD" } & VMVBDFragmentFragment>>;
    osVersion: Maybe<{ __typename?: "OSVersion" } & Pick<OSVersion, "name">>;
    access: Array<
      Maybe<{ __typename?: "GVMAccessEntry" } & VMAccessFragmentFragment>
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

export type XenObjectFragmentFragment = Pick<
  GXenObject,
  "ref" | "nameLabel" | "nameDescription"
>;

export type ACLXenObjectFragmentFragment = Pick<
  GAclXenObject,
  "ref" | "nameLabel" | "nameDescription" | "isOwner"
>;

import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig
} from "graphql";

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

export type AttachNetworkMutationResolvers<
  Context = any,
  ParentType = AttachNetworkMutation
> = {
  taskId?: Resolver<Maybe<Scalars["ID"]>, ParentType, Context>;
  granted?: Resolver<Scalars["Boolean"], ParentType, Context>;
  reason?: Resolver<Maybe<Scalars["String"]>, ParentType, Context>;
};

export type AttachVDIMutationResolvers<
  Context = any,
  ParentType = AttachVDIMutation
> = {
  taskId?: Resolver<Maybe<Scalars["ID"]>, ParentType, Context>;
  granted?: Resolver<Scalars["Boolean"], ParentType, Context>;
  reason?: Resolver<Maybe<Scalars["String"]>, ParentType, Context>;
};

export type CpuInfoResolvers<Context = any, ParentType = CpuInfo> = {
  cpuCount?: Resolver<Scalars["Int"], ParentType, Context>;
  modelname?: Resolver<Scalars["String"], ParentType, Context>;
  socketCount?: Resolver<Scalars["Int"], ParentType, Context>;
  vendor?: Resolver<Scalars["String"], ParentType, Context>;
  family?: Resolver<Scalars["Int"], ParentType, Context>;
  features?: Resolver<Scalars["ID"], ParentType, Context>;
  featuresHvm?: Resolver<Maybe<Scalars["ID"]>, ParentType, Context>;
  featuresPv?: Resolver<Maybe<Scalars["ID"]>, ParentType, Context>;
  flags?: Resolver<Scalars["String"], ParentType, Context>;
  model?: Resolver<Scalars["Int"], ParentType, Context>;
  speed?: Resolver<Scalars["Float"], ParentType, Context>;
  stepping?: Resolver<Scalars["Int"], ParentType, Context>;
};

export type CreateVMResolvers<Context = any, ParentType = CreateVM> = {
  taskId?: Resolver<Maybe<Scalars["ID"]>, ParentType, Context>;
  granted?: Resolver<Scalars["Boolean"], ParentType, Context>;
  reason?: Resolver<Maybe<Scalars["String"]>, ParentType, Context>;
};

export type CurrentUserInformationResolvers<
  Context = any,
  ParentType = CurrentUserInformation
> = {
  isAdmin?: Resolver<Scalars["Boolean"], ParentType, Context>;
  user?: Resolver<Maybe<User>, ParentType, Context>;
  groups?: Resolver<Maybe<Array<Maybe<User>>>, ParentType, Context>;
};

export interface DateTimeScalarConfig
  extends GraphQLScalarTypeConfig<Scalars["DateTime"], any> {
  name: "DateTime";
}

export type DeletedResolvers<Context = any, ParentType = Deleted> = {
  ref?: Resolver<Scalars["ID"], ParentType, Context>;
};

export type GAbstractVMResolvers<Context = any, ParentType = GAbstractVM> = {
  __resolveType: TypeResolveFn<"GVM" | "GTemplate", ParentType, Context>;
  platform?: Resolver<Maybe<Platform>, ParentType, Context>;
  VCPUsAtStartup?: Resolver<Scalars["Int"], ParentType, Context>;
  VCPUsMax?: Resolver<Scalars["Int"], ParentType, Context>;
  domainType?: Resolver<DomainType, ParentType, Context>;
  guestMetrics?: Resolver<Scalars["ID"], ParentType, Context>;
  installTime?: Resolver<Scalars["DateTime"], ParentType, Context>;
  memoryActual?: Resolver<Scalars["Float"], ParentType, Context>;
  memoryStaticMin?: Resolver<Scalars["Float"], ParentType, Context>;
  memoryStaticMax?: Resolver<Scalars["Float"], ParentType, Context>;
  memoryDynamicMin?: Resolver<Scalars["Float"], ParentType, Context>;
  memoryDynamicMax?: Resolver<Scalars["Float"], ParentType, Context>;
  PVBootloader?: Resolver<Scalars["String"], ParentType, Context>;
};

export type GAccessEntryResolvers<Context = any, ParentType = GAccessEntry> = {
  __resolveType: TypeResolveFn<
    | "GVMAccessEntry"
    | "GNetworkAccessEntry"
    | "GVDIAccessEntry"
    | "GSRAccessEntry"
    | "GTemplateAccessEntry"
    | "GPoolAccessEntry"
    | "GTaskAccessEntry",
    ParentType,
    Context
  >;
  userId?: Resolver<User, ParentType, Context>;
  isOwner?: Resolver<Scalars["Boolean"], ParentType, Context>;
};

export type GAclXenObjectResolvers<
  Context = any,
  ParentType = GAclXenObject
> = {
  __resolveType: TypeResolveFn<
    "GVM" | "GNetwork" | "GVDI" | "GSR" | "GTemplate" | "GPool" | "GTask",
    ParentType,
    Context
  >;
  nameLabel?: Resolver<Scalars["String"], ParentType, Context>;
  nameDescription?: Resolver<Scalars["String"], ParentType, Context>;
  ref?: Resolver<Scalars["ID"], ParentType, Context>;
  uuid?: Resolver<Scalars["ID"], ParentType, Context>;
  access?: Resolver<Array<Maybe<GAccessEntry>>, ParentType, Context>;
  isOwner?: Resolver<Scalars["Boolean"], ParentType, Context>;
};

export type GHostResolvers<Context = any, ParentType = GHost> = {
  nameLabel?: Resolver<Scalars["String"], ParentType, Context>;
  nameDescription?: Resolver<Scalars["String"], ParentType, Context>;
  ref?: Resolver<Scalars["ID"], ParentType, Context>;
  uuid?: Resolver<Scalars["ID"], ParentType, Context>;
  APIVersionMajor?: Resolver<Maybe<Scalars["Int"]>, ParentType, Context>;
  APIVersionMinor?: Resolver<Maybe<Scalars["Int"]>, ParentType, Context>;
  PBDs?: Resolver<Array<Maybe<GPBD>>, ParentType, Context>;
  PCIs?: Resolver<Array<Maybe<Scalars["ID"]>>, ParentType, Context>;
  PGPUs?: Resolver<Array<Maybe<Scalars["ID"]>>, ParentType, Context>;
  PIFs?: Resolver<Array<Maybe<Scalars["ID"]>>, ParentType, Context>;
  PUSBs?: Resolver<Array<Maybe<Scalars["ID"]>>, ParentType, Context>;
  address?: Resolver<Scalars["String"], ParentType, Context>;
  allowedOperations?: Resolver<
    Array<Maybe<HostAllowedOperations>>,
    ParentType,
    Context
  >;
  cpuInfo?: Resolver<CpuInfo, ParentType, Context>;
  display?: Resolver<HostDisplay, ParentType, Context>;
  hostname?: Resolver<Scalars["String"], ParentType, Context>;
  softwareVersion?: Resolver<SoftwareVersion, ParentType, Context>;
  residentVms?: Resolver<Array<Maybe<GVM>>, ParentType, Context>;
  metrics?: Resolver<Scalars["ID"], ParentType, Context>;
  memoryTotal?: Resolver<Maybe<Scalars["Float"]>, ParentType, Context>;
  memoryFree?: Resolver<Maybe<Scalars["Float"]>, ParentType, Context>;
  memoryAvailable?: Resolver<Maybe<Scalars["Float"]>, ParentType, Context>;
  memoryOverhead?: Resolver<Maybe<Scalars["Float"]>, ParentType, Context>;
  live?: Resolver<Maybe<Scalars["Boolean"]>, ParentType, Context>;
  liveUpdated?: Resolver<Maybe<Scalars["DateTime"]>, ParentType, Context>;
};

export type GHostOrDeletedResolvers<
  Context = any,
  ParentType = GHostOrDeleted
> = {
  __resolveType: TypeResolveFn<"GHost" | "Deleted", ParentType, Context>;
};

export type GHostsSubscriptionResolvers<
  Context = any,
  ParentType = GHostsSubscription
> = {
  changeType?: Resolver<Change, ParentType, Context>;
  value?: Resolver<GHostOrDeleted, ParentType, Context>;
};

export type GNetworkResolvers<Context = any, ParentType = GNetwork> = {
  nameLabel?: Resolver<Scalars["String"], ParentType, Context>;
  nameDescription?: Resolver<Scalars["String"], ParentType, Context>;
  ref?: Resolver<Scalars["ID"], ParentType, Context>;
  uuid?: Resolver<Scalars["ID"], ParentType, Context>;
  access?: Resolver<Array<Maybe<GNetworkAccessEntry>>, ParentType, Context>;
  isOwner?: Resolver<Scalars["Boolean"], ParentType, Context>;
  myActions?: Resolver<Array<Maybe<NetworkActions>>, ParentType, Context>;
  VIFs?: Resolver<Maybe<Array<Maybe<GVIF>>>, ParentType, Context>;
  otherConfig?: Resolver<Maybe<Scalars["JSONString"]>, ParentType, Context>;
};

export type GNetworkAccessEntryResolvers<
  Context = any,
  ParentType = GNetworkAccessEntry
> = {
  userId?: Resolver<User, ParentType, Context>;
  isOwner?: Resolver<Scalars["Boolean"], ParentType, Context>;
  actions?: Resolver<Array<NetworkActions>, ParentType, Context>;
};

export type GNetworkOrDeletedResolvers<
  Context = any,
  ParentType = GNetworkOrDeleted
> = {
  __resolveType: TypeResolveFn<"GNetwork" | "Deleted", ParentType, Context>;
};

export type GNetworksSubscriptionResolvers<
  Context = any,
  ParentType = GNetworksSubscription
> = {
  changeType?: Resolver<Change, ParentType, Context>;
  value?: Resolver<GNetworkOrDeleted, ParentType, Context>;
};

export type GPBDResolvers<Context = any, ParentType = GPBD> = {
  ref?: Resolver<Scalars["ID"], ParentType, Context>;
  uuid?: Resolver<Scalars["ID"], ParentType, Context>;
  host?: Resolver<GHost, ParentType, Context>;
  deviceConfig?: Resolver<Scalars["JSONString"], ParentType, Context>;
  SR?: Resolver<GSR, ParentType, Context>;
  currentlyAttached?: Resolver<Scalars["Boolean"], ParentType, Context>;
};

export type GPlaybookResolvers<Context = any, ParentType = GPlaybook> = {
  id?: Resolver<Scalars["ID"], ParentType, Context>;
  inventory?: Resolver<Maybe<Scalars["String"]>, ParentType, Context>;
  requires?: Resolver<Maybe<PlaybookRequirements>, ParentType, Context>;
  name?: Resolver<Scalars["String"], ParentType, Context>;
  description?: Resolver<Maybe<Scalars["String"]>, ParentType, Context>;
  variables?: Resolver<Maybe<Scalars["JSONString"]>, ParentType, Context>;
};

export type GPoolResolvers<Context = any, ParentType = GPool> = {
  nameLabel?: Resolver<Scalars["String"], ParentType, Context>;
  nameDescription?: Resolver<Scalars["String"], ParentType, Context>;
  ref?: Resolver<Scalars["ID"], ParentType, Context>;
  uuid?: Resolver<Scalars["ID"], ParentType, Context>;
  access?: Resolver<Array<Maybe<GPoolAccessEntry>>, ParentType, Context>;
  isOwner?: Resolver<Scalars["Boolean"], ParentType, Context>;
  myActions?: Resolver<Array<Maybe<PoolActions>>, ParentType, Context>;
  master?: Resolver<Maybe<GHost>, ParentType, Context>;
  defaultSr?: Resolver<Maybe<GSR>, ParentType, Context>;
};

export type GPoolAccessEntryResolvers<
  Context = any,
  ParentType = GPoolAccessEntry
> = {
  userId?: Resolver<User, ParentType, Context>;
  isOwner?: Resolver<Scalars["Boolean"], ParentType, Context>;
  actions?: Resolver<Array<PoolActions>, ParentType, Context>;
};

export type GPoolOrDeletedResolvers<
  Context = any,
  ParentType = GPoolOrDeleted
> = {
  __resolveType: TypeResolveFn<"GPool" | "Deleted", ParentType, Context>;
};

export type GPoolsSubscriptionResolvers<
  Context = any,
  ParentType = GPoolsSubscription
> = {
  changeType?: Resolver<Change, ParentType, Context>;
  value?: Resolver<GPoolOrDeleted, ParentType, Context>;
};

export type GQuotaObjectResolvers<Context = any, ParentType = GQuotaObject> = {
  __resolveType: TypeResolveFn<"GVM" | "GVDI", ParentType, Context>;
  mainOwner?: Resolver<Maybe<User>, ParentType, Context>;
};

export type GSRResolvers<Context = any, ParentType = GSR> = {
  nameLabel?: Resolver<Scalars["String"], ParentType, Context>;
  nameDescription?: Resolver<Scalars["String"], ParentType, Context>;
  ref?: Resolver<Scalars["ID"], ParentType, Context>;
  uuid?: Resolver<Scalars["ID"], ParentType, Context>;
  access?: Resolver<Array<Maybe<GSRAccessEntry>>, ParentType, Context>;
  isOwner?: Resolver<Scalars["Boolean"], ParentType, Context>;
  myActions?: Resolver<Array<Maybe<SRActions>>, ParentType, Context>;
  PBDs?: Resolver<Array<Maybe<GPBD>>, ParentType, Context>;
  VDIs?: Resolver<Maybe<Array<Maybe<GVDI>>>, ParentType, Context>;
  contentType?: Resolver<SRContentType, ParentType, Context>;
  type?: Resolver<Scalars["String"], ParentType, Context>;
  physicalSize?: Resolver<Scalars["Float"], ParentType, Context>;
  virtualAllocation?: Resolver<Scalars["Float"], ParentType, Context>;
  isToolsSr?: Resolver<Scalars["Boolean"], ParentType, Context>;
  physicalUtilisation?: Resolver<Scalars["Float"], ParentType, Context>;
  spaceAvailable?: Resolver<Scalars["Float"], ParentType, Context>;
};

export type GSRAccessEntryResolvers<
  Context = any,
  ParentType = GSRAccessEntry
> = {
  userId?: Resolver<User, ParentType, Context>;
  isOwner?: Resolver<Scalars["Boolean"], ParentType, Context>;
  actions?: Resolver<Array<SRActions>, ParentType, Context>;
};

export type GSROrDeletedResolvers<Context = any, ParentType = GSROrDeleted> = {
  __resolveType: TypeResolveFn<"GSR" | "Deleted", ParentType, Context>;
};

export type GSRsSubscriptionResolvers<
  Context = any,
  ParentType = GSRsSubscription
> = {
  changeType?: Resolver<Change, ParentType, Context>;
  value?: Resolver<GSROrDeleted, ParentType, Context>;
};

export type GTaskResolvers<Context = any, ParentType = GTask> = {
  nameLabel?: Resolver<Scalars["String"], ParentType, Context>;
  nameDescription?: Resolver<Scalars["String"], ParentType, Context>;
  ref?: Resolver<Scalars["ID"], ParentType, Context>;
  uuid?: Resolver<Scalars["ID"], ParentType, Context>;
  access?: Resolver<Array<Maybe<GTaskAccessEntry>>, ParentType, Context>;
  isOwner?: Resolver<Scalars["Boolean"], ParentType, Context>;
  myActions?: Resolver<Array<Maybe<TaskActions>>, ParentType, Context>;
  created?: Resolver<Scalars["DateTime"], ParentType, Context>;
  finished?: Resolver<Maybe<Scalars["DateTime"]>, ParentType, Context>;
  progress?: Resolver<Scalars["Float"], ParentType, Context>;
  result?: Resolver<Maybe<Scalars["ID"]>, ParentType, Context>;
  who?: Resolver<Maybe<User>, ParentType, Context>;
  residentOn?: Resolver<Maybe<Scalars["ID"]>, ParentType, Context>;
  errorInfo?: Resolver<
    Maybe<Array<Maybe<Scalars["String"]>>>,
    ParentType,
    Context
  >;
  status?: Resolver<TaskStatus, ParentType, Context>;
  objectRef?: Resolver<Maybe<Scalars["ID"]>, ParentType, Context>;
  objectType?: Resolver<Maybe<Scalars["String"]>, ParentType, Context>;
  action?: Resolver<Maybe<Scalars["String"]>, ParentType, Context>;
};

export type GTaskAccessEntryResolvers<
  Context = any,
  ParentType = GTaskAccessEntry
> = {
  userId?: Resolver<User, ParentType, Context>;
  isOwner?: Resolver<Scalars["Boolean"], ParentType, Context>;
  actions?: Resolver<Array<TaskActions>, ParentType, Context>;
};

export type GTaskOrDeletedResolvers<
  Context = any,
  ParentType = GTaskOrDeleted
> = {
  __resolveType: TypeResolveFn<"GTask" | "Deleted", ParentType, Context>;
};

export type GTasksSubscriptionResolvers<
  Context = any,
  ParentType = GTasksSubscription
> = {
  changeType?: Resolver<Change, ParentType, Context>;
  value?: Resolver<GTaskOrDeleted, ParentType, Context>;
};

export type GTemplateResolvers<Context = any, ParentType = GTemplate> = {
  nameLabel?: Resolver<Scalars["String"], ParentType, Context>;
  nameDescription?: Resolver<Scalars["String"], ParentType, Context>;
  ref?: Resolver<Scalars["ID"], ParentType, Context>;
  uuid?: Resolver<Scalars["ID"], ParentType, Context>;
  access?: Resolver<Array<Maybe<GTemplateAccessEntry>>, ParentType, Context>;
  isOwner?: Resolver<Scalars["Boolean"], ParentType, Context>;
  platform?: Resolver<Maybe<Platform>, ParentType, Context>;
  VCPUsAtStartup?: Resolver<Scalars["Int"], ParentType, Context>;
  VCPUsMax?: Resolver<Scalars["Int"], ParentType, Context>;
  domainType?: Resolver<DomainType, ParentType, Context>;
  guestMetrics?: Resolver<Scalars["ID"], ParentType, Context>;
  installTime?: Resolver<Scalars["DateTime"], ParentType, Context>;
  memoryActual?: Resolver<Scalars["Float"], ParentType, Context>;
  memoryStaticMin?: Resolver<Scalars["Float"], ParentType, Context>;
  memoryStaticMax?: Resolver<Scalars["Float"], ParentType, Context>;
  memoryDynamicMin?: Resolver<Scalars["Float"], ParentType, Context>;
  memoryDynamicMax?: Resolver<Scalars["Float"], ParentType, Context>;
  PVBootloader?: Resolver<Scalars["String"], ParentType, Context>;
  myActions?: Resolver<Array<Maybe<TemplateActions>>, ParentType, Context>;
  isDefaultTemplate?: Resolver<Scalars["Boolean"], ParentType, Context>;
  installOptions?: Resolver<Maybe<InstallOSOptions>, ParentType, Context>;
};

export type GTemplateAccessEntryResolvers<
  Context = any,
  ParentType = GTemplateAccessEntry
> = {
  userId?: Resolver<User, ParentType, Context>;
  isOwner?: Resolver<Scalars["Boolean"], ParentType, Context>;
  actions?: Resolver<Array<TemplateActions>, ParentType, Context>;
};

export type GTemplateOrDeletedResolvers<
  Context = any,
  ParentType = GTemplateOrDeleted
> = {
  __resolveType: TypeResolveFn<"GTemplate" | "Deleted", ParentType, Context>;
};

export type GTemplatesSubscriptionResolvers<
  Context = any,
  ParentType = GTemplatesSubscription
> = {
  changeType?: Resolver<Change, ParentType, Context>;
  value?: Resolver<GTemplateOrDeleted, ParentType, Context>;
};

export type GVBDResolvers<Context = any, ParentType = GVBD> = {
  ref?: Resolver<Scalars["ID"], ParentType, Context>;
  uuid?: Resolver<Scalars["ID"], ParentType, Context>;
  VM?: Resolver<Maybe<GVM>, ParentType, Context>;
  VDI?: Resolver<Maybe<GVDI>, ParentType, Context>;
  type?: Resolver<VBDType, ParentType, Context>;
  mode?: Resolver<VBDMode, ParentType, Context>;
  currentlyAttached?: Resolver<Scalars["Boolean"], ParentType, Context>;
  bootable?: Resolver<Scalars["Boolean"], ParentType, Context>;
  userdevice?: Resolver<Scalars["Int"], ParentType, Context>;
};

export type GVDIResolvers<Context = any, ParentType = GVDI> = {
  nameLabel?: Resolver<Scalars["String"], ParentType, Context>;
  nameDescription?: Resolver<Scalars["String"], ParentType, Context>;
  ref?: Resolver<Scalars["ID"], ParentType, Context>;
  uuid?: Resolver<Scalars["ID"], ParentType, Context>;
  access?: Resolver<Array<Maybe<GVDIAccessEntry>>, ParentType, Context>;
  isOwner?: Resolver<Scalars["Boolean"], ParentType, Context>;
  mainOwner?: Resolver<Maybe<User>, ParentType, Context>;
  myActions?: Resolver<Array<Maybe<VDIActions>>, ParentType, Context>;
  SR?: Resolver<Maybe<GSR>, ParentType, Context>;
  virtualSize?: Resolver<Scalars["Float"], ParentType, Context>;
  VBDs?: Resolver<Array<Maybe<GVBD>>, ParentType, Context>;
  contentType?: Resolver<SRContentType, ParentType, Context>;
  type?: Resolver<VDIType, ParentType, Context>;
};

export type GVDIAccessEntryResolvers<
  Context = any,
  ParentType = GVDIAccessEntry
> = {
  userId?: Resolver<User, ParentType, Context>;
  isOwner?: Resolver<Scalars["Boolean"], ParentType, Context>;
  actions?: Resolver<Array<VDIActions>, ParentType, Context>;
};

export type GVDIOrDeletedResolvers<
  Context = any,
  ParentType = GVDIOrDeleted
> = {
  __resolveType: TypeResolveFn<"GVDI" | "Deleted", ParentType, Context>;
};

export type GVDIsSubscriptionResolvers<
  Context = any,
  ParentType = GVDIsSubscription
> = {
  changeType?: Resolver<Change, ParentType, Context>;
  value?: Resolver<GVDIOrDeleted, ParentType, Context>;
};

export type GVIFResolvers<Context = any, ParentType = GVIF> = {
  ref?: Resolver<Scalars["ID"], ParentType, Context>;
  MAC?: Resolver<Scalars["ID"], ParentType, Context>;
  VM?: Resolver<Maybe<GVM>, ParentType, Context>;
  device?: Resolver<Scalars["ID"], ParentType, Context>;
  currentlyAttached?: Resolver<Scalars["Boolean"], ParentType, Context>;
  ip?: Resolver<Maybe<Scalars["String"]>, ParentType, Context>;
  ipv4?: Resolver<Maybe<Scalars["String"]>, ParentType, Context>;
  ipv6?: Resolver<Maybe<Scalars["String"]>, ParentType, Context>;
  network?: Resolver<Maybe<GNetwork>, ParentType, Context>;
};

export type GVMResolvers<Context = any, ParentType = GVM> = {
  nameLabel?: Resolver<Scalars["String"], ParentType, Context>;
  nameDescription?: Resolver<Scalars["String"], ParentType, Context>;
  ref?: Resolver<Scalars["ID"], ParentType, Context>;
  uuid?: Resolver<Scalars["ID"], ParentType, Context>;
  access?: Resolver<Array<Maybe<GVMAccessEntry>>, ParentType, Context>;
  isOwner?: Resolver<Scalars["Boolean"], ParentType, Context>;
  platform?: Resolver<Maybe<Platform>, ParentType, Context>;
  VCPUsAtStartup?: Resolver<Scalars["Int"], ParentType, Context>;
  VCPUsMax?: Resolver<Scalars["Int"], ParentType, Context>;
  domainType?: Resolver<DomainType, ParentType, Context>;
  guestMetrics?: Resolver<Scalars["ID"], ParentType, Context>;
  installTime?: Resolver<Scalars["DateTime"], ParentType, Context>;
  memoryActual?: Resolver<Scalars["Float"], ParentType, Context>;
  memoryStaticMin?: Resolver<Scalars["Float"], ParentType, Context>;
  memoryStaticMax?: Resolver<Scalars["Float"], ParentType, Context>;
  memoryDynamicMin?: Resolver<Scalars["Float"], ParentType, Context>;
  memoryDynamicMax?: Resolver<Scalars["Float"], ParentType, Context>;
  PVBootloader?: Resolver<Scalars["String"], ParentType, Context>;
  mainOwner?: Resolver<Maybe<User>, ParentType, Context>;
  myActions?: Resolver<Array<Maybe<VMActions>>, ParentType, Context>;
  PVDriversUpToDate?: Resolver<Maybe<Scalars["Boolean"]>, ParentType, Context>;
  PVDriversVersion?: Resolver<Maybe<PvDriversVersion>, ParentType, Context>;
  metrics?: Resolver<Scalars["ID"], ParentType, Context>;
  osVersion?: Resolver<Maybe<OSVersion>, ParentType, Context>;
  powerState?: Resolver<PowerState, ParentType, Context>;
  startTime?: Resolver<Maybe<Scalars["DateTime"]>, ParentType, Context>;
  VIFs?: Resolver<Array<Maybe<GVIF>>, ParentType, Context>;
  VBDs?: Resolver<Array<Maybe<GVBD>>, ParentType, Context>;
};

export type GVMAccessEntryResolvers<
  Context = any,
  ParentType = GVMAccessEntry
> = {
  userId?: Resolver<User, ParentType, Context>;
  isOwner?: Resolver<Scalars["Boolean"], ParentType, Context>;
  actions?: Resolver<Array<VMActions>, ParentType, Context>;
};

export type GVMOrDeletedResolvers<Context = any, ParentType = GVMOrDeleted> = {
  __resolveType: TypeResolveFn<"GVM" | "Deleted", ParentType, Context>;
};

export type GVMsSubscriptionResolvers<
  Context = any,
  ParentType = GVMsSubscription
> = {
  changeType?: Resolver<Change, ParentType, Context>;
  value?: Resolver<GVMOrDeleted, ParentType, Context>;
};

export type GXenObjectResolvers<Context = any, ParentType = GXenObject> = {
  __resolveType: TypeResolveFn<"GHost", ParentType, Context>;
  nameLabel?: Resolver<Scalars["String"], ParentType, Context>;
  nameDescription?: Resolver<Scalars["String"], ParentType, Context>;
  ref?: Resolver<Scalars["ID"], ParentType, Context>;
  uuid?: Resolver<Scalars["ID"], ParentType, Context>;
};

export type InstallOSOptionsResolvers<
  Context = any,
  ParentType = InstallOSOptions
> = {
  distro?: Resolver<Distro, ParentType, Context>;
  arch?: Resolver<Maybe<Arch>, ParentType, Context>;
  release?: Resolver<Maybe<Scalars["String"]>, ParentType, Context>;
  installRepository?: Resolver<Maybe<Scalars["String"]>, ParentType, Context>;
};

export interface JSONStringScalarConfig
  extends GraphQLScalarTypeConfig<Scalars["JSONString"], any> {
  name: "JSONString";
}

export type MutationResolvers<Context = any, ParentType = Mutation> = {
  createVm?: Resolver<
    Maybe<CreateVM>,
    ParentType,
    Context,
    MutationcreateVmArgs
  >;
  template?: Resolver<
    Maybe<TemplateMutation>,
    ParentType,
    Context,
    MutationtemplateArgs
  >;
  templateClone?: Resolver<
    Maybe<TemplateCloneMutation>,
    ParentType,
    Context,
    MutationtemplateCloneArgs
  >;
  templateDelete?: Resolver<
    Maybe<TemplateDestroyMutation>,
    ParentType,
    Context,
    MutationtemplateDeleteArgs
  >;
  templateAccessSet?: Resolver<
    Maybe<TemplateAccessSet>,
    ParentType,
    Context,
    MutationtemplateAccessSetArgs
  >;
  vm?: Resolver<Maybe<VMMutation>, ParentType, Context, MutationvmArgs>;
  vmStart?: Resolver<
    Maybe<VMStartMutation>,
    ParentType,
    Context,
    MutationvmStartArgs
  >;
  vmShutdown?: Resolver<
    Maybe<VMShutdownMutation>,
    ParentType,
    Context,
    MutationvmShutdownArgs
  >;
  vmReboot?: Resolver<
    Maybe<VMRebootMutation>,
    ParentType,
    Context,
    MutationvmRebootArgs
  >;
  vmPause?: Resolver<
    Maybe<VMPauseMutation>,
    ParentType,
    Context,
    MutationvmPauseArgs
  >;
  vmSuspend?: Resolver<
    Maybe<VMSuspendMutation>,
    ParentType,
    Context,
    MutationvmSuspendArgs
  >;
  vmDelete?: Resolver<
    Maybe<VMDestroyMutation>,
    ParentType,
    Context,
    MutationvmDeleteArgs
  >;
  vmAccessSet?: Resolver<
    Maybe<VMAccessSet>,
    ParentType,
    Context,
    MutationvmAccessSetArgs
  >;
  playbookLaunch?: Resolver<
    Maybe<PlaybookLaunchMutation>,
    ParentType,
    Context,
    MutationplaybookLaunchArgs
  >;
  network?: Resolver<
    Maybe<NetworkMutation>,
    ParentType,
    Context,
    MutationnetworkArgs
  >;
  netAttach?: Resolver<
    Maybe<AttachNetworkMutation>,
    ParentType,
    Context,
    MutationnetAttachArgs
  >;
  netAccessSet?: Resolver<
    Maybe<NetAccessSet>,
    ParentType,
    Context,
    MutationnetAccessSetArgs
  >;
  vdi?: Resolver<Maybe<VDIMutation>, ParentType, Context, MutationvdiArgs>;
  vdiAttach?: Resolver<
    Maybe<AttachVDIMutation>,
    ParentType,
    Context,
    MutationvdiAttachArgs
  >;
  vdiAccessSet?: Resolver<
    Maybe<VDIAccessSet>,
    ParentType,
    Context,
    MutationvdiAccessSetArgs
  >;
  vdiDelete?: Resolver<
    Maybe<VDIDestroyMutation>,
    ParentType,
    Context,
    MutationvdiDeleteArgs
  >;
  sr?: Resolver<Maybe<SRMutation>, ParentType, Context, MutationsrArgs>;
  srAccessSet?: Resolver<
    Maybe<SRAccessSet>,
    ParentType,
    Context,
    MutationsrAccessSetArgs
  >;
  srDelete?: Resolver<
    Maybe<SRDestroyMutation>,
    ParentType,
    Context,
    MutationsrDeleteArgs
  >;
  pool?: Resolver<Maybe<PoolMutation>, ParentType, Context, MutationpoolArgs>;
  poolAccessSet?: Resolver<
    Maybe<PoolAccessSet>,
    ParentType,
    Context,
    MutationpoolAccessSetArgs
  >;
  taskDelete?: Resolver<
    Maybe<TaskRemoveMutation>,
    ParentType,
    Context,
    MutationtaskDeleteArgs
  >;
  quotaSet?: Resolver<
    Maybe<QuotaMutation>,
    ParentType,
    Context,
    MutationquotaSetArgs
  >;
  selectedItems?: Resolver<
    Maybe<Array<Scalars["ID"]>>,
    ParentType,
    Context,
    MutationselectedItemsArgs
  >;
};

export type NetAccessSetResolvers<Context = any, ParentType = NetAccessSet> = {
  success?: Resolver<Scalars["Boolean"], ParentType, Context>;
};

export type NetworkMutationResolvers<
  Context = any,
  ParentType = NetworkMutation
> = {
  granted?: Resolver<Scalars["Boolean"], ParentType, Context>;
  reason?: Resolver<Maybe<Scalars["String"]>, ParentType, Context>;
};

export type OSVersionResolvers<Context = any, ParentType = OSVersion> = {
  name?: Resolver<Maybe<Scalars["String"]>, ParentType, Context>;
  uname?: Resolver<Maybe<Scalars["String"]>, ParentType, Context>;
  distro?: Resolver<Maybe<Scalars["String"]>, ParentType, Context>;
  major?: Resolver<Maybe<Scalars["Int"]>, ParentType, Context>;
  minor?: Resolver<Maybe<Scalars["Int"]>, ParentType, Context>;
};

export type PlatformResolvers<Context = any, ParentType = Platform> = {
  coresPerSocket?: Resolver<Maybe<Scalars["Int"]>, ParentType, Context>;
  timeoffset?: Resolver<Maybe<Scalars["Int"]>, ParentType, Context>;
  nx?: Resolver<Maybe<Scalars["Boolean"]>, ParentType, Context>;
  deviceModel?: Resolver<Maybe<Scalars["String"]>, ParentType, Context>;
  pae?: Resolver<Maybe<Scalars["Boolean"]>, ParentType, Context>;
  hpet?: Resolver<Maybe<Scalars["Boolean"]>, ParentType, Context>;
  apic?: Resolver<Maybe<Scalars["Boolean"]>, ParentType, Context>;
  acpi?: Resolver<Maybe<Scalars["Int"]>, ParentType, Context>;
  videoram?: Resolver<Maybe<Scalars["Int"]>, ParentType, Context>;
};

export type PlaybookLaunchMutationResolvers<
  Context = any,
  ParentType = PlaybookLaunchMutation
> = {
  taskId?: Resolver<Scalars["ID"], ParentType, Context>;
};

export type PlaybookRequirementsResolvers<
  Context = any,
  ParentType = PlaybookRequirements
> = {
  osVersion?: Resolver<Array<Maybe<OSVersion>>, ParentType, Context>;
};

export type PoolAccessSetResolvers<
  Context = any,
  ParentType = PoolAccessSet
> = {
  success?: Resolver<Scalars["Boolean"], ParentType, Context>;
};

export type PoolMutationResolvers<Context = any, ParentType = PoolMutation> = {
  granted?: Resolver<Scalars["Boolean"], ParentType, Context>;
  reason?: Resolver<Maybe<Scalars["String"]>, ParentType, Context>;
};

export type PvDriversVersionResolvers<
  Context = any,
  ParentType = PvDriversVersion
> = {
  major?: Resolver<Maybe<Scalars["Int"]>, ParentType, Context>;
  minor?: Resolver<Maybe<Scalars["Int"]>, ParentType, Context>;
  micro?: Resolver<Maybe<Scalars["Int"]>, ParentType, Context>;
  build?: Resolver<Maybe<Scalars["Int"]>, ParentType, Context>;
};

export type QueryResolvers<Context = any, ParentType = Query> = {
  vms?: Resolver<Array<Maybe<GVM>>, ParentType, Context>;
  vm?: Resolver<Maybe<GVM>, ParentType, Context, QueryvmArgs>;
  templates?: Resolver<Array<Maybe<GTemplate>>, ParentType, Context>;
  template?: Resolver<Maybe<GTemplate>, ParentType, Context, QuerytemplateArgs>;
  hosts?: Resolver<Array<Maybe<GHost>>, ParentType, Context>;
  host?: Resolver<Maybe<GHost>, ParentType, Context, QueryhostArgs>;
  pools?: Resolver<Array<Maybe<GPool>>, ParentType, Context>;
  pool?: Resolver<Maybe<GPool>, ParentType, Context, QuerypoolArgs>;
  networks?: Resolver<Array<Maybe<GNetwork>>, ParentType, Context>;
  network?: Resolver<Maybe<GNetwork>, ParentType, Context, QuerynetworkArgs>;
  srs?: Resolver<Array<Maybe<GSR>>, ParentType, Context>;
  sr?: Resolver<Maybe<GSR>, ParentType, Context, QuerysrArgs>;
  vdis?: Resolver<Array<Maybe<GVDI>>, ParentType, Context, QueryvdisArgs>;
  vdi?: Resolver<Maybe<GVDI>, ParentType, Context, QueryvdiArgs>;
  playbooks?: Resolver<Array<Maybe<GPlaybook>>, ParentType, Context>;
  playbook?: Resolver<Maybe<GPlaybook>, ParentType, Context, QueryplaybookArgs>;
  tasks?: Resolver<Array<Maybe<GTask>>, ParentType, Context, QuerytasksArgs>;
  task?: Resolver<Maybe<GTask>, ParentType, Context, QuerytaskArgs>;
  console?: Resolver<
    Maybe<Scalars["String"]>,
    ParentType,
    Context,
    QueryconsoleArgs
  >;
  users?: Resolver<Array<Maybe<User>>, ParentType, Context>;
  groups?: Resolver<Array<Maybe<User>>, ParentType, Context>;
  user?: Resolver<Maybe<User>, ParentType, Context, QueryuserArgs>;
  currentUser?: Resolver<Maybe<CurrentUserInformation>, ParentType, Context>;
  findUser?: Resolver<
    Array<Maybe<User>>,
    ParentType,
    Context,
    QueryfindUserArgs
  >;
  quotas?: Resolver<Array<Maybe<Quota>>, ParentType, Context>;
  quota?: Resolver<Quota, ParentType, Context, QueryquotaArgs>;
  selectedItems?: Resolver<
    Array<Scalars["ID"]>,
    ParentType,
    Context,
    QueryselectedItemsArgs
  >;
  vmSelectedReadyFor?: Resolver<VMSelectedIDLists, ParentType, Context>;
};

export type QuotaResolvers<Context = any, ParentType = Quota> = {
  memory?: Resolver<Maybe<Scalars["Float"]>, ParentType, Context>;
  vdiSize?: Resolver<Maybe<Scalars["Float"]>, ParentType, Context>;
  vcpuCount?: Resolver<Maybe<Scalars["Int"]>, ParentType, Context>;
  vmCount?: Resolver<Maybe<Scalars["Int"]>, ParentType, Context>;
  user?: Resolver<User, ParentType, Context>;
};

export type QuotaMutationResolvers<
  Context = any,
  ParentType = QuotaMutation
> = {
  success?: Resolver<Scalars["Boolean"], ParentType, Context>;
};

export type SoftwareVersionResolvers<
  Context = any,
  ParentType = SoftwareVersion
> = {
  buildNumber?: Resolver<Scalars["String"], ParentType, Context>;
  date?: Resolver<Scalars["String"], ParentType, Context>;
  hostname?: Resolver<Scalars["String"], ParentType, Context>;
  linux?: Resolver<Scalars["String"], ParentType, Context>;
  networkBackend?: Resolver<Scalars["String"], ParentType, Context>;
  platformName?: Resolver<Scalars["String"], ParentType, Context>;
  platformVersion?: Resolver<Scalars["String"], ParentType, Context>;
  platformVersionText?: Resolver<Scalars["String"], ParentType, Context>;
  platformVersionTextShort?: Resolver<Scalars["String"], ParentType, Context>;
  xapi?: Resolver<Scalars["String"], ParentType, Context>;
  xen?: Resolver<Scalars["String"], ParentType, Context>;
  productBrand?: Resolver<Scalars["String"], ParentType, Context>;
  productVersion?: Resolver<Scalars["String"], ParentType, Context>;
  productVersionText?: Resolver<Scalars["String"], ParentType, Context>;
};

export type SRAccessSetResolvers<Context = any, ParentType = SRAccessSet> = {
  success?: Resolver<Scalars["Boolean"], ParentType, Context>;
};

export type SRDestroyMutationResolvers<
  Context = any,
  ParentType = SRDestroyMutation
> = {
  taskId?: Resolver<Maybe<Scalars["ID"]>, ParentType, Context>;
  granted?: Resolver<Scalars["Boolean"], ParentType, Context>;
  reason?: Resolver<Maybe<Scalars["String"]>, ParentType, Context>;
};

export type SRMutationResolvers<Context = any, ParentType = SRMutation> = {
  granted?: Resolver<Scalars["Boolean"], ParentType, Context>;
  reason?: Resolver<Maybe<Scalars["String"]>, ParentType, Context>;
};

export type SubscriptionResolvers<Context = any, ParentType = Subscription> = {
  vms?: SubscriptionResolver<
    GVMsSubscription,
    ParentType,
    Context,
    SubscriptionvmsArgs
  >;
  vm?: SubscriptionResolver<
    Maybe<GVM>,
    ParentType,
    Context,
    SubscriptionvmArgs
  >;
  templates?: SubscriptionResolver<
    GTemplatesSubscription,
    ParentType,
    Context,
    SubscriptiontemplatesArgs
  >;
  template?: SubscriptionResolver<
    Maybe<GTemplate>,
    ParentType,
    Context,
    SubscriptiontemplateArgs
  >;
  hosts?: SubscriptionResolver<
    GHostsSubscription,
    ParentType,
    Context,
    SubscriptionhostsArgs
  >;
  host?: SubscriptionResolver<
    Maybe<GHost>,
    ParentType,
    Context,
    SubscriptionhostArgs
  >;
  pools?: SubscriptionResolver<
    GPoolsSubscription,
    ParentType,
    Context,
    SubscriptionpoolsArgs
  >;
  pool?: SubscriptionResolver<
    Maybe<GPool>,
    ParentType,
    Context,
    SubscriptionpoolArgs
  >;
  networks?: SubscriptionResolver<
    GNetworksSubscription,
    ParentType,
    Context,
    SubscriptionnetworksArgs
  >;
  network?: SubscriptionResolver<
    Maybe<GNetwork>,
    ParentType,
    Context,
    SubscriptionnetworkArgs
  >;
  srs?: SubscriptionResolver<
    GSRsSubscription,
    ParentType,
    Context,
    SubscriptionsrsArgs
  >;
  sr?: SubscriptionResolver<
    Maybe<GSR>,
    ParentType,
    Context,
    SubscriptionsrArgs
  >;
  vdis?: SubscriptionResolver<
    GVDIsSubscription,
    ParentType,
    Context,
    SubscriptionvdisArgs
  >;
  vdi?: SubscriptionResolver<
    Maybe<GVDI>,
    ParentType,
    Context,
    SubscriptionvdiArgs
  >;
  tasks?: SubscriptionResolver<
    GTasksSubscription,
    ParentType,
    Context,
    SubscriptiontasksArgs
  >;
  task?: SubscriptionResolver<
    Maybe<GTask>,
    ParentType,
    Context,
    SubscriptiontaskArgs
  >;
};

export type TaskRemoveMutationResolvers<
  Context = any,
  ParentType = TaskRemoveMutation
> = {
  taskId?: Resolver<Maybe<Scalars["ID"]>, ParentType, Context>;
  granted?: Resolver<Scalars["Boolean"], ParentType, Context>;
  reason?: Resolver<Maybe<Scalars["String"]>, ParentType, Context>;
};

export type TemplateAccessSetResolvers<
  Context = any,
  ParentType = TemplateAccessSet
> = {
  success?: Resolver<Scalars["Boolean"], ParentType, Context>;
};

export type TemplateCloneMutationResolvers<
  Context = any,
  ParentType = TemplateCloneMutation
> = {
  taskId?: Resolver<Maybe<Scalars["ID"]>, ParentType, Context>;
  granted?: Resolver<Scalars["Boolean"], ParentType, Context>;
  reason?: Resolver<Maybe<Scalars["String"]>, ParentType, Context>;
};

export type TemplateDestroyMutationResolvers<
  Context = any,
  ParentType = TemplateDestroyMutation
> = {
  taskId?: Resolver<Maybe<Scalars["ID"]>, ParentType, Context>;
  granted?: Resolver<Scalars["Boolean"], ParentType, Context>;
  reason?: Resolver<Maybe<Scalars["String"]>, ParentType, Context>;
};

export type TemplateMutationResolvers<
  Context = any,
  ParentType = TemplateMutation
> = {
  granted?: Resolver<Scalars["Boolean"], ParentType, Context>;
  reason?: Resolver<Maybe<Scalars["String"]>, ParentType, Context>;
};

export type UserResolvers<Context = any, ParentType = User> = {
  id?: Resolver<Scalars["ID"], ParentType, Context>;
  name?: Resolver<Scalars["String"], ParentType, Context>;
  username?: Resolver<Scalars["String"], ParentType, Context>;
};

export type VDIAccessSetResolvers<Context = any, ParentType = VDIAccessSet> = {
  success?: Resolver<Scalars["Boolean"], ParentType, Context>;
};

export type VDIDestroyMutationResolvers<
  Context = any,
  ParentType = VDIDestroyMutation
> = {
  taskId?: Resolver<Maybe<Scalars["ID"]>, ParentType, Context>;
  granted?: Resolver<Scalars["Boolean"], ParentType, Context>;
  reason?: Resolver<Maybe<Scalars["String"]>, ParentType, Context>;
};

export type VDIMutationResolvers<Context = any, ParentType = VDIMutation> = {
  granted?: Resolver<Scalars["Boolean"], ParentType, Context>;
  reason?: Resolver<Maybe<Scalars["String"]>, ParentType, Context>;
};

export type VMAccessSetResolvers<Context = any, ParentType = VMAccessSet> = {
  success?: Resolver<Scalars["Boolean"], ParentType, Context>;
};

export type VMDestroyMutationResolvers<
  Context = any,
  ParentType = VMDestroyMutation
> = {
  taskId?: Resolver<Maybe<Scalars["ID"]>, ParentType, Context>;
  granted?: Resolver<Scalars["Boolean"], ParentType, Context>;
  reason?: Resolver<Maybe<Scalars["String"]>, ParentType, Context>;
};

export type VMMutationResolvers<Context = any, ParentType = VMMutation> = {
  granted?: Resolver<Scalars["Boolean"], ParentType, Context>;
  reason?: Resolver<Maybe<Scalars["String"]>, ParentType, Context>;
};

export type VMPauseMutationResolvers<
  Context = any,
  ParentType = VMPauseMutation
> = {
  taskId?: Resolver<Maybe<Scalars["ID"]>, ParentType, Context>;
  granted?: Resolver<Scalars["Boolean"], ParentType, Context>;
  reason?: Resolver<Maybe<Scalars["String"]>, ParentType, Context>;
};

export type VMRebootMutationResolvers<
  Context = any,
  ParentType = VMRebootMutation
> = {
  taskId?: Resolver<Maybe<Scalars["ID"]>, ParentType, Context>;
  granted?: Resolver<Scalars["Boolean"], ParentType, Context>;
};

export type VMSelectedIDListsResolvers<
  Context = any,
  ParentType = VMSelectedIDLists
> = {
  start?: Resolver<Maybe<Array<Maybe<Scalars["ID"]>>>, ParentType, Context>;
  stop?: Resolver<Maybe<Array<Maybe<Scalars["ID"]>>>, ParentType, Context>;
  trash?: Resolver<Maybe<Array<Maybe<Scalars["ID"]>>>, ParentType, Context>;
};

export type VMShutdownMutationResolvers<
  Context = any,
  ParentType = VMShutdownMutation
> = {
  taskId?: Resolver<Maybe<Scalars["ID"]>, ParentType, Context>;
  granted?: Resolver<Scalars["Boolean"], ParentType, Context>;
};

export type VMStartMutationResolvers<
  Context = any,
  ParentType = VMStartMutation
> = {
  taskId?: Resolver<Maybe<Scalars["ID"]>, ParentType, Context>;
  granted?: Resolver<Scalars["Boolean"], ParentType, Context>;
  reason?: Resolver<Maybe<Scalars["String"]>, ParentType, Context>;
};

export type VMSuspendMutationResolvers<
  Context = any,
  ParentType = VMSuspendMutation
> = {
  taskId?: Resolver<Maybe<Scalars["ID"]>, ParentType, Context>;
  granted?: Resolver<Scalars["Boolean"], ParentType, Context>;
  reason?: Resolver<Maybe<Scalars["String"]>, ParentType, Context>;
};

export type Resolvers<Context = any> = {
  AttachNetworkMutation?: AttachNetworkMutationResolvers<Context>;
  AttachVDIMutation?: AttachVDIMutationResolvers<Context>;
  CpuInfo?: CpuInfoResolvers<Context>;
  CreateVM?: CreateVMResolvers<Context>;
  CurrentUserInformation?: CurrentUserInformationResolvers<Context>;
  DateTime?: GraphQLScalarType;
  Deleted?: DeletedResolvers<Context>;
  GAbstractVM?: GAbstractVMResolvers;
  GAccessEntry?: GAccessEntryResolvers;
  GAclXenObject?: GAclXenObjectResolvers;
  GHost?: GHostResolvers<Context>;
  GHostOrDeleted?: GHostOrDeletedResolvers;
  GHostsSubscription?: GHostsSubscriptionResolvers<Context>;
  GNetwork?: GNetworkResolvers<Context>;
  GNetworkAccessEntry?: GNetworkAccessEntryResolvers<Context>;
  GNetworkOrDeleted?: GNetworkOrDeletedResolvers;
  GNetworksSubscription?: GNetworksSubscriptionResolvers<Context>;
  GPBD?: GPBDResolvers<Context>;
  GPlaybook?: GPlaybookResolvers<Context>;
  GPool?: GPoolResolvers<Context>;
  GPoolAccessEntry?: GPoolAccessEntryResolvers<Context>;
  GPoolOrDeleted?: GPoolOrDeletedResolvers;
  GPoolsSubscription?: GPoolsSubscriptionResolvers<Context>;
  GQuotaObject?: GQuotaObjectResolvers;
  GSR?: GSRResolvers<Context>;
  GSRAccessEntry?: GSRAccessEntryResolvers<Context>;
  GSROrDeleted?: GSROrDeletedResolvers;
  GSRsSubscription?: GSRsSubscriptionResolvers<Context>;
  GTask?: GTaskResolvers<Context>;
  GTaskAccessEntry?: GTaskAccessEntryResolvers<Context>;
  GTaskOrDeleted?: GTaskOrDeletedResolvers;
  GTasksSubscription?: GTasksSubscriptionResolvers<Context>;
  GTemplate?: GTemplateResolvers<Context>;
  GTemplateAccessEntry?: GTemplateAccessEntryResolvers<Context>;
  GTemplateOrDeleted?: GTemplateOrDeletedResolvers;
  GTemplatesSubscription?: GTemplatesSubscriptionResolvers<Context>;
  GVBD?: GVBDResolvers<Context>;
  GVDI?: GVDIResolvers<Context>;
  GVDIAccessEntry?: GVDIAccessEntryResolvers<Context>;
  GVDIOrDeleted?: GVDIOrDeletedResolvers;
  GVDIsSubscription?: GVDIsSubscriptionResolvers<Context>;
  GVIF?: GVIFResolvers<Context>;
  GVM?: GVMResolvers<Context>;
  GVMAccessEntry?: GVMAccessEntryResolvers<Context>;
  GVMOrDeleted?: GVMOrDeletedResolvers;
  GVMsSubscription?: GVMsSubscriptionResolvers<Context>;
  GXenObject?: GXenObjectResolvers;
  InstallOSOptions?: InstallOSOptionsResolvers<Context>;
  JSONString?: GraphQLScalarType;
  Mutation?: MutationResolvers<Context>;
  NetAccessSet?: NetAccessSetResolvers<Context>;
  NetworkMutation?: NetworkMutationResolvers<Context>;
  OSVersion?: OSVersionResolvers<Context>;
  Platform?: PlatformResolvers<Context>;
  PlaybookLaunchMutation?: PlaybookLaunchMutationResolvers<Context>;
  PlaybookRequirements?: PlaybookRequirementsResolvers<Context>;
  PoolAccessSet?: PoolAccessSetResolvers<Context>;
  PoolMutation?: PoolMutationResolvers<Context>;
  PvDriversVersion?: PvDriversVersionResolvers<Context>;
  Query?: QueryResolvers<Context>;
  Quota?: QuotaResolvers<Context>;
  QuotaMutation?: QuotaMutationResolvers<Context>;
  SoftwareVersion?: SoftwareVersionResolvers<Context>;
  SRAccessSet?: SRAccessSetResolvers<Context>;
  SRDestroyMutation?: SRDestroyMutationResolvers<Context>;
  SRMutation?: SRMutationResolvers<Context>;
  Subscription?: SubscriptionResolvers<Context>;
  TaskRemoveMutation?: TaskRemoveMutationResolvers<Context>;
  TemplateAccessSet?: TemplateAccessSetResolvers<Context>;
  TemplateCloneMutation?: TemplateCloneMutationResolvers<Context>;
  TemplateDestroyMutation?: TemplateDestroyMutationResolvers<Context>;
  TemplateMutation?: TemplateMutationResolvers<Context>;
  User?: UserResolvers<Context>;
  VDIAccessSet?: VDIAccessSetResolvers<Context>;
  VDIDestroyMutation?: VDIDestroyMutationResolvers<Context>;
  VDIMutation?: VDIMutationResolvers<Context>;
  VMAccessSet?: VMAccessSetResolvers<Context>;
  VMDestroyMutation?: VMDestroyMutationResolvers<Context>;
  VMMutation?: VMMutationResolvers<Context>;
  VMPauseMutation?: VMPauseMutationResolvers<Context>;
  VMRebootMutation?: VMRebootMutationResolvers<Context>;
  VMSelectedIDLists?: VMSelectedIDListsResolvers<Context>;
  VMShutdownMutation?: VMShutdownMutationResolvers<Context>;
  VMStartMutation?: VMStartMutationResolvers<Context>;
  VMSuspendMutation?: VMSuspendMutationResolvers<Context>;
};

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<Context = any> = Resolvers<Context>;

import gql from "graphql-tag";
import * as ReactApolloHooks from "./hooks/apollo";
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
    SR {
      isToolsSr
      PBDs {
        currentlyAttached
      }
    }
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
  }
  ${ACLXenObjectFragmentFragmentDoc}
  ${VMSettingsFragmentFragmentDoc}
  ${VMVIFFragmentFragmentDoc}
  ${VMVBDFragmentFragmentDoc}
  ${VMAccessFragmentFragmentDoc}
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
    vdis(onlyIsos: true) {
      ...ISOCreateVMListFragment
    }
  }
  ${ISOCreateVMListFragmentFragmentDoc}
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
export const RebootVmDocument = gql`
  mutation RebootVm($ref: ID!, $force: ShutdownForce) {
    vmReboot(ref: $ref, force: $force) {
      taskId
    }
  }
`;

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
export const ShutdownVMDocument = gql`
  mutation ShutdownVM($ref: ID!, $force: ShutdownForce) {
    vmShutdown(ref: $ref, force: $force) {
      taskId
    }
  }
`;

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

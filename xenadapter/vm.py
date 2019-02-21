from typing import Sequence, Optional, List, Dict

import graphene
from graphene.types.resolver import dict_resolver
from rethinkdb.errors import ReqlTimeoutError, ReqlDriverError


from handlers.graphql.resolvers.interface import resolve_interfaces
from handlers.graphql.types.blockdevice import BlockDevice

from handlers.graphql.types.interface import Interface
from handlers.graphql.types.vm import resolve_disks
from xenadapter import XenAdapterPool
from xenadapter.xenobject import GAclXenObject
from handlers.graphql.types.gxenobjecttype import GXenObjectType
from xenadapter.abstractvm import AbstractVM
from xenadapter.helpers import use_logger
import XenAPI
import provision
from xenadapter.xenobjectdict import XenObjectDict
from dataclasses import dataclass
from xenadapter.xenobject import XenObject

from .osdetect import OSChooser
from exc import *
from enum import auto
from enum import Flag

class Access(Flag):
    pass


@dataclass
class SetDisksEntry:
    '''
    New disk entry
    '''

    SR : XenObject # Storage repository
    size: int # disk size in megabytes


class XenEnum(graphene.Enum):
    def __str__(self):
        return self.name

class VBDMode(XenEnum):
    RO = auto()
    RW = auto()

    def __repr__(self):
        if self.name == 'RO':
            return 'Read-only device'
        elif self.name == 'RW':
            return 'Read-write device'

class VBDType(XenEnum):
    CD = auto()
    Disk = auto()
    Floppy = auto()

    def __repr__(self):
        if self.name == 'CD':
            return 'Optical disc device'
        elif self.name == 'Disk':
            return 'Hard disk device'
        elif self.name == 'Floppy':
            return 'Floppy device'


class PvDriversVersion(graphene.ObjectType):
    '''
    Drivers version. We don't want any fancy resolver except for the thing that we know that it's a dict in VM document
    '''
    class Meta:
        default_resolver = dict_resolver
    major = graphene.Int()
    minor = graphene.Int()
    micro = graphene.Int()
    build = graphene.Int()


class OSVersion(graphene.ObjectType):
    '''
    OS version reported by Xen tools
    '''
    class Meta:
        default_resolver = dict_resolver
    name = graphene.String()
    uname = graphene.String()
    distro = graphene.String()
    major = graphene.Int()
    minor = graphene.Int()


class PowerState(graphene.Enum):
    Halted = 'Halted'
    Paused = 'Paused'
    Running = 'Running'
    Suspended = 'Suspended'

class DomainType(graphene.Enum):
    HVM = 'hvm'
    PV = 'pv'
    PV_in_PVH = 'pv_in_pvh'

class GVM(GXenObjectType):
    class Meta:
        interfaces = (GAclXenObject,)

    # calculated field
    interfaces = graphene.Field(graphene.List(Interface), description="Network adapters connected to a VM", resolver=resolve_interfaces)
    # from http://xapi-project.github.io/xen-api/classes/vm_guest_metrics.html
    PV_drivers_up_to_date = graphene.Field(graphene.Boolean, description="True if PV drivers are up to date, reported if Guest Additions are installed")
    PV_drivers_version = graphene.Field(PvDriversVersion,description="PV drivers version, if available")
    disks = graphene.Field(graphene.List(BlockDevice), resolver=resolve_disks)

    VCPUs_at_startup = graphene.Field(graphene.Int, required=True)
    VCPUs_max = graphene.Field(graphene.Int, required=True)
    domain_type = graphene.Field(DomainType, required=True)
    guest_metrics = graphene.Field(graphene.ID, required=True)
    install_time = graphene.Field(graphene.DateTime, required=True)
    memory_actual = graphene.Field(graphene.Int, required=True)
    memory_static_min = graphene.Field(graphene.Int, required=True)
    memory_static_max = graphene.Field(graphene.Int, required=True)
    memory_dynamic_min = graphene.Field(graphene.Int, required=True)
    memory_dynamic_max = graphene.Field(graphene.Int, required=True)
    metrics = graphene.Field(graphene.ID, required=True)
    os_version = graphene.Field(OSVersion)
    power_state = graphene.Field(PowerState, required=True)
    start_time = graphene.Field(graphene.DateTime, required=True)


class VM (AbstractVM):
    EVENT_CLASSES = ['vm', 'vm_metrics', 'vm_guest_metrics']
    db_table_name = 'vms'
    GraphQLType = GVM
    def __init__(self, auth, uuid=None, ref=None):
        super().__init__(auth, uuid, ref)


    @classmethod
    def process_event(cls,  auth, event, db, authenticator_name):

        from rethinkdb_tools.helper import CHECK_ER
        # patch event[snapshot] so that if it doesn't have domain_type, guess it from HVM_boot_policy
        try:
            if 'domain_type' not in event['snapshot']:
                event['snapshot']['domain_type'] = 'hvm' if 'HVM_boot_policy' in event['snapshot'] and event['snapshot']['HVM_boot_policy'] else 'pv'
        except:
            pass

        if event['class'] == 'vm':
            super(cls, VM).process_event(auth, event, db, authenticator_name)
        else:
            if event['operation'] == 'del':
                return # Metrics removed when VM has already been removed
            if event['class'] == 'vm_metrics':


                new_rec = cls.process_metrics_record(auth, event['snapshot'])
                # get VM by metrics ref
                metrics_query = db.table(cls.db_table_name).get_all(event['ref'], index='metrics')
                rec_len = len(metrics_query.run().items)
                if rec_len == 0:
                    #auth.xen.log.warning("VM: Cannot find a VM for metrics {0}".format(event['ref']))
                    return
                elif rec_len > 1:
                    auth.xen.log.warning("VM::process_event: More than one ({1}) VM for metrics {0}: DB broken?".format(event['ref'], rec_len))
                    return


                CHECK_ER(metrics_query.update(new_rec).run())
            elif event['class'] == 'vm_guest_metrics':

                new_rec = cls.process_guest_record(auth, event['snapshot'])
                guest_metics_query = db.table(VM.db_table_name).get_all(event['ref'], index='guest_metrics')
                rec_len = len(guest_metics_query.run().items)
                if rec_len != 1:
                    # TODO Snapshots
                    auth.xen.log.warning(
                        f"VMGuest::process_event: Cannot find a VM (or theres more than one)"
                        f" for guest metrics {event['ref']}")

                    return

                CHECK_ER(guest_metics_query.update(new_rec).run())

    @classmethod
    def filter_record(cls, record):
        return not (record['is_a_template'] or record['is_control_domain'])


    @classmethod
    def create_db(cls, db, indexes=None): #ignore indexes
        super(VM, cls).create_db(db, indexes=['metrics', 'guest_metrics'])

    @classmethod
    def process_record(cls, auth, ref, record):
        '''
        Creates a (shortened) dict record from long XenServer record. If no record could be created, return false
        :param record:
        :return: record for DB
        interfaces are filled in network.py

        '''
        new_rec = super().process_record(auth, ref, record)
        new_rec['interfaces'] = {}
        new_rec['disks'] = {}
        return new_rec

    @classmethod
    def process_metrics_record(cls, auth, record):
        '''
        Process a record from VM_metrics. Used by init_db and process_event when
        processing a vm_metrics event
        :param auth:
        :param record:
        :return: record for DB
        '''
        # NB: ensure that keys and process_record.keys have no intersection
        keys = ['start_time', 'install_time', 'memory_actual']
        return XenObjectDict({k: v for k, v in record.items() if k in keys})

    @classmethod
    def process_guest_record(cls, auth, record):
        new_rec = {'os_version': record['os_version'], 'interfaces': {},
                   'PV_drivers_version': record['PV_drivers_version'],
                   'PV_drivers_up_to_date': record['PV_drivers_up_to_date']}

        for k, v in record['networks'].items():
            try:
                net_name, key, *rest = k.split('/')
                new_rec['interfaces'][net_name] = {**new_rec['interfaces'][net_name], **{key: v}} if net_name in \
                                                                                                     new_rec[
                                                                                                         'interfaces'] else {
                    key: v}
            except ValueError:
                auth.xen.log.warning(f"Can't get network information for VM {record['VM']}: {k}:{v}")

        return new_rec

    @classmethod
    def get_access_data(cls, record, authenticator_name) -> List[Dict]:
        '''
        Obtain access data from XenStore
        :param record:
        :param authenticator_name:
        :return:
        '''
        xenstore = record['xenstore_data']
        def read_xenstore_access_rights(xenstore_data):
            filtered_iterator = filter(
                lambda keyvalue: keyvalue[1] and keyvalue[0].startswith(cls.VMEMPEROR_ACCESS_PREFIX),
                xenstore_data.items())

            for k, v in filtered_iterator:
                key_components = k[len(cls.VMEMPEROR_ACCESS_PREFIX) + 1:].split('/')
                if key_components[0] == authenticator_name:
                    yield {'userid': f'{key_components[1]}/{key_components[2]}', 'access': v.split(';')}

            else:
                if cls.ALLOW_EMPTY_XENSTORE:
                    yield {'userid': 'any', 'access': ['all']}

        return list(read_xenstore_access_rights(xenstore))


    def manage_actions(self, action,  revoke=False, user=None, group=None):
        '''
        Changes ACL for VM (in XenStore)
        :param action:
        :param revoke:
        :param user: User ID as returned from authenticator.get_id()
        :param group:
        :param force: Change actionlist even if user do not have sufficient permissions. Used by CreateVM
        :return: False if failed
        '''

        if all((user, group)) or not any((user, group)):
            raise XenAdapterArgumentError(self.log, 'Specify user or group for XenObject::manage_actions')


        if user:
            real_name = self.get_access_path(user, False)
        elif group:
            real_name = self.get_access_path(group, True)

        xenstore_data = self.get_xenstore_data()
        if real_name in xenstore_data:
            actionlist = xenstore_data[real_name].split(';')
        else:
            actionlist = []

        if revoke and action == 'all':
            for name in xenstore_data:
                if name == real_name:
                    continue

                actionlist = xenstore_data[real_name].split(';')
                if 'all' in actionlist:
                    break
            else:
                raise XenAdapterArgumentError('I cannot revoke "all" from {0} because there are no other admins of the resource'.format(real_name))


        if revoke:
            if action in actionlist:
                actionlist.remove(action)
        else:
            if action not in actionlist:
                actionlist.append(action)

        actions = ';'.join(actionlist)

        xenstore_data[real_name] = actions

        self.set_xenstore_data(xenstore_data)


    @use_logger
    def create(self, insert_log_entry, provision_config : Sequence[SetDisksEntry], net, ram_size, template=None, ip=None, install_url=None, override_pv_args=None, iso=None,
               username=None, password=None, hostname=None, partition=None, fullname=None, vcpus=1, return_xenadapter_to_query=True):
        '''
        Creates a virtual machine and installs an OS

        :param insert_log_entry: A function of signature (uuid : str, state : str, message : str) -> None to insert log entries into task status
        :param provision_config: For help see self.set_disks
        :param net: Network object
        :param ram_size: RAM size in megabytes
        :param hostname: Host name
        :param template: Template object from which this VM was cloned
        :param ip: IP configuration as in AutoInstall object. Default: auto configuration
        :param install_url: URL to install OS from
        :scenario_url: preseed/kickstart file url. It's Preseed for debian-based systems, Kickstart for RedHat. If os_kind is ubuntu and scenario_url is kickstart, provide a tuple (url, 'ks')
        :param mode: 'pv' or 'hvm'. Refer to http://xapi-project.github.io/xen-api/vm-lifecycle
        :param name_label: Name for created VM
        :param start: if True, start VM immediately
        :param override_pv_args: if specified, overrides all pv_args for Linux kernel
        :param iso: ISO Image object. If specified, will be mounted

        '''
        self.insert_log_entry = lambda *args, **kwargs: insert_log_entry(self.uuid, *args, **kwargs)
        self.install = True
        self.remove_tags('vmemperor')
        if not self.auth.is_admin():
            self.manage_actions('all',  user=self.auth.get_id())
        self.set_ram_size(ram_size)
        self.set_VCPUs_max(vcpus)
        self.set_VCPUs_at_startup(vcpus)
        self.set_disks(provision_config)

        if iso:
            try:
                iso.attach(self, sync=True)
            except XenAdapterAPIError as e:
                self.insert_log_entry(self=self, state="failed-iso", message=e.message)
                raise e

        device = self.install_guest_tools()

        if net:
            try:
                net.attach(self, sync=True)
            except XenAdapterAPIError as e:
                self.insert_log_entry(self=self, state="failed-network", message=e.message)
                raise e
            else:
                self.log.debug(f"Plugged in network: {net}")

        else:
            if template.get_os_kind():
                self.xen.log.warning(f"os_kind specified as {template.get_os_kind()}, but no network specified. The OS won't install automatically")


        if template.get_os_kind():
            self.os_detect(template.get_os_kind(), device, ip, hostname, install_url, override_pv_args, fullname, username, password, partition)
            self.log.debug(f"OS successfully detected, proceeding with auto installation mode")


        self.insert_log_entry('installing', f'The OS is installing')
        try:
            self.start(False, True)
        except Exception as e:
            try:
                raise e
            except XenAPI.Failure as f:
                self.insert_log_entry('failed', f'Failed to start OS installation:  {f.details}')
                raise XenAdapterAPIError(self.log, 'Failed to start OS installation', f.details)

        # Wait for installation to finish

        from constants import need_exit

        state = self.db.table(VM.db_table_name).get(self.uuid).pluck('power_state').run()['power_state']
        if state != 'Running':
            self.insert_log_entry('failed',
                                  f"failed to start VM for installation (low resources?). State: {state}")
            return

        cur = self.db.table('vms').get(self.uuid).changes().run()
        other_config = self.get_other_config()

        self.log.debug(f"Waiting for {self} to finish installing")
        if 'convert-to-hvm' in other_config and other_config['convert-to-hvm']:
            self.log.debug(f"Changing {self} type to HVM after reboot")
        else:
            if return_xenadapter_to_query:
                XenAdapterPool().unget(self.auth.xen)


        while True:
            try:
                change = cur.next(wait=1)
            except ReqlTimeoutError:
                if need_exit.is_set():
                    return
                else:
                    continue
            except ReqlDriverError as e:
                self.log.error(
                    f"ReQL error while trying to retrieve VM '{self.uuid}': install status: {e}")
                return

            if change['new_val']['power_state'] == 'Halted':
                try:
                    self.log.debug(f"Halted: finalizing installation of {self}")
                    if 'convert-to-hvm' in other_config and other_config['convert-to-hvm']:
                        self.set_domain_type('hvm')
                        if return_xenadapter_to_query:
                            XenAdapterPool().unget(self.auth.xen)


                    self.start_stop_vm(True)
                    self.insert_log_entry(self.uuid, "installed", "OS successfully installed")
                except XenAdapterAPIError as e:
                    self.insert_log_entry(self.uuid, "failed-after-install", e.message)
                finally:
                    break

        del self.install



    @use_logger
    def set_ram_size(self,  mbs):
        try:
            bs = str(1048576 * int(mbs))
            #vm_ref = self.api.VM.get_by_uuid(vm_uuid)
            static_min = self.get_memory_static_min()
#            if bs <= static_min:
#                self.set_memory_static_min(bs)
            self.set_memory_limits(bs, bs, bs, bs)
        except Exception as e:
            #self.destroy_vm(vm_uuid, force=True)
            try:
                raise e
            except XenAPI.Failure as f:
                self.insert_log_entry(state='failed-ram',message= f.details)
                raise XenAdapterAPIError(self.log, f"Failed to set ram size: {mbs} Mb", f.details)




    @use_logger
    def set_disks(self, provision_config : Sequence[SetDisksEntry]):
        '''
        Generates a provision XML, does provision, sets appropriate access rights to current user
        :param provision_config:
        :return:
        '''
        from xenadapter.vbd import VBD
        from xenadapter.disk import VDIorISO
        from xenadapter.disk import VDI
        i = 0
        specs = provision.ProvisionSpec()
        for entry in provision_config:
            size = str(1048576 * int(entry.size))
            specs.disks.append(provision.Disk(f'{i}', size, entry.SR.uuid, True))
            i += 1
        try:
            provision.setProvisionSpec(self.auth.xen.session, self.ref, specs)
        except Exception as e:
            try:
                raise e
            except XenAPI.Failure as f:
                msg = f'Failed to assign provision specification: {f.details}'
                self.insert_log_entry(state='failed-provision-spec', message=f.details)
                raise XenAdapterAPIError(self.log, msg)
            finally:
                pass
                #self.destroy_vm(vm_uuid, force=True)
        else:
            self.log.debug(f"provision spec set {provision_config}")


        try:
            self.provision()
        except Exception as e:
            try:
                raise e
            except XenAPI.Failure as f:
                self.insert_log_entry(state='failed-provision', message=f.details)
                raise XenAdapterAPIError(self.log, f"Failed to provision: {f.details}")
            finally:
                pass
                #self.destroy_vm(vm_uuid, force=True)
        else:
            self.insert_log_entry(state='provisioned',message=str(specs))

            for item in self.get_VBDs():
                vbd = VBD(auth=self.auth, ref=item)
                vdi = VDIorISO(self.auth, ref=vbd.get_VDI())
                if isinstance(vdi, VDI):

                    vdi.set_name_description(f"Created by VMEmperor for VM {self.uuid}")
                    # After provision. manage disks actions
                    if not self.auth.is_admin():
                        vdi.manage_actions('all', user=self.auth.get_id())



    @use_logger
    def create_VBD(self, vdi : Optional[XenObject] = None, type : Optional[VBDType] = None, mode : Optional[VBDMode] = None, bootable : bool = True) -> XenObject:
        from xenadapter.vbd import VBD
        from xenadapter.disk import ISO
        userdevice_max = -1
        if vdi:
            vdi_vbds = vdi.get_VBDs()
            if not type:
                type = VBDType.CD if isinstance(vdi, ISO) else VBDType.Disk
            if not mode:
                mode = VBDMode.RO if isinstance(vdi, ISO) else VBDMode.RW
        else:
            vdi_vbds = []
            assert mode is not None
            assert mode is not None
        for vbd in self.get_VBDs():
            vbd_obj = VBD(auth=self.auth, ref=vbd)
            if vbd in vdi_vbds:

                self.log.warning(f"Disk {vdi.uuid} is already attached to VBD {vbd_obj.uuid}")
                return vbd_obj
            try:
                userdevice = int(vbd_obj.get_userdevice())
            except ValueError:
                userdevice = -1

            if userdevice_max < userdevice:
                userdevice_max = userdevice

        userdevice_max += 1


        args = {'VM': self.ref, 'VDI': vdi.ref if vdi else self.REF_NULL,
                'userdevice': str(userdevice_max),
                'bootable' : bootable, 'mode' : str(mode), 'type' : str(type), 'empty' : vdi is None,
                'other_config' : {},'qos_algorithm_type': '', 'qos_algorithm_params': {}}

        try:
            new_vbd = VBD.create(self.auth, args)
        except XenAPI.Failure as f:
            raise XenAdapterAPIError(self.auth.xen.log, "Failed to create VBD", f.details)

        return VBD(auth=self.auth, ref=new_vbd)

    @use_logger
    def os_detect(self, os_kind, guest_device, net_conf, hostname, install_url, override_pv_args, fullname, username, password, partition):
        '''
        call only during install
        :param guest_device: Guest CD device name as seen by guest
        :param os_kind:
        :param net_conf: NetworkConfiguration object
        :param hostname:
        :param scenario_url:
        :param override_pv_args:
        :return:
        '''

        if not hasattr(self, 'install'):
            raise RuntimeError("Not an installation process")
        other_config = self.get_other_config()
        os = OSChooser.get_os(os_kind, other_config)

        if os:
            if net_conf:
                os.set_network_parameters(**net_conf)

            os.set_hostname(hostname)

            os.set_install_url(install_url)

            self.set_other_config(os.other_config)
            os.fullname = fullname
            os.username = username
            os.password = password
            os.partition = partition
            os.device = guest_device

            if not override_pv_args:
                pv_args = os.pv_args()
            else:
                pv_args = override_pv_args
            self.set_PV_args(pv_args)

            self.log.debug(f"Set PV args: {pv_args}")
            self.log.debug(f"OS detected: {os}")


    @use_logger
    def install_guest_tools(self) -> str:
        '''
        Inserts Guest CD and returns Unix device name for this CD
        :return:
        '''
        from .disk import ISO
        from xenadapter.sr import SR
        for ref in SR.get_all(self.auth):
            sr = SR(ref=ref, auth=self.auth)
            if sr.get_is_tools_sr():
                for vdi_ref in sr.get_VDIs():
                    vdi = ISO(ref=vdi_ref, auth=self.auth)
                    if vdi.get_is_tools_iso():
                        vbd = vdi.attach(self, sync=True)
                        #get_device won't work here so we'll hack based on our vdi.attach implementation
                        device = chr(ord('a') + int(vbd.get_userdevice()))
                        self.log.debug(f"Installing guest tools: UNIX device /dev/{device}")
                        return f'xvd{device}'

    def set_memory(self, memory: int):
        try:
            self._set_memory(memory)
        except XenAPI.Failure as f:
            if f.details[0] == "MESSAGE_METHOD_UNKNOWN":
                self.set_memory_static_max(memory)
                self.set_memory_dynamic_max(memory)
                self.set_memory_dynamic_min(memory)
            else:
                raise f

    def set_domain_type(self,  type: str):
        """
        set vm domain type to 'pv', 'hvm' (or pv_in_pvh' starting from XenServer 7.5)
        :param type: pv/hvm
        :return:
        """
        try:
            self._set_domain_type(type)
        except XenAPI.Failure as f:
            if f.details[0] == "MESSAGE_METHOD_UNKNOWN":
                hvm_boot_policy = self.get_HVM_boot_policy()
                if hvm_boot_policy and type == 'pv':
                    self.set_HVM_boot_policy('')
                if hvm_boot_policy == '' and type == 'hvm':
                    self.set_HVM_boot_policy('BIOS order')
            else:
                raise f


    @use_logger
    def start_stop_vm(self, enable):

        """
        Starts and stops VM if required
        :param enable: True = start; False = stop
        :return:
        """
        try:
            task = None
            ps = self.get_power_state()
            if ps != 'Running' and enable:
                task = self.async_start(False, True)


            if ps == 'Running' and not enable:
                task = self.async_shutdown()

            return task

        except XenAPI.Failure as f:
            raise XenAdapterAPIError(self.log, "Failed to start/stop VM", f.details)

    @use_logger
    def get_vnc(self):
        self.start_stop_vm(True)
        consoles = self.get_consoles()  # references
        if (len(consoles) == 0):
            self.log.error('Failed to find console')
            return
        try:
            url = None
            for console in consoles:
                proto = self.xen.api.console.get_protocol(console)
                if proto == 'rfb':
                    url = self.xen.api.console.get_location(console)
                    break
            if not url:
                raise XenAdapterAPIError(self.log, "No RFB console, VM UUID in details", self.uuid)

            self.xen.log.info("Console location: {0}".format(url))
        except XenAPI.Failure as f:
            raise XenAdapterAPIError(self.log, "Failed to get console location",f.details)

        return url

    @use_logger
    def destroy_vm(self):
        from .disk import VDI
        from xenadapter.vbd import VBD

        self.start_stop_vm(False)

        vbds = self.get_VBDs()
        vdis = [VBD(self.auth, ref=vbd_ref).get_VDI() for vbd_ref in vbds]

        try:
            for vdi_ref in vdis:
                vdi = VDI(auth=self.auth, ref=vdi_ref)
                if len(vdi.get_VBDs()) < 2:
                    vdi.destroy()
            self.destroy()


        except XenAPI.Failure as f:
            raise XenAdapterAPIError(self.log, "Failed to destroy VM",f.details)

        return

from typing import Sequence, Mapping

from rethinkdb.errors import ReqlTimeoutError, ReqlDriverError
from sentry_sdk import capture_exception
import constants.re as re

from handlers.graphql.types.vm import SetDisksEntry, GVM
from handlers.graphql.types.base.vmbase import VMActions
from rethinkdb_tools.helper import CHECK_ER
from xenadapter import SR
from xenadapter.vif import VIF
from xenadapter.abstractvm import AbstractVM, set_VCPUs, set_memory
from xenadapter.helpers import use_logger
import XenAPI
import provision
from xenadapter.xenobject import set_subtype_from_input
from xenadapter.xenobjectdict import XenObjectDict

from xentools.os import OSChooser
from exc import *


class VM (AbstractVM):
    EVENT_CLASSES = ['vm', 'vm_metrics', 'vm_guest_metrics']
    db_table_name = 'vms'
    GraphQLType = GVM
    Actions = VMActions
    def __init__(self, xen, ref):
        super().__init__(xen, ref)


    @classmethod
    def process_event(cls,  xen, event):

        from rethinkdb_tools.helper import CHECK_ER
        # patch event[snapshot] so that if it doesn't have domain_type, guess it from HVM_boot_policy
        try:
            if 'domain_type' not in event['snapshot']:
                event['snapshot']['domain_type'] = 'hvm' if 'HVM_boot_policy' in event['snapshot'] and event['snapshot']['HVM_boot_policy'] else 'pv'
        except:
            pass

        if event['class'] == 'vm':
            super(cls, VM).process_event(xen, event)
        else:
            if event['operation'] == 'del':
                return # Metrics removed when VM has already been removed
            if event['class'] == 'vm_metrics':


                new_rec = cls.process_metrics_record(xen, event['snapshot'])
                # get VM by metrics ref
                metrics_query = re.db.table(cls.db_table_name).get_all(event['ref'], index='metrics')
                rec_len = len(metrics_query.run().items)
                if rec_len == 0:
                    #xen.log.warning("VM: Cannot find a VM for metrics {0}".format(event['ref']))
                    return
                elif rec_len > 1:
                    xen.log.warning("VM::process_event: More than one ({1}) VM for metrics {0}: DB broken?".format(event['ref'], rec_len))
                    return


                CHECK_ER(metrics_query.update(new_rec).run())
            elif event['class'] == 'vm_guest_metrics':


                guest_metics_query = re.db.table(VM.db_table_name).get_all(event['ref'], index='guest_metrics')
                items = guest_metics_query.pluck('ref').run().items
                if len(items) != 1:
                    # TODO Snapshots
                    xen.log.warning(
                        f"VMGuest::process_event: Cannot find a VM (or theres more than one : {len(items)})"
                        f" for guest metrics {event['ref']}")

                    return
                new_rec = cls.process_guest_record(xen, event['snapshot'], items[0]['ref'])
                CHECK_ER(guest_metics_query.update(new_rec).run())

    @classmethod
    def filter_record(cls, xen, record, ref):
        return not (record['is_a_template'] or record['is_control_domain'] or record['is_a_snapshot'])


    @classmethod
    def create_db(cls, indexes=None): #ignore indexes
        super(VM, cls).create_db(indexes=['metrics', 'guest_metrics'])


    @classmethod
    def process_metrics_record(cls, xen, record):
        '''
        Process a record from VM_metrics. Used by init_db and process_event when
        processing a vm_metrics event
        :param record:
        :return: record for DB
        '''
        # NB: ensure that keys and process_record.keys have no intersection
        keys = ['start_time', 'install_time', 'memory_actual']
        return XenObjectDict({k: v for k, v in record.items() if k in keys})

    @classmethod
    def process_guest_record(cls, xen, record, vm_ref):
        new_rec = {'os_version': record['os_version'],
                   'PV_drivers_version': record['PV_drivers_version'],
                   'PV_drivers_up_to_date': record['PV_drivers_up_to_date']}

        def vif_generator():
            for ref in VM(xen, vm_ref).get_VIFs():
                vif = VIF(xen, ref)
                yield (vif.get_device(), ref)

        vif_dict = {i[0]: i[1] for i in vif_generator()} # Key: device number, value: ref
        vif_data = {}  # key: ref, value: "ip", "ipv6", etc

        try:
            for k, v in record['networks'].items():
                net_name, key, *rest = k.split('/')
                vif_ref = vif_dict[net_name]
                if not vif_ref in vif_data:
                    vif_data[vif_ref] = {}

                vif_data[vif_ref][key] = v

            documents = [{'ref': key, **value} for key, value in vif_data.items()]
            CHECK_ER(re.db.table(VIF.db_table_name).insert(documents, conflict="update").run())
        except ValueError as e:
            xen.log.warning(f"Can't get network information for VM {vm_ref}")
            capture_exception(e)

        return new_rec


    @use_logger
    def create(self,  task : "CustomTask", provision_config : Sequence[SetDisksEntry], net, options : Mapping, template : "Template",  override_pv_args=None, iso=None, install_params=None):
        '''
        Creates a virtual machine and installs an OS
        :param task: a task which logs VM creation process
        :param provision_config: For help see self.set_disks
        :param net: Network object
        :param iso: ISO Image object. If specified, will be mounted
        :param options: VMInput-like object with platform options, memory settings & VCPU settings

        '''

        self.user = options.get('main_owner')
        self.task = task
        self.install = True
        self.remove_tags('vmemperor')
        self.manage_actions(self.Actions.ALL, user=self.user)
        self.set_main_owner(self.user)

        set_subtype_from_input("platform", return_diff=False)(options, self)
        set_VCPUs(options, self, return_diff=False)
        set_memory(options, self, return_diff=False)
        if 'name_label' in options:
            self.set_name_label(options['name_label'])
        if 'name_description' in options:
            self.set_name_description(options['name_description'])

        self.set_disks(provision_config)
        if iso:
            try:
                iso.attach(self, sync=True)
            except XenAdapterAPIError as e:
                capture_exception(e)
                task.set_status(progress=0.2, state='failure', error_info_add=f"Failed to attach {iso}: {e.message}")
                return
            else:
                task.set_status(progress=0.2)

        device = self.install_guest_tools()

        if net:
            try:
                net.attach(self, sync=True)
            except XenAdapterAPIError as e:
                capture_exception(e)
                task.set_status(progress=0.3, state='failure', error_info_add=f"Failed to attach {net}: {e.message}")
            else:
                task.set_status(progress=0.3)

        else:
            if template.get_distro():
                self.log.warning(f"os_kind specified as {template.get_distro()}, but no network specified. The OS won't install automatically")

        set_hvm_after_install = False
        if not iso:
            os = self.os_detect(device, install_params)
            if os:
                self.log.debug(f"OS successfully detected as {os.get_distro()}, proceeding with auto installation mode")
                if os.get_release() in os.HVM_RELEASES:
                    set_hvm_after_install = True
                    self.log.debug("fVM mode will automatically be switched to HVM after reboot")

        task.set_status(progress=0.4)

        try:
            self.start(False, True)
        except Exception as e:
            capture_exception(e)
            task.set_status(progress=0.5,status='failure', error_info_add=f'Failed to start VM: {str(e)}')
        else:
            task.set_status(progress=0.5)



        # Wait for installation to finish
        # remove PV_args
        self.set_PV_args("")

        from constants import need_exit

        state = self._get_power_state() # It's crucial to get that value not from cache but from VM itself.
        if state != 'Running':
            task.set_status('failure', error_info_add="Failed to start VM ")
            return

        cur = re.db.table(VM.db_table_name).get(self.ref).changes().run()
        self.log.debug(f"Waiting for {self} to finish installing")
        if set_hvm_after_install:
            self.set_domain_type("hvm")
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
                    f"ReQL error while trying to retrieve VM '{self.ref}': install status: {e}")
                return

            if change['new_val']['power_state'] == 'Halted':
                try:
                    task.set_status(status='success', progress=1)
                finally:
                    break

        del self.install


    @use_logger
    def set_disks(self, provision_config : Sequence[SetDisksEntry]):
        '''
        Generates a provision XML, does provision, sets appropriate access rights to current user
        :param provision_config:
        :return:
        '''
        if not hasattr(self, 'install'):
            raise AttributeError('self.install')
        from xenadapter.vbd import VBD
        from xenadapter.vdi import VDI
        i = 0
        specs = provision.ProvisionSpec()
        for entry in provision_config:
            size = str(int(entry.size))
            specs.disks.append(provision.Disk(f'{i}', size, entry.SR.get_uuid(), True))
            i += 1
        try:
            provision.setProvisionSpec(self.xen.session, self.ref, specs)
        except Exception as e:
            capture_exception(e)
            self.task.set_status(status='failure', error_info_add=f'Failed to assign provision specification: {str(e)}')
            return False
        else:
            self.log.debug(f"provision spec set {provision_config}")


        try:
            self.provision()
        except Exception as e:
            try:
                raise e
            except XenAPI.Failure as f:
                raise XenAdapterAPIError(self.log, f"Failed to provision: {f.details}")
            finally:
                pass
                #self.destroy_vm(vm_uuid, force=True)
        else:


            for item in self.get_VBDs():
                vbd = VBD(self.xen, ref=item)
                vdi = VDI(self.xen, ref=vbd.get_VDI())
                sr = SR(self.xen, ref=vdi.get_SR())
                if sr.get_content_type() != 'iso':

                    vdi.set_name_description(f"Created by VMEmperor for VM {self.ref} (UUID {self.get_uuid()})")
                    # After provision. manage disks actions
                    vdi.manage_actions(VDI.Actions.ALL, user=self.user)
                    vdi.set_main_owner(self.user)


    @use_logger
    def os_detect(self, guest_device, install_params):
        '''
        Detect auto installation OS and set VM's PV_args
        :param guest_device: Guest CD device name as seen by guest
        :param os_kind
        :param install_params: parameters for automatic installation
        :return an object with detected os
        '''

        assert install_params
        if not hasattr(self, 'install'):
            raise RuntimeError("Not an installation process")
        other_config = self.get_other_config()
        os = OSChooser.get_os(other_config)

        if os:
            if install_params.static_ip_config:
                os.set_network_parameters(**install_params.static_ip_config)

            os.hostname = install_params.hostname
            os.fullname = install_params.fullname
            os.username = install_params.username
            os.password = install_params.password
            os.partition = install_params.partition
            os.device = guest_device

            pv_args = os.get_pv_args()
            self.set_PV_args(pv_args)

            self.log.debug(f"Set PV args: {pv_args}")
            self.log.debug(f"OS detected: {os}")
        return os


    @use_logger
    def install_guest_tools(self) -> str:
        '''
        Inserts Guest CD and returns Unix device name for this CD
        :return:
        '''
        from .vdi import VDI
        from xenadapter.sr import SR
        for ref in SR.get_all(self.xen):
            sr = SR(ref=ref, xen=self.xen)
            if sr.get_is_tools_sr():
                for vdi_ref in sr.get_VDIs():
                    vdi = VDI(ref=vdi_ref, xen=self.xen)
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



import XenAPI
import hooks
import provision
from exc import XenAdapterAPIError, XenAdapterArgumentError, XenAdapterConnectionError

import logging
import sys
from loggable import Loggable


def xenadapter_root(method):
    def decorator(self, *args, **kwargs):
        if self.vmemperor_user is None:
            return method(self, *args, **kwargs)
        else:
            raise XenAdapterAPIError(self, "Attempt to call root-only method by user")


    return decorator




class XenAdapter(Loggable):
    AUTOINSTALL_PREFIX = '/autoinstall'

    def get_all_records(self, subject) -> dict :
        """
        return get_all_records call in a dict format without opaque object references
        :param subject: XenAPI subject (VM, VDI, etc)
        :return: dict in format : { uuid : dict of object fields }
        """
        return {item['uuid'] : item for item in subject.get_all_records().values()}

    def uuid_by_name(self, subject,  name) -> str:
        """
        Obtain uuid by human readable name
        :param subject: Xen API subject
        :param name: name_label
        :return: uuid (str) or empty string if no object with that name
        """
        try:
            return next((key for key, value in self.get_all_records(subject).items()
                     if value['name_label'] == name))
        except StopIteration:
            return ""







    def __init__(self, settings, vmemperor_user=None):
        """creates session connection to XenAPI. Connects using admin login/password from settings
        :param vmemperor_user: vmemperor 'virtual' user. In order to be root, leave it None(default)
    """
        self.vmemperor_user = vmemperor_user
        if 'debug' in settings:
                self.debug = bool(settings['debug'])
        self.init_log()



        try:
            url = settings['url']
            username = settings['username']
            password = settings['password']
        except KeyError as e:
            raise XenAdapterArgumentError(self, 'Failed to parse settings: {0}'.format(str(e)))

        try:
            self.session = XenAPI.Session(url)
            self.session.xenapi.login_with_password(username, password)
            self.log.info ('Authentication is successful')
            self.api = self.session.xenapi
        except OSError as e:
            raise XenAdapterConnectionError(self, "Unable to reach XenServer at {0}: {1}".format(url, str(e)))
        except XenAPI.Failure as e:
            raise XenAdapterConnectionError(self, 'Failed to login: url: "{1}"; username: "{2}"; password: "{3}"; error: {0}'.format(str(e), url, username, password))

        return

    @xenadapter_root
    def list_pools(self) -> dict:
        '''
        :return: dict of pool records
        '''
        return self.get_all_records(self.api.pool)

    @xenadapter_root
    def list_vms(self):
        '''
        :return: dict of vm records except dom0 and templates
        '''
        keys = ['power_state', 'name_label', 'uuid']
        #return {key : value for key, value in self.get_all_records(self.api.VM).items()
        #       if not value['is_a_template'] and not value['is_control_domain']}

        def process(value):
            vm_ref = self.api.VM.get_by_uuid(value['uuid'])
            new_rec = {k : v for k,v in value.items() if k in keys}
            new_rec['user'] = 'root'
            new_rec['network'] = []
            vifs = self.api.VM.get_VIFs(vm_ref)
            for vif in vifs:
                net_ref = self.api.VIF.get_network(vif)
                net_uuid = self.api.network.get_uuid(net_ref)
                new_rec['networks'].append(net_uuid)
            new_rec['disks'] = []
            vbds = self.api.VM.get_VBDs(vm_ref)
            for vbd in vbds:
                vdi_ref = self.api.VBD.get_VDI(vbd)
                vdi_uuid = self.api.VDI.get_uuid(vdi_ref)
                new_rec['disks'].append(vdi_uuid)
            return new_rec

        return [process(value) for value in self.get_all_records(self.api.VM).values()
                if not value['is_a_template'] and not value['is_control_domain']]

    @xenadapter_root
    def list_srs(self) -> dict:
        '''
        :return: dict of storage repositories' records
        '''
        return self.get_all_records(self.api.SR)


    @xenadapter_root
    def list_vdis(self) -> dict:
        '''
        :return: dict of virtual disk images' records
        '''
        return self.get_all_records(self.api.VDI)

    @xenadapter_root
    def list_networks(self) -> dict:
        '''
        dict of network interfaces' records
        :return:
        '''
        return self.get_all_records(self.api.network)

    @xenadapter_root
    def list_templates(self) -> dict:
        '''
        dict of VM templates' records
        :return:
        '''
        keys = ['hvm', 'name_label', 'uuid']
        def process(value):
            new_rec = {k: v for k, v in value.items() if k in keys}
            if value['HVM_boot_policy'] == '':
                new_rec['hvm'] = False
            else:
                new_rec['hvm'] = True
            return new_rec

        return {value['uuid'] : process(value) for value in self.get_all_records(self.api.VM).values()
                  if value['is_a_template']}


    class GenericOS:
        '''
        A class that generates kernel boot arguments string for various Linux distributions
        '''
        def __init__(self):
            self.dhcp = True

        def pv_args(self) -> str:
            '''
            Obtain pv_args - kernel parameters for paravirtualized VM
            :return:
            '''

        def hvm_args(self) -> str:
            '''
            Obtain hvm_args - whatever that might be
            :return:
            '''
        def set_scenario(self, url):
            raise NotImplementedError
        def set_kickstart(self, url):
            return 'ks={0}'.format(url)
        def set_preseed(self, url):
            return 'preseed/url={0}'.format(url)

        def set_hostname(self, hostname):
            self.hostname = hostname

        def set_network_parameters(self, ip=None, gw=None, netmask=None, dns1=None, dns2=None):
            if not ip:
               self.dhcp = True
            else:
                if not gw:
                    raise XenAdapterArgumentError(self,"Network configuration: IP has been specified, missing gateway")
                if not netmask:
                    raise XenAdapterArgumentError(self,"Network configuration: IP has been specified, missing netmask")

                ip_string = " ipv6.disable=true netcfg/disable_dhcp=true netcfg/disable_autoconfig=true netcfg/use_autoconfig=false  netcfg/confirm_static=true netcfg/get_ipaddress=%s netcfg/get_gateway=%s netcfg/get_netmask=%s netcfg/get_nameservers=%s netcfg/get_domain=vmemperor" % (ip, gw, netmask, dns1)



            self.ip = ip_string
            self.dhcp = False

    class UbuntuOS (GenericOS):
        '''
        OS-specific parameters for Ubuntu
        '''

        def set_scenario(self, url):
            self.scenario = self.set_preseed(url)

        def pv_args(self):
            if self.dhcp:
                self.ip = "netcfg/disable_dhcp=false"
            return "auto=true console=hvc0 debian-installer/locale=en_US console-setup/layoutcode=us console-setup/ask_detect=false interface=eth0 %s %s netcfg/get_hostname=%s" % (
                self.ip, self.scenario, self.hostname)

        def set_network_parameters(self, ip=None, gw=None, netmask=None, dns1=None, dns2=None):
            if not ip:
                self.dhcp = True
            else:
                if not gw:
                    raise XenAdapterArgumentError(self, "Network configuration: IP has been specified, missing gateway")
                if not netmask:
                    raise XenAdapterArgumentError(self, "Network configuration: IP has been specified, missing netmask")

                ip_string = " ipv6.disable=1 netcfg/disable_autoconfig=true netcfg/use_autoconfig=false  netcfg/confirm_static=true netcfg/get_ipaddress=%s netcfg/get_gateway=%s netcfg/get_netmask=%s netcfg/get_nameservers=%s netcfg/get_domain=vmemperor" % (
                ip, gw, netmask, dns1)

            self.ip = ip_string
            self.dhcp = False

    class CentOS (GenericOS):
        """
        OS-specific parameters for CetOS
        """
        def set_scenario(self, url):
            self.scenario = self.set_kickstart(url)

        def set_network_parameters(self, ip=None, gw=None, netmask=None, dns1=None, dns2=None):
            if not ip:
               self.dhcp = True
            else:
                if not gw:
                    raise XenAdapterArgumentError(self,"Network configuration: IP has been specified, missing gateway")
                if not netmask:
                    raise XenAdapterArgumentError(self,"Network configuration: IP has been specified, missing netmask")
                ip_string = " ip=%s::%s:%s" % (ip, gw, netmask)

                if dns1:
                    ip_string = ip_string + ":::off:%s" % dns1
                    if dns2:
                        ip_string = ip_string +":%s" % dns2

            self.ip = ip_string
            self.dhcp = False

        def pv_args(self):
            return "%s %s" % (self.ip, self.scenario)

    def create_vm(self, tmpl_uuid, sr_uuid, net_uuid, vdi_size, hostname, mode, os_kind=None, ip=None, install_url=None, scenario_url=None, name_label = '', start=True, override_pv_args=None) -> str:
        '''
        Creates a virtual machine and installs an OS

        :param tmpl_uuid: Template UUID
        :param sr_uuid: Storage Repository UUID
        :param net_uuid: Network UUID
        :param vdi_size: Size of disk
        :param hostname: Host name
        :param os_kind: OS kind (used for automatic installation. Default: manual installation)
        :param ip: IP configuration. Default: auto configuration. Otherwise expects a tuple of the following format
        (ip, mask, gateway, dns1(optional), dns2(optional))
        :param install_url: URL to install OS from
        :scenario_url: preseed/kickstart file url. It's Preseed for debian-based systems, Kickstart for RedHat. If os_kind is ubuntu and scenario_url is kickstart, provide a tuple (url, 'ks')
        :param mode: 'pv' or 'hvm'. Refer to http://xapi-project.github.io/xen-api/vm-lifecycle
        :param name_label: Name for created VM
        :param start: if True, start VM immediately
        :param override_pv_args: if specified, overrides all pv_args for Linux kernel
        :return: VM UUID
        '''
        try:
            tmpl_ref = self.api.VM.get_by_uuid(tmpl_uuid)
            new_vm_ref = self.api.VM.clone(tmpl_ref, name_label)
            new_vm_uuid = self.api.VM.get_uuid(new_vm_ref)
            self.log.info ("New VM is created: UUID {0}, OS type {1}".format(new_vm_uuid, os_kind))
        except XenAPI.Failure as f:
            raise XenAdapterAPIError(self, "Failed to clone template: {0}".format(f.details))

        try:

            self.api.VM.set_memory(new_vm_ref, '1073741824')

            if install_url:
                self.log.info("Adding Installation URL: %s" % install_url)
                config = self.api.VM.get_other_config(new_vm_ref)
                config['install-repository'] = install_url
                config['default-mirror'] = install_url
                self.api.VM.set_other_config(new_vm_ref, config)

            if 'ubuntu' in os_kind or 'debian' in os_kind:
                os = XenAdapter.UbuntuOS()
                try:
                    debian_release = os_kind.split()[1]
                    config = self.api.VM.get_other_config(new_vm_ref)
                    config['debian-release'] = debian_release
                    self.api.VM.set_other_config(new_vm_ref, config)
                except IndexError:
                    pass
            else:
                if 'centos' in os_kind:
                    os = XenAdapter.CentOS()
                    config = self.api.VM.get_other_config(new_vm_ref)
                    if 'rhel6' in config:
                        del config['rhel6']
                    self.api.VM.set_other_config(new_vm_ref, config)
                else:
                    os = None

            if os:
                os.set_network_parameters(*ip)
                os.set_hostname(hostname)
                os.set_scenario(scenario_url)

                if mode == 'pv':
                    if not override_pv_args:
                        pv_args = os.pv_args()
                    else:
                        pv_args = override_pv_args
                    self.api.VM.set_HVM_boot_policy(new_vm_ref, '')
                    self.api.VM.set_PV_bootloader(new_vm_ref, 'eliloader')
                    self.api.VM.set_PV_args(new_vm_ref, pv_args)

                if mode == 'hvm':
                    policy = self.api.VM.get_HVM_boot_policy(new_vm_ref)
                    if policy == '':
                        self.api.VM.set_HVM_boot_policy(new_vm_ref, 'BIOS order')
                    bp = self.api.VM.get_HVM_boot_params(new_vm_ref)
                    bp['ks'] = scenario_url
                    key, value = os.ip.split('=')
                    bp[key] = value

        except XenAPI.Failure as f:
            self.destroy_vm(new_vm_uuid)
            raise XenAdapterAPIError(self, 'Failed to install OS: {0}'.format(f.details))

        try:
            specs = provision.ProvisionSpec()
            specs.disks.append(provision.Disk("0", vdi_size, sr_uuid, True))
            provision.setProvisionSpec(self.session, new_vm_ref, specs)
        except Exception as e:
            self.destroy_vm(new_vm_uuid)
            try:
                raise e
            except XenAPI.Failure as f:
                raise XenAdapterAPIError(self, "Failed to setting disk: {0}".format(f.details))

        try:
            self.api.VM.provision(new_vm_ref)
        except Exception as e:
            self.destroy_vm(new_vm_uuid)
            try:
                raise e
            except XenAPI.Failure as f:
                raise XenAdapterAPIError(self, "Failed to provision: {0}".format(f.details))

        self.connect_vm(new_vm_uuid, net_uuid, ip)


        if self.vmemperor_user is not None:
            self.set_other_config(new_vm_uuid, "vmemperor_user", self.vmemperor_user)



        if start:
            self.api.VM.start(new_vm_ref, False, True) # args: VM reference, start in paused state, force start
            self.log.info ("Created VM is started")
        else:
            self.log.warning('Created VM is off')

        return new_vm_uuid

    def create_disk(self, sr_uuid, size, name_label = None) -> str:
        """
        Creates a VDI of a certain size in storage repository
        :param sr_uuid: Storage Repository UUID
        :param size: Disk size
        :param name_label: Name of created disk
        :return: Virtual Disk Interface UUID
        """

        sr_ref = self.api.SR.get_by_uuid(sr_uuid)
        if not (name_label):
            sr = self.api.SR.get_record(sr_ref)
            name_label = sr['name_label'] + ' disk'

        other_config = {}
        if self.vmemperor_user:
            other_config['vmemperor_user'] = self.vmemperor_user

        args = {'SR': sr_ref, 'virtual_size': str(size), 'type': 'system', \
                'sharable': False, 'read_only': False, 'other_config': other_config, \
                'name_label': name_label}
        try:
            vdi_ref = self.api.VDI.create(args)
            vdi_uuid = self.api.VDI.get_uuid(vdi_ref)
            self.log.info ("VDI is created: UUID {0}".format(vdi_uuid))
        except XenAPI.Failure as f:
            raise XenAdapterAPIError(self, "Failed to create VDI: {0}".format(f.details))

        return vdi_uuid

    def start_stop_vm(self, vm_uuid, enable):
        """
        Starts and stops VM if required
        :param vm_uuid:
        :param enable:
        :return:
        """
        vm_ref = self.api.VM.get_by_uuid(vm_uuid)
        ps = self.api.VM.get_power_state(vm_ref)
        try:
            if ps != 'Running' and bool(enable) == True:
                self.api.VM.start (vm_ref, False, True)
                self.log.info ("Started VM UUID {0}".format(vm_uuid))
            if ps == 'Running' and bool(enable) == False:
                self.api.VM.shutdown(vm_ref)
                self.log.info("Shutted down VM UUID {0}".format(vm_uuid))
        except XenAPI.Failure as f:
            raise XenAdapterAPIError (self.log, "Failed to start/stop VM: {0}".format(f.details))

        return

    def connect_vm(self, vm_uuid, net_uuid, ip=None):
        """
        Creates VIF to connect VM to network
        :param vm_uuid:
        :param net_uuid:
        :return: vif_uuid
        """
        net_ref = self.api.network.get_by_uuid(net_uuid)
        net = self.api.network.get_record(net_ref)
        vm_ref = self.api.VM.get_by_uuid(vm_uuid)
        vm = self.api.VM.get_record(vm_ref)
        args = {'VM': vm_ref, 'network': net_ref, 'device': str(len(vm['VIFs'])), \
                'MAC': '', 'MTU': net['MTU'], 'other_config': {}, \
                'qos_algorithm_type': '', 'qos_algorithm_params': {}}
        try:
            vif_ref = self.api.VIF.create(args)
            vif_uuid = self.api.VIF.get_uuid(vif_ref)
            self.log.info ("VM is connected to network: VIF UUID {0}".format(vif_uuid))
        except XenAdapterAPIError as f:
            raise XenAdapterAPIError(self, "Failed to create VIF: {0}".format(f.details))

        return vif_uuid

    def enable_disable_template(self, vm_uuid, enable):
        """
        Adds/removes tag vmemperor"
        :param vm_uuid:
        :param enable:
        :return: dict, code_status
        """
        vm_ref = self.api.VM.get_by_uuid(vm_uuid)
        try:
            if enable:
                self.api.VM.add_tags(vm_ref, 'vmemperor_enabled')
                self.log.info ("Enable template UUID {0}".format(vm_uuid))
            else:
                self.api.VM.remove_tags(vm_ref, 'vmemperor_enabled')
                self.log.info ("Disable template UUID {0}".format(vm_uuid))
        except XenAPI.Failure as f:
            raise XenAdapterAPIError (self, "Failed to enable/disable template: {0}".format(f.details))

    def get_power_state(self, vm_uuid) -> str:
        '''
        Returns a power state of the VM
        :param vm_uuid: VM UUID
        :return: VM State string
        '''
        vm_ref = self.api.VM.get_by_uuid(vm_uuid)
        return self.api.VM.get_power_state(vm_ref)


    def get_vnc(self, vm_uuid) -> str:
        """
        Get VNC Console
        :param vm_uuid: VM UUID
        :return: URL console location
        """
        vm_ref = self.api.VM.get_by_uuid(vm_uuid)
        self.start_stop_vm(vm_uuid, True)
        consoles = self.api.VM.get_consoles(vm_ref) #references
        if (len(consoles) == 0):
            self.log.error('Failed to find console of VM UUID {0}'.format(vm_uuid))
            return
        try:
            cons_ref = consoles[0]
            console = self.api.console.get_record(cons_ref)
            url = self.api.console.get_location(cons_ref)
            self.log.info ("Console location {0} of VM UUID {1}".format(url, vm_uuid))
        except XenAPI.Failure as f:
            raise XenAdapterAPIError(self, "Failed to get console location: {0}".format(f.details))

        return url




    def attach_disk(self, vm_uuid, vdi_uuid) -> str:
        '''
        Attach a VDI object to a VM by creating a VBD object and attempting to hotplug it if the machine is running        if VM is running
        :param vm_uuid: VM UUID
        :param vdi_uuid: virtual disk image UUID
        :return: Virtual block device UUID
        '''
        vm_ref = self.api.VM.get_by_uuid(vm_uuid)
        vm = self.api.VM.get_record(vm_ref)
        vdi_ref = self.api.VDI.get_by_uuid(vdi_uuid)
        vdi = self.api.VDI.get_record(vdi_ref)

        vm_vbds = vm['VBDs']
        vdi_vbds = vdi['VBDs']
        for vm_vbd in vm_vbds:
            for vdi_vbd in vdi_vbds:
                if vm_vbd == vdi_vbd:
                    vbd_uuid = self.api.VBD.get_uuid(vm_vbd)
                    self.log.warning ("Disk is already attached with VBD UUID {0}".format(vbd_uuid))
                    return vbd_uuid

        args = {'VM': vm_ref, 'VDI': vdi_ref, 'userdevice': str(len(vm['VBDs'])), 'bootable': True, \
                'mode': 'RW', 'type': 'Disk', 'empty': False, 'other_config': {}, \
                'qos_algorithm_type': '', 'qos_algorithm_params': {}}
        try:
            vbd_ref = self.api.VBD.create(args)
        except XenAPI.Failure as f:
            raise XenAdapterAPIError(self, "Failed to create VBD: {0}".format(f.details))

        vbd_uuid = self.api.VBD.get_uuid(vbd_ref)
        if (self.api.VM.get_power_state(vm_ref) == 'Running'):
            try:
                self.api.VBD.plug(vbd_ref)
            except Exception as e:
                self.log.warning("Disk will be attached after reboot with VBD UUID {0}".format(vbd_uuid))
                return vbd_uuid

        self.log.info ("Disk is attached with VBD UUID: {0}".format(vbd_uuid))

        return vbd_uuid


    def detach_disk(self, vm_uuid, vdi_uuid):
        '''
        Detach a VBD object while trying to eject it if the machine is running
        :param vbd_uuid: virtual block device UUID to detach
        :return:
        '''
        vm_ref = self.api.VM.get_by_uuid(vm_uuid)
        vdi_ref = self.api.VDI.get_by_uuid(vdi_uuid)
        vbds = self.api.VM.get_VBDs(vm_ref)
        for vbd_ref in vbds:
            vdi = self.api.VBD.get_VDI(vbd_ref)
            if vdi == vdi_ref:
                vbd_uuid = self.api.VBD.get_uuid(vbd_ref)
                break
        if not vbd_uuid:
            raise XenAdapterAPIError(self, "Failed to detach disk: Disk isn't attached")

        vbd_ref = self.api.VBD.get_by_uuid(vbd_uuid)
        if self.api.VM.get_power_state(vm_ref) == 'Running':
            try:
                self.api.VBD.unplug(vbd_ref)
            except Exception as e:
                self.log.warning("Failed to detach disk from running VM")
                return 1
            
        try:
            self.api.VBD.destroy(vbd_ref)
            self.log.info("VBD UUID {0} is destroyed".format(vbd_uuid))
        except XenAPI.Failure as f:
            raise XenAdapterAPIError(self, "Failed to detach disk: {0}".format(f.details))

        return

    def destroy_vm(self, vm_uuid):
        self.start_stop_vm(vm_uuid, False)
        vm_ref = self.api.VM.get_by_uuid(vm_uuid)
        vm = self.api.VM.get_record(vm_ref)

        vbds = vm['VBDs']
        vdis = [self.api.VBD.get_record(vbd_ref)['VDI'] for vbd_ref in vbds]

        try:
            self.api.VM.destroy(vm_ref)
            for vdi_ref in vdis:
                self.api.VDI.destroy(vdi_ref)
        except XenAPI.Failure as f:
            raise XenAdapterAPIError (self, "Failed to destroy VM: {0}".format(f.details))

        return

    def destroy_disk(self, vdi_uuid):
        vdi_ref = self.api.VDI.get_by_uuid(vdi_uuid)
        try:
            self.api.VDI.destroy(vdi_ref)
        except XenAPI.Failure as f:

            raise XenAdapterAPIError(self, "Failed to destroy VDI: {0}".format(f.details))

        return

    def hard_shutdown(self, vm_uuid):
        vm_ref = self.api.VM.get_by_uuid(vm_uuid)
        if self.api.VM.get_power_state(vm_ref) != 'Halted':
            self.api.VM.hard_shutdown(vm_ref)


    def set_other_config(self, subject, uuid, name, value=None, overwrite=True):
        '''
        Set value of other_config field
        :param subject: API subject
        :param uuid:
        :param name:
        :param value: none if you wish to remove field
        :return:
        '''
        ref = subject.get_by_uuid(uuid)
        if value is not None:
            if overwrite:
                try:
                    subject.remove_from_other_config(ref, name)
                except XenAPI.Failure as f:
                    self.log.debug("set_other_config: failed to remove entry %s from other_config (overwrite=True): %s" % (name, f.details))
            try:
                subject.add_to_other_config(ref, name, value)
            except XenAPI.Failure as f:
                raise XenAdapterAPIError(self, "Failed to add tag '{0}' with value '{1}' to subject '{2}'s other_config field {3}': {4}".format(
                    name, value, subject, uuid, f.details))
        else:
            try:
                subject.remove_from_other_config(ref, name, value)
            except XenAPI.Failure as f:
                raise XenAdapterAPIError(self,
                                         "Failed to remove tag '{0}' from subject '{1}'s other_config field {2}': {3}".format(
                                             name, subject, uuid, f.details))



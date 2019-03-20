from urllib.parse import urlencode

from constants import AUTOINSTALL_ROUTE


class GenericOS:
    '''
    A class that generates kernel boot arguments string for various Linux distributions
    '''

    def __init__(self):
        self.dhcp = True
        self.other_config = {}

        self.hostname = None
        self.username = None
        self.password = None
        self.install_url = None
        self.fullname = None
        self.ip = None
        self.gateway=None
        self.netmask = None
        self.dns0 = None
        self.dns1 = None
        self.partition = None
        self.device = None # Guest iso device name

    def __repr__(self):
        return self.__class__.__name__

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

    def set_install_url(self, url):
        '''
        Set install URL to other_config field
        :param url:
        :return:
        '''
        self.install_url = url

    def set_scenario(self, url):
        raise NotImplementedError

    def get_scenario(self):
        '''
        return
        :return: Scenario URL
        '''
        from vmemperor import opts
        args = dict(
            device=self.device,
            hostname=self.hostname,
            username=self.username,
            password=self.password,
            mirror_url=self.install_url,
            fullname=self.fullname,
            ip=self.ip,
            gateway=self.gateway,
            netmask=self.netmask,
            dns0=self.dns0,
            dns1=self.dns1,
            partition=self.partition

        )

        return 'http://' + opts.vmemperor_host + ':' + str(
            opts.vmemperor_port) + AUTOINSTALL_ROUTE + "/" + self.os_kind.split()[0] + "?" \
        + urlencode(args, doseq=True)

    def set_kickstart(self, url):
        return 'ks={0}'.format(url)

    def set_preseed(self, url):
        return 'preseed/url={0}'.format(url)

    def set_hostname(self, hostname):
        self.hostname = hostname

    def set_network_parameters(self, ip=None, gateway=None, netmask=None, dns0=None, dns1=None):
        self.ip = ip
        self.gateway = gateway
        self.netmask = netmask
        self.dns0 = dns0
        self.dns1 = dns1
        if self.ip and self.gateway and self.netmask:
            self.dhcp = False

    def set_os_kind(self, os_kind):
        self.os_kind = os_kind

class DebianOS(GenericOS):
    '''
    OS-specific parameters for Debian
    '''
    HVM_RELEASES=[]

    def pv_args(self):
        if self.dhcp:
            net_config = "netcfg/disable_dhcp=false"
        else:
            if not self.ip:
                raise AttributeError("dhcp is set to false, but ip is not set")
            if not self.gateway:
                raise AttributeError("dhcp is set to false, but gateway is not set")
            if not self.netmask:
                raise AttributeError("dhcp is set to false, but netmask is not set")


            net_config  = "ipv6.disable=1 netcfg/disable_autoconfig=true netcfg/use_autoconfig=false  netcfg/confirm_static=true"
            net_config = net_config + f" netcfg/get_ipaddress={self.ip} netcfg/get_gateway={self.gateway} netcfg/get_netmask={self.netmask} netcfg/get_nameservers={self.dns0} netcfg/get_domain=vmemperor"
        # scenario set up
        scenario = self.get_scenario()
        return "auto=true console=hvc0 debian-installer/locale=en_US console-setup/layoutcode=us console-setup/ask_detect=false interface=eth0 %s netcfg/get_hostname=%s preseed/url=%s --" % (
            net_config, self.hostname, scenario)

    def get_release(self, num):
        releases = {
            '7': 'wheezy',
            '8': 'jessie',
            '9': 'stretch'
        }
        if str(num) in releases.keys():
            return releases[str(num)]
        if num in releases.values():
            return num
        return None

    def set_os_kind(self, os_kind: str):
        super().set_os_kind(os_kind)
        try:
            debian_release = self.get_release(os_kind.split()[1])
            self.other_config['debian-release'] = debian_release
        except IndexError:
            pass

        if self.other_config['debian-release'] in self.HVM_RELEASES:
            self.other_config['convert-to-hvm'] = 'true'

    def set_install_url(self, url):

        if not url:
            url = 'http://ftp.ru.debian.org/debian/'

        self.other_config['install-repository'] = url
        self.other_config['default-mirror'] = url
        super().set_install_url(url)


class UbuntuOS(DebianOS):
    '''
    OS-specific parameters for Ubuntu
    '''
    HVM_RELEASES = ['artful',  'zesty', 'yakkety', 'bionic', 'cosmic', 'disco']
    def get_release(self, num):
        releases = {
            '12.04': 'precise',
            '14.04': 'trusty',
            '14.10': 'utopic',
            '15.04': 'vivid',
            '15.10': 'willy',
            '16.04': 'xenial',
            '16.10': 'yakkety',
            '17.04': 'zesty',
            '17.10': 'artful',
            '18.04': 'bionic',
            '18.10': 'cosmic',
            '19.04': 'disco',
        }
        if num in releases.keys():
            return releases[num]
        if num in releases.values():
            return num
        return None


    def set_install_url(self, url):
        if not url:
            url = 'http://archive.ubuntu.com/ubuntu/'
        super().set_install_url(url)





class CentOS(GenericOS):
    """
    OS-specific parameters for CetOS
    """
    #Releases that require HVM installation and then switching to PV
    HVM_RELEASES=['7']
    def set_scenario(self, url):
        self.scenario = self.set_kickstart(url)


    def pv_args(self):
        '''
        TODO: rewrite for CentOS
        :return:
        '''
        if self.dhcp:
            net_config = ""
        else:
            if not self.ip:
                raise AttributeError("dhcp is set to false, but ip is not set")
            if not self.gateway:
                raise AttributeError("dhcp is set to false, but gateway is not set")
            if not self.netmask:
                raise AttributeError("dhcp is set to false, but netmask is not set")

            # These options are deprecated in CentOS 7
            #net_config = " ip={0} netmask={1} gateway={2}".format(self.ip, self.netmask, self.gateway)


            #if self.dns0:
            #    net_config = net_config + " nameserver={0}".format(self.dns0)
            #    if self.dns1:
            #        net_config = net_config + ",{0}".format(self.dns1)

            # These options are new
            net_config = f" ip={self.ip}::{self.gateway}:{self.netmask}"

            if self.dns0:
                net_config = net_config + f":::off:{self.dns0}"
                if self.dns1:
                    net_config = net_config + f":{self.dns1}"


        # scenario set up
        scenario = self.get_scenario()
        return "linux inst.cmdline inst.ks={0} ksdevice=eth0{1} sshd".format(scenario, net_config)

    def set_install_url(self, url):

        if not url:
            url = 'http://mirror.centos.org/centos/{0}/os/x86_64'.format(self.rhel_version)

        self.other_config['install-repository'] = url
        self.other_config['default-mirror'] = url
        super().set_install_url(url)

    def set_rhel_version(self, rhel_version):
        '''
        Set RHEL version (self.rhel_version)for using in RHEL installation repository
        :param rhel_version: specified version. If None, guess from other_config
        :return:
        '''
        try:
            if rhel_version and isinstance(rhel_version, str):
                version = int(rhel_version)
                if version < 1 or version > 7:
                    raise ValueError()
            else:
                raise ValueError()

        except ValueError: # RHEL Version should be a nunber
            rhel_version = None

        rhel_keys = [key for key in self.other_config if key.startswith('rhel')]
        if rhel_version:
            set_rhel_version = True

            for key in rhel_keys:

                if key[4:] == rhel_version:
                    set_rhel_version = False # already set
                    continue
                else:
                    del self.other_config[key]

                if set_rhel_version:
                    self.other_config['rhel'+rhel_version] = 'true'

        else:
            for key in rhel_keys:
                if self.other_config[key]:
                    rhel_version = key[4:]
                    break

        if not rhel_version:
            raise ValueError("No RHEL version specified")
        self.rhel_version = rhel_version








    def set_os_kind(self, os_kind: str):
        super().set_os_kind(os_kind)
        try:
            rhel_version = os_kind.split()[1]
            self.set_rhel_version(rhel_version)
        except IndexError:
            self.set_rhel_version(None)

        if self.rhel_version in self.HVM_RELEASES:
            self.other_config['convert-to-hvm'] = 'true'




class OSChooser:
    @classmethod
    def get_os(cls, os_kind, other_config):
        if os_kind.startswith('ubuntu'):
            os = UbuntuOS()
        elif os_kind.startswith('centos'):
            os = CentOS()
        elif os_kind.startswith('debian'):
            os = DebianOS()
        else:
            return None

        os.other_config = other_config
        os.set_os_kind(os_kind)
        return os


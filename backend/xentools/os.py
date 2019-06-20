from enum import Enum
from typing import Optional, List, Callable
from urllib.parse import urlencode, urlsplit, urlunsplit

from constants import AUTOINSTALL_ROUTE
from xentools.autoinstalllist import AutoInstallList


class Distro(Enum):
    Debian = "debianlike"
    CentOS = "rhlike"
    SUSE = "sleslike"




class Arch(Enum):
    I386 = 'i386'
    X86_64 = 'x86_64'

class GenericOS:
    '''
    A class that generates kernel boot arguments string for various Linux distributions
    '''

    HVM_RELEASES = []

    def __init__(self, other_config):
        self.dhcp = True
        self.other_config = other_config
        self.hostname = None
        self.username = None
        self.password = None
        self.fullname = None
        self.ip = None
        self.gateway=None
        self.netmask = None
        self.dns0 = None
        self.dns1 = None
        self.partition = None
        self.device = None # Guest iso device name

    def _set_key(self, key, value):
        '''
        Remove key if value is None, otherwise update value
        :param key:
        :param value:
        :return:
        '''
        if not value and key in self.other_config:
            del self.other_config[key]
        else:
            self.other_config[key] = value


    def __repr__(self):
        return self.__class__.__name__

    def get_pv_args(self) -> str:
        '''
        Obtain pv_args - kernel parameters for paravirtualized VM
        This method creates a new record in DB of install_scripts and thus creates a one-time link to temporary installation scenario
        See also get_scenario
        See also handlers/rest/autoinstall.py - serves one-time installation scenarios
        :return:
        '''

    def hvm_args(self) -> str:
        '''
        Obtain hvm_args - whatever that might be
        :return:
        '''

    def set_install_repository(self, url):
        '''
        Set install URL to other_config field.
        if Url is None, remove the field
        :param url:
        :return:
        '''
        self._set_key('install-repository', url)


    def get_install_repository(self):
        return self.other_config.get('install-repository')

    def set_arch(self, arch : Arch):
        assert arch is None or isinstance(arch, Arch)
        if not arch:
            value = None
        else:
            value = arch.value
        self._set_key('install-arch', value)

    def get_arch(self) -> Optional[Arch]:
        try:
            return Arch(self.other_config.get('install-arch'))
        except (KeyError, ValueError):
            return None

    def get_release(self):
        raise NotImplementedError()

    def set_release(self, release):
        raise NotImplementedError()

    def is_hvm_release(self):
        return self.get_release() in self.HVM_RELEASES

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
            mirror_url=self.get_install_repository(),
            fullname=self.fullname,
            ip=self.ip,
            gateway=self.gateway,
            netmask=self.netmask,
            dns0=self.dns0,
            dns1=self.dns1,
            partition=self.partition
        )
        id = AutoInstallList.insert(args)
        return 'http://' + opts.vmemperor_host + ':' + str(
            opts.vmemperor_port) + AUTOINSTALL_ROUTE + "/" + self.get_distro().value + "?" \
        + urlencode({'id': id}, doseq=True)

    def get_distro(self):
        try:
            return Distro(self.other_config['install-distro'])
        except KeyError:
            return None



    def set_network_parameters(self, ip=None, gateway=None, netmask=None, dns0=None, dns1=None):
        self.ip = ip
        self.gateway = gateway
        self.netmask = netmask
        self.dns0 = dns0
        self.dns1 = dns1
        if self.ip and self.gateway and self.netmask:
            self.dhcp = False


class DebianOS(GenericOS):
    '''
    OS-specific parameters for Debian
    '''
    HVM_RELEASES = ['artful',  'zesty', 'yakkety', 'bionic', 'cosmic', 'disco']

    def get_pv_args(self):
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
        return f"auto=true console=hvc0 debian-installer/locale=en_US console-setup/layoutcode=us console-setup/ask_detect=false interface=eth0 {net_config} netcfg/get_hostname={self.hostname} preseed/url={scenario} --"

    def set_release(self, release):
        if not release:
            if 'debian-release' in self.other_config:
                del self.other_config['debian-release']
        self.other_config['debian-release'] = release

    def get_release(self):
        return self.other_config.get('debian-release')

    def set_arch(self, arch : Arch):
        if arch == Arch.X86_64:
            self.other_config['install-arch'] = 'amd64'
        else:
            super().set_arch(arch)

    def get_arch(self):
        if self.other_config.get('install-arch') == 'amd64':
            return Arch.X86_64
        else:
            return super().get_arch()


class CentOS(GenericOS):
    """
    OS-specific parameters for CetOS
    """
    #Releases that require HVM installation and then switching to PV
    HVM_RELEASES=['7']


    def get_pv_args(self):
        '''
        TODO: rewrite for CentOS 6
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

    def set_install_repository(self, url: Optional[str]):
        '''
        :param url:
        :return:
        '''
        if url is None:
            super().set_install_repository(url)
        if not isinstance(url, str):
            raise TypeError("url should be of type str")
        split_url  = urlsplit(url)
        path = split_url.path

        path_parts = list(path.split('/'))
        if path_parts[-1] == '': # This path part corresponds to final slash in http://host/centos/
            del path_parts[-1]

        if not path_parts or len(path_parts) < 2:
            raise ValueError(f"Malformed url: {url}")

        release = None # This variable won't be None if we couldn't get a release from repository URL and therefore we should complete RedHat repository URL with release
        def complete_url():
            nonlocal release

            if path_parts[-1] not in ('x86_64', 'i386'): # URL not full, complete it
                if path_parts[-1] == 'os': # we only need to complete the arch
                    arch = self.get_arch()
                    if not arch:
                        raise ValueError("Arch is not specified in the URL and not set by template")
                    path_parts.append(arch.value)
                else:
                    if not release:
                        release = self.get_release()
                        if not release:
                            raise ValueError("RedHat release is not set by template")
                    elif release in path_parts[-1]: # So 7 would correspond to urls like MIRROR/centos/7.6.1810, etc
                        path_parts.append('os')
                    else: # Append self.get_release
                        path_parts.append(release)

                    complete_url()
            else:
                if not release: # URL is full, set template release according to URL
                    self.set_release(path_parts[-3].split('.')[0], False) # /centos/7/os/x86_64 corresponds to 7

                if path_parts[-1] == 'i386':
                    self.set_arch(Arch.I386, False)
                elif path_parts[-1] == 'x86_64':
                    self.set_arch(Arch.X86_64, False)

        complete_url()

        new_path = '/'.join(path_parts)
        if new_path != split_url.path:
            url = urlunsplit((split_url[0], split_url[1], new_path, split_url[3], split_url[4]))

        super().set_install_repository(url)


    def get_arch(self):
        repo = self.get_install_repository()
        if repo:
            path = urlsplit(repo).path
            if path:
                path_split = path.split('/')
                if path_split[-1] == 'i386':
                    return Arch.I386
                elif path_split[-1] == 'x86_64':
                    return Arch.X86_64
        return super().get_arch()

    def set_arch(self, arch : Optional[Arch], edit_url=True):
        '''
        This method sets architecture of CentOS template and replaces last install_repository part if needed
        :param arch:
        :return:
        '''
        super().set_arch(arch)
        if arch is None:
            return

        if edit_url:
            def edit_url(path_parts):
                if path_parts[-1] in ('i386', 'x86_64'):
                    if path_parts[-1] != arch.value:
                        path_parts[-1] = arch.value
                        return path_parts

            self._edit_url(edit_url)

    def _edit_url(self, callback: Callable[[List[str]], Optional[List[str]]]):
        '''
        Edit install repository and set in in place.
        If callback returns none, abort editing
        :param callback:
        :return:
        '''
        if not self.get_install_repository():
            return
        split_url  = urlsplit(self.get_install_repository())
        path = split_url.path
        path_parts = list(path.split('/'))
        if path_parts[-1] == '': # This path part corresponds to final slash in http://host/centos/
            del path_parts[-1]

        if not path_parts or len(path_parts) < 2:
            return

        new_path_parts = callback(path_parts)
        if new_path_parts:
            new_path = '/'.join(new_path_parts)
            url = urlunsplit((split_url[0], split_url[1], new_path, split_url[3], split_url[4]))
            super().set_install_repository(url)


    def set_release(self, release, edit_url=True):
        '''
        Set RHEL version
        :param release: specified version
        :return:
        '''
        if release and isinstance(release, str):
            release_major = int(release.split('.')[0])
            if release_major < 2 or release_major > 7:
                raise ValueError(release, "Valid RedHat versions are between 2 and 7")
        else:
            raise ValueError()

        rhel_keys = [key for key in self.other_config if key.startswith('rhel')]

        for key in rhel_keys:
            if key[4:] == release_major:
                break
            else:
                del self.other_config[key]
        else:
            self.other_config['rhel' + str(release_major)] = True

        # Update URL with new release value
        if edit_url:
            def edit_url(path_parts):
                if path_parts[-1] in ('i386', 'x86_64'):
                    path_parts[-3] = release
                elif path_parts[-1] == 'os':
                    path_parts[-2] = release
                    path_parts.append(self.get_arch().value)
                elif path_parts[-1] == self.get_release():
                    path_parts[-1] = release
                    path_parts.append('os')
                    path_parts.append(self.get_arch().value)
                else:
                    return

                return path_parts

            self._edit_url(edit_url)





    def get_release(self):
        rhel_keys = map(lambda key: key[4:], filter(lambda key: key.startswith('rhel') and self.other_config[key] is True, self.other_config))
        try:
            ret = next(rhel_keys)
            if not ret: # junk like rhel=True
                return None
            else:
                return ret
        except StopIteration:
            return None

class SuseOS(GenericOS):
    def get_release(self):
        return None

class OSChooser:
    @classmethod
    def get_os(cls, other_config):
        if other_config.get('install-distro') == 'rhlike':
            os = CentOS(other_config)
        elif other_config.get('install-distro') == 'debianlike':
            os = DebianOS(other_config)
        elif other_config.get('install-distro') == 'sleslike':
            os = SuseOS(other_config)
        else:
            return None

        return os


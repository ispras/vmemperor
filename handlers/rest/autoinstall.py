import pathlib
from urllib.parse import urlencode
import os, sys
import constants
from handlers.rest.base import RESTHandler


class AutoInstall(RESTHandler):
    def get(self, os_kind):
        '''
        This is used by CreateVM
        :param os_kind:
        :return:
        '''
        filename = None
        hostname = self.get_argument('hostname')
        device = self.get_argument('device')
        username = self.get_argument('username', default='')
        password = self.get_argument('password', default='')
        mirror_url = self.get_argument('mirror_url', default='')
        fullname = self.get_argument('fullname', default='')
        ip = self.get_argument('ip', default='')
        gateway = self.get_argument('gateway', default='')
        netmask = self.get_argument('netmask', default='')
        dns0 = self.get_argument('dns0', default='')
        dns1 = self.get_argument('dns1', default='')
        part = self.get_argument('partition').split('-')
        partition = {'method': 'regular',
                     'mode': 'mbr',
                     'expert_recipe': [],
                     'swap': ''}
        if part[0] == 'auto':
            part.remove('auto')
        if 'swap' not in part and 'centos' not in os_kind:
            partition['swap'] = '2048'
        if 'swap' in part:
            ind = part.index('swap')
            partition['swap'] = part[ind + 1]
            part.remove('swap')
            part.remove(part[ind])
        if 'mbr' in part:
            part.remove('mbr')
        if 'gpt' in part:
            partition['mode'] = 'gpt'
            part.remove('gpt')
        if 'lvm' in part:
            partition['method'] = 'lvm'
            part.remove('lvm')
            if '/boot' not in part:
                raise ValueError("LVM partition require boot properties")
        partition['expert_recipe'] = [{'mp': part[i + 0], 'size': part[i + 1], 'fs': part[i + 2]}
                                      for i in range(0, len(part), 3)]
        if 'ubuntu' in os_kind or 'debian' in os_kind:
            mirror_url = mirror_url.split('http://')[1]
            mirror_path = mirror_url[mirror_url.find('/'):]
            mirror_url = mirror_url[:mirror_url.find('/')]
            filename = 'debian.jinja2'

            pubkey = ""  # We handle it in postinst
        if 'centos' in os_kind:
            for part in partition['expert_recipe']:
                if part['mp'] is "/":
                    part['name'] = 'root'
                else:
                    part['name'] = part['mp'].replace('/', '')
            filename = 'centos-ks.cfg'
            mirror_path = ''
            pubkey_path = pathlib.Path(constants.ansible_pubkey)
            pubkey = pubkey_path.read_text()
        if not filename:
            raise ValueError(f"OS {os_kind} doesn't support autoinstallation")
        # filename = 'raid10.cfg'
        self.render(os.path.join(
            os.path.abspath(sys.modules['__main__'].__file__ + "/.."),
            f"templates/installation-scenarios/{filename}"),
            hostname=hostname, username=username,
            fullname=fullname, password=password, mirror_url=mirror_url, mirror_path=mirror_path,
            ip=ip, gateway=gateway, netmask=netmask, dns0=dns0, dns1=dns1, partition=partition, pubkey=pubkey,device=device,
            postinst=f"{constants.URL}{constants.POSTINST_ROUTE}?{urlencode({'os': 'debian', 'device':device})}")

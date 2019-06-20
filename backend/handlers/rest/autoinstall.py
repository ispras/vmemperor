import pathlib
from urllib.parse import urlencode, urlsplit
import os, sys
import constants
from handlers.rest.base import RESTHandler
from xentools.autoinstalllist import AutoInstallList


class AutoInstall(RESTHandler):
    def get(self, os_kind):
        '''
        This is used by CreateVM
        :param os_kind:
        :return:
        '''
        filename = None
        id = self.get_argument('id')
        args = AutoInstallList.get(id)
        if not args:
            self.set_status(404)
            return
        part = args.get('partition').split('-')
        partition = {'method': 'regular',
                     'mode': 'mbr',
                     'expert_recipe': [],
                     'swap': ''}
        if part[0] == 'auto':
            part.remove('auto')
        if 'swap' not in part and  os_kind != 'rhlike':
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

        args['partition'] = partition

        if os_kind == 'debianlike':
            mirror_url = args['mirror_url']
            del args['mirror_url']
            mirror_parts = urlsplit(mirror_url)
            args['mirror_protocol'] = mirror_parts.scheme
            args['mirror_hostname'] = mirror_parts.netloc
            args['mirror_path'] = mirror_parts.path
            args['postinst'] = f"{constants.URL}{constants.POSTINST_ROUTE}?" \
                f"{urlencode({'os': os_kind, 'device': args['device'], 'username': args['username']})}"
            filename = 'debian.jinja2'

        elif os_kind == 'rhlike':
            for part in partition['expert_recipe']:
                if part['mp'] is "/":
                    part['name'] = 'root'
                else:
                    part['name'] = part['mp'].replace('/', '')
            filename = 'centos-ks.cfg'
            pubkey_path = pathlib.Path(constants.ansible_pubkey)
            args['pubkey'] = pubkey_path.read_text()
        if not filename:
            raise ValueError(f"OS {os_kind} doesn't support autoinstallation")
        # filename = 'raid10.cfg'
        self.render(os.path.join(
            os.path.abspath(sys.modules['__main__'].__file__ + "/.."),
            f"templates/installation-scenarios/{filename}"),
            **args)

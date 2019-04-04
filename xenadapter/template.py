from typing import Optional, Dict, List

from serflag import SerFlag

from handlers.graphql.types.template import GTemplate, TemplateActions
from xentools.dict_deep_convert import dict_deep_convert
from xentools.os import OSChooser, Arch, Distro
from .abstractvm import AbstractVM
from exc import *
import XenAPI
from .vm import VM
from xenadapter.helpers import use_logger


class Template(AbstractVM):
    EVENT_CLASSES = ['vm']
    ALLOW_EMPTY_OTHERCONFIG = True
    VMEMPEROR_TEMPLATE_PREFIX = 'vm/data/vmemperor/template'
    db_table_name = 'tmpls'
    GraphQLType = GTemplate
    Actions = TemplateActions

    @classmethod
    def filter_record(cls, xen, record, ref):
        return record['is_a_template'] and not record['is_a_snapshot']

    @classmethod
    def process_record(cls, xen, ref, record):
        '''
        Contary to parent method, this method can return many records as one XenServer template may convert to many
        VMEmperor templates
        :param ref:
        :param record:
        :return:
        '''
        new_rec = super().process_record(xen, ref, record)

        if record['HVM_boot_policy'] == '':
            new_rec['hvm'] = False
        else:
            new_rec['hvm'] = True

        other_config = dict_deep_convert(record['other_config'])
        new_rec['is_default_template'] = 'default_template' in other_config and\
                                         other_config['default_template']
        if new_rec['is_default_template']:
            new_rec['_blocked_operations_'].append("destroy")

        os = OSChooser.get_os(other_config)
        if os:
            new_rec['install_options'] = {}
            install_options = new_rec['install_options']
            distro = os.get_distro()
            if distro:
                install_options['distro'] = distro.value
            repo =  os.get_install_repository()
            if repo:
                install_options['install_repository'] = repo
            arch = os.get_arch()
            if arch:
                install_options['arch'] = arch.value
            release = os.get_release()
            if release:
                install_options['release'] = release

        return new_rec


    @use_logger
    def clone_as_vm(self, name_label=None):
        try:
            if not name_label:
                name_label = self.get_name_label()
            new_vm_ref = self.__getattr__('clone')(name_label)
            vm = VM(self.xen, new_vm_ref)

            self.log.info(f"New VM is created: ref:{vm.ref}")
            # Hack: set viridian to false iif linux_template is true (for Guest Additions to work correctly).
            other_config = self.get_other_config()
            if other_config['linux_template'] is True:
                platform = vm.get_platform()
                # This is for Linux auto-installs to work. If we'd ever support Windows, then viridian should be true (Hyper-V improvements for Windows guests)
                if 'viridian' not in platform or platform['viridian']:
                    platform['viridian'] = False
                    vm.set_platform(platform)
            if 'vmemperor' in other_config: # Clear VMEmperor access settings
                del other_config['vmemperor']
                vm.set_other_config(other_config)

            return vm
        except XenAPI.Failure as f:
            raise XenAdapterAPIError(self.log, f"Failed to clone template: {f.details}")



    def set_install_options(self, options : dict):
        '''
        Set install options from options dict
        If some option is set to None, it is deleted
        :return:
        '''
        if 'distro' in options:
            distro = options.pop('distro')
            self.set_distro(distro)
            if distro is None:
                if len(options) != 0:
                    raise ValueError("Extra options while distro is None")
                return

        os = OSChooser.get_os(self.get_other_config())

        if 'release' in options:
            os.set_release(options['release'])

        if 'arch' in options:
            if isinstance(options['arch'], str):
                for member in  Arch.__members__.values():
                    if member.value == options['arch']:
                        options['arch'] = member
                        break
                else:
                    raise ValueError(f"Incorrect arch value: {options['arch']}")


            os.set_arch(options['arch'])


        if 'install_repository' in options:
            os.set_install_repository(options['install_repository'])

        self.set_other_config(os.other_config)

    def set_distro(self, distro: Optional[Distro]):
        '''
        Change distro type
        :param distro
        '''
        other_config = self.get_other_config()
        if distro is None:
            try:
                del other_config['install-distro']
            except KeyError:
                return # Nothing to change
        else:
            other_config['install-distro'] = distro.value
            os = OSChooser.get_os(other_config)
            oldarch = self.get_install_options().get('arch')
            try:
                oldarch = Arch(oldarch)
            except KeyError:
                oldarch = None

            os.set_arch(oldarch)
            self.set_other_config(other_config)




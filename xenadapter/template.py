import json

import graphene

from xenadapter.xenobject import GAclXenObject
from handlers.graphql.types.gxenobjecttype import GXenObjectType
from .abstractvm import AbstractVM
from exc import *
import XenAPI
from .vm import VM
from xenadapter.helpers import use_logger

class GTemplate(GXenObjectType):

    class Meta:
        interfaces = (GAclXenObject,)

    os_kind = graphene.Field(graphene.String, description="If a template supports auto-installation, here a distro name is provided")
    hvm = graphene.Field(graphene.Boolean, required=True, description="True if this template works with hardware assisted virtualization")
    enabled = graphene.Field(graphene.Boolean, required=True, description="True if this template is available for regular users")


class Template(AbstractVM):
    EVENT_CLASSES = ['vm']
    ALLOW_EMPTY_XENSTORE = True
    VMEMPEROR_TEMPLATE_PREFIX = 'vm/data/vmemperor/template'
    db_table_name = 'tmpls'
    GraphQLType = GTemplate

    @classmethod
    def filter_record(cls, xen, record, ref):
        return record['is_a_template']

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

        new_rec['enabled'] = cls.is_enabled(record)

        #read xenstore data
        xenstore_data = record['xenstore_data']
        if not cls.VMEMPEROR_TEMPLATE_PREFIX in xenstore_data:
            if new_rec['hvm'] is False:
                if 'os_kind' in record['other_config']:
                    new_rec['os_kind'] = record['other_config']['os_kind']
                else:
                    if 'reference_label' in record:
                        for OS in 'ubuntu','centos', 'debian':
                            if record['reference_label'].startswith(OS):
                                new_rec['os_kind'] = OS
                                break

            return new_rec

        template_settings = json.load(xenstore_data[cls.VMEMPEROR_TEMPLATE_PREFIX])
        new_rec['os_kind'] = template_settings['os_kind']
        return new_rec

    @classmethod
    def get_access_data(cls, record):
        if cls.is_enabled(record):
            return super().get_access_data(record)
        else:
            return []

    @classmethod
    def is_enabled(cls, record):
        return 'vmemperor' in record['tags']


    @use_logger
    def clone(self, name_label):
        try:
            new_vm_ref = self.__getattr__('clone')(name_label)
            vm = VM(self.xen, new_vm_ref)
            self.log.info(f"New VM is created: ref:{vm.ref}, name_label: {name_label}")
            return vm
        except XenAPI.Failure as f:
            raise XenAdapterAPIError(self.log, f"Failed to clone template: {f.details}")

    @use_logger
    def set_enabled(self, enabled):
        '''
        Adds/removes tag 'vmemperor'
        :param enabled:
        :return:
        '''
        try:
            if enabled:
                self.add_tags('vmemperor')
                self.log.info(f"enabled")
            else:
                self.remove_tags('vmemperor')
                self.log.info(f"disabled")
        except XenAPI.Failure as f:
            raise XenAdapterAPIError(self.log, f"Failed to {'enable' if enabled else 'disable'} template: {f.details}")



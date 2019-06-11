from typing import Union, Optional

from authentication import with_default_authentication
from handlers.graphql.types.vdi import VDIActions, GVDI
from handlers.graphql.utils.querybuilder.querybuilder import QueryBuilder
from xenadapter.quotaobject import QuotaObject
from xenadapter.sr import SR
from xenadapter.vbd import VBD
from xenadapter.helpers import use_logger
from exc import *
import XenAPI
from xenadapter.xenobject import XenObject
from xenadapter.aclxenobject import ACLXenObject


class Attachable:
    import xenadapter.vm
    @use_logger
    def _attach(self : XenObject, vm: xenadapter.vm.VM, type : str, mode: str, empty=False, sync=False) -> Optional[Union[VBD, str]]:
        '''
        Attach self (XenObject - either ISO or Disk) to vm VM with disk type type
        :param vm:VM to attach to
        :param mode: 'RO'/'RW'
        :param type: 'CD'/'Disk'/'Floppy'
        :return VBD if in sync mode. In async mode return task ID for plugging if VM state is Running, and None otherwise
        '''
        #vm.check_access('attach') #done by vmemperor

        vm_vbds = vm._get_VBDs() # no cached version
        my_vbds = self.get_VBDs()

        userdevice_max = -1
        for vm_vbd in vm_vbds:
            for vdi_vbd in my_vbds:
                if vm_vbd == vdi_vbd:
                    self.log.warning (f"Disk is already attached to {vm} using VBD '{vm_vbd}'")
                    if sync:
                        return VBD(self.xen, vm_vbd)
                    else:
                        return None
            try:
                userdevice = int(VBD(self.xen, vm_vbd).get_userdevice())
            except ValueError:
                userdevice = -1

            if userdevice_max < userdevice:
                userdevice_max = userdevice

        userdevice_max += 1

        args = {'VM': vm.ref, 'VDI': self.ref,
                'userdevice': str(userdevice_max),
        'bootable' : True, 'mode' :mode, 'type' : type, 'empty' : empty,
        'other_config' : {},'qos_algorithm_type': '', 'qos_algorithm_params': {}}

        try:
            if sync:
                vbd_ref =  VBD.create(self.xen, args)
            else:
                task_id = VBD.async_create(self.xen, args)
                return task_id
        except XenAPI.Failure as f:
            raise XenAdapterAPIError(self.xen.xen.log, "Failed to create VBD", f.details)


        # Plug
        if vm.get_power_state() == 'Running' and vm.get_domain_type == 'pv':
            try:
                if sync:
                     vbd = VBD(self.xen, vbd_ref)
                     vbd.plug()
                     return vbd
                else:
                    return VBD(self.xen, vbd_ref).async_plug()
            except:
                if sync:
                    return vbd
                else:
                    return None
        else:
            if sync:
                return VBD(self.xen, vbd_ref)
            else:
                return None


    @use_logger
    def _detach(self : XenObject, vm, sync=False):
        vbds = vm.get_VBDs()
        for vbd_ref in vbds:
            vbd = VBD(xen=self.xen, ref=vbd_ref)
            vdi = vbd.get_VDI()
            if vdi == self.ref:
                break
        else:
            return None


        try:
            if sync:
                return vbd.destroy()
            else:
                return vbd.async_destroy()
        except XenAPI.Failure as f:
            raise XenAdapterAPIError(self.log, "Failed to detach disk:", f.details)

    @classmethod
    def SR_type(cls, xen,  record):
        '''
        This method returns SR type of this record
        :param record:
        :return:
        '''
        sr = SR(xen, record['SR'])
        return sr.get_content_type()


class VDI(QuotaObject, Attachable):
    api_class = 'VDI'
    db_table_name = 'vdis'
    EVENT_CLASSES = ['vdi']
    GraphQLType = GVDI
    Actions = VDIActions


    @classmethod
    def create(cls, xen, user, sr_ref, size, name_label=None):
        """
        Creates a VDI of a certain size in storage repository
        :param sr_ref: Storage Repository ref
        :param size: Disk size
        :param name_label: Name of created disk
        :return: Virtual Disk Image object
        """

        if not name_label:
            sr = SR(xen, sr_ref)
            name_label = sr.get_name_label() + ' disk'

        args = {'SR': sr_ref, 'virtual_size': str(size), 'type': 'system', \
                'sharable': False, 'read_only': False, 'other_config': {}, \
                'name_label': name_label}
        try:
            vdi_ref = cls._create(xen, args)
            vdi = cls(xen, vdi_ref)
            vdi.manage_actions(VDIActions.ALL, user=user)
            vdi.set_main_owner(user)

        except XenAPI.Failure as f:
            raise XenAdapterAPIError(xen.log, "Failed to create VDI:", f.details)

    @classmethod
    def process_record(cls, xen, ref, record):
        new_record = super().process_record(xen, ref, record)
        new_record['content_type'] = Attachable.SR_type(xen, record)
        return new_record


    @classmethod
    def filter_record(cls, xen, record, ref):
        return not record['is_a_snapshot'] and record['type'] in ('system', 'user', 'ephemeral')

    @staticmethod
    def resolve_all():
        '''
        Resolves all objects belonging to a user
        :param cls:

        :return:
        '''
        from handlers.graphql.resolvers import with_connection

        @with_connection
        @with_default_authentication
        def resolver(root, info, **kwargs):
            '''

            :param root:
            :param info:
            :param kwargs: Optional keyword arguments for pagination: "page" and "page_size"

            :return:
            '''
            additional_string = ""
            if 'only_isos' in kwargs and kwargs['only_isos'] is not None:
                operator = "==" if kwargs['only_isos'] else '!='
                additional_string = f".filter(lambda item: item['content_type'] {operator} 'iso')"
            builder = QueryBuilder(id=None, info=info,additional_string=additional_string, user_authenticator=info.context.user_authenticator)
            return builder.run_query()


        return resolver


    def destroy(self):
        sr = SR(xen=self.xen, ref=self.get_SR())
        if 'vdi_destroy' in sr.get_allowed_operations():
            self.async_destroy()
            return True
        else:
            return False

    def attach(self, vm, sync=False) -> VBD:
        '''
        Attaches ISO to a vm
        :param vm:
        :return:
        '''
        mode = "RO" if self.get_read_only() else "RW"
        type = "CD" if self.get_content_type() == "iso" else "Disk"
        return self._attach(vm, type, mode, sync=sync)
        

    def detach(self, vm, sync=False):
        return self._detach(vm, sync=sync)





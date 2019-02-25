from handlers.graphql.resolvers.sr import resolve_sr, srType
from handlers.graphql.resolvers.vm import resolve_vms, vmType
from xenadapter.sr import SR
from xenadapter.vbd import VBD
from .xenobject import *
from xenadapter.helpers import use_logger
from exc import *
import XenAPI


class Attachable:
    import xenadapter.vm
    @use_logger
    def _attach(self : XenObject, vm: xenadapter.vm.VM, type : str, mode: str, empty=False, sync=False) -> str:
        '''
        Attach self (XenObject - either ISO or Disk) to vm VM with disk type type
        :param vm:VM to attach to
        :param mode: 'RO'/'RW'
        :param type: 'CD'/'Disk'/'Floppy'
        :return VBD
        '''
        #vm.check_access('attach') #done by vmemperor

        vm_vbds = vm.get_VBDs()
        my_vbds = self.get_VBDs()

        userdevice_max = -1
        for vm_vbd in vm_vbds:
            for vdi_vbd in my_vbds:
                if vm_vbd == vdi_vbd:
                    self.log.warning (f"Disk is already attached to {vm} using VBD '{vm_vbd}'")
                    return VBD(vm_vbd)
            try:
                userdevice = int(self.xen.xen.api.VBD.get_userdevice(vm_vbd))
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
            vbd_ref =  VBD.create(self.xen, args)
        except XenAPI.Failure as f:
            raise XenAdapterAPIError(self.xen.xen.log, "Failed to create VBD", f.details)


        # Plug
        if vm.get_power_state() == 'Running':
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
            vdi = VBD.get_VDI()
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
    def SR_type(cls, xen,  record, ref):
        '''
        This method returns SR type of this record
        :param record:
        :return:
        '''
        sr = SR(xen, record['SR'])
        return sr.get_content_type()

class DiskImage(GXenObject):
    SR = graphene.Field(srType, resolver=resolve_sr)
    VMs = graphene.List(vmType)
    virtual_size = graphene.Field(graphene.Float, required=True)

class GISO(GXenObjectType):
    class Meta:
        interfaces = (GAclXenObject, DiskImage)

    from handlers.graphql.resolvers.vm import resolve_vms
    VMs = graphene.Field(graphene.List(vmType), resolver=resolve_vms)
    location = graphene.Field(graphene.String, required=True)


class ISO(XenObject, Attachable):
    api_class = 'VDI'
    db_table_name = 'isos'
    EVENT_CLASSES = ['vdi']
    GraphQLType = GISO

    from .vm import VM

    @classmethod
    def filter_record(cls, xen, record, ref):
       return cls.SR_type(xen, record, ref) == 'iso'


    def attach(self, vm : VM, sync=False) -> VBD:
        '''
        Attaches VDI to a vm as RW
        :param vm:
        WARNING: It does not check whether self is a real ISO, do it for yourself.

        '''
        return self._attach(vm, 'CD', 'RO', sync=sync)

    def detach(self, vm: VM, sync=False):
        return self._detach(vm, sync=sync)


class GVDI(GXenObjectType):
    class Meta:
        interfaces = (GAclXenObject, DiskImage)
    VMs = graphene.Field(graphene.List(vmType), resolver=resolve_vms)



class VDI(ACLXenObject, Attachable):
    api_class = 'VDI'
    db_table_name = 'vdis'
    EVENT_CLASSES = ['vdi']
    GraphQLType = GVDI

    @classmethod
    def create(cls, xen, sr_ref, size, access = None, name_label=None):
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
            vdi_ref = VDI.create(xen, args)
            vdi = VDI(xen, vdi_ref)
            if access:
                for user, action in access.items():
                    vdi.manage_actions(action, user=user)

        except XenAPI.Failure as f:
            raise XenAdapterAPIError(xen.log, "Failed to create VDI:", f.details)


    @classmethod
    def filter_record(cls, xen, record, ref):
        return cls.SR_type(xen, record, ref) != 'iso'

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
        return self._attach(vm, 'Disk', 'RW', sync=sync)

    def detach(self, vm, sync=False):
        return self._detach(vm, sync=sync)


class VDIorISO:
    def __new__(cls, xen, ref):
        db = xen.xen.db

        if db.table(ISO.db_table_name).get(ref).run():
            return ISO(xen, ref)
        elif db.table(VDI.db_table_name).get(ref).run():
            return VDI(xen,  ref)
        else:
            return None



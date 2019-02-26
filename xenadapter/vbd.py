import graphene

from handlers.graphql.resolvers.diskimage import resolve_vdi, vdiType
from handlers.graphql.resolvers.vm import vmType, resolve_vm
from handlers.graphql.types.gxenobjecttype import GXenObjectType
from xenadapter.xenobject import XenObject

from rethinkdb import RethinkDB
r = RethinkDB()


class GVBD(GXenObjectType):
    ref = graphene.Field(graphene.ID, required=True, description="Unique constant identifier/object reference")
    uuid = graphene.Field(graphene.ID, required=True,
                          description="Unique non-primary identifier/object reference")

    VM = graphene.Field(graphene.List(vmType), resolver=resolve_vm)
    VDI = graphene.Field(graphene.List(vdiType), resolver=resolve_vdi)




class VBD(XenObject):
    api_class = 'VBD'
    EVENT_CLASSES = ['vbd']
    db_table_name = 'vbds'


    def delete(self) -> bool:
        '''

        :return: False if unable to unplug device from running VM
        '''
        from .vm import VM
        vm = VM(self.xen, ref=self.get_VM())

        if vm.get_power_state() == 'Running' and self.get_unpluggable():
            self.unplug()
        else:
            return False

        self.destroy()
        return True

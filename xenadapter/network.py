from handlers.graphql.types.network import GNetwork, NetworkActions
from xenadapter.aclxenobject import ACLXenObject
from xenadapter.vif import VIF
from .xenobject import *
from xenadapter.helpers import use_logger


class Network(ACLXenObject):
    from .vm import VM
    api_class = "network"
    db_table_name = 'nets'
    EVENT_CLASSES = ['network']
    GraphQLType = GNetwork
    Actions = NetworkActions



    def __init__(self, xen, ref):
        super().__init__(xen, ref)

    @use_logger
    def attach(self, vm: VM, sync=False) -> VIF:
        args = {'VM': vm.ref, 'network': self.ref , 'device': str(len(vm.get_VIFs())),
                'MAC': '', 'MTU': self.get_MTU() , 'other_config': {},
                'qos_algorithm_type': '', 'qos_algorithm_params': {}}
        try:
            if sync:
                return VIF.create(self.xen, args)
            else:
                return VIF.async_create(self.xen, args)
        except XenAPI.Failure as f:
            raise XenAdapterAPIError(self.log, "Network::attach: Failed to create VIF",f.details)


    @use_logger
    def detach(self, vm: VM):
        for ref in vm.get_VIFs():
            vif = VIF(self.xen, ref)
            if vif.get_network() == self.ref:
                try:
                    return vif.async_destroy()
                except XenAPI.Failure as f:
                    raise XenAdapterAPIError(self.log, "Network::detach: Failed to detach VIF", f.details)
                break
        else:
            self.log.warning(f"Not attached to {vm}")
            return None


    @classmethod
    def filter_record(cls, xen, record, ref):
        return True
        #return record['bridge'] != 'xenapi'




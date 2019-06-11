import graphene

from graphene import ObjectType

from handlers.graphql.graphene_with_flags.schema import SchemaWithFlags
from handlers.graphql.mutations.accessset import SRAccessSet, VDIAccessSet, NetAccessSet, VMAccessSet, \
    TemplateAccessSet, PoolAccessSet
from handlers.graphql.mutations.attachnet import AttachNetworkMutation
from handlers.graphql.mutations.attachvdi import AttachVDIMutation
from handlers.graphql.mutations.createvm import CreateVM
from handlers.graphql.mutations.network import NetworkMutation
from handlers.graphql.mutations.pool import PoolMutation
from handlers.graphql.mutations.quota import QuotaMutation
from handlers.graphql.mutations.task import TaskRemoveMutation
from handlers.graphql.mutations.vm import VMDestroyMutation, VMSuspendMutation, VMPauseMutation, VMRebootMutation, \
    VMShutdownMutation, VMStartMutation, VMMutation, VMSnapshotMutation
from handlers.graphql.mutations.vmsnapshot import VMRevertMutation, VMSnapshotDestroyMutation
from handlers.graphql.resolvers.console import resolve_console
from handlers.graphql.resolvers.quota import resolve_quotas, resolve_quota
from handlers.graphql.resolvers.task import resolve_tasks
from handlers.graphql.resolvers.vbd import resolve_vbd
from handlers.graphql.resolvers.vdi import resolve_vdis, resolve_isos_for_install
from handlers.graphql.mutations.sr import SRMutation, SRDestroyMutation
from handlers.graphql.mutations.vdi import VDIMutation, VDIDestroyMutation
from handlers.graphql.types.vbd import GVBD
from handlers.graphql.types.vmsnapshot import GVMSnapshot
from handlers.graphql.utils.query import resolve_all, resolve_one
from handlers.graphql.utils.querybuilder.changefeedbuilder import ChangefeedBuilder
from handlers.graphql.utils.querybuilder.querybuilder import QueryBuilder
from handlers.graphql.utils.subscription import MakeSubscription, resolve_xen_item_by_key, \
    MakeSubscriptionWithChangeType, resolve_all_xen_items_changes
from handlers.graphql.resolvers.user import resolve_users, resolve_groups, resolve_user, resolve_filter_users, \
    resolve_current_user
from handlers.graphql.types.playbook import GPlaybook, resolve_playbooks, resolve_playbook
from handlers.graphql.types.playbooklauncher import PlaybookLaunchMutation
from handlers.graphql.types.user import User, CurrentUserInformation
from xenadapter.vdi import VDI
from handlers.graphql.types.vdi import GVDI
from handlers.graphql.types.host import GHost
from handlers.graphql.types.pool import GPool, Quota
from handlers.graphql.types.task import GTask
from handlers.graphql.types.template import GTemplate
from handlers.graphql.types.sr import GSR
from handlers.graphql.types.vm import GVM
from handlers.graphql.types.network import GNetwork

from handlers.graphql.mutations.template import TemplateMutation, TemplateCloneMutation, TemplateDestroyMutation
from rethinkdb import RethinkDB

r = RethinkDB()

class Query(ObjectType):

    vms = graphene.List(GVM, required=True, resolver=resolve_all(), description="All VMs available to user")
    vm = graphene.Field(GVM, ref=graphene.NonNull(graphene.ID), resolver=resolve_one())

    vm_snapshot = graphene.Field(GVMSnapshot, ref=graphene.NonNull(graphene.ID), resolver=resolve_one())
    templates = graphene.List(GTemplate, required=True, resolver=resolve_all(), description="All Templates available to user")
    template = graphene.Field(GTemplate,  ref=graphene.NonNull(graphene.ID), resolver=resolve_one())

    hosts = graphene.List(GHost, required=True, resolver=resolve_all())
    host = graphene.Field(GHost,  ref=graphene.NonNull(graphene.ID), resolver=resolve_one())

    pools = graphene.List(GPool, required=True, resolver=resolve_all())
    pool = graphene.Field(GPool, ref=graphene.NonNull(graphene.ID), resolver=resolve_one())

    networks = graphene.List(GNetwork, required=True, resolver=resolve_all(), description="All Networks available to user")
    network = graphene.Field(GNetwork,  ref=graphene.NonNull(graphene.ID), resolver=resolve_one(), description="Information about a single network")

    srs = graphene.List(GSR, required=True, resolver=resolve_all(),
                             description="All Storage repositories available to user")
    sr = graphene.Field(GSR,  ref=graphene.NonNull(graphene.ID), resolver=resolve_one(), description="Information about a single storage repository")

    vdis = graphene.Field(graphene.List(GVDI), only_isos=graphene.Boolean(description="True - print only ISO images; False - print everything but ISO images; null - print everything"), required=True, resolver=VDI.resolve_all(), description="All Virtual Disk Images (hard disks), available for user")
    vdi = graphene.Field(GVDI, ref=graphene.NonNull(graphene.ID), resolver=resolve_one(), description="Information about a single virtual disk image (hard disk)")

    vbd = graphene.Field(GVBD, ref=graphene.NonNull(graphene.ID), resolver=resolve_vbd, description="Information about a virtual block device of a VM")
    isos_for_install = graphene.Field(graphene.List(GVDI), description="ISO VDIs available for using as install ISO images", resolver=resolve_isos_for_install)

    playbooks = graphene.List(GPlaybook,  required=True, resolver=resolve_playbooks, description="List of Ansible-powered playbooks")
    playbook = graphene.Field(GPlaybook, id=graphene.ID(), resolver=resolve_playbook,
                              description="Information about Ansible-powered playbook")

    tasks = graphene.Field(graphene.List(GTask), required=True, start_date = graphene.DateTime(), end_date = graphene.DateTime(),  resolver=resolve_tasks(), description="All Tasks available to user")
    task = graphene.Field(GTask, ref=graphene.NonNull(graphene.ID), resolver=resolve_one(), description="Single Task")

    console = graphene.Field(graphene.String, required=False, vm_ref=graphene.NonNull(graphene.ID),
                             description="One-time link to RFB console for a VM", resolver=resolve_console)

    users = graphene.List(User, required=True,
                          description="All registered users (excluding root)", resolver=resolve_users)
    groups = graphene.List(User, required=True,
                          description="All registered groups", resolver=resolve_groups)
    user = graphene.Field(User, description="User or group information", id=graphene.ID(), resolver=resolve_user())
    current_user = graphene.Field(CurrentUserInformation, description="current user or group information", resolver=resolve_current_user)

    find_user = graphene.Field(graphene.List(User), query=graphene.NonNull(graphene.String), required=True, resolver=resolve_filter_users)

    quotas = graphene.Field(graphene.List(Quota), required=True, resolver=resolve_quotas)
    quota = graphene.Field(Quota, required=True, resolver=resolve_quota, user=graphene.NonNull(graphene.String))







class Mutation(ObjectType):
    create_VM = CreateVM.Field(description="Create a new VM")

    template = TemplateMutation.Field(description="Edit template options")
    template_clone = TemplateCloneMutation.Field(description="Clone template")
    template_delete = TemplateDestroyMutation.Field(description="Delete template")
    template_access_set = TemplateAccessSet.Field(description="Set template access rights")

    vm = VMMutation.Field(description="Edit VM options")
    vm_start = VMStartMutation.Field(description="Start VM")
    vm_shutdown = VMShutdownMutation.Field(description="Shut down VM")
    vm_reboot = VMRebootMutation.Field(description="Reboot VM")
    vm_pause = VMPauseMutation.Field(description="If VM is Running, pause VM. If Paused, unpause VM")
    vm_suspend = VMSuspendMutation.Field(description="If VM is Running, suspend VM. If Suspended, resume VM")
    vm_snapshot = VMSnapshotMutation.Field(description="Make a snapshot")

    vm_revert = VMRevertMutation.Field(description="Restore VM state from a snapshot")
    vm_snapshot_destroy = VMSnapshotDestroyMutation.Field(description="Destroy a VM Snapshot")

    vm_delete = VMDestroyMutation.Field(description="Delete a Halted VM")
    vm_access_set = VMAccessSet.Field(description="Set VM access rights")

    playbook_launch = PlaybookLaunchMutation.Field(description="Launch an Ansible Playbook on specified VMs")

    network = NetworkMutation.Field(description="Edit Network options")
    net_attach = AttachNetworkMutation.Field(description="Attach VM to a Network by creating a new Interface")
    net_access_set = NetAccessSet.Field(description="Set network access rights")

    vdi = VDIMutation.Field(description="Edit VDI options")
    vdi_attach = AttachVDIMutation.Field(description="Attach VDI to a VM by creating a new virtual block device")
    vdi_access_set = VDIAccessSet.Field(description="Set VDI access rights")
    vdi_delete = VDIDestroyMutation.Field(description="Delete a VDI")

    sr = SRMutation.Field(description="Edit SR options")
    sr_access_set = SRAccessSet.Field(description="Set SR access rights")
    sr_delete = SRDestroyMutation.Field(description="Delete a SR")

    pool = PoolMutation.Field(description="Edit pool options")
    pool_access_set = PoolAccessSet.Field(description="Set pool access rights")


    task_delete = TaskRemoveMutation.Field(description="Delete a Task")

    quota_set = QuotaMutation.Field(description="Adjust quota")




class Subscription(ObjectType):
    '''
    All subscriptions must return  Observable
    '''
    vms = graphene.Field(MakeSubscriptionWithChangeType(GVM), required=True, with_initials=graphene.Argument(graphene.Boolean, default_value=False), description="Updates for all VMs")
    vm = graphene.Field(MakeSubscription(GVM), ref=graphene.NonNull(graphene.ID), description="Updates for a particular VM")

    vm_snapshot = graphene.Field(MakeSubscription(GVMSnapshot), ref=graphene.NonNull(graphene.ID), description="Updates for a VM Snapshot")

    templates = graphene.Field(MakeSubscriptionWithChangeType(GTemplate), required=True, with_initials=graphene.Argument(graphene.Boolean, default_value=False), description="Updates for all Templates")
    template = graphene.Field(MakeSubscription(GTemplate), ref=graphene.NonNull(graphene.ID), description="Updates for a particular Template")

    hosts = graphene.Field(MakeSubscriptionWithChangeType(GHost), required=True, with_initials=graphene.Argument(graphene.Boolean, default_value=False), description="Updates for all Hosts")
    host = graphene.Field(MakeSubscription(GHost), ref=graphene.NonNull(graphene.ID), description="Updates for a particular Host")

    pools = graphene.Field(MakeSubscriptionWithChangeType(GPool), required=True, with_initials=graphene.Argument(graphene.Boolean, default_value=False), description="Updates for all pools available in VMEmperor")
    pool = graphene.Field(MakeSubscription(GPool), ref=graphene.NonNull(graphene.ID), description="Updates for a particular Pool")
    
    networks = graphene.Field(MakeSubscriptionWithChangeType(GNetwork), required=True, with_initials=graphene.Argument(graphene.Boolean, default_value=False), description="Updates for all Networks")
    network = graphene.Field(MakeSubscription(GNetwork), ref=graphene.NonNull(graphene.ID), description="Updates for a particular Network")
    
    srs = graphene.Field(MakeSubscriptionWithChangeType(GSR), required=True, with_initials=graphene.Argument(graphene.Boolean, default_value=False), description="Updates for all Storage Repositories")
    sr = graphene.Field(MakeSubscription(GSR), ref=graphene.NonNull(graphene.ID), description="Updates for a particular Storage Repository")

    vdis = graphene.Field(MakeSubscriptionWithChangeType(GVDI), required=True, with_initials=graphene.Argument(graphene.Boolean, default_value=False),
                              only_isos=graphene.Boolean(description="True - print only ISO images; False - print everything but ISO images; null - print everything"),
                              description="Updates for all VDIs", resolver=resolve_vdis)
    vdi = graphene.Field(MakeSubscription(GVDI), ref=graphene.NonNull(graphene.ID), description="Updates for a particular VDI")

    tasks = graphene.Field(MakeSubscriptionWithChangeType(GTask), required=True, with_initials=graphene.Argument(graphene.Boolean, default_value=False), description="Updates for all XenServer tasks")
    task = graphene.Field(MakeSubscription(GTask),  ref=graphene.NonNull(graphene.ID), description="Updates for a particular XenServer Task")




    def resolve_task(*args, **kwargs):
        return resolve_xen_item_by_key()(*args, **kwargs)

    def resolve_tasks(*args, **kwargs):
        return resolve_all_xen_items_changes(GTask)(*args, **kwargs)

    def resolve_vms(*args, **kwargs):
        return resolve_all_xen_items_changes(GVM)(*args, **kwargs)

    def resolve_vm(*args, **kwargs):
        return resolve_xen_item_by_key()(*args, **kwargs)

    def resolve_vdi(*args, **kwargs):
        return resolve_xen_item_by_key()(*args, **kwargs)

    def resolve_templates(*args, **kwargs):
        return resolve_all_xen_items_changes(GTemplate)(*args, **kwargs)

    def resolve_template(*args, **kwargs):
        return resolve_xen_item_by_key()(*args, **kwargs)

    def resolve_hosts(*args, **kwargs):
        return resolve_all_xen_items_changes(GHost)(*args, **kwargs)

    def resolve_host(*args, **kwargs):
        return resolve_xen_item_by_key()(*args, **kwargs)

    def resolve_pools(*args, **kwargs):
        return resolve_all_xen_items_changes(GPool)(*args, **kwargs)

    def resolve_pool(*args, **kwargs):
        return resolve_xen_item_by_key()(*args, **kwargs)

    def resolve_networks(*args, **kwargs):
        return resolve_all_xen_items_changes(GNetwork)(*args, **kwargs)

    def resolve_network(*args, **kwargs):
        return resolve_xen_item_by_key()(*args, **kwargs)

    def resolve_srs(*args, **kwargs):
        return resolve_all_xen_items_changes(GSR)(*args, **kwargs)

    def resolve_sr(*args, **kwargs):
        return resolve_xen_item_by_key()(*args, **kwargs)




schema = SchemaWithFlags(query=Query, mutation=Mutation, subscription=Subscription)
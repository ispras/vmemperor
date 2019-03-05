import uuid
from typing import Sequence

import graphene
from rethinkdb import RethinkDB

from connman import ReDBConnection
from xenadapter.disk import VDI
from xenadapter.network import Network

from handlers.graphql.graphql_handler import ContextProtocol
from handlers.graphql.resolvers import with_connection
from authentication import with_authentication, with_default_authentication
from handlers.graphql.types.input.createvdi import NewVDI
from handlers.graphql.types.tasks.createvm import CreateVMTask, CreateVMTaskList
from xenadapter.sr import SR
from xenadapter.template import Template
import tornado.ioloop
from xenadapter import XenAdapterPool
from handlers.graphql.types.vm import SetDisksEntry


class NetworkConfiguration(graphene.InputObjectType):
    ip = graphene.InputField(graphene.String, required=True)
    gateway = graphene.InputField(graphene.String, required=True)
    netmask = graphene.InputField(graphene.String, required=True)
    dns0 = graphene.InputField(graphene.String, required=True)
    dns1 = graphene.InputField(graphene.String)


class AutoInstall(graphene.InputObjectType):
    hostname = graphene.InputField(graphene.String, description="VM hostname", required=True)
    mirror_url = graphene.InputField(graphene.String, description="Network installation URL")
    username = graphene.InputField(graphene.String, required=True, description="Name of the newly created user")
    password = graphene.InputField(graphene.String, required=True, description="User and root password")
    fullname = graphene.InputField(graphene.String, description="User's full name")
    partition = graphene.InputField(graphene.String, required=True, description="Partition scheme (TODO)")
    static_ip_config = graphene.InputField(NetworkConfiguration, description="Static IP configuration, if needed")



def createvm(ctx : ContextProtocol, task_id : str, user: str,
             template: str, VCPUs : int, disks : Sequence[NewVDI], ram : int, name_label : str, name_description : str, network : str, iso : str =None, install_params : AutoInstall=None,
             Template: Template = None, VDI: VDI = None ):

    with ReDBConnection().get_connection():
        xen = XenAdapterPool().get()
        task_list = CreateVMTaskList()
        try:

            def disk_entries():
                for entry in disks:
                    sr = SR(xen, entry.SR)
                    if sr.check_access(ctx.user_authenticator, SR.Actions.vdi_create):
                        yield SetDisksEntry(SR=sr, size=entry.size)


            task_list.upsert_task(user, CreateVMTask(id=task_id, ref=template, state='cloning',
                                                     message=f'cloning template'))
            net = Network(xen, network)
            # TODO: Check quotas here as well as in create vdi method
            provision_config = list(disk_entries())

            vm = Template.clone(name_label)
            task_list.upsert_task(user, CreateVMTask(id=task_id, ref=vm.ref, state='cloned', message=f'cloned from {Template}'))
            vm.set_name_description(name_description)
            vm.create(
                insert_log_entry=lambda ref, state, message: task_list.upsert_task(user, CreateVMTask(id=task_id, ref=ref, state=state, message=message)),
                provision_config=provision_config,
                ram_size=ram,
                net=net,
                template=Template,
                iso=VDI,
                hostname=install_params.hostname if install_params else None,
                ip=install_params.static_ip_config if install_params else None,
                install_url=install_params.mirror_url if install_params else None,
                username=install_params.username if install_params else None,
                password=install_params.password if install_params else None,
                partition=install_params.partition if install_params else None,
                fullname=install_params.fullname if install_params else None,
                vcpus = VCPUs,
                user = user if not user == "root" else None,
        )
        finally:
            XenAdapterPool().unget(xen)


class CreateVM(graphene.Mutation):
    task_id = graphene.Field(graphene.ID, required=True, description="Installation task ID")

    class Arguments:
        template = graphene.Argument(graphene.ID, required=True, description="Template ID")
        disks = graphene.Argument(graphene.List(NewVDI))
        ram = graphene.Argument(graphene.Float, required=True, description="RAM size in megabytes")
        name_label = graphene.Argument(graphene.String, required=True, description="VM human-readable name")
        name_description = graphene.Argument(graphene.String, required=True, description="VM human-readable description")
        network = graphene.Argument(graphene.ID, description="Network ID to connect to")
        iso = graphene.Argument(graphene.ID, description="ISO image mounted if conf parameter is null")
        install_params = graphene.Argument(AutoInstall, description="Automatic installation parameters, the installation is done via internet. Only available when template.os_kind is not empty")
        VCPUs = graphene.Argument(graphene.Int, default_value=1, description="Number of created virtual CPUs")


    @staticmethod
    @with_connection
    @with_authentication(access_class=Template, access_action=Template.Actions.clone, id_field="template")
    @with_authentication(access_class=VDI, access_action=VDI.Actions.plug, id_field="iso")
    #@with_authentication(access_class=Network, access_action=Network.Actions.)
    def mutate(root, info, *args, **kwargs):
        task_id  = str(uuid.uuid4())
        ctx :ContextProtocol = info.context
        if 'VDI' not in kwargs or kwargs['VDI'].type != 'iso':
            raise TypeError("VDI argument is not ISO image")
        tornado.ioloop.IOLoop.current().run_in_executor(ctx.executor,
        lambda: createvm(ctx, task_id, user=ctx.user_authenticator.get_id(), *args, **kwargs))
        return CreateVM(task_id=task_id)

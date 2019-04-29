import uuid
from typing import Sequence

import graphene

from connman import ReDBConnection
from customtask.customtask import CustomTask
from handlers.graphql.types.input.newvdi import NewVDI
from handlers.graphql.types.input.vm import AutoInstall, VMInput
from utils.user import check_user_input
from xenadapter.vdi import VDI
from xenadapter.network import Network

from handlers.graphql.graphql_handler import ContextProtocol
from handlers.graphql.resolvers import with_connection
from authentication import with_authentication, return_if_access_is_not_granted
from xenadapter.sr import SR
from xenadapter.template import Template
import tornado.ioloop
from xentools.xenadapterpool import XenAdapterPool
from handlers.graphql.types.vm import SetDisksEntry


def createvm(ctx : ContextProtocol, task_id : str,
             vm_options: VMInput,
             template: str, disks : Sequence[NewVDI], network : str, iso : str =None, install_params : AutoInstall =None,
             **kwargs):


    with ReDBConnection().get_connection():
        xen = XenAdapterPool().get()
        task = CustomTask(task_id, Template, template, "create_vm", ctx.user_authenticator)
        if not vm_options.main_owner and not ctx.user_authenticator.is_admin():
            vm_options.main_owner = 'users/' + ctx.user_authenticator.get_id()
        user = vm_options.main_owner

        try:
            if not check_user_input(user, ctx.user_authenticator):
                task.set_status(status='failure', error_info_add=f"Incorrect value of argument: 'vmOptions.mainOwner': {user}")
                return
            def disk_entries():
                for entry in disks:
                    sr = SR(xen, entry.SR)
                    if sr.check_access(ctx.user_authenticator, SR.Actions.vdi_create):
                        yield SetDisksEntry(SR=sr, size=entry.size)



            # TODO: Check quotas here as well as in create vdi method
            provision_config = list(disk_entries())
            tmpl = kwargs['Template']
            vm = tmpl.clone_as_vm(f"New VM for {user}")
            task.set_status(progress=0.1, result=vm.ref)

            vm.create(
                task=task,
                provision_config=provision_config,
                net=kwargs.get('Network'),
                template=tmpl,
                iso=kwargs.get('VDI'),
                install_params=install_params,
                options=vm_options
            )
        finally:
            XenAdapterPool().unget(xen)


class CreateVM(graphene.Mutation):
    task_id = graphene.Field(graphene.ID, required=False, description="Installation task ID")
    granted = graphene.Field(graphene.Boolean, required=True)
    reason = graphene.Field(graphene.String)

    class Arguments:
        vm_options = graphene.Argument(VMInput, required=True, description="Basic VM options. Leave fields empty to use Template options")
        template = graphene.Argument(graphene.ID, required=True, description="Template ID")
        disks = graphene.Argument(graphene.List(NewVDI))
        network = graphene.Argument(graphene.ID, description="Network ID to connect to")
        iso = graphene.Argument(graphene.ID, description="ISO image mounted if conf parameter is null")
        install_params = graphene.Argument(AutoInstall, description="Automatic installation parameters, the installation is done via internet. Only available when template.os_kind is not empty")


    @staticmethod
    @with_connection
    @with_authentication(access_class=Template, access_action=Template.Actions.clone, id_field="template")
    @with_authentication(access_class=VDI, access_action=VDI.Actions.plug, id_field="iso")
    @with_authentication(access_class=Network, access_action=Network.Actions.attaching, id_field="network")
    @return_if_access_is_not_granted([("Template", "template", Template.Actions.clone),
                                      ("VDI", "iso", VDI.Actions.plug),
                                      ("Network", "network", Network.Actions.attaching)])
    def mutate(root, info,  *args, **kwargs):
        task_id  = str(uuid.uuid4())
        ctx :ContextProtocol = info.context
        if 'VDI' in kwargs and kwargs['VDI'].type != 'iso':
            raise TypeError("VDI argument is not ISO image")

        tornado.ioloop.IOLoop.current().run_in_executor(ctx.executor,
        lambda: createvm(ctx, task_id, *args, **kwargs))
        return CreateVM(task_id=task_id, granted=True)

from functools import partial
from urllib.parse import urlsplit

import graphene
from graphql import ResolveInfo

from handlers.graphql.graphql_handler import ContextProtocol
from handlers.graphql.mutation_utils.asyncmutationmethod import AsyncMutationMethod
from handlers.graphql.mutation_utils.cleanup import cleanup_defaults
from handlers.graphql.mutation_utils.mutationmethod import MutationMethod, MutationHelper
from handlers.graphql.resolvers import with_connection
from authentication import with_authentication, with_default_authentication, return_if_access_is_not_granted
from handlers.graphql.types.input.abstractvm import platform_validator, vcpus_input_validator, memory_input_validator
from handlers.graphql.utils.editmutation import create_edit_mutation, create_async_mutation
from xenadapter.xenobject import set_subtype_from_input
from input.template import TemplateInput, InstallOSOptionsInput
from xenadapter.abstractvm import set_VCPUs, set_memory
from xenadapter.template import Template
from xentools.os import Distro, OSChooser


def set_install_options(input: TemplateInput, tmpl : Template):
    def get_install_options_dict():
        other_config = tmpl.get_other_config()
        os = OSChooser.get_os(other_config)
        if not os:
            return {
                'distro': None,
                'release': None,
                'arch': None,
                'install_repository': None
            }
        return {
            'distro': os.get_distro(),
            'release': os.get_release(),
            'arch': os.get_arch(),
            'install_repository': os.get_install_repository(),
        }

    old_val = get_install_options_dict()
    clean_input = cleanup_defaults(input)
    if 'install_options' in clean_input:
        tmpl.set_install_options(clean_input['install_options'])

    new_val = get_install_options_dict()
    return old_val, new_val

def install_options_validator(input: TemplateInput, _):
    '''
    Use the fact that both {} and None are falsy values.
    Either distro  is not set (or cleared) or if distro is set other parameters should be set
    :param input:
    :return:
    '''
    opts: InstallOSOptionsInput = input.install_options
    if not opts:
        return False, None
    if opts.distro:
        if not (opts.release and opts.arch and opts.install_repository):
            return False, "Specify release, arch and installRepository for distro"

    if opts.install_repository:
        url =  urlsplit(opts.install_repository)
        schemes = ('http', 'ftp')
        if url.scheme not in schemes:
            return False, f"installOptions.installRepository: unsupported url scheme. Supported: {','.join(schemes)}"
    return True, None

mutations = [
            MutationMethod(func="name_label", access_action=Template.Actions.rename),
            MutationMethod(func="name_description", access_action=Template.Actions.rename),
            MutationMethod(func="domain_type", access_action=Template.Actions.change_domain_type),
            MutationMethod(func=(set_subtype_from_input("platform"), platform_validator), access_action=Template.Actions.changing_VCPUs),
            MutationMethod(func=(set_VCPUs, vcpus_input_validator), access_action=Template.Actions.changing_VCPUs),
            MutationMethod(func=(set_memory, memory_input_validator), access_action=Template.Actions.changing_memory_limits),
            MutationMethod(func=(set_install_options, install_options_validator), access_action=Template.Actions.change_install_os_options),
        ]

TemplateMutation = create_edit_mutation("TemplateMutation", "template", TemplateInput, Template, mutations)





class TemplateCloneMutation(graphene.Mutation):
    task_id = graphene.ID(required=False, description="clone task ID")
    granted = graphene.Boolean(required=True, description="Shows if access to clone is granted")
    reason = graphene.String()

    class Arguments:
        ref = graphene.ID(required=True)
        name_label = graphene.String(required=True, description="New name label")
        user = graphene.String(description="User/group to own resulting clone")

    @staticmethod
    @with_authentication(access_class=Template, access_action=Template.Actions.clone)
    @return_if_access_is_not_granted([("Template", "ref", Template.Actions.clone)])
    def mutate(root, info : ResolveInfo, ref, name_label, **kwargs):
        user = kwargs.get('user')
        tmpl: Template = kwargs['Template']
        if not user and not  info.context.user_authenticator.is_admin():
            user = 'users/' + info.context.user_authenticator.get_id()

        def post_template_clone_hook(result, ctx: ContextProtocol):
            new_template = Template(xen=ctx.xen, ref=result)
            new_template.manage_actions(Template.Actions.ALL, user=user)

        method = partial(tmpl.async_clone, name_label)
        task_id = AsyncMutationMethod.call(method, info.context,  post_template_clone_hook)
        return TemplateCloneMutation(granted=True, task_id=task_id)


TemplateDestroyMutation = create_async_mutation("TemplateDestroyMutation", "async_destroy", Template, Template.Actions.destroy)


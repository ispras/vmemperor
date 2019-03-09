import graphene

from handlers.graphql.graphql_handler import ContextProtocol
from handlers.graphql.mutation_utils.base import MutationMethod, MutationHelper
from handlers.graphql.resolvers import with_connection
from authentication import with_authentication, with_default_authentication
from handlers.graphql.types.objecttype import InputObjectType
from xenadapter.template import Template

class TemplateInput(InputObjectType):
    ref = graphene.InputField(graphene.ID, required=True, description="Template ID")
    enabled = graphene.InputField(graphene.Boolean,
                                description="Should this template be enabled, i.e. used in VMEmperor by users")

def set_enabled(ctx : ContextProtocol, template : Template, changes : TemplateInput):
    if changes.enabled is not None:
        template.set_enabled(changes.enabled)




class TemplateMutation(graphene.Mutation):
    granted = graphene.Field(graphene.Boolean, required=True, description="If access is granted")
    reason = graphene.Field(graphene.String, required=False, description="If access is not granted, return reason why")

    class Arguments:
        template = graphene.Argument(TemplateInput, description="Template to change")



    @staticmethod
    @with_default_authentication
    @with_connection
    def mutate(root, info, template):
        ctx : ContextProtocol = info.context

        t = Template(auth=ctx.user_authenticator, ref=template.ref)


        mutations = [
            MutationMethod(func=set_enabled, action_name=None)
        ]

        def reason(method):
            if method.func == set_enabled:
                return "Not an administrator"

        helper = MutationHelper(mutations, ctx, t)
        granted, method = helper.perform_mutations(template)
        if not granted:
            return TemplateMutation(granted=False, reason=reason(method))

        return TemplateMutation(granted=True)




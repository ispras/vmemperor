import graphene

from handlers.graphql.types.objecttype import InputObjectType
from handlers.graphql.types.input.abstractvm import AbstractVMInput
from handlers.graphql.types.template import GDistro, GArch
from xentools.os import Arch, Distro


class InstallOSOptionsInput(InputObjectType):
    distro = graphene.InputField(GDistro)
    arch = graphene.InputField(GArch)
    release = graphene.InputField(graphene.String)
    install_repository = graphene.InputField(graphene.String)

class TemplateInput(AbstractVMInput):
    install_options = graphene.InputField(InstallOSOptionsInput)
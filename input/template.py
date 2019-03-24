import graphene

from handlers.graphql.types.objecttype import InputObjectType
from input.abstractvm import AbstractVMInput
from xentools.os import Arch, Distro
GArch = graphene.Enum.from_enum(Arch)
GDistro = graphene.Enum.from_enum(Distro)

class InstallOSOptionsInput(InputObjectType):
    distro = graphene.InputField(GDistro)
    arch = graphene.InputField(GArch)
    release = graphene.InputField(graphene.String)
    install_repository = graphene.InputField(graphene.String)

class TemplateInput(AbstractVMInput):
    enabled = graphene.InputField(graphene.Boolean,
                                description="Should this template be enabled, i.e. used in VMEmperor by users")
    install_options = graphene.InputField(InstallOSOptionsInput)
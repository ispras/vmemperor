from enum import auto

import graphene

from handlers.graphql.resolvers.diskimage import vdiType, resolve_vdi
from handlers.graphql.resolvers.vm import vmType, resolve_vm
from handlers.graphql.types.gxenobjecttype import GXenObjectType


class XenEnum(graphene.Enum):
    def __str__(self):
        return self.name


class VBDMode(XenEnum):
    RO = auto()
    RW = auto()

    def __repr__(self):
        if self.name == 'RO':
            return 'Read-only device'
        elif self.name == 'RW':
            return 'Read-write device'


class VBDType(XenEnum):
    CD = auto()
    Disk = auto()
    Floppy = auto()

    def __repr__(self):
        if self.name == 'CD':
            return 'Optical disc device'
        elif self.name == 'Disk':
            return 'Hard disk device'
        elif self.name == 'Floppy':
            return 'Floppy device'


class GVBD(GXenObjectType):
    ref = graphene.Field(graphene.ID, required=True, description="Unique constant identifier/object reference")
    uuid = graphene.Field(graphene.ID, required=True,
                          description="Unique non-primary identifier/object reference")

    VM = graphene.Field(vmType, resolver=resolve_vm)
    VDI = graphene.Field(vdiType, resolver=resolve_vdi)
    type = graphene.Field(VBDType,required=True)
    mode = graphene.Field(VBDMode, required=True)
    attached = graphene.Field(graphene.Boolean, required=True)
    bootable = graphene.Field(graphene.Boolean, required=True)

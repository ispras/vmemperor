from enum import auto

import graphene
from serflag import SerFlag

from handlers.graphql.resolvers.accessentry import resolve_accessentries
from handlers.graphql.resolvers.diskimage import vdiType
from handlers.graphql.types.accessentry import GAccessEntry
from handlers.graphql.types.gxenobjecttype import GXenObjectType
from handlers.graphql.types.objecttype import ObjectType
from handlers.graphql.utils.query import resolve_many
from handlers.graphql.types.pbd import GPBD
from handlers.graphql.interfaces.xenobject import GAclXenObject


class SRType(graphene.Enum):
    '''
    For more information on SR types, check out:
    https://docs.citrix.com/en-us/xenserver/current-release/storage/format.html

    '''
    LVM = 'lvm'
    EXT = 'ext'  # EXT3
    ISO = 'iso'
    LVMOFCOE = 'lvmofcoe'  # iSCSI FCoE
    LVMOISCSI = 'lvmoiscsi'  # LVM over iSCSI
    LVMOHBA = 'lvmohba'
    GFS2 = 'gfs2'
    NFS = 'nfs'
    CIFS = 'cifs'  # SMB
    NetApp = 'NetApp'
    EqualLogic = 'EqualLogic'


class SRContentType(graphene.Enum):
    User = 'user' # Can create VMs here
    Disk = 'disk' # Revomable storage
    ISO = 'iso'  # ISO drives


class SRActions(SerFlag):
    scan = auto()
    destroy = auto()
    vdi_create = auto()
    vdi_introduce = auto()
    vdi_clone = auto()


GSRActions = graphene.Enum.from_enum(SRActions)


class GSRAccessEntry(ObjectType):
    class Meta:
        interfaces = (GAccessEntry, )

    actions = graphene.Field(GSRActions, required=True)


class GSR(GXenObjectType):
    class Meta:
        interfaces = (GAclXenObject,)

    access = graphene.Field(graphene.List(GSRAccessEntry), required=True,
                            resolver=resolve_accessentries(SRActions, GSRAccessEntry))
    my_actions = graphene.Field(graphene.List(GSRActions), required=True)
    PBDs = graphene.Field(graphene.List(GPBD),
                                 required=True, resolver=resolve_many(),
                                 description="Connections to host. Usually one, unless the storage repository is shared: e.g. iSCSI")

    VDIs = graphene.Field(graphene.List(vdiType), resolver=resolve_many())
    content_type = graphene.Field(SRContentType, required=True)
    type = graphene.Field(graphene.String, required=True)
    physical_size = graphene.Field(graphene.Float, required=True, description="Physical size in kilobytes")
    virtual_allocation = graphene.Field(graphene.Float, required=True, description="Virtual allocation in kilobytes")
    is_tools_sr = graphene.Field(graphene.Boolean, required=True, description="This SR contains XenServer Tools")
    physical_utilisation = graphene.Field(graphene.Float, required=True, description="Physical utilisation in bytes")
    space_available = graphene.Field(graphene.Float, required=True, description="Available space in bytes")


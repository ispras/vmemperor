import enum

import graphene
from graphene.types.resolver import dict_resolver

from handlers.graphql.types.base.gxenobjecttype import GSubtypeObjectType


class DomainType(enum.Enum):
    HVM = 'hvm'
    PV = 'pv'
    PV_in_PVH = 'pv_in_pvh'


GDomainType = graphene.Enum.from_enum(DomainType)


class Platform(GSubtypeObjectType):
    class Meta:
        default_resolver = dict_resolver
    cores_per_socket = graphene.Int()
    timeoffset = graphene.Int()
    nx = graphene.Boolean()
    device_model = graphene.String()
    pae = graphene.Boolean()
    hpet = graphene.Boolean()
    apic = graphene.Boolean()
    acpi = graphene.Int()
    videoram = graphene.Int()


class GAbstractVM(graphene.Interface):
    platform = graphene.Field(Platform, description="CPU platform parameters")
    VCPUs_at_startup = graphene.Field(graphene.Int, required=True)
    VCPUs_max = graphene.Field(graphene.Int, required=True)
    domain_type = graphene.Field(GDomainType, required=True)
    guest_metrics = graphene.Field(graphene.ID, required=True)
    install_time = graphene.Field(graphene.DateTime, required=True)
    memory_actual = graphene.Field(graphene.Float, required=True)
    memory_static_min = graphene.Field(graphene.Float, required=True)
    memory_static_max = graphene.Field(graphene.Float, required=True)
    memory_dynamic_min = graphene.Field(graphene.Float, required=True)
    memory_dynamic_max = graphene.Field(graphene.Float, required=True)
    PV_bootloader = graphene.Field(graphene.String, required=True)
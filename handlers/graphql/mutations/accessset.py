


from handlers.graphql.types.access import create_access_mutation_type
from handlers.graphql.types.network import GNetworkActions
from handlers.graphql.types.pool import GPoolActions
from handlers.graphql.types.sr import GSRActions
from handlers.graphql.types.vdi import GVDIActions
from handlers.graphql.types.vm import GVMActions
from xenadapter import Pool
from xenadapter.network import Network
from xenadapter.sr import SR
from xenadapter.template import Template
from handlers.graphql.types.template import GTemplateActions
from xenadapter.vdi import VDI
from xenadapter.vm import VM

_all_ = ["VMAccessSet", "VDIAccessSet", "SRAccessSet", "TemplateAccessSet", "NetAccessSet"]
VMAccessSet = create_access_mutation_type("VMAccessSet", GVMActions, VM)

VDIAccessSet = create_access_mutation_type("VDIAccessSet", GVDIActions, VDI)

SRAccessSet = create_access_mutation_type("SRAccessSet", GSRActions, SR)

TemplateAccessSet = create_access_mutation_type("TemplateAccessSet", GTemplateActions, Template)

NetAccessSet = create_access_mutation_type("NetAccessSet", GNetworkActions, Network)

PoolAccessSet = create_access_mutation_type("PoolAccessSet", GPoolActions, Pool)

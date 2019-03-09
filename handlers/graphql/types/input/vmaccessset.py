


from handlers.graphql.types.access import create_access_mutation_type
from handlers.graphql.types.vm import GVMActions
from xenadapter.vm import VM

_all_ = ["VMAccessSet"]
VMAccessSet = create_access_mutation_type("VMAccessSet", GVMActions, VM)









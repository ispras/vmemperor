def resolve_networks(*args, **kwargs):
    from xenadapter.network import Network
    return Network.resolve_many(field_name='networks')(*args, **kwargs)

def resolve_network(*args, **kwargs):
    from xenadapter.network import Network
    return Network.resolve_one(field_name='network')(*args, **kwargs)

def networkType():
    from xenadapter.network import GNetwork
    return GNetwork
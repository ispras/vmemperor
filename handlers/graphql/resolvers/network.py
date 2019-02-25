def resolve_networks(*args, **kwargs):
    from xenadapter.network import Network
    field_name = None
    if 'field_name' in kwargs:
        field_name = kwargs['field_name']
        del kwargs['field_name']
    return Network.resolve_many(field_name=field_name)(*args, **kwargs)

def resolve_network(*args, **kwargs):
    from xenadapter.network import Network
    return Network.resolve_one()(*args, **kwargs)


def networkType():
    from xenadapter.network import GNetwork
    return GNetwork
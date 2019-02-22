def resolve_hosts(*args, **kwargs):
    from xenadapter.host import Host
    field_name = kwargs.pop('field_name', 'hosts')
    return Host.resolve_many(field_name=field_name)(*args, **kwargs)


def hostType():
    from xenadapter.host import GHost
    return GHost

def resolve_host(*args, **kwargs):
    from xenadapter.host import Host
    field_name = kwargs.pop('field_name', 'host')
    return Host.resolve_one(field_name=field_name)(*args, **kwargs)
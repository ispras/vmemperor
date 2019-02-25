def resolve_vms(*args, **kwargs):
    from xenadapter.vm import VM
    field_name = None
    if 'field_name' in kwargs:
        field_name = kwargs['field_name']
        del kwargs['field_name']
    return VM.resolve_many(field_name=field_name)(*args, **kwargs)

def resolve_vm(*args, **kwargs):
    from xenadapter.vm import VM
    return VM.resolve_one()(*args, **kwargs)


def vmType():
    from handlers.graphql.types.vm import GVM
    return GVM
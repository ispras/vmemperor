def resolve_sr(*args, **kwargs):
    from xenadapter.sr import SR
    return SR.resolve_one()(*args, **kwargs)


def srType():
    from xenadapter.sr import GSR
    return GSR

from constants.auth import auth_name


def deserialize_auth_dict(cls, emperor_auth_dict):
    return {k: cls.Actions.deserialize(v) for k, v in emperor_auth_dict.items()}
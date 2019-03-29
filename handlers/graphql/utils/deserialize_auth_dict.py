from typing import Dict, List


def deserialize_auth_dict(cls, emperor_auth_dict) -> Dict[str, List[str]]:
    return {k: cls.Actions.deserialize(v) for k, v in emperor_auth_dict.items()}

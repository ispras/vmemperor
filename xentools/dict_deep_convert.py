def dict_deep_convert(d):
    def convert_to_bool(v):
        if isinstance(v, str):
            if v.lower() == 'true':
                return True
            elif v.lower() == 'false':
                return False
        elif isinstance(v, dict):
            return dict_deep_convert(v)

        return v

    return {k: convert_to_bool(v) for k, v in d.items()}
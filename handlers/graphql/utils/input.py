def validate_subtype(field_name):
    def validator(input, _):
        '''
        If all items are defaults (empty dict), dont alter anything
        :param input:
        :return:
        '''
        if not getattr(input, field_name):
            return False, None
        ret = any(map(lambda item: item != {}, dict(**getattr(input, field_name)).values()))
        return ret, None
    return validator


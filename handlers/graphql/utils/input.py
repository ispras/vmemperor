from handlers.graphql.mutation_utils.cleanup import cleanup_defaults
from xenadapter.xenobject import set_subtype


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

def set_subtype_field(field_name):
    '''
    Sets a subtype named field_name of XenObject, cleaning input dict of defaults (empty dict)
    :param field_name:
    :return:
    '''
    thunk = set_subtype(field_name)
    def setter(input, obj):
        thunk(cleanup_defaults(input[field_name]), obj)
    return setter

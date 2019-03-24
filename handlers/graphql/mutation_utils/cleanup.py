from typing import Mapping


def cleanup_defaults(input):
    '''
    recursively remove all empty dicts from input as they serve as defaults
    :param input:
    :return:
    '''
    if isinstance(input, Mapping):
        return  {k:cleanup_defaults(v) for k,v in {**input}.items() if v != {}}
    else:
        return input
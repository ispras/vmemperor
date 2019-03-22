from handlers.graphql.types.objecttype import InputObjectType
from xenadapter.xenobject import XenObject



def set_subtype(field_name: str):
    def setter(input: InputObjectType, obj: XenObject):
        '''
        Input object values format:
        Empty dict input: don't alter original map's key (this should be the default)
        None: remove this from original map
        :param input:
        :param obj:
        :return:
        '''
        input_dict = {k:v for k,v in {**getattr(input, field_name)}.items() if v != {}}
        old_dict = getattr(obj, f'get_{field_name}')()
        to_delete = filter(lambda item: input_dict[item] is None, input_dict.keys())

        def item_yielder():
            for delete_key in to_delete:
                del input_dict[delete_key]
                del old_dict[delete_key]

            for key in old_dict:
                if key in input_dict:
                    yield key, input_dict.pop(key)
                else:
                    yield key, old_dict[key]

            yield from input_dict.items()

        arg = {k:v for k,v in item_yielder()}
        getattr(obj, f'set_{field_name}')(arg)
    return setter


def validate_subtype(field_name):
    def validator(input):
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

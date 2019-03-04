import graphene
from graphene.types.resolver import dict_resolver


class ObjectType(graphene.ObjectType):
    '''
    Implements mapping and iterable iterfaces around graphene's ObjectType so
    we could pass our objects to other functions pythonically
    '''

    def __iter__(self):
        for element in self._meta.fields:
            yield element, getattr(self, element)

    def keys(self):
        return self._meta.fields.keys()

    def __getitem__(self, item):
        return getattr(self, item)

    @classmethod
    def __init_subclass_with_meta__(
        cls,
        interfaces=(),
        possible_types=(),
        default_resolver=None,
        _meta=None,
        **options
    ):
        super().__init_subclass_with_meta__(
            interfaces,
            possible_types,
            dict_resolver,
            _meta,
            **options
        )


class InputObjectType(graphene.InputObjectType):
    '''
    Implements mapping and iterable iterfaces around graphene's ObjectType so
    we could pass our objects to other functions pythonically
    '''

    def __iter__(self):
        for element in self._meta.fields:
            yield element, getattr(self, element)

    def keys(self):
        return self._meta.fields.keys()

    def __getitem__(self, item):
        return getattr(self, item)



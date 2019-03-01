from typing import Collection, Iterable

import graphene
from graphene.types.resolver import dict_resolver

from handlers.graphql.types.objecttype import ObjectType


class GXenObjectType(ObjectType):
    class Meta:
        default_resolver = dict_resolver

    @classmethod
    def get_type(cls, field_name: str):
        type = cls._meta.fields[field_name].type
        while True:
            if isinstance(type, graphene.List): # make a list type on our own
                class ListSerializer:
                    def __init__(self):
                        self.type = type.of_type
                        while True:
                            if not hasattr(self.type, 'of_type'):
                                if hasattr(self.type, 'serialize'):
                                    break
                                else:
                                    self.type = graphene.ID #complex type replaced by its id
                            else:
                                self.type = self.type.of_type

                    def serialize(self, value):
                        if isinstance(value, str) or not isinstance(value, Iterable):
                            raise TypeError(f"value should be an iterable, but not string. Got: {type(value)} ")
                        return [self.type.serialize(item) for item in value]

                return ListSerializer()
            if not hasattr(type, "of_type"):
                if hasattr(type, 'serialize') or issubclass(type, GXenObjectType) and type.is_subtype():
                    return type
                else:
                    return graphene.ID # Complex objects represented in DB by their refs, i.e. unique string IDs
            else:
                type = type.of_type

    @classmethod
    def is_subtype(cls):
        return False


class GSubtypeObjectType(GXenObjectType):
    '''
    Subclasses of this class get serialized w/o serialize method. Usable for complex subtypes like SoftwareVersion of GHost.
    Not usable for i.e. GVM, as GVM is not serialized by default: it is substituted by its ref and resolved later.
    GVM, GHost,etc. should be of GXenObjectType as they have their own tables which resolve them by their ref  during field resolving
    '''
    @classmethod
    def is_subtype(cls):
        return True

import graphene

from handlers.graphql.types.accessentry import GAccessEntry
from handlers.graphql.types.objecttype import ObjectType


def create_access_type(name, actions_type):
    return type(name, (ObjectType,), {
        "Meta": type("Meta",(), {"interfaces": (GAccessEntry,)}),
        "actions": graphene.Field(graphene.List(actions_type), required=True)
    })

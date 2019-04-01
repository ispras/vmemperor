import graphene

from handlers.graphql.types.objecttype import InputObjectType

class BasicXenInput(InputObjectType):
    ref = graphene.InputField(graphene.ID, required=True, description="Object's ref")
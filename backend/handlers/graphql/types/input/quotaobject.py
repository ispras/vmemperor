import graphene

from handlers.graphql.types.input.namedinput import NamedInput


class QuotaObjectInput(NamedInput):
    main_owner = graphene.Field(graphene.ID,
                                default_value={},
                                description="A user against whom the quotes are calculated")


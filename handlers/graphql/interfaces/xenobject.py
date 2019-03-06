import graphene

from handlers.graphql.types.accessentry import GAccessEntry


class GXenObject(graphene.Interface):
    name_label = graphene.Field(graphene.String, required=True, description="a human-readable name")
    name_description = graphene.Field(graphene.String, required=True, description="a human-readable description")
    ref = graphene.Field(graphene.ID, required=True, description="Unique constant identifier/object reference (primary)")
    uuid = graphene.Field(graphene.ID, required=True, description="Unique constant identifier/object reference (used in XenCenter)")


class GAclXenObject(GXenObject):
    access = graphene.List(GAccessEntry, required=True)
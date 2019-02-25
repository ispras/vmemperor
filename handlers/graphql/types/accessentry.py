import graphene


class GAccessEntry(graphene.Interface):
    user_id = graphene.String(required=True)

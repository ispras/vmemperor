import graphene
class NewVDI(graphene.InputObjectType):
    SR = graphene.InputField(graphene.ID, required=True, description="Storage repository to create disk on")
    size = graphene.InputField(graphene.Float, required=True, description="Disk size of a newly created disk in bytes")




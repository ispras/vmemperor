import graphene
from graphene.types.resolver import dict_resolver

from authentication import with_authentication, with_default_authentication
from handlers.graphql.resolvers import with_connection
from handlers.graphql.types.objecttype import ObjectType
from playbookloader import PlaybookLoader
from handlers.graphql.types.vm import OSVersion
import rethinkdb
from tornado.options import options as opts


class PlaybookRequirements(ObjectType):
    class Meta:
        default_resolver = dict_resolver
    os_version = graphene.Field(graphene.List(OSVersion), required=True, description="Minimal supported OS versions")

class GPlaybook(ObjectType):
    id = graphene.Field(graphene.ID, required=True, description="Playbook ID")
    inventory = graphene.Field(graphene.String, description="Inventory file path")
    requires = graphene.Field(PlaybookRequirements, description="Requirements for running this playbook")
    #single = graphene.Field(graphene.Boolean, description="")
    name = graphene.Field(graphene.String, required=True, description="Playbook name")
    description = graphene.Field(graphene.String, description="Playbook description")
    variables = graphene.Field(graphene.JSONString, description="Variables available for change to an user")



def _resolve_playbook(id):
    r = rethinkdb.RethinkDB()
    table = r.db(opts.database).table(PlaybookLoader.PLAYBOOK_TABLE_NAME)
    data = table.get(id).pluck(*GPlaybook._meta.fields.keys()).run()
    if not data:
        raise ValueError(f"No such playbook: {id}")
    return data

@with_default_authentication
@with_connection
def resolve_playbook(root, info, id):
    return _resolve_playbook(id)



@with_default_authentication
@with_connection
def resolve_playbooks(root, info):
    r = rethinkdb.RethinkDB()
    table = r.db(opts.database).table(PlaybookLoader.PLAYBOOK_TABLE_NAME)
    data = table.pluck(*GPlaybook._meta.fields.keys()).coerce_to('array').run()

    return data


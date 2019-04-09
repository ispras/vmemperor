from graphql import ResolveInfo

from authentication import with_default_authentication
from handlers.graphql.graphql_handler import ContextProtocol
from handlers.graphql.utils.query import resolve_table
from handlers.graphql.resolvers import with_connection
import constants.re as re

ANY_USER = {
                    "id": "any",
                    "username": "any",
                    "name": "Any user in the system"
                }

def resolve_users(*args, **kwargs):
    from handlers.graphql.types.user import User
    return resolve_table(User, "users")(*args, **kwargs)

def resolve_groups(*args, **kwargs):
    from handlers.graphql.types.user import User
    return resolve_table(User, "groups")(*args, **kwargs)

def userType():
    from handlers.graphql.types.user import User
    return User

def resolve_user(field_name = "user_id"):
    '''
    Resolve user OR group (user ids start with users/, group ids start with groups/)
    '''

    @with_connection
    @with_default_authentication
    def resolver(root, info, **kwargs):
        from handlers.graphql.types.user import User
        if 'id' in kwargs:
            id = kwargs['ref']
        else:
            if field_name:
                id = root[field_name]
            else:
                id = root

        tables = {
            "users/" : "users",
            "groups/" : "groups"
        }

        # remember that for loop variables are of function scope
        for item, value in tables.items():
            if id.startswith(item):
                db_id = id.replace(item, "")
                table_name = value
                break
        else:
            if id == "any":
                return ANY_USER
            return None


        record = re.db.table(table_name).get(db_id).run()

        if not record or not len(record):
            return None

        record["id"] = id
        return record

    return resolver

@with_default_authentication
def resolve_current_user(root, info : ResolveInfo):
    ctx : ContextProtocol = info.context
    if ctx.user_authenticator.is_admin():
        return {
            "is_admin" : True
        }
    else:
        user = re.db.table('users').get(ctx.user_authenticator.get_id())\
            .merge(lambda user: { 'id' : 'users/' + user['id']}).run()

        groups = re.db.table('groups').get_all(*ctx.user_authenticator.get_user_groups().keys())\
            .merge(lambda group: {'id': 'groups/' + group['id']}).coerce_to('array').run()

        return {
            "is_admin" : False,
            "user" : user,
            "groups" : groups,
        }


@with_default_authentication
def resolve_filter_users(root, info, query):
    q = re.db.table('users').filter(lambda user: user['username'].match(query).or_(user['name'].match(query))).merge(lambda user: {
        'id': 'users/' + user['id']
    }).union(re.db.table('groups').filter(lambda user: user['username'].match(query).or_(user['name'].match(query))).merge(lambda user: {
        'id': 'groups/' + user['id']
    }))
    ret = q.coerce_to('array').run()
    ret.append(ANY_USER)
    return ret


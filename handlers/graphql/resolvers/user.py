from authentication import with_default_authentication
from handlers.graphql.utils.query import resolve_table
from handlers.graphql.resolvers import with_connection
import constants.re as re

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
            id = root[field_name]

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
            raise ValueError(f"User ID should start with {list(tables)}")


        record = re.db.table(table_name).get(db_id).run()

        if not record or not len(record):
            return None

        record["id"] = id
        return record

    return resolver


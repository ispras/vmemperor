from authentication import BasicAuthenticator
from constants import re as re


def check_user_input(user, user_authenticator : BasicAuthenticator):
    if user == 'any':
        return True
    if user_authenticator.is_admin():
        return True

    if user == f'users/{user_authenticator.get_id()}':
        return True
    if user in (f'groups/{g}' for g in user_authenticator.get_user_groups().keys()):
        return True

    return False


def user_entities(authenticator: BasicAuthenticator):
    yield f'users/{authenticator.get_id()}'
    yield 'any'
    for group in authenticator.get_user_groups():
        yield f'groups/{group}'


ANY_USER = {
                    "id": "any",
                    "username": "any",
                    "name": "Any user in the system"
                }


def get_user_object(id):
    tables = {
        "users/": "users",
        "groups/": "groups"
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
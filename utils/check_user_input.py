from authentication import BasicAuthenticator


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





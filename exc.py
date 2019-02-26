import json
from  rethinkdb import  RethinkDB
r = RethinkDB()
import tornado.options as opts
__all__ = ['EmperorException',
           'XenAdapterException',
           'XenAdapterUnauthorizedActionException',
           'XenAdapterAPIError', 'XenAdapterArgumentError', 'XenAdapterConnectionError',
           'AuthenticationException', 'AuthenticationRealmException',  'AuthenticationUserNotFoundException', 'AuthenticationWithEmptyPasswordException']
class EmperorException(Exception):
    def __init__(self, log, message):
        log.error(f"{type(self).__name__}: {message}", exc_info=True)
        super().__init__()
        self.message = message
        self.log = log

    def __str__(self):
        return f"<{self.__class__.__name__}>: {self.message}"


class XenAdapterException(EmperorException):
    pass



class XenAdapterConnectionError(XenAdapterException):
    pass

class XenAdapterUnauthorizedActionException(XenAdapterException):
    def __init__(self, log, message, empty):
        super().__init__(log, message)
        self.empty = empty

class XenAdapterAPIError(XenAdapterException):
    def __init__(self, log, message, details=None):
        self.details = self.print_details(details)
        super().__init__(log, message=json.dumps({'message' : message, 'details' : self.details}))


    @staticmethod
    def print_details(details):
        if not details:
            return None
        if details[0] == 'VDI_MISSING':
            return {
                "error_code" : details[0],
                "SR": details[1],
                "VDI": details[2],
            }
        elif details[0] == 'UUID_INVALID':
            return {
                "error_code": details[0],
                "object_type": details[1],
                "uuid": details[2],
            }
        elif details[0] == 'HANDLE_INVALID':
            return {
                "error_code": details[0],
                "object_type": details[1],
                "ref": details[2]
            }
        else:
            return details


class XenAdapterArgumentError(XenAdapterException):
    pass


class AuthenticationException(EmperorException):
    pass

class AuthenticationRealmException(AuthenticationException):
    pass

class AuthenticationUserNotFoundException(AuthenticationException):
    def __init__(self, log, realm):
        super().__init__(log, f"Realm {type(realm).__name__} can't find user {realm.username}")


class AuthenticationPasswordException(AuthenticationException):
    def __init__(self, log, realm):
        super().__init__(log,
                         f"Realm {type(realm).__name__} can't find authenticate user {realm.get_id()}: incorrect password")

class AuthenticationWithEmptyPasswordException(AuthenticationException):
    def __init__(self, log, realm):
        super().__init__(log,
                         f"Realm {type(realm).__name__} can't find authenticate user {realm.username}: empty password")

class UnauthorizedException(AuthenticationException):
    pass
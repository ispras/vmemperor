from abc import ABCMeta, abstractmethod
from functools import wraps
import logging
from typing import Union, Sequence

from serflag import SerFlag

from exc import XenAdapterAPIError


class Authentication(metaclass=ABCMeta):


    @abstractmethod
    def check_credentials(self, password, username, log=logging) -> None:
        """
        asserts credentials using inner db, or some outer authentication system
        You should set username to self.username
        You should set password to self.password
        :param log: logging-like vmemperor logger
        :return None
        :raise AuthenticationUserNotFoundException if user is not found
        :raise AuthenticationPasswordException if password is wrong
        :raise AuthenticationWithEmptyPasswordException if password is empty
        All exceptions are in exc.py
        """
        ...

    @abstractmethod
    def get_user_groups(self):
        """
        Return a dict of user's groups with id as key and name as value"
        """
        ...

    @classmethod
    @abstractmethod
    def get_all_users(cls, log=logging) -> Sequence:
        '''
        Return a list of all users available in format of a list of dicts with the following fields:
        {
        "id": Unique id for an user
        "username": Unique username that the user uses for login and this username is checked in check_credentials
        "name": User's full name
        }

        This may be an resource-intensive method that is being called each N seconds and its results are uploaded to a cache database
        :param log:
        :return: list

        '''
        ...

    @classmethod
    @abstractmethod
    def get_all_groups(cls, log=logging) -> Sequence:
        '''
        Return a list of all groups available in format of a list of dicts with the following fields:
        {
        "id": Unique id for a group
        "username": Unique username that the group user uses for login and this username is checked in check_credentials if your realm supports login into a group OR you can use the same value as ID
        "name": Group's full name
        }

        This may be an resource-intensive method that is being called each N seconds and its results are uploaded to a cache database
        :param log:
        :return: list

        '''
        ...

    @abstractmethod
    def is_admin(self) -> bool:
        '''
        Checks if this user is an administrator
        :return:
        '''
        ...

    @abstractmethod
    def get_id(self) -> Union[str, int]:
        '''
        Return user id
        :return:
        '''
        ...


@Authentication.register
class BasicAuthenticator():
    @classmethod
    def class_name(cls):
        return cls.__name__

    def get_user_groups(self):
        return {}

    def is_admin(self):
        return False

    def get_id(self):
        return None





class AdministratorAuthenticator(BasicAuthenticator):
    def __init__(self, user_auth: type):
        self.auth = False
        self.user_auth = user_auth


    def check_credentials(self, password, username, log=logging):
        from exc import AuthenticationPasswordException, XenAdapterConnectionError
        from xenadapter import XenAdapter
        from vmemperor import opts
        params = {**opts.group_dict('xenadapter'), **opts.group_dict('rethinkdb')}
        params['username'] = username
        params['password'] = password
        self.id = username
        try:

            xen = XenAdapter(params, nosingleton=True)
        except XenAdapterConnectionError as e:
            raise AuthenticationPasswordException(e.log, self)



    def get_id(self):
        return self.id

    def get_name(self):
        return self.id

    def class_name(self):
        return self.user_auth.__name__

    def is_admin(self):
        return True



class DebugAuthenticator(AdministratorAuthenticator): #used by tests
    def check_credentials(self, password, username):
        pass #not rly used

    def __init__(self, user_auth):

        from xenadapter import XenAdapter
        from vmemperor import opts
        self.xen = XenAdapter({**opts.group_dict('xenadapter'), **opts.group_dict('rethinkdb')})

        super().__init__(user_auth)

class DummyAuth(BasicAuthenticator):

    def check_credentials(self, password, username):
        pass

    def __init__(self, id='', name=''):
        self.id = id
        self.name = name


    def get_id(self):
        return self.id

    def get_name(self):
        return self.name


class NotAuthenticatedException(Exception):
    def __init__(self):
        super().__init__("You are not authenticated")

class NotAuthenticatedAsAdminException(Exception):
    def __init__(self):
        super().__init__("You are not authenticated as administrator")

def with_authentication(access_class : type = None, access_action : SerFlag = None, id_field="ref"):
    '''
    This decorator takes a resolver method.
    It performs authentication checks
    If access_class is None, it checks that the user is authenticated and throws NotAuthenticatedException otherwise
    Else it creates an instance of type access_class, checks that permissions for access_action are granted
    and calls the resolver method with the instance as kwargs[access_class.__name__]
    :param access_class: ACLXenObject to check permissions against
    :param access_action: SerFlag that is the action we should check
    :param id_field:  name of keyword argument that contains access_class's ref. Default: 'ref' or args[0]
    :return:  decorated method
    '''
    def decorator(method):
        from xenadapter.xenobject import ACLXenObject
        @wraps(method)
        def wrapper(root, info, *args, **kwargs):
            if not hasattr(info.context, 'user_authenticator'):
                raise NotAuthenticatedException()

            if access_class:
                if id_field in kwargs:
                    ref = kwargs.get(id_field)
                else:
                    ref = args[0]

                try:
                    obj : ACLXenObject = access_class(xen=info.context.xen, ref=ref)
                    obj.check_access(info.context.user_authenticator, access_action)
                except XenAdapterAPIError as e:
                    if e.details['error_code'] == 'HANDLE_INVALID':
                        raise ValueError(f"Invalid {id_field}: {ref}")
                    else:
                        raise e
                else:
                    kwargs[access_class.__name__] = obj
                return method(root, info, *args, **kwargs)


            return method(root, info, *args, **kwargs)
        return wrapper
    return decorator

with_default_authentication = with_authentication()

def with_admin_authentication(method):
    @wraps(method)
    def decorator(root, info, *args, **kwargs):
        if not hasattr(info.context, 'user_authenticator'):
            raise NotAuthenticatedException()
        if not info.context.user_authenticator.is_admin():
            raise NotAuthenticatedAsAdminException()

        return method(root, info, *args, **kwargs)
    return decorator


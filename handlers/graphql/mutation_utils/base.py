from dataclasses import dataclass
from typing import NewType, Callable, Sequence, Any, Optional, Tuple
import graphene
from graphene import Boolean
from serflag import SerFlag

from authentication import AdministratorAuthenticator, NotAuthenticatedAsAdminException

from handlers.graphql.graphql_handler import ContextProtocol
from xenadapter.xenobject import XenObject


@dataclass
class MutationMethod:
    '''
    Represents a mutation method - a function equipped with action name that is passed to check_access.
    Here, access_action = None has a special meaning: if access_action is None, then it is checked whether the user is an administrator, thus this
    value is suitable for administrator actions
    '''
    #func : Callable[[ContextProtocol, XenObject, InputObject, OutputObject, ...], None]
    func : Callable
    access_action : Optional[SerFlag]



@dataclass
class MutationHelper:
    """
    A Mutation helper. Parameters:
    - mutations: Sequence of mutations to be performed
    - ctx: Request's context
    - mutable_object: A Xen object to perform mutation on
    """
    mutations : Sequence[MutationMethod]
    ctx : ContextProtocol
    mutable_object : XenObject

    def perform_mutations(self, changes) -> Tuple[bool, Optional[MutationMethod]]:
        '''
        Perform mutations in a transaction fashion: Either all or nothing.
        :param changes: Graphene Input type instance with proposed changes
        :return: Tuple [True, None] or [False, MutationMethod where access is not granted]
        '''
        callables = []
        for item in self.mutations:
            if item.access_action is None:
                if self.ctx.user_authenticator.is_admin():
                    callables.append(lambda: item.func(self.ctx, self.mutable_object, changes))
                else:
                    return False, item
            else:
                if self.mutable_object.check_access(item.access_action):
                    callables.append(lambda: item.func(self.ctx, self.mutable_object, changes))
                else:
                    return False, item

        for callable in callables:
            callable()

        return True, None










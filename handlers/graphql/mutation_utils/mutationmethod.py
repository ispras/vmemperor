from dataclasses import dataclass
from typing import Callable, Sequence, Any, Optional, Tuple, Union
from serflag import SerFlag
from handlers.graphql.graphql_handler import ContextProtocol
from xenadapter.xenobject import XenObject
from functools import partial


@dataclass
class MutationMethod:
    '''
    Represents a mutation method - a function equipped with action name that is passed to check_access.
    Attributes:
        func: A mutation performer: a function that accepts user input (as a whole) and returns none -
        access_action: An access action required for performing this mutation. None means this mutation is for administrators only
        deps: Tuple of dependencies. These could be either objects referring to user input we've got or lambdas that are called with our object as first argument and returning tuple of Boolean and reason string
    '''
    func: Callable[[Any], None]
    access_action: Optional[SerFlag]
    deps: Tuple[Union[Optional[Any], Callable[["XenObject"], Tuple[bool, str]]]]



@dataclass
class MutationHelper:
    """
    A Mutation helper. Parameters:
    - mutations: Sequence of mutations to be performed
    - ctx: Request's context
    - mutable_object: A Xen object to perform mutation on
    """
    mutations: Sequence[MutationMethod]
    ctx: ContextProtocol
    mutable_object: XenObject

    def perform_mutations(self, changes) -> Tuple[bool, str]:
        '''
        Perform mutations in a transaction fashion: Either all or nothing.
        :param changes: Graphene Input type instance with proposed changes
        :return: Tuple [True, None] or [False, "String reason what's not granted"] where access is not granted]
        '''
        callables : Sequence[Callable[[], None]] = []

        for item in self.mutations:
            dep_checks : Sequence[Callable[[], Tuple[bool, str]]] = []
            for dep in item.deps:
                if dep is None:
                    break
                if isinstance(dep, Callable):
                    dep_checks.append(partial(dep, self.mutable_object))
            else: # i.e. if we did quit not via break
                if item.access_action is None and \
                        self.ctx.user_authenticator.is_admin() or \
                        self.mutable_object.check_access(self.ctx.user_authenticator, item.access_action):
                    callables.append(partial(item.func, self.ctx, self.mutable_object, changes))
                else:
                    if item.access_action:
                        return False, f"{item.func.__name__}: Access denied: object {self.mutable_object}; action: {item.access_action}"
                    else:
                        return False, f"{item.func.__name__}: Access denied: not an administrator"

                for dep_check in dep_checks:
                    ret = dep_check()
                    if not ret[0]:
                        return False, f"{item.func.__name__}: {ret[1]}"

        for callable in callables:
            callable()

        return True, None

from dataclasses import dataclass
from typing import Callable, Sequence, Any, Optional, Tuple, Union, List, Generic, TypeVar
from serflag import SerFlag
from handlers.graphql.graphql_handler import ContextProtocol
from handlers.graphql.utils.string import camelcase
from xenadapter.xenobject import XenObject
from functools import partial
import constants.re as re

def call_mutation_from_string(mutable_object, changes, function):
    def f():
        old_value = getattr(mutable_object, f'get_{function}')()
        new_value = getattr(changes, function)
        getattr(mutable_object, f'set_{function}')(new_value)
        return old_value, new_value

    return f




@dataclass
class MutationMethod:
    '''
    Represents a mutation method - a function equipped with action name that is passed to check_access.
    Attributes:
        func: A mutation performer name without set prefix: a function that accepts an argument that is a part of used input named after the func.
        i.e. if func == "name_label",  it'll invoke set_name_label(user_input.name_label)
        OR
        a tuple of functions: 1st is going to be called with user input,
         and 2nd is a validator, taking user input and returning a tuple of validation result and reason
        access_action: An access action required for performing this mutation. None means this mutation is for administrators only
        deps: Tuple of dependencies:  lambdas that are called with our object as first argument and returning tuple of Boolean and reason string
    '''
    Input = TypeVar('Input')
    InputArgument = TypeVar('InputArgument')
    MutationFunction = Callable[[Input, "XenObject"], Tuple[InputArgument, InputArgument]]
    MutationCheckerFunction = Callable[[Input, "XenObject"], Tuple[bool, Optional[str]]]
    func: Union[str, Tuple[MutationFunction, MutationCheckerFunction]]
    access_action: Optional[SerFlag]
    deps: Tuple[Callable[["XenObject"], Tuple[bool, str]]] = tuple()

def call_mutation_from_function(mutable_object, changes, function: MutationMethod.MutationFunction):
    return function(changes, mutable_object)


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

    def perform_mutations(self, changes: MutationMethod.Input) -> Tuple[bool, Optional[str]]:
        '''
        Perform mutations in a transaction fashion: Either all or nothing.
        :param changes: Graphene Input type instance with proposed changes
        :return: Tuple [True, None] or [False, "String reason what's not granted"] where access is not granted]
        '''
        task_start_time = re.r.now()

        callables: List[MutationMethod.func] = []
        for item in self.mutations:
            dep_checks : List[Callable[[], Tuple[bool, str]]] = []
            for dep in item.deps:
                dep_checks.append(partial(dep, self.mutable_object))
            if isinstance(item.func, str):
                if getattr(changes, item.func) is None:
                    continue
            else:
                granted, reason = item.func[1](changes, self.mutable_object)
                if not granted:
                    if not reason: # if Reason is None, we're instructed to skip this mutation as user didn't supply anything
                        continue
                    else:
                        return False, reason

            if not(item.access_action is None and \
                    self.ctx.user_authenticator.is_admin() or \
                    self.mutable_object.check_access(self.ctx.user_authenticator, item.access_action)):

                if item.access_action:
                    return False, f"{camelcase(item.func if isinstance(item.func, str) else item.func[0].__name__)}: Access denied: object {self.mutable_object}; action: {item.access_action}"
                else:
                    return False, f"{camelcase(item.func if isinstance(item.func, str) else item.func[0].__name__)}: Access denied: not an administrator"
            else:
                if isinstance(item.func, str):
                    callables.append(call_mutation_from_string(self.mutable_object, changes, item.func))
                else:
                    callables.append(call_mutation_from_function(self.mutable_object, changes, item.func[0]))

            for dep_check in dep_checks:
                ret = dep_check()
                if not ret[0]:
                    return False, f"{camelcase(item.func if isinstance(item.func, str) else '')}: {ret[1]}"

        for item in callables:
            item()


        return True, None

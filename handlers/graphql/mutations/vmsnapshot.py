import graphene

from authentication import with_authentication, return_if_access_is_not_granted
from handlers.graphql.mutation_utils.asyncmutationmethod import AsyncMutationMethod
from handlers.graphql.utils.editmutation import create_async_mutation, create_edit_mutation
from xenadapter import VMSnapshot

VMRevertMutation = create_async_mutation("VMRevertMutation", VMSnapshot, VMSnapshot.Actions.revert);
VMSnapshotDestroyMutation = create_async_mutation("VMSnapshotDestroyMutation", VMSnapshot, VMSnapshot.Actions.destroy);


import graphene

from authentication import with_authentication, return_if_access_is_not_granted

from xenadapter import Task


class TaskRemoveMutation(graphene.Mutation):
    taskId = graphene.ID(required=False, description="always null, provided for compatibility")
    granted = graphene.Boolean(required=True, description="Shows if access to task remove is granted")
    reason = graphene.String()


    class Arguments:
        ref = graphene.ID(required=True)



    @staticmethod
    @with_authentication(access_class=Task, access_action=Task.Actions.remove)
    @return_if_access_is_not_granted([("Task", "ref", Task.Actions.remove)])
    def mutate(root, info, ref, **kwargs):
        task : Task = kwargs['Task']
        if task.status in ('pending', 'cancelling'):
            return TaskRemoveMutation(taskId=None, granted=False, reason="Can't remove a Task in 'pending' or 'cancelling' state")


        task.remove()
        return TaskRemoveMutation(taskId=None, granted=True)


import toast from 'toasted-notes';
import React from 'react';
import ApolloClient from "apollo-client";
import {Alert, Label, Progress} from "reactstrap";
import {
  TaskFragmentFragment,
  TaskFragmentFragmentDoc,
  TaskInfoUpdateDocument,
  TaskStatus
} from "../../generated-models";
import getValue, {TaskDataType} from "../../containers/TaskList/getValue";
import {dataIdFromObject} from "../../utils/cacheUtils";

interface Params {
  taskId?: string;
  granted: boolean,
  reason?: string;
}

export const showTaskNotification = (client: ApolloClient<any>, title: string, {taskId, granted, reason}: Params) => {
  if (taskId) {
    const getTask = getValue(client);
    const observable = client.subscribe({
      query: TaskInfoUpdateDocument,
      variables: {
        ref: taskId,
      }
    });
    observable.subscribe(({data}) => {
      const func = async () => {
        client.writeFragment<TaskDataType>({
          fragment: TaskFragmentFragmentDoc,
          id: dataIdFromObject(data.task),
          data: await getTask(data.task),
          fragmentName: "TaskFragment",
        });
      };
      if (data.task)
        func();
    });
  }
  toast.notify(({onClose, id}) => {
      if (!granted) {
        return (
          <div key={id}>
            <Alert color="danger" toggle={onClose}>
              <h4 className="alert-heading">
                {title} Error
              </h4>
              <p>
                {reason}
              </p>
            </Alert>
          </div>
        )
      } else {
        const data = client.readFragment<TaskFragmentFragment>({
          id: dataIdFromObject({
            __typename: "GTask",
            ref: taskId,
          }),
          fragment: TaskFragmentFragmentDoc,
          fragmentName: "TaskFragment",
        });
        let alertColor = 'info';
        if (data)
          switch (data.status) {
            case TaskStatus.Cancelled:
            case TaskStatus.Cancelling:
              alertColor = 'warning';
              break;
            case TaskStatus.Failure:
              alertColor = 'danger';
              break;
            case TaskStatus.Pending:
              alertColor = 'info';
              break;
            case TaskStatus.Success:
              alertColor = 'success';

          }
        return JSON.stringify(data);


      }
    },
  )
};

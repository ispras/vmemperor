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
import {TaskComponent} from "./taskComponent";

interface Params {
  taskId?: string;
  granted: boolean,
  reason?: string;
}

export const showTaskNotification = (client: ApolloClient<any>, title: string, {taskId, granted, reason}: Params) => {
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
        return <TaskComponent
          taskId={taskId}
          onClose={onClose}
          client={client}
          defaultTitle={title}/>
      }
    },
    granted && {
      duration: null,
    } || undefined);
};

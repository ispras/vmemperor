import toast from 'toasted-notes';
import React from 'react';
import ApolloClient from "apollo-client";
import {Alert, Label, Progress} from "reactstrap";
import {
  TaskFragmentFragment,
  TaskFragmentFragmentDoc,
  TaskInfoUpdateDocument, TaskInfoUpdateSubscription, TaskInfoUpdateSubscriptionVariables,
  TaskStatus
} from "../../generated-models";
import getValue, {TaskDataType} from "../../containers/TaskList/getValue";
import {dataIdFromObject} from "../../utils/cacheUtils";
import {Subscription} from "react-apollo";
import ApolloProvider from "react-apollo/ApolloProvider";

interface Params {
  taskId?: string;
  granted: boolean,
  reason?: string;
}

export const showTaskErrorNotification = (title: string, {taskId, granted, reason}: Params) => {
  if (granted)
    toast.notify(({onClose}) => {
        return (
          <div>
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
      },
      {
        duration: null,
      });
};

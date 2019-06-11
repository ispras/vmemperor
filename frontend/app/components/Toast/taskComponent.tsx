import * as React from "react";
import {useEffect, useState} from "react";
import getTaskValue, {TaskDataType} from "../../containers/TaskList/getTaskValue";
import {TaskInfoUpdateDocument, TaskStatus} from "../../generated-models";
import {Alert, Label, Progress} from "reactstrap";
import ApolloClient from "apollo-client";

interface Props {
  taskId: string;
  onClose: () => void;
  client: ApolloClient<any>;
  defaultTitle?: string;
}

export const TaskComponent: React.FC<Props> = ({taskId, onClose, client, defaultTitle}) => {
  const [data, setData] = useState<TaskDataType>(null);
  useEffect(() => {
    const getTask = getTaskValue(client);
    const observable = client.subscribe({
      query: TaskInfoUpdateDocument,
      variables: {
        ref: taskId,
      }
    });
    observable.subscribe(({data: nextData}) => {
      const func = async () => {
        setData(await getTask(nextData.task));
        console.log("Data updated:", data);
      };
      console.log("New data: ", nextData);
      if (nextData.task)
        func();
    });
  }, []);

  useEffect(() => {
    if (data) {
      switch (data.status) {
        case TaskStatus.Success:
        case TaskStatus.Cancelled:
        case TaskStatus.Failure:
          setTimeout(() => {
            onClose();
          }, 3000)

      }
    }
  }, [data]);
  let alertColor = 'info';
  if (data) {
    switch (data.status) {
      case TaskStatus.Cancelled:
      case TaskStatus.Cancelling:
        alertColor = 'warning';
        break;
      case TaskStatus.Failure:
        alertColor = 'danger';
        break;
      case TaskStatus.Success:
        alertColor = 'success';
        break;

    }
  }
  return (
    <div>
      <Alert color={alertColor} toggle={onClose}>
        <h4 className="alert-heading">
          {data && data.nameLabel || defaultTitle || "Loading..."}
        </h4>
        <Progress value={data && data.progress * 100 || 0}>

        </Progress>
        <hr/>
        {data && data.errorInfo.map(string => (
          <Label>{string}</Label>
        ))}
      </Alert>
    </div>
  )
};

import {ListGroup, ListGroupItem, ListGroupItemHeading, Progress} from "reactstrap";
import moment = require("moment");
import {
  TaskFragmentFragment,
  TaskInfoQuery,
  TaskStatus,
  useTaskInfoQuery,
  useTaskInfoUpdateSubscription
} from "../../generated-models";
import React, {ReactNode, useEffect, useState} from "react";


interface Props {
  id: string;
  render: (task: TaskFragmentFragment) => ReactNode;
}

export const TaskView: React.FC<Props> = ({id, render}) => {
  const {data: {task}} = useTaskInfoQuery({
    variables: {
      ref: id
    }
  });
  const update = useTaskInfoUpdateSubscription({
    variables: {
      ref: id
    }
  });
  const [success, setSuccess] = useState(false);
  useEffect(() => {
    if (update.data && update.data.task.status == "Success")
      setSuccess(!success);
  }, [update.data]);

  return (
    <ListGroup>
      {render(task)}
      {task.errorInfo.length > 0 &&
      <ListGroupItem>
        <ListGroupItemHeading>
          Error
        </ListGroupItemHeading>
        <code>{task.errorInfo.join("\n")}</code>
      </ListGroupItem>}
      <ListGroupItem>
        <ListGroupItemHeading>
          Started at:
        </ListGroupItemHeading>
        {moment(task.created).format("L LTS")}
      </ListGroupItem>
      <ListGroupItem>
        {task.status !== TaskStatus.Pending && task.status !== TaskStatus.Cancelling}
        <ListGroupItemHeading>
          Finished at
        </ListGroupItemHeading>
        {moment(task.finished).format("L LTS")}
      </ListGroupItem>
      <ListGroupItem>
        <ListGroupItemHeading>
          Status
        </ListGroupItemHeading>
        {(task.status === TaskStatus.Pending || task.status === TaskStatus.Cancelling) &&
        <Progress
          value={task.progress * 100}
        />
        || <span>{task.status}</span>}
      </ListGroupItem>
    </ListGroup>
  )
};

import {
  PlaybookTask,
  PlaybookTaskState,
  usePlaybookTaskUpdateSubscription
} from "../../generated-models";
import * as React from "react";
import {useCallback, useMemo} from "react";
import ListGroup from "reactstrap/lib/ListGroup";
import {ListGroupItem, ListGroupItemHeading} from "reactstrap";
import ListGroupItemText from "reactstrap/lib/ListGroupItemText";

interface Props {
  taskId: string,
}

const PlaybookWatcher = ({taskId}: Props) => {
  const {data: {playbookTask}} = usePlaybookTaskUpdateSubscription(
    {
      variables: {
        id: taskId
      }
    }); //Cached by Apollo Client automatically

  const statusColor = () => {
    if (!playbookTask)
      return null;
    switch (playbookTask.state) {
      case PlaybookTaskState.ConfigurationWarning:
      case PlaybookTaskState.Error:
        return 'danger';
      case PlaybookTaskState.Unknown:
        return 'warning';
      case PlaybookTaskState.Preparing:
        return 'info';
      case PlaybookTaskState.Running:
        return 'primary';
      case PlaybookTaskState.Finished:
        return 'success';

    }

  };
  if (!playbookTask) {
    console.error(`No playbook task with id ${taskId}`);
    return null;
  }

  return <ListGroup>
    <ListGroupItem color={statusColor()}>
      <ListGroupItemHeading>
        Status
      </ListGroupItemHeading>
      <ListGroupItemText>
        {playbookTask.state}
      </ListGroupItemText>
    </ListGroupItem>
    <ListGroupItem>
      <ListGroupItemHeading>
        Message
      </ListGroupItemHeading>
      <ListGroupItemText>
        {playbookTask.message}
      </ListGroupItemText>
    </ListGroupItem>
  </ListGroup>
    ;

};

export default PlaybookWatcher;

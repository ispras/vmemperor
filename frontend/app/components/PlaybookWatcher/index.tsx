import {TaskStatus, useTaskInfoQuery, useTaskInfoUpdateSubscription} from "../../generated-models";
import * as React from "react";
import ListGroup from "reactstrap/lib/ListGroup";
import {Input, ListGroupItem, ListGroupItemHeading} from "reactstrap";
import ListGroupItemText from "reactstrap/lib/ListGroupItemText";
import {Reducer, ReducerState, useCallback, useEffect, useReducer, useState} from "react";
import TextArea from 'react-textarea-autosize';

interface Props {
  taskId: string,
}

interface State {
  output: string;
}

interface Action {
  addToOutput: string;
}

type PlaybookWatcherReducer = Reducer<State, Action>;
const reducer: PlaybookWatcherReducer = (state, action) => {
  return {
    output: state.output + action.addToOutput + '\n'
  }
};
const initialState: ReducerState<PlaybookWatcherReducer> = {
  output: "",
}
const PlaybookWatcher = ({taskId}: Props) => {

  const {data: {task}} = useTaskInfoQuery({
    variables: {
      ref: taskId
    }
  });
  useTaskInfoUpdateSubscription({
    variables:
      {
        ref: taskId
      }
  });
  const [outputLaunched, setOutputLaunched] = useState(false);
  const [{output}, dispatch] = useReducer<PlaybookWatcherReducer>(reducer, initialState);

  useEffect(() => {
    if (!outputLaunched && task.progress >= 0.2) {
      const url = `ws://${window.location.hostname}:${window.location.port}/api/pblog?id=${taskId}`;
      const socket = new WebSocket(url);
      socket.addEventListener('message', event => {
        console.log("Encountered event: ", event.data);
        dispatch({
          addToOutput: event.data,
        })
      });
      setOutputLaunched(true);
    }
  }, [task.progress, outputLaunched, taskId, dispatch]);

  const statusColor = () => {
    if (!task)
      return null;
    switch (task.status) {
      case TaskStatus.Failure:
        return 'danger';
      case TaskStatus.Cancelled:
      case TaskStatus.Cancelling:
        return 'warning';
      case TaskStatus.Pending:
        return 'primary';
      case TaskStatus.Success:
        return 'success';
    }

  };
  if (!task) {
    console.error(`No playbook task with id ${taskId}`);
    return null;
  }

  return <ListGroup>
    <ListGroupItem color={statusColor()}>
      <ListGroupItemHeading>
        Status
      </ListGroupItemHeading>
      <ListGroupItemText>
        {task.status}
      </ListGroupItemText>
    </ListGroupItem>
    <ListGroupItem>
      <ListGroupItemHeading>
        Result
      </ListGroupItemHeading>
      <ListGroupItemText>
        {task.result}
      </ListGroupItemText>
    </ListGroupItem>
    {task.errorInfo.length > 0 && (
      <ListGroupItem>
        <ListGroupItemHeading>
          Errors
        </ListGroupItemHeading>
        <ListGroupItemText>
          {task.errorInfo.join('')}
        </ListGroupItemText>
      </ListGroupItem>
    )}
    {outputLaunched && (
      <ListGroupItem>
        <ListGroupItemHeading>
          Output
        </ListGroupItemHeading>
        <Input tag={TextArea} readOnly={true} value={output}/>
      </ListGroupItem>
    )}
  </ListGroup>

};

export default PlaybookWatcher;

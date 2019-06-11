import {RouteComponentProps} from "react-router";
import React, {Fragment, ReactNode} from "react";
import {ListGroup, ListGroupItem, Progress} from "reactstrap";
import {TaskStatus, useTaskInfoQuery, useTaskInfoUpdateSubscription} from "../../generated-models";
import ListGroupItemHeading from "reactstrap/lib/ListGroupItemHeading";
import ApolloClient from "apollo-client";
import moment from 'moment';
import {MaybeUnknownItem} from "./unknownitem";
import {Template, VM} from "./taskObject";

interface Args {
  id: string;
}


export const CreateVMTask = (props: RouteComponentProps<Args>) => {
    const {data: {task}} = useTaskInfoQuery({
      variables: {
        ref: props.match.params.id
      }
    });
    useTaskInfoUpdateSubscription({
      variables: {
        ref: props.match.params.id
      }
    });

    return <Fragment>
      <ListGroup>
        <MaybeUnknownItem
          itemPath="vm"
          itemRef={task.result}
          history={props.history}
          getNameLabel={VM._getNameLabel}
        >
          <ListGroupItemHeading>
            VM
          </ListGroupItemHeading>
        </MaybeUnknownItem>
        <MaybeUnknownItem
          itemPath="template"
          itemRef={task.objectRef}
          history={props.history}
          getNameLabel={Template._getNameLabel}
        >
          <ListGroupItemHeading>
            Template
          </ListGroupItemHeading>
        </MaybeUnknownItem>
        {task.errorInfo.length > 0 &&
        <ListGroupItem
        >
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
    </Fragment>
  }
;

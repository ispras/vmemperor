import {RouteComponentProps} from "react-router";
import React, {Fragment, ReactNode} from "react";
import {ListGroup, ListGroupItem, Progress} from "reactstrap";
import {TaskStatus, useTaskInfoQuery, useTaskInfoUpdateSubscription} from "../../generated-models";
import ListGroupItemHeading from "reactstrap/lib/ListGroupItemHeading";
import ApolloClient from "apollo-client";
import moment from 'moment';
import {MaybeUnknownItem} from "./unknownitem";
import {Template, VM} from "./taskObject";
import {TaskView} from "./taskview";

interface Args {
  id: string;
}


export const CreateVMTask = (props: RouteComponentProps<Args>) => {
  return <TaskView
    id={props.match.params.id}
    render={task => (
      <Fragment>
        <MaybeUnknownItem
          itemPath="vm"
          task={task}
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

      </Fragment>)}
  />
};

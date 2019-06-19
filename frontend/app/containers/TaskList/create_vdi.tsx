import {RouteComponentProps} from "react-router";
import {TaskView} from "./taskview";
import {MaybeUnknownItem} from "./unknownitem";
import {ListGroupItemHeading} from "reactstrap";
import {SR, VDI} from "./taskObject";
import React, {Fragment} from "react";


interface Args {
  id: string;
}


export const CreateVDITask = (props: RouteComponentProps<Args>) => {
  return <TaskView
    id={props.match.params.id}
    render={task => (
      <Fragment>
        <MaybeUnknownItem
          itemPath="vdi"
          task={task}
          history={props.history}
          getNameLabel={VDI._getNameLabel}
        >
          <ListGroupItemHeading>
            Disk
          </ListGroupItemHeading>
        </MaybeUnknownItem>
        <MaybeUnknownItem
          itemPath="sr"
          itemRef={task.objectRef}
          history={props.history}
          getNameLabel={SR._getNameLabel}
        >
          <ListGroupItemHeading>
            Storage repository
          </ListGroupItemHeading>
        </MaybeUnknownItem>
      </Fragment>)}
  />
};

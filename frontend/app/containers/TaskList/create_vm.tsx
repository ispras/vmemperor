import {RouteComponentProps} from "react-router";
import React, {Fragment, ReactNode, useEffect, useState} from "react";
import {ListGroup, ListGroupItem, ListGroupItemProps, Progress} from "reactstrap";
import {TaskStatus, useTaskInfoQuery, useTaskInfoUpdateSubscription} from "../../generated-models";
import {useApolloClient} from "react-apollo-hooks";
import ListGroupItemHeading from "reactstrap/lib/ListGroupItemHeading";
import ApolloClient from "apollo-client";
import {getTemplateNameLabel, getVMNameLabel} from "./getValue";
import moment from 'moment';

interface Args {
  id: string;
}

interface MaybeUnknownItemProps {
  itemPath: string;
  itemRef: string;
  children: ReactNode;
  history: RouteComponentProps['history'];
  getNameLabel: (client: ApolloClient<any>, ref: string) => Promise<string>;
}

const MaybeUnknownItem: React.FunctionComponent<MaybeUnknownItemProps> =
  ({itemPath, itemRef, children, history, getNameLabel}) => {
    const client = useApolloClient();
    const onButtonClick = () => {
      history.push(`/${itemPath}/${itemRef}`);
    };
    const props: Partial<ListGroupItemProps> = itemRef ? {
      tag: "button",
      action: true,
      onClick: () => onButtonClick(),
    } : {};
    const [nameLabel, setNameLabel] = useState(itemRef);
    useEffect(() => {
      const func = async () => {
        const _nameLabel = await getNameLabel(client, itemRef);
        setNameLabel(_nameLabel);
      };
      func();
    }, [itemRef]);
    return <ListGroupItem {...props}>
      {children}
      {nameLabel}
    </ListGroupItem>
  };

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
          getNameLabel={getVMNameLabel}
        >
          <ListGroupItemHeading>
            VM
          </ListGroupItemHeading>
        </MaybeUnknownItem>
        <MaybeUnknownItem
          itemPath="template"
          itemRef={task.objectRef}
          history={props.history}
          getNameLabel={getTemplateNameLabel}
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

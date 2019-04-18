import {RouteComponentProps} from "react-router";
import React, {Fragment, useEffect, useMemo, useState} from "react";
import {Row, Col, ButtonGroup, Button, Label, ListGroup, ListGroupItem, ListGroupItemHeading} from "reactstrap";
import {
  PlaybookNameForTaskListDocument,
  PlaybookNameForTaskListQuery, PlaybookNameForTaskListQueryVariables,
  useTaskInfoQuery, useTaskInfoUpdateSubscription,
  VMForTaskListDocument,
  VMForTaskListQuery,
  VMForTaskListQueryVariables
} from "../../generated-models";
import {useApolloClient} from "react-apollo-hooks";
import PlaybookWatcher from "../../components/PlaybookWatcher";
import {MaybeUnknownItem} from "./unknownitem";
import {getVMNameLabel} from "./getValue";
import moment = require("moment");

interface Args {
  id: string;
}

export const PlaybookTask = (props: RouteComponentProps<Args>) => {
  const {data: {task}} = useTaskInfoQuery({
    variables: {
      ref: props.match.params.id
    }
  });
  document.title = "View playbook task";
  useTaskInfoUpdateSubscription();
  const [vms, setVms] = useState<string[]>([]);
  const [variables, setVariables] = useState<string>("");
  const [playbook, setPlaybook] = useState<PlaybookNameForTaskListQuery>(null);
  const client = useApolloClient();
  useEffect(() => { //Loading VM data
    setVms(task.objectRef.split(';'));
  }, [task.objectRef]);

  useEffect(() => { //Loading playbook data

    const func = async () => {
      if (!task.nameDescription) {
        setPlaybook({
          playbook: {
            id: "0",
            name: "Unknown playbook"
          }
        });
        return;
      }
      const playbookData = JSON.parse(task.nameDescription);
      setVariables(playbookData.variables);
      try {
        const {data} = await client.query<PlaybookNameForTaskListQuery, PlaybookNameForTaskListQueryVariables>({
          query: PlaybookNameForTaskListDocument,
          variables: {
            playbookId: playbookData.playbookId
          }
        });
        setPlaybook(data);
      } catch (e) {
        setPlaybook({
          playbook: {
            name: `Deleted Playbook ${playbookData.playbookId}`,
            id: playbookData.playbookId
          }
        })
      }
    };
    func();
  }, []);
  if (!playbook)
    return null;
  return <Fragment>
    <Label>
      <h3>{playbook.playbook.name}</h3>
      <h5>at {moment(task.created).format("L LTS")} - {task.finished ? moment(task.finished).format("L LTS") : "not finished"}</h5>
    </Label>
    <div><h4>VMs</h4></div>
    <ListGroup>
      {vms.map(vmRef => (<MaybeUnknownItem
          itemRef={vmRef}
          itemPath="vm"
          getNameLabel={getVMNameLabel}
          history={props.history}
          key={vmRef}
        />
      ))}
    </ListGroup>

    <h4>Variables</h4>
    <code> {JSON.stringify(variables, null, '\t')}</code>
    <h4> State </h4>
    <PlaybookWatcher
      taskId={props.match.params.id}
    />
  </Fragment>
};

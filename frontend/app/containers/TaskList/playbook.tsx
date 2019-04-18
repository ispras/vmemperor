import {RouteComponentProps} from "react-router";
import React, {Fragment, useEffect, useMemo, useState} from "react";
import {Row, Col, ButtonGroup, Button, Label} from "reactstrap";
import {
  PlaybookNameForTaskListDocument,
  PlaybookNameForTaskListQuery, PlaybookNameForTaskListQueryVariables,
  useTaskInfoQuery,
  VMForTaskListDocument,
  VMForTaskListQuery,
  VMForTaskListQueryVariables
} from "../../generated-models";
import {useApolloClient} from "react-apollo-hooks";
import PlaybookWatcher from "../../components/PlaybookWatcher";

interface Args {
  id: string;
}

export const PlaybookTask = (props: RouteComponentProps<Args>) => {
  const {data: {task}} = useTaskInfoQuery({
    variables: {
      ref: props.match.params.id
    }
  });
  const [vms, setVms] = useState<VMForTaskListQuery[]>([]);
  const [variables, setVariables] = useState<string>("");
  const [playbook, setPlaybook] = useState<PlaybookNameForTaskListQuery>(null);
  const client = useApolloClient();
  const onVmButtonClick = (ref: string) => {
    props.history.push(`/vms/${ref}`);
  };
  useEffect(() => { //Loading VM data
    const func = async () => {
      const vmRefs = task.objectRef.split(";");
      const asyncMap = vmRefs.map(async (item) => {
        const {data} = await client.query<VMForTaskListQuery, VMForTaskListQueryVariables>({
          query: VMForTaskListDocument,
          variables: {
            vmRef: item,
          }
        });
        return data;
      });
      const _vms = (await Promise.all(asyncMap)).filter(item => !!item);
      setVms(_vms);
    };
    func();
  }, []);

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
    <Label><h3>{playbook.playbook.name}</h3></Label>
    <Row>
      <Col>
        VMs
      </Col>
      <Col>
        <ButtonGroup>
          {vms.map(({vm}) => {
            if (!vm) {
              return null;
            }
            return (
              <Button onClick={() => onVmButtonClick(vm.ref)} id={`cmd-playbook-vm-${vm.ref}`}>
                {vm.nameLabel}
              </Button>)
          })}
        </ButtonGroup>
      </Col>
    </Row>
    <Row>
      <Col>
        Variables
      </Col>
      <Row>
        <code>{variables}</code>
      </Row>
    </Row>
    <PlaybookWatcher taskId={props.match.params.id}/>
  </Fragment>
};

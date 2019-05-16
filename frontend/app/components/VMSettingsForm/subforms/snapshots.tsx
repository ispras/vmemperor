import {
  useSnapshotVMMutation,
  VMActions,
  VMInfoFragmentFragment,
  VMSnapshotFragmentFragment, VMSnapshotFragmentFragmentDoc
} from "../../../generated-models";
import * as React from "react";
import {
  ChangeEventHandler,
  Fragment,
  MouseEventHandler,
  useState
} from "react";
import {Button, CardFooter, Input, Row} from "reactstrap";
import Col from "reactstrap/lib/Col";
import FullHeightCard from "../../FullHeightCard";
import CardBody from "reactstrap/lib/CardBody";
import CardTitle from "reactstrap/lib/CardTitle";
import {SnapshotList} from "./snapshotList";


interface Props {
  vm: VMInfoFragmentFragment

}


export const Snapshots: React.FC<Props> = ({vm}) => {

  const [nameLabel, setNameLabel] = useState("");
  const onEditSnapshotName: ChangeEventHandler<HTMLInputElement> = (e) => {
    setNameLabel(e.target.value);
  };

  const snapshot = useSnapshotVMMutation();
  
  const onCreateSnapshot: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();

    //Send snapshot mutation
    const {data: {vmSnapshot}, errors} = await snapshot({
        variables: {
          ref: vm.ref,
          nameLabel
        }
      }
    );


    /*showTaskNotification(client, `Cloning vm "${vm.nameLabel}" into "${nameLabel}"`,
      vmSnapshot); */ //we don't need it since the snapshotting is instant
    setNameLabel("");
  };


  return (
    <Fragment>
      {vm.myActions.includes(VMActions.snapshot) && (
        <Row>
          <Col>
            <FullHeightCard>
              <CardBody>
                <CardTitle>Create a new snapshot</CardTitle>
                <Input
                  placeholder="Input snapshot name..."
                  value={nameLabel}
                  onChange={onEditSnapshotName}
                >
                </Input>
              </CardBody>
              <CardFooter>
                <Button
                  disabled={nameLabel === ""}
                  onClick={onCreateSnapshot}
                >
                  Create snapshot
                </Button>
              </CardFooter>
            </FullHeightCard>
          </Col>
        </Row>
      )}
      <Row>
        <SnapshotList vm={vm}/>
      </Row>
    </Fragment>
  )
};

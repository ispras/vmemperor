import React, {Fragment, useState, useMemo, useCallback} from 'react';


import {checkBoxFormatter} from "../../../utils/formatters";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardText,
  CardTitle,
  Col,
  Collapse,
  Row,
  UncontrolledAlert
} from 'reactstrap';

import StatefulTable, {ColumnType} from '../../../containers/StatefulTable';
import NetworkAttach from './networkAttach';
import {
  NetAttach,
  NetAttachTableSelect,
  NetAttachTableSelectAll, NetAttachTableSelection, NetDetach,
  VmInfoFragment,
  VmvifFragment
} from "../../../generated-models";
import {useMutation, useQuery} from "react-apollo-hooks";
import {Data} from "popper.js";
import Variables = NetAttach.Variables;

interface DataType {
  ref: string;
  nameLabel: string;
  currentlyAttached: boolean;
  ip?: string;
  MAC: string;
  netRef: string;
};

type NetColumnType = ColumnType<DataType>;
const columns: NetColumnType[] = [
  {
    dataField: 'ref',
    text: '#'
  },
  {
    dataField: 'nameLabel',
    text: 'Name'
  },
  {
    dataField: 'currentlyAttached',
    text: 'Attached',
    formatter: checkBoxFormatter,
  },
  {
    dataField: 'ip',
    text: 'IP',
  },
  {
    dataField: 'MAC',
    text: 'MAC'
  }

];

interface Props {
  vm: VmInfoFragment.Fragment;

}

const Network: React.FunctionComponent<Props> = ({vm}) => {
  const [netAttach, setNetAttach] = useState(false);

  const tableData: DataType[] = useMemo(() => {
    return vm.VIFs.map(({ref, ip, ipv6, network: {nameLabel, ref: netRef}, MAC, currentlyAttached}: VmvifFragment.Fragment): DataType => {
      return {
        ref,
        ip,
        nameLabel,
        MAC,
        currentlyAttached,
        netRef,
      }
    })
  }, [vm.VIFs]);

  const onDetach = useMutation<NetDetach.Mutation, NetDetach.Variables>(NetDetach.Document);
  const tableSelection = useQuery<NetAttachTableSelection.Query, NetAttachTableSelection.Variables>(NetAttachTableSelection.Document);
  const selectedData = useMemo(() => tableData.filter(item => tableSelection.data.selectedItems.includes(item.ref)), [tableData, tableSelection]);
  const onDetachDoubleClick = useCallback(async () => {
    for (const row of selectedData)
      await onDetach({
        variables: {
          vmRef: vm.ref,
          netRef: row.netRef,
        }
      })
  }, [selectedData, vm.ref, tableData]);

  return (<Fragment>
      <Row>
        <Col sm={12}>
          <Card>
            <CardBody>
              <CardTitle>Networks</CardTitle>
              <CardText>
                <StatefulTable
                  columns={columns}
                  data={tableData}
                  keyField="ref"
                  tableSelectMany={NetAttachTableSelectAll.Document}
                  tableSelectOne={NetAttachTableSelect.Document}
                  tableSelectionQuery={NetAttachTableSelection.Document}
                />
              </CardText>
            </CardBody>
            <CardFooter>
              <Button size="lg" color="success" onClick={() => setNetAttach(!netAttach)} active={netAttach}
                      aria-pressed="true">
                Attach network
              </Button>
              <Button id={'detach-vif'} size="lg" color="danger" disabled={selectedData.length === 0}
                      onClick={onDetachDoubleClick}>
                Detach
              </Button>
              <Collapse id="collNet"
                        isOpen={netAttach}>
                <UncontrolledAlert color='info'>Double-click to attach a network</UncontrolledAlert>
                <NetworkAttach vm={vm}

                />
              </Collapse>

            </CardFooter>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default Network;





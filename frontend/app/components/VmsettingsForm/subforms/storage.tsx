import React, {PureComponent, useCallback, useMemo, useState} from 'react';
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
import {sizeFormatter, checkBoxFormatter} from "../../../utils/formatters";
import StorageAttach from "./storageAttach";

import StatefulTable, {ColumnType} from '../../../containers/StatefulTable';

import {
  DiskAttachTableSelect, DiskAttachTableSelectAll,
  DiskAttachTableSelection,
  StorageAttachList,
  VdiDetach,
  VmvbdFragment,
  VmInfo
} from "../../../generated-models";
import Vm = VmInfo.Vm;
import {useMutation, useQuery} from "react-apollo-hooks";

interface DataType {
  userdevice: number;
  nameLabel: string;
  virtualSize: number;
  currentlyAttached: boolean;
  bootable: boolean;
  type: string;
  ref: string;
  vdiRef: string;
}

const columns: ColumnType<DataType>[] = [
  {
    dataField: 'userdevice',
    text: 'Name'
  },
  {
    dataField: 'type',
    text: 'Type',

  },
  {
    dataField: 'nameLabel',
    text: 'Disk name',

  },

  {
    dataField: 'virtualSize',
    text: 'Size',
    formatter: sizeFormatter,
  },
  {
    dataField: 'currentlyAttached',
    text: 'Attached',
    formatter: checkBoxFormatter,
  },

  {
    dataField: 'bootable',
    text: 'Bootable',
    formatter: checkBoxFormatter,
  },


];


interface Props {
  vm: Vm
}

const Storage: React.FunctionComponent<Props> = ({vm}) => {
  const [vdiAttach, setVdiAttach] = useState(false);
  const [isoAttach, setIsoAttach] = useState(false);

  const tableData: DataType[] = useMemo(() => {
    return vm.VBDs.map(({ref, userdevice, type, currentlyAttached, bootable, VDI,}: VmvbdFragment.Fragment): DataType => {
      return {
        ref,
        userdevice,
        type,
        currentlyAttached,
        bootable,
        nameLabel: VDI ? VDI.nameLabel : "Unknown",
        virtualSize: VDI ? VDI.virtualSize : null,
        vdiRef: VDI ? VDI.ref : null,
      }
    })
  }, [vm.VBDs]);
  const nonSelectable = useMemo(() =>
      tableData.filter(item => !item.vdiRef).map(item => item.ref),
    [tableData]);
  const onDetach = useMutation<VdiDetach.Mutation, VdiDetach.Variables>(VdiDetach.Document);
  const tableSelection = useQuery<DiskAttachTableSelection.Query, DiskAttachTableSelection.Variables>(DiskAttachTableSelection.Document);
  const selectedData = useMemo(() => tableData.filter(item => tableSelection.data.selectedItems.includes(item.ref)), [tableData, tableSelection]);

  const onDetachDoubleClick = useCallback(async () => {
    for (const row of selectedData)
      await onDetach({
        variables: {
          vmRef: vm.ref,
          vdiRef: row.vdiRef,
        }
      })
  }, [selectedData, vm.ref, tableData]);

  const {data: {isos, vdis}} = useQuery<StorageAttachList.Query, StorageAttachList.Variables>(StorageAttachList.Document);


  return (
    <React.Fragment>

      <Row>
        <Col sm={12}>
          <Card>
            <CardBody>
              <CardTitle>Virtual disks</CardTitle>
              <CardText>
                <StatefulTable
                  columns={columns}
                  data={tableData}
                  keyField="ref"
                  tableSelectMany={DiskAttachTableSelectAll.Document}
                  tableSelectOne={DiskAttachTableSelect.Document}
                  tableSelectionQuery={DiskAttachTableSelection.Document}
                  nonSelectable={nonSelectable}
                />
              </CardText>
            </CardBody>
            <CardFooter>
              <Button size="lg" color="success" onClick={() => setVdiAttach(!vdiAttach)} active={vdiAttach}
                      aria-pressed="true"> Attach virtual hard disk </Button>
              <Button size="lg" color="success" onClick={() => setIsoAttach(!isoAttach)} active={isoAttach}
                      aria-pressed="true"> Attach ISO image </Button>
              <Button size="lg" color="danger" disabled={selectedData.length === 0}
                      onClick={onDetachDoubleClick}> Detach </Button>
              <Collapse id="collVdi"
                        isOpen={vdiAttach}>
                <UncontrolledAlert color='info'>Double-click to attach a disk. You can't delete an attached
                  disk</UncontrolledAlert>
                <StorageAttach
                  diskImageList={vdis}
                  vm={vm}
                  caption="Hard disk images"
                />
              </Collapse>
              <Collapse id="collIso"
                        isOpen={isoAttach}>
                <UncontrolledAlert color='info'>Double-click to attach an ISO</UncontrolledAlert>
                <StorageAttach
                  caption="ISO images"
                  diskImageList={isos}
                  vm={vm}
                />
              </Collapse>

            </CardFooter>
          </Card>

        </Col>
      </Row>
    </React.Fragment>
  );
};


export default Storage;

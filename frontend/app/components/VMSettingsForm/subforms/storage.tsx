import React, {Fragment, useCallback, useMemo, useState} from 'react';
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
import {sizeFormatter, checkBoxFormatter, userdeviceFormatter} from "../../../utils/formatters";
import StorageAttach from "./storageAttach";

import StatefulTable, {ColumnType} from '../../../containers/StatefulTable';
import {
  DiskAttachTableSelectAllDocument, DiskAttachTableSelectDocument, DiskAttachTableSelectionDocument,
  useDiskAttachTableSelectionQuery, useStorageAttachISOListQuery, useStorageAttachVDIListQuery,
  useVDIDetachMutation,
  VMInfoFragmentFragment, VMVBDFragmentFragment
} from "../../../generated-models";
import {useRouter} from "../../../hooks/router";

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
    text: 'Name',
    formatter: userdeviceFormatter
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
  vm: VMInfoFragmentFragment
}


const Storage: React.FunctionComponent<Props> = ({vm}) => {
  const [vdiAttach, setVdiAttach] = useState(false);
  const [isoAttach, setIsoAttach] = useState(false);

  const tableData: DataType[] = useMemo(() => {
    return vm.VBDs.map(
      ({ref, userdevice, type, currentlyAttached, bootable, VDI,}: VMVBDFragmentFragment): DataType => {
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
  const onDetach = useVDIDetachMutation();
  const tableSelection = useDiskAttachTableSelectionQuery();
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

  const {data: {vdis}} = useStorageAttachVDIListQuery();
  const {data: {vdis: isos}} = useStorageAttachISOListQuery();

  const router = useRouter();
  const onDoubleClick = useCallback((e: React.MouseEvent, row: DataType) => {
    if (row.vdiRef && row.vdiRef !== 'OpaqueRef:NULL')
      router.history.push(`/vdi/${row.vdiRef}`);
  }, [router]);

  return (
    <Fragment>
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
                  tableSelectMany={DiskAttachTableSelectAllDocument}
                  tableSelectOne={DiskAttachTableSelectDocument}
                  tableSelectionQuery={DiskAttachTableSelectionDocument}
                  nonSelectable={nonSelectable}
                  onDoubleClick={onDoubleClick}
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
    </Fragment>
  );
};


export default Storage;

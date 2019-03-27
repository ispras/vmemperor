import NextTable from 'react-bootstrap-table-next';

import React, {PureComponent, useMemo} from 'react';
import {sizeFormatter} from "../../../utils/formatters";
import {ColumnType} from "../../../containers/StatefulTable";
import {
  StorageAttachVDIListFragmentFragment, useVDIAttachMutation,
  VMInfoFragmentFragment
} from "../../../generated-models";

const columns: ColumnType<StorageAttachVDIListFragmentFragment>[] = [
  {
    dataField: 'nameLabel',
    text: 'Name',

  },
  {
    dataField: 'nameDescription',
    text: 'Description'
  },
  {
    dataField: 'virtualSize',
    text: 'Size',
    formatter: sizeFormatter,
  },
];

interface Props {
  vm: VMInfoFragmentFragment;
  diskImageList: StorageAttachVDIListFragmentFragment[];
  caption: string;

}


const StorageAttach: React.FunctionComponent<Props> = ({
                                                         vm: {ref, VBDs},
                                                         diskImageList,
                                                         caption
                                                       }) => {
  const onAttach = useVDIAttachMutation();
  const onDoubleClick = async (e, row: StorageAttachVDIListFragmentFragment, rowIndex) => {
    const taskId = await onAttach({
      variables: {
        vmRef: ref,
        vdiRef: row.ref,
      }
    });
  };

  const notYetConnectedList = useMemo(() => (
      diskImageList.filter(disk =>
        VBDs.filter(VBD => VBD.VDI).every(VBD => VBD.VDI.ref !== disk.ref))),
    [diskImageList, VBDs]);

  return (
    <div>
      <NextTable
        data={notYetConnectedList}
        caption={caption}
        columns={columns}
        noData={() => "No disks available for attaching"}
        rowEvents={{
          onDoubleClick
        }}
        keyField="ref"
      />
    </div>);
};


export default StorageAttach;

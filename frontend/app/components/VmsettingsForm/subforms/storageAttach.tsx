import NextTable from 'react-bootstrap-table-next';

import React, {PureComponent, useMemo} from 'react';
import {sizeFormatter} from "../../../utils/formatters";
import {ColumnType} from "../../../containers/StatefulTable";
import {DiskFragment, StorageAttachList, VdiAttach, VmInfoFragment} from "../../../generated-models";
import {useMutation, useQuery} from "react-apollo-hooks";

const columns: ColumnType<DiskFragment.Fragment>[] = [
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
  vm: VmInfoFragment.Fragment;
  diskImageList: DiskFragment.Fragment[];
  caption: string;

}


const StorageAttach: React.FunctionComponent<Props> = ({
                                                         vm: {ref, VBDs},
                                                         diskImageList,
                                                         caption
                                                       }) => {
  const onAttach = useMutation<VdiAttach.Mutation, VdiAttach.Variables>(VdiAttach.Document);
  const onDoubleClick = async (e, row: DiskFragment.Fragment, rowIndex) => {
    const taskId = await onAttach({
      variables: {
        vmRef: ref,
        vdiRef: row.ref,
      }
    });
  };

  const notYetConnectedList = useMemo(() => (
      diskImageList.filter(disk =>
        VBDs.every(VBD => VBD.VDI.ref !== disk.ref))),
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

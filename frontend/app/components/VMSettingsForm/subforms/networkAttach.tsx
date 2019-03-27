import React, {Fragment, useMemo} from 'react';
import NextTable from 'react-bootstrap-table-next';
import {ColumnType} from "../../../containers/StatefulTable";
import {
  NetworkListFragmentFragment,
  useNetAttachMutation,
  useNetworkListQuery,
  VMInfoFragmentFragment
} from "../../../generated-models";

const columns: ColumnType<NetworkListFragmentFragment>[] = [
  {
    dataField: 'nameLabel',
    text: 'Name',
  },
  {
    dataField: 'nameDescription',
    text: 'Description',
  },

];

interface Props {
  vm: VMInfoFragmentFragment,
}

const NetworkAttach = ({vm: {ref, VIFs}}: Props) => {
  const onAttach = useNetAttachMutation();
  const {data: {networks}} = useNetworkListQuery();
  const notYetConnectedList = useMemo(() => (
      networks.filter(network =>
        VIFs.filter(VIF => VIF.network).every(item => item.network.ref !== network.ref))),
    [VIFs, networks]);
  const onDoubleClick = async (e, row: NetworkListFragmentFragment, rowIndex) => {
    const taskId = await onAttach({
      variables: {
        vmRef: ref,
        netRef: row.ref,
      }
    });
    console.log(`Network connection... taskId: ${taskId.data.netAttach.taskId}`)
  };

  return (
    <div>
      <NextTable
        columns={columns}
        rowEvents={{
          onDoubleClick
        }}
        data={notYetConnectedList}
        keyField="ref"
      />
    </div>
  )
};

export default NetworkAttach;

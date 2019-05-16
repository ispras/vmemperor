import {
  DestroyVMSnapshotDocument, useRevertVMMutation,
  VMActions,
  VMInfoFragmentFragment,
  VMSnapshotFragmentFragment,
  VMSnapshotFragmentFragmentDoc
} from "../../../generated-models";
import NextTable from 'react-bootstrap-table-next';
import * as React from "react";
import {Reducer, ReducerState, useCallback, useEffect, useMemo, useReducer, useState} from "react";
import {ColumnType} from "../../../containers/StatefulTable";
import {showTaskNotification} from "../../Toast/task";
import {useApolloClient} from "react-apollo-hooks";
import {Button, ButtonToolbar, Col, Row} from "reactstrap";
import {
  readCacheObject,
  ReducerActionType,
  selectedForTrashReducer,
  SelectedForTrashState
} from "../../../utils/componentStateReducers";
import {ListAction} from "../../../utils/reducer";
import {Set} from 'immutable';
import ButtonGroup from "reactstrap/lib/ButtonGroup";
import RecycleBinButton from "../../RecycleBinButton";
import Label from "reactstrap/lib/Label";

interface Props {
  vm: VMInfoFragmentFragment

}

const _readVMSnapshot = (client) => (ref) => {
  return readCacheObject<VMSnapshotFragmentFragment>(client, VMSnapshotFragmentFragmentDoc,
    "GVMSnapshot", ref, "VMSnapshotFragment");
};

interface State extends SelectedForTrashState {

}

const keyField = 'ref';

type VMSnapshotListReducer = Reducer<State, ListAction>;

const initialState: ReducerState<VMSnapshotListReducer> = {
  selectedForTrash: Set.of<string>(),
};


export const SnapshotList: React.FC<Props> = ({vm}) => {
  const revert = useRevertVMMutation();
  const client = useApolloClient();


  /* Component's reducer allows us to remove VM snapshots in bulk */
  const reducer: VMSnapshotListReducer = (state, action) => {
    const type: ReducerActionType = action.type === "Remove" ? "Remove" : "Add";
    const info = _readVMSnapshot(client)(action.ref);
    return {
      ...selectedForTrashReducer(VMActions.destroy, type, info, state)
    }
  };

  const [{selectedForTrash}, dispatch] = useReducer<VMSnapshotListReducer>(reducer, initialState);
  const [selection, setSelection] = useState(Set.of<string>());

  const select = (ref, isSelect) => {
    setSelection(isSelect ? selection.add(ref) : selection.remove(ref));
    dispatch({
      ref,
      type: isSelect ? "Add" : "Remove",
    });
  };
  const onSelect = (row, isSelect) => {
    select(row[keyField], isSelect);
  };

  const selectAll = (refs: Set<string>, isSelect) => {
    for (const item of refs) {
      dispatch({
        ref: item,
        type: isSelect ? "Add" : "Remove"
      })
    }
    setSelection(isSelect ? refs : Set.of<string>());
  };

  const onSelectAll = (isSelect, rows: Set<VMSnapshotFragmentFragment>) => {
    selectAll(rows.map(row => row.ref), isSelect);
  };

  useEffect(() => { //Remove items that are no longer in snapshots but selected
    selection.subtract(vm.snapshots
      .map(snapshot => snapshot.ref))
      .forEach(value => select(value, false));
  }, [vm.snapshots]);

  /* NB: Bear in mind that if you'd add something more than just removing, you don't need that */
  const nonSelectable = useMemo(() =>
    vm.snapshots
      .filter(snapshot => !snapshot.myActions.includes(VMActions.destroy))
      .map(item => item.ref), [vm.snapshots]);

  const selectRow = {
    mode: 'checkbox',
    clickToSelect: 'false',
    bgColor: 'aqua',
    selected: selection,
    onSelect,
    onSelectAll,
    nonSelectable,
  };
  const columns: ColumnType<VMSnapshotFragmentFragment>[] = [
    {
      dataField: "nameLabel",
      text: "Name",
    },
    {
      dataField: "snapshotTime",
      text: "Snapshot time",
    },
    {
      dataField: "ref",
      text: "Revert",
      formatter: (cell, row) => { //call revert mutation
        const onClick = () => {
          const func = async () => {
            const {data, errors} = await revert({
              variables: {
                ref: cell,
              }
            });
            showTaskNotification(client,
              `Reverting VM "${vm.nameLabel}" onto state "${row.nameLabel}"`,
              data.vmRevert);
          };
          func();
        };
        const disabled = !row.myActions.includes(VMActions.revert);
        return <Button
          onClick={onClick}
          title={disabled ? "Access denied" : "Revert VM to this state"}
          disabled={disabled}
        >
          Revert
        </Button>
      }
    }
  ];
  return (
    <div>
      <Row>
        <Col>
          <RecycleBinButton
            destroyMutationName="vmSnapshotDestroy"
            state={{selectedForTrash}}
            destroyMutationDocument={DestroyVMSnapshotDocument}
            readCacheFunction={_readVMSnapshot(client)}
          />
        </Col>
        <Col>
          {`Snapshots of "${vm.nameLabel}"`}
        </Col>
      </Row>
      <NextTable
        data={vm.snapshots}
        columns={columns}
        noData={() => "No snapshots"}
        keyField={keyField}
        selectRow={selectRow}
      />
    </div>
  )
};

/**
 * Remember to put every new local query in app.tsx initialization, so that
 * it could be initialized with empty local state
 */
import StatefulTable, {ColumnType} from "../StatefulTable";
import {
  ISOListDocument,
  VDIListFragmentFragment, VDIListFragmentFragmentDoc, ISOListUpdateDocument,
  ISOTableSelectAllDocument,
  ISOTableSelectDocument,
  ISOTableSelectionDocument,
  useISOListQuery,
  useISOTableSelectionQuery, VDIAccessSetMutationDocument, VDIActions,
} from "../../generated-models";
import {nameFormatter} from "../../utils/formatters";
import filterFactory, {textFilter} from 'react-bootstrap-table2-filter';
import {RouteComponentProps} from "react-router";
import {getStateInfoAndTypeFromCache, handleAddRemove} from "../../utils/cacheUtils";
import * as React from "react";
import {Fragment, Reducer, ReducerState, useCallback, useReducer} from 'react';
import {
  readCacheObject,
  selectedForSetActionReducer,
  SelectedForSetActionState
} from "../../utils/componentStateReducers";
import {ListAction} from "../../utils/reducer";
import {Set} from 'immutable';
import {useTableSelectionInInternalState, useUpdateInternalStateWithSubscription} from "../../hooks/listSelectionState";
import {useApolloClient} from "react-apollo-hooks";
import {ButtonGroup, ButtonToolbar} from "reactstrap";
import SetAccessButton from "../../components/SetAccessButton";

type ISOColumnType = ColumnType<VDIListFragmentFragment>;

const columns: ISOColumnType[] = [
  {
    dataField: "nameLabel",
    text: "Name",
    filter: textFilter(),
    headerFormatter: nameFormatter,
    headerClasses: 'align-self-baseline'
  }
];


interface State extends SelectedForSetActionState /*,SelectedForTrashState */
{

}

type ISOListReducer = Reducer<State, ListAction>;

const initialState: ReducerState<ISOListReducer> = {
  selectedForSetAction: Set.of<string>()
};

const ISOs: React.FunctionComponent<RouteComponentProps> = ({history}) => {
  const {data: {vdis}} = useISOListQuery();
  const client = useApolloClient();
  const readVDI = useCallback((ref) => {
    return readCacheObject<VDIListFragmentFragment>(client, VDIListFragmentFragmentDoc, "GVDI", ref);
  }, [client]);

  const reducer: ISOListReducer = (state, action) => {
    const [type, info] = getStateInfoAndTypeFromCache(action, readVDI);
    return {
      ...selectedForSetActionReducer(type, info, state)
    }
  };
  const {data: {selectedItems}} = useISOTableSelectionQuery();
  const [state, dispatch] = useReducer<ISOListReducer>(reducer, initialState);
  useTableSelectionInInternalState(dispatch, selectedItems);
  useUpdateInternalStateWithSubscription(dispatch, ISOListUpdateDocument, ISOListDocument, "vdis");

  const onDoubleClick = useCallback((e: React.MouseEvent, row: VDIListFragmentFragment, index) => {
    e.preventDefault();
    history.push(`/vdi/${row.ref}`);
  }, [history]);
  return (
    <Fragment>
      <ButtonToolbar>
        <ButtonGroup size="lg">
          <SetAccessButton
            ALL={VDIActions.ALL}
            state={state}
            mutationName="vdiAccessSet"
            mutationNode={VDIAccessSetMutationDocument}
            readCacheFunction={readVDI}/>
        </ButtonGroup>
      </ButtonToolbar>
      <StatefulTable
        keyField="ref"
        data={vdis}
        tableSelectOne={ISOTableSelectDocument}
        tableSelectMany={ISOTableSelectAllDocument}
        tableSelectionQuery={ISOTableSelectionDocument}
        columns={columns}
        onDoubleClick={onDoubleClick}
        props={{
          striped: true,
          hover: true,
          filter: filterFactory(),
        }}
        onSelect={(key, isSelect) => dispatch({
          type: isSelect ? "Add" : "Remove",
          ref: key,
        })}
      />
    </Fragment>
  );


};

export default ISOs;

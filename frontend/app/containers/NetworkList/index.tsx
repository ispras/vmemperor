/**
 * Remember to put every new local query in app.tsx initialization, so that
 * it could be initialized with empty local state
 */
import StatefulTable, {ColumnType} from "../StatefulTable";
import {
  Change, NetworkAccessSetMutationDocument, NetworkActions,
  NetworkListDocument,
  NetworkListFragmentFragment, NetworkListFragmentFragmentDoc, NetworkListUpdateDocument,
  NetworkTableSelectAllDocument,
  NetworkTableSelectDocument,
  NetworkTableSelectionDocument,
  useNetworkListQuery,
  useNetworkListUpdateSubscription, useNetworkTableSelectionQuery
} from "../../generated-models";
import {nameFormatter} from "../../utils/formatters";
import filterFactory, {textFilter} from 'react-bootstrap-table2-filter';
import {RouteComponentProps} from "react-router";
import {getStateInfoAndTypeFromCache, handleAddRemove} from "../../utils/cacheUtils";
import * as React from "react";
import {Fragment, Reducer, ReducerState, useCallback, useReducer} from 'react';
import {ButtonGroup, ButtonToolbar} from "reactstrap";
import {
  readCacheObject,
  selectedForSetActionReducer,
  SelectedForSetActionState,
  selectedForTrashReducer, SelectedForTrashState
} from "../../utils/componentStateReducers";
import {ListAction} from "../../utils/reducer";
import {Set} from 'immutable';
import {useApolloClient} from "react-apollo-hooks";
import {useTableSelectionInInternalState, useUpdateInternalStateWithSubscription} from "../../hooks/listSelectionState";
import SetAccessButton from "../../components/SetAccessButton";

type NetworkColumnType = ColumnType<NetworkListFragmentFragment>;

const columns: NetworkColumnType[] = [
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

type NetworkListReducer = Reducer<State, ListAction>;

const initialState: ReducerState<NetworkListReducer> = {
  selectedForSetAction: Set.of<string>()
};

const Networks: React.FunctionComponent<RouteComponentProps> = ({history}) => {
  const {data: {networks}} = useNetworkListQuery();
  const client = useApolloClient();
  const readNetwork = useCallback((ref) => {
    return readCacheObject<NetworkListFragmentFragment>(client, NetworkListFragmentFragmentDoc, "GNetwork", ref);
  }, [client]);


  const reducer: NetworkListReducer = (state, action) => {
    const [type, info] = getStateInfoAndTypeFromCache(action, readNetwork);
    return {
      ...selectedForSetActionReducer(type, info, state),
      /*...selectedForTrashReducer(NetworkActions.destroy, type, info, state), */
    }
  };

  const {data: {selectedItems}} = useNetworkTableSelectionQuery();
  const [state, dispatch] = useReducer<NetworkListReducer>(reducer, initialState);
  useTableSelectionInInternalState(dispatch, selectedItems);
  useUpdateInternalStateWithSubscription(dispatch, NetworkListUpdateDocument, NetworkListDocument, "networks");

  const onDoubleClick = useCallback((e: React.MouseEvent, row: NetworkListFragmentFragment, index) => {
    e.preventDefault();
    history.push(`/network/${row.ref}`);
  }, [history]);
  return (
    <Fragment>
      <ButtonToolbar>
        <ButtonGroup size="lg">
          <SetAccessButton
            ALL={NetworkActions.ALL}
            state={state}
            mutationName="netAccessSet"
            mutationNode={NetworkAccessSetMutationDocument}
            readCacheFunction={readNetwork}/>
        </ButtonGroup>
      </ButtonToolbar>
      <StatefulTable
        keyField="ref"
        data={networks}
        tableSelectOne={NetworkTableSelectDocument}
        tableSelectMany={NetworkTableSelectAllDocument}
        tableSelectionQuery={NetworkTableSelectionDocument}
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

export default Networks;

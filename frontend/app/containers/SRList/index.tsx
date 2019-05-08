/**
 * Remember to put every new local query in app.tsx initialization, so that
 * it could be initialized with empty local state
 */
import StatefulTable, {ColumnType} from "../StatefulTable";
import {
  SRListDocument,
  SRListFragmentFragment, SRListFragmentFragmentDoc, SRListUpdateDocument,
  SRTableSelectAllDocument,
  SRTableSelectDocument,
  SRTableSelectionDocument,
  useSRListQuery,
  useSRTableSelectionQuery, SRAccessSetMutationDocument, SRActions,
} from "../../generated-models";
import {nameFormatter} from "../../utils/formatters";
import filterFactory, {textFilter} from 'react-bootstrap-table2-filter';
import {RouteComponentProps} from "react-router";
import {getStateInfoAndTypeFromCache} from "../../utils/cacheUtils";
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

type SRColumnType = ColumnType<SRListFragmentFragment>;

const columns: SRColumnType[] = [
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

type SRListReducer = Reducer<State, ListAction>;

const initialState: ReducerState<SRListReducer> = {
  selectedForSetAction: Set.of<string>()
};

const SRs: React.FunctionComponent<RouteComponentProps> = ({history}) => {
  const {data: {srs}} = useSRListQuery();
  const client = useApolloClient();
  const readSR = useCallback((ref) => {
    return readCacheObject<SRListFragmentFragment>(client, SRListFragmentFragmentDoc, "GSR", ref);
  }, [client]);

  const reducer: SRListReducer = (state, action) => {
    const [type, info] = getStateInfoAndTypeFromCache(action, readSR);
    return {
      ...selectedForSetActionReducer(type, info, state)
    }
  };
  const {data: {selectedItems}} = useSRTableSelectionQuery();
  const [state, dispatch] = useReducer<SRListReducer>(reducer, initialState);
  useTableSelectionInInternalState(dispatch, selectedItems);
  useUpdateInternalStateWithSubscription(dispatch, SRListUpdateDocument, SRListDocument, "srs");

  const onDoubleClick = useCallback((e: React.MouseEvent, row: SRListFragmentFragment, index) => {
    e.preventDefault();
    history.push(`/sr/${row.ref}`);
  }, [history]);
  return (
    <Fragment>
      <ButtonToolbar>
        <ButtonGroup size="lg">
          <SetAccessButton
            ALL={SRActions.ALL}
            state={state}
            mutationName="srAccessSet"
            mutationNode={SRAccessSetMutationDocument}
            readCacheFunction={readSR}/>
        </ButtonGroup>
      </ButtonToolbar>
      <StatefulTable
        keyField="ref"
        data={srs}
        tableSelectOne={SRTableSelectDocument}
        tableSelectMany={SRTableSelectAllDocument}
        tableSelectionQuery={SRTableSelectionDocument}
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

export default SRs;

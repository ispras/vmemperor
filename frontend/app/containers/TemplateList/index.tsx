import * as React from 'react';
import {Fragment, Reducer, ReducerState, useCallback, useReducer} from 'react';
import {RouteComponentProps} from "react-router";
import StatefulTable, {ColumnType} from "../StatefulTable";
import {useApolloClient} from "react-apollo-hooks";
import filterFactory, {textFilter} from 'react-bootstrap-table2-filter'
import {
  Change, DeleteTemplateDocument, TemplateAccessSetMutationDocument,
  TemplateActions,
  TemplateListDocument,
  TemplateListFragmentFragment,
  TemplateListFragmentFragmentDoc,
  TemplateTableSelectAllDocument,
  TemplateTableSelectDocument, TemplateTableSelectionDocument,
  useCurrentUserQuery,
  useDeleteTemplateMutation,
  useTemplateListQuery,
  useTemplateListUpdateSubscription,
} from "../../generated-models";
import {checkBoxFormatter, nameFormatter} from "../../utils/formatters";
import {Button, ButtonToolbar} from "reactstrap";
import {Set} from 'immutable';
import ButtonGroup from "reactstrap/lib/ButtonGroup";
import {ListAction} from "../../utils/reducer";
import {dataIdFromObject, handleAddRemove} from "../../utils/cacheUtils";
import RecycleBinButton from "../../components/RecycleBinButton";

import {installOptionsFormatter} from "./installoptions";
import {
  readCacheObject,
  selectedForSetActionReducer,
  SelectedForSetActionState, selectedForTrashReducer,
  SelectedForTrashState
} from "../../utils/componentStateReducers";
import {valueFromASTUntyped} from "graphql";
import SetAccessButton from "../../components/SetAccessButton";


type TemplateColumnType = ColumnType<TemplateListFragmentFragment>;

const columns: TemplateColumnType[] = [
  {
    dataField: "nameLabel",
    text: 'Name',
    filter: textFilter(),
    headerFormatter: nameFormatter,
    headerClasses: 'align-self-baseline'
  },
  {
    dataField: "installOptions",
    text: "Auto-install type",
    formatter: installOptionsFormatter,
  },

];

function rowClasses(row: TemplateListFragmentFragment, rowIndex) {
  if (row.installOptions) {
    if (row.installOptions.installRepository && row.installOptions.release && row.installOptions.arch) {
      return "table-success";
    } else {
      return "table-warning";
    }
  } else {
    return "table-danger";
  }
}


interface State extends SelectedForSetActionState, SelectedForTrashState {
}


type TemplateListReducer = Reducer<State, ListAction>;

const initialState: ReducerState<TemplateListReducer> = {
  selectedForSetAction: Set.of<string>(),
  selectedForTrash: Set.of<string>(),
};


const Templates: React.FunctionComponent<RouteComponentProps> = ({history}) => {

  const onDoubleClick = useCallback((e: React.MouseEvent, row: TemplateListFragmentFragment, index) => {
    e.preventDefault();
    history.push(`/template/${row.ref}`);
  }, [history]);

  const {data: {templates}} = useTemplateListQuery();
  //const {data: {currentUser}} = useCurrentUserQuery();
  const client = useApolloClient();
  const readTemplate = useCallback((ref) => {
    return readCacheObject<TemplateListFragmentFragment>(client, TemplateListFragmentFragmentDoc, "GTemplate", ref);
  }, [client]);


  const reducer: TemplateListReducer = (state, action) => {
    let info = null;
    let type = null;
    switch (action.type) {
      case "Change":
      case "Add":
        info = readTemplate(action.ref);
        type = "Add";
        break;
      case "Remove":
        info = {ref: action.ref};
        type = "Remove";
        break;
    }
    ;
    return {
      ...selectedForSetActionReducer(type, info, state),
      ...selectedForTrashReducer(TemplateActions.destroy, type, info, state),
    }
  };

  useTemplateListUpdateSubscription(
    {
      onSubscriptionData({client, subscriptionData}) {
        //Changing is handled automatically, here we're handling removal & addition
        const change = subscriptionData.data.templates;
        switch (change.changeType) {
          case Change.Add:
          case Change.Remove:
            console.log("Add/Remove: ", change);
            handleAddRemove(client, TemplateListDocument, 'templates', change);
            break;
          case Change.Change: //Update our internal state
            dispatch({
              type: "Change",
              ref: change.value.ref,
            });
            break;
          default:
            break;
        }
      }
    });



  const [state, dispatch] = useReducer<TemplateListReducer>(reducer, initialState);
  return (
    <Fragment>
      <ButtonToolbar>
        <ButtonGroup className="ml-auto" size="lg">
          <RecycleBinButton
            destroyMutationName="templateDelete"
            state={state}
            destroyMutationDocument={DeleteTemplateDocument}
            readCacheFunction={readTemplate}
          />
          <SetAccessButton
            ALL={TemplateActions.ALL}
            readCacheFunction={readTemplate}
            state={state}
            mutationName="templateAccessSet"
            mutationNode={TemplateAccessSetMutationDocument}
          />
        </ButtonGroup>
      </ButtonToolbar>
      <StatefulTable
        keyField="ref"
        data={templates}
        tableSelectOne={TemplateTableSelectDocument}
        tableSelectMany={TemplateTableSelectAllDocument}
        tableSelectionQuery={TemplateTableSelectionDocument}
        props={{
          striped: true,
          hover: true,
          filter: filterFactory(),
          rowClasses
        }}
        onDoubleClick={onDoubleClick}
        onSelect={(key, isSelect) => dispatch({
          type: isSelect ? "Add" : "Remove",
          ref: key,
        })}
        columns={columns}/>
    </Fragment>
  );

};

export default Templates;

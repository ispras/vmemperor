import * as React from 'react';
import {Fragment, Reducer, ReducerState, useCallback, useReducer} from 'react';
import {RouteComponentProps} from "react-router";
import StatefulTable, {ColumnType} from "../StatefulTable";
import {useApolloClient, useMutation, useQuery} from "react-apollo-hooks";
import filterFactory, {textFilter} from 'react-bootstrap-table2-filter'
import {
  Change,
  CurrentUser, DeleteTemplate,
  TemplateActions,
  TemplateList,
  TemplateListFragment, TemplateListUpdate, TemplateSetEnabled,
  TemplateTableSelect,
  TemplateTableSelectAll,
  TemplateTableSelection
} from "../../generated-models";
import {checkBoxFormatter, nameFormatter} from "../../utils/formatters";
import {Button, ButtonToolbar} from "reactstrap";
import {Set} from 'immutable';
import ButtonGroup from "reactstrap/lib/ButtonGroup";
import {ListAction} from "../../utils/reducer";
import {dataIdFromObject, handleAddRemove} from "../../utils/cacheUtils";
import RecycleBinButton from "../../components/RecycleBinButton";
import {useSubscription} from "../../hooks/subscription";
import {installOptionsFormatter} from "./installoptions";


type TemplateColumnType = ColumnType<TemplateListFragment.Fragment>;

const columns: TemplateColumnType[] = [
  {
    dataField: "nameLabel",
    text: 'Name',
    filter: textFilter(),
    headerFormatter: nameFormatter,
    headerClasses: 'align-self-baseline'
  },
  {
    dataField: "enabled",
    text: 'Enabled',
    formatter: checkBoxFormatter,
  },
  {
    dataField: "installOptions",
    text: "Auto-install type",
    formatter: installOptionsFormatter,
  },

];

function rowClasses(row: TemplateListFragment.Fragment, rowIndex) {
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


interface State {
  selectedForEnabling: Set<string>;
  selectedForDisabling: Set<string>;
  selectedForTrash: Set<string>;
}

type TemplateListReducer = Reducer<State, ListAction>;

const initialState: ReducerState<TemplateListReducer> = {
  selectedForEnabling: Set.of<string>(),
  selectedForDisabling: Set.of<string>(),
  selectedForTrash: Set.of<string>(),
};


const Templates: React.FunctionComponent<RouteComponentProps> = ({history}) => {
  const {data: {templates}} = useQuery<TemplateList.Query>(TemplateList.Document);
  const {data: {currentUser}} = useQuery<CurrentUser.Query>(CurrentUser.Document);
  const client = useApolloClient();
  const templateMutation = useMutation<TemplateSetEnabled.Mutation, TemplateSetEnabled.Variables>(TemplateSetEnabled.Document);
  const deleteTemplate = useMutation<DeleteTemplate.Mutation, DeleteTemplate.Variables>(DeleteTemplate.Document);

  const reducer: TemplateListReducer = (state, action) => {
    let currentState = {...initialState};
    switch (action.type) {
      case "Change":
      case "Add":
        const info = client.cache.readFragment<TemplateListFragment.Fragment>({
          fragment: TemplateListFragment.FragmentDoc,
          id: dataIdFromObject({
            ref: action.ref,
            __typename: "GTemplate",
          }),
        });

        if (currentUser.isAdmin)
          currentState = {
            ...currentState,
            selectedForEnabling: !info.enabled
              ? state.selectedForEnabling.add(action.ref)
              : state.selectedForEnabling.remove(action.ref),
            selectedForDisabling: info.enabled
              ? state.selectedForDisabling.add(action.ref)
              : state.selectedForDisabling.remove(action.ref),

          };

        return {
          ...currentState, selectedForTrash: info.myActions.includes(TemplateActions.Destroy)
            ? state.selectedForTrash.add(action.ref)
            : state.selectedForTrash.remove(action.ref)
        };
      case "Remove":
        if (currentUser.isAdmin)
          currentState = {
            ...currentState,
            selectedForEnabling: state.selectedForEnabling.delete(action.ref),
            selectedForDisabling: state.selectedForDisabling.delete(action.ref),
          };
        return {
          ...currentState,
          selectedForTrash: state.selectedForTrash.delete(action.ref),
        };
    }
  };

  useSubscription<TemplateListUpdate.Subscription>(TemplateListUpdate.Document,
    {
      onSubscriptionData({client, subscriptionData}) {
        //Changing is handled automatically, here we're handling removal & addition
        const change = subscriptionData.templates;
        switch (change.changeType) {
          case Change.Add:
          case Change.Remove:
            console.log("Add/Remove: ", change);
            handleAddRemove(client, TemplateList.Document, 'templates', change);
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

  const onEnableDisable = useCallback(async (array: Array<string>, enabled: boolean) => {
    for (const id of array) {
      await templateMutation({
        variables: {
          template: {
            ref: id,
            enabled
          }
        }
      });
    }
  }, [templateMutation]);

  const [state, dispatch] = useReducer<TemplateListReducer>(reducer, initialState);
  const {selectedForEnabling, selectedForDisabling, selectedForTrash} = state;

  const onEnable = useCallback(async () =>
    await onEnableDisable(selectedForEnabling.toArray(), true), [onEnableDisable, selectedForEnabling]);
  const onDisable = useCallback(async () =>
    await onEnableDisable(selectedForDisabling.toArray(), false), [onEnableDisable, selectedForDisabling]);

  const onDeleteTemplate = useCallback(async () => {
    for (const id of selectedForTrash.toArray()) {
      await deleteTemplate({
        variables: {
          ref: id
        }
      });
    }
  }, [deleteTemplate, selectedForTrash]);

  return (
    <Fragment>
      <ButtonToolbar>
        {currentUser.isAdmin &&
        <ButtonGroup>
          <Button
            color="primary"
            disabled={selectedForEnabling.isEmpty()}
            onClick={onEnable}
          >
            Enable
          </Button>
          <Button
            color="primary"
            disabled={selectedForDisabling.isEmpty()}
            onClick={onDisable}
          >
            Disable
          </Button>
        </ButtonGroup>
        }
        <ButtonGroup className="ml-auto">
          <RecycleBinButton
            onClick={onDeleteTemplate}
            disabled={selectedForTrash.size == 0}/>
        </ButtonGroup>
      </ButtonToolbar>
      <StatefulTable
        keyField="ref"
        data={templates}
        tableSelectOne={TemplateTableSelect.Document}
        tableSelectMany={TemplateTableSelectAll.Document}
        tableSelectionQuery={TemplateTableSelection.Document}
        props={{
          striped: true,
          hover: true,
          filter: filterFactory(),
          rowClasses
        }}
        onSelect={(key, isSelect) => dispatch({
          type: isSelect ? "Add" : "Remove",
          ref: key,
        })}
        columns={columns}/>
    </Fragment>
  );

};

export default Templates;

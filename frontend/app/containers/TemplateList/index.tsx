import * as React from 'react';
import {Fragment, Reducer, ReducerState, useReducer} from 'react';
import {RouteComponentProps} from "react-router";
import StatefulTable, {ColumnType} from "../StatefulTable";
import {useApolloClient, useQuery} from "react-apollo-hooks";
import filterFactory, {textFilter} from 'react-bootstrap-table2-filter'
import {
  Change,
  CurrentUser,
  TemplateActions,
  TemplateList,
  TemplateListFragment, TemplateListUpdate,
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
    dataField: "osKind",
    text: "Auto-install type",
  },

];

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

  const reducer: TemplateListReducer = (state, action) => {
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
          return {
            selectedForTrash: info.myActions.includes(TemplateActions.Destroy)
              ? state.selectedForTrash.add(action.ref)
              : state.selectedForTrash.remove(action.ref),
            selectedForEnabling: !info.enabled
              ? state.selectedForEnabling.add(action.ref)
              : state.selectedForEnabling.remove(action.ref),
            selectedForDisabling: info.enabled
              ? state.selectedForDisabling.add(action.ref)
              : state.selectedForDisabling.remove(action.ref),

          };

        return {
          ...initialState,
          selectedForTrash: info.myActions.includes(TemplateActions.Destroy)
            ? state.selectedForTrash.add(action.ref)
            : state.selectedForTrash.remove(action.ref)
        };
      case "Remove":
        if (currentUser.isAdmin)
          return {
            ...initialState,
            selectedForTrash: state.selectedForTrash.delete(action.ref)
          };
        return {
          selectedForTrash: state.selectedForTrash.delete(action.ref),
          selectedForEnabling: state.selectedForEnabling.delete(action.ref),
          selectedForDisabling: state.selectedForDisabling.delete(action.ref),
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

  const [state, dispatch] = useReducer<TemplateListReducer>(reducer, initialState);
  const {selectedForEnabling, selectedForDisabling, selectedForTrash} = state;
  return (
    <Fragment>
      <ButtonToolbar>
        {currentUser.isAdmin &&
        <ButtonGroup>
          <Button
            color="primary"
            disabled={selectedForEnabling.isEmpty()}
          >
            Enable
          </Button>
          <Button
            color="primary"
            disabled={selectedForDisabling.isEmpty()}
          >
            Disable
          </Button>
        </ButtonGroup>
        }
        <ButtonGroup className="ml-auto">
          <RecycleBinButton
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
          filter: filterFactory()
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

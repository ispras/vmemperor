/**
 * Remember to put every new local query in app.tsx initialization, so that
 * it could be initialized with empty local state
 */

import StatefulTable, {ColumnType} from "../StatefulTable";

import {nameFormatter} from "../../utils/formatters";
import filterFactory, {textFilter} from 'react-bootstrap-table2-filter';
import {RouteComponentProps} from "react-router";
import {
  dataIdFromObject,
  getStateInfoAndTypeFromCache,
  handleAddOfValue,
  handleRemoveOfValueByRef
} from "../../utils/cacheUtils";
import * as React from "react";
import {Fragment, Reducer, ReducerState, useCallback, useEffect, useMemo, useReducer, useRef} from "react";
import {
  readCacheObject,
  selectedForSetActionReducer,
  SelectedForSetActionState,
  selectedForTrashReducer,
  SelectedForTrashState
} from "../../utils/componentStateReducers";
import {ListAction} from "../../utils/reducer";
import {Set} from 'immutable';
import {useTableSelectionInInternalState} from "../../hooks/listSelectionState";
import {useApolloClient} from "react-apollo-hooks";
import {Button, ButtonGroup, ButtonToolbar} from "reactstrap";
import {
  Change,
  TaskActions,
  TaskFragmentFragment,
  TaskFragmentFragmentDoc,
  TaskListDocument,
  TaskListQuery,
  TaskListQueryVariables,
  TaskListUpdateDocument,
  TaskListUpdateSubscription,
  TaskListUpdateSubscriptionVariables,
  TaskTableSelectAllDocument,
  TaskTableSelectDocument,
  TaskTableSelectionDocument,
  useTaskListQuery,
  useTaskTableSelectionQuery,
  VMForTaskListDocument,
  VMForTaskListQuery,
  VMForTaskListQueryVariables
} from "../../generated-models";
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';
import moment from "moment";
import * as daterangepicker from "daterangepicker";

export interface DataType extends TaskFragmentFragment {
}

export type TaskColumnType = ColumnType<DataType>;


interface State extends SelectedForSetActionState, SelectedForTrashState {
}

interface DateRange {
  startDate: moment.Moment;
  endDate: moment.Moment;
}

interface MomentState extends DateRange {
  live: boolean;
}

interface MomentAction {
  type: "setDateRange" | "liveOn" | "liveOff",
  startDate?: moment.Moment;
  endDate?: moment.Moment;
}

type MomentReducer = Reducer<MomentState, MomentAction>;

type SelectionReducer = Reducer<State, ListAction>;

const initialSelectionState: ReducerState<SelectionReducer> = {
  selectedForSetAction: Set.of<string>(),
  selectedForTrash: Set.of<string>(),
};

const initialMomentState: ReducerState<MomentReducer> = {
  live: false,
  startDate: moment().subtract(1, 'weeks'),
  endDate: moment()
};


const Tasks: React.FunctionComponent<RouteComponentProps> = ({history}) => {
  const client = useApolloClient();
  const {data: {tasks}} = useTaskListQuery();
  const selectionReducer: SelectionReducer = (state, action) => {
    const [type, info] = getStateInfoAndTypeFromCache(action, readTask);
    return {
      ...selectedForSetActionReducer(type, info, state),
      ...selectedForTrashReducer(TaskActions.remove, type, info, state
      )
    }
  };

  const momentReducer: MomentReducer = (state, action) => {
    switch (action.type) {
      case "setDateRange":
        if (state.live)
          return {
            ...state,
            startDate: action.startDate,
            endDate: moment(),
          };
        else {
          return {
            ...state,
            startDate: action.startDate,
            endDate: action.endDate,
          }
        }
      case "liveOn":
        return {
          ...state,
          live: true,
          endDate: moment(),
        };
      case "liveOff":
        return {
          ...state,
          live: false,
        }
    }
  };

  const onLiveButtonClick = () => {
    if (momentState.live) {
      momentDispatch({
          type: "liveOff"
        }
      );
    } else {
      momentDispatch({
        type: "liveOn"
      });
    }
  };


  const readTask = useCallback((ref) => {
    return readCacheObject<TaskFragmentFragment>(client, TaskFragmentFragmentDoc, "GTask", ref);
  }, [client]);


  const {data: {selectedItems}} = useTaskTableSelectionQuery();
  const [selectionState, selectionDispatch] = useReducer<SelectionReducer>(selectionReducer, initialSelectionState);
  const [momentState, momentDispatch] = useReducer<MomentReducer>(momentReducer, initialMomentState);
  const subscription = useRef<ZenObservable.Subscription>(null);

  const getNameLabel = useCallback(async (value: TaskFragmentFragment) => {
    const nameParts = value.nameLabel.split('.');
    if (nameParts.length > 1 && value.objectRef) {
      let cl = null;
      let method = null;
      if (nameParts[0] == 'Async') {
        cl = nameParts[1];
        method = nameParts[2];
      } else {
        cl = nameParts[0];
        method = nameParts[1];
      }
      switch (cl) {
        case "VM":
          const {data: {vm: {nameLabel: vmNameLabel}}} = await client.query<VMForTaskListQuery, VMForTaskListQueryVariables>({
              query: VMForTaskListDocument,
              variables: {
                vmRef: value.objectRef
              }
            }
          );
          switch (method) {
            case "start":
              return `Started VM ${vmNameLabel}`;
            case "shutdown":
              return `Shut down VM ${vmNameLabel}`;
            case "hard_shutdown":
              return `Forcibly shut down VM ${vmNameLabel}`;
            case "clean_shutdown":
              return `Gracefully shut down VM ${vmNameLabel}`;
            default:
              break;
          }
          break;
        default:
          break;

      }
    }
    return value.nameLabel;
  }, [client]);
  const getValue: (value: TaskFragmentFragment) => Promise<TaskFragmentFragment> = async value => ({
      ...value,
      nameLabel: await getNameLabel(value)
    }
  );
  const loadTasks = async () => {
    const onLoad = async (data: TaskFragmentFragment[]) => {
      const asyncMap: Promise<TaskFragmentFragment>[] = data.map(getValue);
      const newTasks = await Promise.all(asyncMap);
      client.writeQuery<TaskListQuery, TaskListQueryVariables>({
        query: TaskListDocument,
        data: {
          tasks: newTasks
        }
      });
    };
    console.log("Loading task data", momentState);
    const {data} = await client.query<TaskListQuery, TaskListQueryVariables>({
      query: TaskListDocument,
      variables: {
        startDate: momentState.startDate.format(),
        endDate: momentState.endDate.format(),
      }
    });
    await onLoad(data.tasks);

  };


  useEffect(() => {
    loadTasks()
  }, [momentState.startDate, momentState.endDate]);

  useEffect(() => {
    if (momentState.live) {
      console.log("Subscribing to live tasks");
      subscription.current = client.subscribe(
        {
          query: TaskListUpdateDocument,
        }
      ).subscribe(({data: {tasks: {changeType, value}}}) => {
        switch (changeType) {
          case Change.Change:
            const func = async () => {
              client.cache.writeFragment<TaskFragmentFragment>({
                fragment: TaskFragmentFragmentDoc,
                id: dataIdFromObject(value),
                data: await getValue(value)
              });
            };
            func();
            break;
          case Change.Remove:
            handleRemoveOfValueByRef(client, TaskListDocument, "tasks", value);
            break;
          case Change.Add:
            const func2 = async () =>
              handleAddOfValue(client, TaskListDocument, "tasks",
                (await getValue(value)));
            func2();
            break;
        }
      });
    } else {
      if (subscription.current) {
        subscription.current.unsubscribe();
        subscription.current = null;
      }
    }
  }, [momentState.live]);

  const onApplyDate = useCallback((_, picker: daterangepicker) => {
    momentDispatch({
      type: "setDateRange",
      startDate: picker.startDate,
      endDate: picker.endDate
    })
  }, []);

  useTableSelectionInInternalState(selectionDispatch, selectedItems);
  //@ts-ignore
  const columns: TaskColumnType[] = useMemo(() => {
    return [
      {
        dataField: "nameLabel",
        text: "Name",
        filter: textFilter(),
        headerFormatter: nameFormatter,
        headerClasses: 'align-self-baseline',
      }];
  }, []);


  const onDoubleClick = useCallback((e: React.MouseEvent, row: TaskFragmentFragment, index) => {
    e.preventDefault();
    /*history.push(`/vdi/${row.ref}`); */
  }, [history]);


  return (
    <Fragment>
      <ButtonToolbar>
        <ButtonGroup size="lg">
          {/*<RecycleBinButton
              destroyMutationName="taskRemove"
              state={state}
              destroyMutationDocument={TaskDeleteDocument}
              readCacheFunction={readTask}/>*/}
          <Button active={momentState.live} onClick={() => onLiveButtonClick()}>
            {
              momentState.live ? "Show past events" : "Show live events"
            }
          </Button>
          <DateRangePicker
            startDate={momentState.startDate}
            endDate={momentState.live ? null : momentState.endDate}
            showDropdowns={true}
            maxDate={moment()}
            timePicker={true}
            timePicker24Hour={true}
            timePickerSeconds={true}
            onApply={onApplyDate}
            autoUpdateInput={true}
            singleDatePicker={momentState.live}>
            <Button size="lg">
              {momentState.startDate.format() + " - " + (momentState.live ? "Now" : momentState.endDate.format())}
            </Button>
          </DateRangePicker>
        </ButtonGroup>
      </ButtonToolbar>
      <StatefulTable
        keyField="ref"
        data={tasks}
        tableSelectOne={TaskTableSelectDocument}
        tableSelectMany={TaskTableSelectAllDocument}
        tableSelectionQuery={TaskTableSelectionDocument}
        columns={columns}
        onDoubleClick={onDoubleClick}
        onSelect={(key, isSelect) => selectionDispatch({
          type: isSelect ? "Add" : "Remove",
          ref: key,
        })}
        props={{
          striped: true,
          hover: true,
          filter: filterFactory(),
        }}
      />
    </Fragment>
  )
};

export default Tasks;

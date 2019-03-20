import React, {Reducer, ReducerState, useCallback, useEffect, useMemo, useReducer} from 'react';
import {useSubscription} from "../../hooks/subscription";
import {
  Change,
  DeleteVm,
  PauseVm,
  PowerState,
  ShutdownVm,
  StartVm,
  SuspendVm,
  VmActions,
  VmList,
  VmListFragment,
  VmListUpdate,
  VmStateForButtonToolbar,
  VmTableSelect,
  VmTableSelectAll,
  VmTableSelection
} from '../../generated-models';
import StatefulTable, {ColumnType} from "../StatefulTable";
import {RouteComponentProps} from "react-router";
import filterFactory, {textFilter} from 'react-bootstrap-table2-filter'
import tableStyle from "./table.css";
import {useApolloClient, useMutation, useQuery} from "react-apollo-hooks";
import {Map, Set} from 'immutable';
import {ButtonGroup, ButtonToolbar} from "reactstrap";
import {dataIdFromObject, handleAddRemove} from "../../utils/cacheUtils";
import StartButton from "../../components/StartButton";
import StopButton from "../../components/StopButton";
import RecycleBinButton from "../../components/RecycleBinButton";
import {nameFormatter, plainFormatter} from "../../utils/formatters";
import {ListAction} from "../../utils/reducer";
import PauseButton from "../../components/PauseButton";
import SuspendButton from "../../components/SuspendButton";
import VmSelectedReadyFor = VmStateForButtonToolbar.VmSelectedReadyFor;


type VmColumnType = ColumnType<VmListFragment.Fragment>;

const columns: VmColumnType[] = [
  {
    dataField: 'nameLabel',
    text: 'Name',
    filter: textFilter(),
    headerFormatter: nameFormatter,
    headerClasses: 'align-self-baseline'

  },
  {
    dataField: "powerState",
    text: 'Status',
    headerFormatter: plainFormatter,
    headerClasses: 'align-self-baseline'

  }
];


function rowClasses(row: VmListFragment.Fragment, rowIndex) {
  switch (row.powerState) {
    case PowerState.Halted:
      return 'table-danger';
    case PowerState.Running:
      return 'table-success';
    case PowerState.Suspended:
      return 'table-warning';
    case PowerState.Paused:
      return 'table-info';
    default:
      return "";
  }
}

interface State {
  selectedForStart: Set<string>;
  selectedForStop: Set<string>;
  selectedForTrash: Set<string>;
  selectedForPause: Set<string>;
  selectedForSuspend: Set<string>;
  wholeSelection: Map<string, VmListFragment.Fragment>;
}

type VMListReducer = Reducer<State, ListAction>;


const initialState: ReducerState<VMListReducer> = {
  selectedForStart: Set.of<string>(),
  selectedForStop: Set.of<string>(),
  selectedForTrash: Set.of<string>(),
  selectedForPause: Set.of<string>(),
  selectedForSuspend: Set.of<string>(),
  wholeSelection: Map.of(),
};

export default function ({history}: RouteComponentProps) {
  const {
    data: {vms},
  } = useQuery<VmList.Query>(VmList.Document);

  const client = useApolloClient();

  const reducer: VMListReducer = (state, action) => {


    switch (action.type) {
      case "Change":
      case "Add":
        //Read fragment associated with this VM in the cache
        const info = client.cache.readFragment<VmListFragment.Fragment>({
          fragment: VmListFragment.FragmentDoc,
          id: dataIdFromObject({
            ref: action.ref,
            __typename: "GVM",
          }),

        });
        console.log("Got associated info: ", info, "Action:", action.type);
        console.log("State:", state);

        return {
          selectedForStart: (info.powerState == PowerState.Halted && info.myActions.includes(VmActions.Start)) ||
          (info.powerState == PowerState.Suspended && info.myActions.includes(VmActions.Resume))
            ? state.selectedForStart.add(action.ref)
            : state.selectedForStart.remove(action.ref),
          selectedForStop: info.powerState !== PowerState.Halted && info.myActions.includes(VmActions.HardShutdown)
            ? state.selectedForStop.add(action.ref)
            : state.selectedForStop.remove(action.ref),
          selectedForTrash: info.powerState === PowerState.Halted && info.myActions.includes(VmActions.Destroy)
            ? state.selectedForTrash.add(action.ref)
            : state.selectedForTrash.remove(action.ref),
          selectedForPause: info.powerState === PowerState.Running && info.myActions.includes(VmActions.Pause) ||
          info.powerState == PowerState.Paused && info.myActions.includes(VmActions.Unpause) ||
          info.powerState == PowerState.Suspended && info.myActions.includes(VmActions.Resume) ||
          info.powerState == PowerState.Halted && info.myActions.includes(VmActions.Start)
            ? state.selectedForPause.add(action.ref)
            : state.selectedForPause.remove(action.ref),
          selectedForSuspend: info.powerState === PowerState.Running && info.myActions.includes(VmActions.Suspend)
            ? state.selectedForSuspend.add(action.ref)
            : state.selectedForSuspend.remove(action.ref),
          wholeSelection: state.wholeSelection.set(action.ref, info)
        };
      case "Remove":
        return {
          selectedForStart: state.selectedForStart.remove(action.ref),
          selectedForStop: state.selectedForStop.remove(action.ref),
          selectedForTrash: state.selectedForTrash.remove(action.ref),
          selectedForPause: state.selectedForPause.remove(action.ref),
          selectedForSuspend: state.selectedForSuspend.remove(action.ref),
          wholeSelection: state.wholeSelection.remove(action.ref),
        }

    }
  };
  const [{selectedForStart, selectedForStop, selectedForTrash, selectedForPause, selectedForSuspend, wholeSelection}, dispatch] = useReducer<VMListReducer>(reducer, initialState);
  const {data: {selectedItems}} = useQuery<VmTableSelection.Query, VmTableSelection.Variables>(VmTableSelection.Document);

  useEffect(() => { //Re-add items to our internal state
    if (!wholeSelection.isEmpty())
      return;

    for (const item of selectedItems)
      dispatch({
        type: "Add",
        ref: item,
      })
  }, []); // To be run only once on loading
  const buttonTitle = useCallback((startswith: string, array: Array<string>) => {
    let ret = startswith;
    for (let i = 0; i < array.length; ++i) {
      ret += `"${wholeSelection.get(array[i]).nameLabel}"`;
      if (i < array.length - 1)
        ret += ', ';
    }
    return ret;
  }, [wholeSelection]);

  const startButtonTitle = useMemo(() => buttonTitle("Start ", selectedForStart.toArray()), [buttonTitle, selectedForStart]);
  const stopButtonTitle = useMemo(() => buttonTitle("Stop ", selectedForStop.toArray()), [buttonTitle, selectedForStop]);
  const trashButtonTitle = useMemo(() => buttonTitle("Delete ", selectedForTrash.toArray()), [buttonTitle, selectedForTrash]);
  const suspendButtonTitle = useMemo(() => buttonTitle("Suspend ", selectedForSuspend.toArray()), [buttonTitle, selectedForSuspend]);
  const pauseButtonOptions = useMemo(() => {
    const array = selectedForPause.toArray();
    let titlePause = "";
    let titleUnpause = "";
    for (const ref of array) {
      switch (wholeSelection.get(ref).powerState) {
        case PowerState.Paused:
          if (titleUnpause != "")
            titleUnpause += ", ";
          titleUnpause += `"${wholeSelection.get(ref).nameLabel}"`;
          break;
        case PowerState.Running:
        case PowerState.Suspended:
        case PowerState.Halted:
          if (titlePause != "")
            titlePause += ", ";
          titlePause += `"${wholeSelection.get(ref).nameLabel}"`;
          if (wholeSelection.get(ref).powerState == PowerState.Suspended)
            titlePause += " (with resuming)";
          else if (wholeSelection.get(ref).powerState === PowerState.Halted)
            titlePause += " (with starting)";
          break;
      }
    }
    let wholeTitle = "";
    let pause = false;
    let unpause = false;

    if (titlePause != "") {
      wholeTitle += `Pause ${titlePause}\n`;
      pause = true;
    }
    if (titleUnpause != "") {
      wholeTitle += `Unpause ${titleUnpause}`
      unpause = true;
    }
    return {
      pause,
      unpause,
      title: wholeTitle == "" ? "Pause or unpause" : wholeTitle
    }
  }, [wholeSelection, selectedForPause]);

  const onDoubleClick = useCallback((e: React.MouseEvent, row: VmListFragment.Fragment, index) => {
    e.preventDefault();
    history.push(`/vmsettings/${row.ref}`);
  }, [history]);

  useSubscription<VmListUpdate.Subscription>(VmListUpdate.Document,
    {
      onSubscriptionData({client, subscriptionData}) {
        //Changing is handled automatically, here we're handling removal & addition
        const change = subscriptionData.vms;
        switch (change.changeType) {
          case Change.Add:
          case Change.Remove:
            console.log("Add/Remove: ", change);
            handleAddRemove(client, VmList.Document, 'vms', change);
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


  const startVm = useMutation<StartVm.Mutation, StartVm.Variables>(
    StartVm.Document);
  const suspendVm = useMutation<SuspendVm.Mutation, SuspendVm.Variables>(SuspendVm.Document);
  const pauseVm = useMutation<PauseVm.Mutation, PauseVm.Variables>(PauseVm.Document);
  const onStartVm = useCallback(async () => {
    console.log("Staring...", selectedForStart);
    for (const id of selectedForStart.toArray()) {
      const variables = {ref: id};
      await startVm({variables});
    }
  }, [selectedForStart, startVm, pauseVm, suspendVm]);

  const stopVm = useMutation<ShutdownVm.Mutation, ShutdownVm.Variables>(
    ShutdownVm.Document);
  const onStopVm = useCallback(async () => {
    for (const id of selectedForStop.toArray()) {
      console.log("Stopping...", id);
      await stopVm(
        {
          variables: {
            ref: id
          },
        }
      );
    }
  }, [selectedForStop]);

  const onPauseVm = useCallback(async () => {
    for (const id of selectedForPause.toArray()) {
      const powerState = wholeSelection.get(id).powerState;
      switch (powerState) {
        case PowerState.Running:
        case PowerState.Paused:
          await pauseVm({variables: {ref: id}});
          break;
        case PowerState.Halted:
        case PowerState.Suspended:
          await startVm({
            variables: {
              ref: id,
              options: {
                paused: true,
              }
            }
          });
      }

    }
  }, [selectedForPause, wholeSelection]);
  const onSuspendVm = useCallback(async () => {
    for (const id of selectedForSuspend.toArray()) {
      await suspendVm({variables: {ref: id}});
    }
  }, [selectedForSuspend]);


  const deleteVm = useMutation<DeleteVm.Mutation, DeleteVm.Variables>(
    DeleteVm.Document);
  const onDeleteVm = async () => {
    for (const id of selectedForTrash.toArray()) {
      await deleteVm(
        {
          variables: {
            ref: id
          }
        });
    }
  };


  return (
    <React.Fragment>
      <ButtonToolbar>
        <ButtonGroup size="lg">
          <StartButton
            title={startButtonTitle}
            onClick={onStartVm}
            disabled={selectedForStart.isEmpty()}/>
          <StopButton
            title={stopButtonTitle}
            onClick={onStopVm}
            disabled={selectedForStop.isEmpty()}/>
          <PauseButton
            title={pauseButtonOptions.title}
            pause={pauseButtonOptions.pause}
            unpause={pauseButtonOptions.unpause}
            onClick={onPauseVm}
            disabled={selectedForPause.isEmpty()}/>
          <SuspendButton
            title={suspendButtonTitle}
            onClick={onSuspendVm}
            disabled={selectedForSuspend.isEmpty()}
          />
        </ButtonGroup>
        <ButtonGroup className="ml-auto">
          <RecycleBinButton
            title={trashButtonTitle}
            onClick={onDeleteVm}
            disabled={selectedForTrash.isEmpty()}/>
        </ButtonGroup>
      </ButtonToolbar>
      <StatefulTable
        keyField="ref"
        refetchQueriesOnSelect={
          [
            {
              query: VmStateForButtonToolbar.Document
            }
          ]
        }
        data={vms}
        tableSelectOne={VmTableSelect.Document}
        tableSelectMany={VmTableSelectAll.Document}
        tableSelectionQuery={VmTableSelection.Document}
        columns={columns}

        props={
          {
            filter: filterFactory(),
            style: tableStyle,
            noDataIndication: "No VMs available... create something new!",
            striped: true,
            hover: true,
            rowClasses,
          }
        }
        onDoubleClick={onDoubleClick}
        onSelect={(key, isSelect) => dispatch({
          type: isSelect ? "Add" : "Remove",
          ref: key,
        })}
      />
    </React.Fragment>)


}

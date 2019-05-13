import React, {Reducer, ReducerState, useCallback, useEffect, useMemo, useReducer, useState, Fragment} from 'react';
import StatefulTable, {ColumnType} from "../StatefulTable";
import {RouteComponentProps} from "react-router";
import filterFactory, {textFilter} from 'react-bootstrap-table2-filter'
import tableStyle from "./table.css";
import {useApolloClient} from "react-apollo-hooks";
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
import SetAccessButton from "../../components/SetAccessButton";
import ActionListModal from "../../components/AccessView/actionListModal";
import toast from 'toasted-notes';
import {
  Change, DeleteVMDocument,
  PowerState, TaskInfoUpdateDocument, TaskInfoUpdateSubscription,
  useDeleteVMMutation,
  usePauseVMMutation,
  useShutdownVMMutation,
  useStartVMMutation,
  useSuspendVMMutation, useTaskInfoUpdateSubscription,
  useVMListQuery,
  useVMListUpdateSubscription,
  useVmTableSelectionQuery,
  VMAccessSetMutationDocument,
  VMActions,
  VMListDocument,
  VMListFragmentFragment,
  VMListFragmentFragmentDoc, VMListUpdateDocument,
  VMStateForButtonToolbarDocument,
  VmTableSelectAllDocument,
  VmTableSelectDocument,
  VmTableSelectionDocument
} from "../../generated-models";
import {
  readCacheObject,
  selectedForSetActionReducer,
  SelectedForSetActionState
} from "../../utils/componentStateReducers";
import {buttonTitle} from "../../utils/buttonTitle";
import {useTableSelectionInInternalState, useUpdateInternalStateWithSubscription} from "../../hooks/listSelectionState";
import {_readVM} from "./tools";
import {uptimeFormatter, VIFsFormatter} from "./formatters";
import {showTaskErrorNotification, showTaskNotification} from "../../components/Toast/task";


type VMColumnType = ColumnType<VMListFragmentFragment>;

const columns: VMColumnType[] = [
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
  },
  {
    dataField: 'VIFs',
    text: 'IPs',
    headerFormatter: plainFormatter,
    headerClasses: 'align-self-baseline',
    formatter: VIFsFormatter,
  },
  {
    dataField: 'startTime',
    text: 'Uptime',
    headerFormatter: plainFormatter,
    headerClasses: 'align-self-baseline',
    formatter: uptimeFormatter,
  }
];


function rowClasses(row: VMListFragmentFragment, rowIndex) {
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

interface State extends SelectedForSetActionState {
  selectedForStart: Set<string>;
  selectedForStop: Set<string>;
  selectedForTrash: Set<string>;
  selectedForPause: Set<string>;
  selectedForSuspend: Set<string>;
}

type VMListReducer = Reducer<State, ListAction>;


const initialState: ReducerState<VMListReducer> = {
  selectedForStart: Set.of<string>(),
  selectedForStop: Set.of<string>(),
  selectedForTrash: Set.of<string>(),
  selectedForPause: Set.of<string>(),
  selectedForSuspend: Set.of<string>(),
  selectedForSetAction: Set.of<string>()
};

export default function ({history}: RouteComponentProps) {
  const {
    data: {vms},
  } = useVMListQuery();

  const client = useApolloClient();
  const readVM = _readVM(client);
  const reducer: VMListReducer = (state, action) => {


    switch (action.type) {
      case "Change":
      case "Add":
        //Read fragment associated with this VM in the cache
        const info = readVM(action.ref);
        return {
          selectedForStart: (info.powerState == PowerState.Halted && info.myActions.includes(VMActions.start)) ||
          (info.powerState == PowerState.Suspended && info.myActions.includes(VMActions.resume))
            ? state.selectedForStart.add(action.ref)
            : state.selectedForStart.remove(action.ref),
          selectedForStop: info.powerState !== PowerState.Halted && info.myActions.includes(VMActions.hard_shutdown)
            ? state.selectedForStop.add(action.ref)
            : state.selectedForStop.remove(action.ref),
          selectedForTrash: info.powerState === PowerState.Halted && info.myActions.includes(VMActions.destroy)
            ? state.selectedForTrash.add(action.ref)
            : state.selectedForTrash.remove(action.ref),
          selectedForPause: info.powerState === PowerState.Running && info.myActions.includes(VMActions.pause) ||
          info.powerState == PowerState.Paused && info.myActions.includes(VMActions.unpause) ||
          info.powerState == PowerState.Suspended && info.myActions.includes(VMActions.resume) ||
          info.powerState == PowerState.Halted && info.myActions.includes(VMActions.start)
            ? state.selectedForPause.add(action.ref)
            : state.selectedForPause.remove(action.ref),
          selectedForSuspend: info.powerState === PowerState.Running && info.myActions.includes(VMActions.suspend)
            ? state.selectedForSuspend.add(action.ref)
            : state.selectedForSuspend.remove(action.ref),
          ...selectedForSetActionReducer("Add", info, state)
        }
          ;
      case
      "Remove"
      :
        return {
          selectedForStart: state.selectedForStart.remove(action.ref),
          selectedForStop: state.selectedForStop.remove(action.ref),
          selectedForTrash: state.selectedForTrash.remove(action.ref),
          selectedForPause: state.selectedForPause.remove(action.ref),
          selectedForSuspend: state.selectedForSuspend.remove(action.ref),
          ...selectedForSetActionReducer("Remove", action, state),
        }

    }
  };
  const [{selectedForStart, selectedForStop, selectedForTrash, selectedForPause, selectedForSuspend, selectedForSetAction}, dispatch] = useReducer<VMListReducer>(reducer, initialState);
  const {data: {selectedItems}} = useVmTableSelectionQuery();

  //Restore internal state using table selection from cache
  useTableSelectionInInternalState(dispatch, selectedItems);
  const vmButtonTitle = useCallback((startswith: string, array: Array<string>) => {
    return buttonTitle(startswith, array, readVM)
  }, [readVM]);

  const startButtonTitle = useMemo(() => vmButtonTitle("Start ", selectedForStart.toArray()), [vmButtonTitle, selectedForStart]);
  const stopButtonTitle = useMemo(() => vmButtonTitle("Stop ", selectedForStop.toArray()), [vmButtonTitle, selectedForStop]);
  const suspendButtonTitle = useMemo(() => vmButtonTitle("Suspend ", selectedForSuspend.toArray()), [vmButtonTitle, selectedForSuspend]);
  const pauseButtonOptions = useMemo(() => {
    const array = selectedForPause.toArray();
    let titlePause = "";
    let titleUnpause = "";
    for (const ref of array) {
      const vm = readVM(ref);
      switch (vm.powerState) {
        case PowerState.Paused:
          if (titleUnpause != "")
            titleUnpause += ", ";
          titleUnpause += `"${vm.nameLabel}"`;
          break;
        case PowerState.Running:
        case PowerState.Suspended:
        case PowerState.Halted:
          if (titlePause != "")
            titlePause += ", ";
          titlePause += `"${vm.nameLabel}"`;
          if (vm.powerState == PowerState.Suspended)
            titlePause += " (with resuming)";
          else if (vm.powerState === PowerState.Halted)
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
      wholeTitle += `Unpause ${titleUnpause}`;
      unpause = true;
    }
    return {
      pause,
      unpause,
      title: wholeTitle == "" ? "Pause or unpause" : wholeTitle
    }
  }, [readVM, selectedForPause]);

  const onDoubleClick = useCallback((e: React.MouseEvent, row: VMListFragmentFragment, index) => {
    e.preventDefault();
    history.push(`/vm/${row.ref}`);
  }, [history]);


  useUpdateInternalStateWithSubscription(dispatch, VMListUpdateDocument, VMListDocument, 'vms');


  const startVM = useStartVMMutation();
  const suspendVM = useSuspendVMMutation();
  const pauseVM = usePauseVMMutation();
  const onStartVM = async () => {
    for (const id of selectedForStart.toArray()) {
      const variables = {ref: id};
      const {data, errors} = await startVM({variables});
      showTaskNotification(client, `Starting VM "${readVM(id).nameLabel}"`, data.vmStart);

    }
  };

  const stopVM = useShutdownVMMutation();

  const onStopVM = useCallback(async () => {
    for (const id of selectedForStop.toArray()) {
      console.log("Stopping...", id);
      const {data, errors} = await stopVM(
        {
          variables: {
            ref: id
          },
        }
      );
      showTaskNotification(client, `Stopping VM "${readVM(id).nameLabel}"`, data.vmShutdown);
    }
  }, [selectedForStop]);

  const onPauseVM = useCallback(async () => {
    let data: {
      granted: boolean;
      reason?: string;
      taskId?: string;
    };
    let title: string;
    for (const id of selectedForPause.toArray()) {
      const powerState = readVM(id).powerState;
      switch (powerState) {
        case PowerState.Running:
        case PowerState.Paused:
          data = (await pauseVM({variables: {ref: id}}))
            .data.vmPause;
          title = `Unpausing VM "${readVM(id).nameLabel}"`;
          break;
        case PowerState.Halted:
        case PowerState.Suspended:
          data = (await startVM({
            variables: {
              ref: id,
              options: {
                paused: true,
              }
            }
          })).data.vmStart;
          title = `Pausing VM ${readVM(id).nameLabel}`;
          break;
      }
    }
    showTaskNotification(client, title, data);
  }, [selectedForPause, readVM]);
  const onSuspendVM = useCallback(async () => {
    for (const id of selectedForSuspend.toArray()) {
      const {data, errors} = await suspendVM({variables: {ref: id}});
      showTaskNotification(client, `Suspending VM "${readVM(id).nameLabel}`, data);
    }
  }, [selectedForSuspend]);

  return (
    <Fragment>
      <ButtonToolbar>
        <ButtonGroup size="lg">
          <StartButton
            title={startButtonTitle}
            onClick={() => onStartVM()}
            disabled={selectedForStart.isEmpty()}/>
          <StopButton
            title={stopButtonTitle}
            onClick={onStopVM}
            disabled={selectedForStop.isEmpty()}/>
          <PauseButton
            title={pauseButtonOptions.title}
            pause={pauseButtonOptions.pause}
            unpause={pauseButtonOptions.unpause}
            onClick={onPauseVM}
            disabled={selectedForPause.isEmpty()}/>
          <SuspendButton
            title={suspendButtonTitle}
            onClick={onSuspendVM}
            disabled={selectedForSuspend.isEmpty()}
          />
          <SetAccessButton
            ALL={VMActions.ALL}
            mutationName="vmAccessSet"
            mutationNode={VMAccessSetMutationDocument}
            state={{selectedForSetAction}}
            readCacheFunction={readVM}
          />
        </ButtonGroup>
        <ButtonGroup className="ml-auto">
          <RecycleBinButton
            destroyMutationName="vmDelete"
            state={{selectedForTrash}}
            destroyMutationDocument={DeleteVMDocument}
            readCacheFunction={readVM}
          />
        </ButtonGroup>
      </ButtonToolbar>
      <StatefulTable
        keyField="ref"
        refetchQueriesOnSelect={
          [
            {
              query: VMStateForButtonToolbarDocument
            }
          ]
        }
        data={vms}
        tableSelectOne={VmTableSelectDocument}
        tableSelectMany={VmTableSelectAllDocument}
        tableSelectionQuery={VmTableSelectionDocument}
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
    </Fragment>
  )


}

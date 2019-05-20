import {Set} from 'immutable';
import {DocumentNode} from "graphql";
import {dataIdFromObject} from "./cacheUtils";
import ApolloClient from "apollo-client";

export function readCacheObject<FragmentType, TCacheShape = any>(client: ApolloClient<TCacheShape>, FragmentDoc: DocumentNode, __typename: string, ref: string, fragmentName: string = undefined) {
  return client.cache.readFragment<FragmentType>({
    fragment: FragmentDoc,
    id: dataIdFromObject({
      ref,
      __typename,
    }),
    fragmentName
  });
}

export type ReducerActionType = "Add" | "Remove";

interface ReducerInfoType {
  ref: string;
}

interface SelectedForSetActionInfoType extends ReducerInfoType {
  isOwner?: boolean;
}

export interface SelectedForSetActionState {
  selectedForSetAction: Set<string>;
}

export function selectedForSetActionReducer(type: ReducerActionType, info: SelectedForSetActionInfoType, state: SelectedForSetActionState): SelectedForSetActionState {
  if (type == "Add") {
    if (info.isOwner === undefined || info.isOwner === null)
      throw "isOwner can't be null in this context";
    return {
      selectedForSetAction: info.isOwner
        ? state.selectedForSetAction.add(info.ref)
        : state.selectedForSetAction.remove(info.ref)
    };
  } else if (type == "Remove")
    return {
      selectedForSetAction: state.selectedForSetAction.remove(info.ref)
    };
}

export interface SelectedForTrashState {
  selectedForTrash: Set<string>;
}

export interface SelectedForTrashInfoType<ActionType> extends ReducerInfoType {
  myActions: Array<ActionType>
}

export function selectedForTrashReducer<ActionType>(destroyAction: ActionType, type: ReducerActionType, info: SelectedForTrashInfoType<ActionType>, state: SelectedForTrashState): SelectedForTrashState {
  if (type == "Add")
    return {
      selectedForTrash: info.myActions.includes(destroyAction)
        ? state.selectedForTrash.add(info.ref)
        : state.selectedForTrash.remove(info.ref)
    };
  else if (type == "Remove") {
    return {
      selectedForTrash: state.selectedForTrash.remove(info.ref)
    }
  }
}

import {defaultDataIdFromObject} from "apollo-cache-inmemory";
import {DocumentNode} from "graphql";
import {DataProxy} from "apollo-cache";
import {Change} from "../generated-models";
import {ActionType} from "redux-saga/effects";
import {ReducerActionType} from "./componentStateReducers";

export const dataIdFromObject = (object) => {
  // @ts-ignore
  if (object.ref) {
    // @ts-ignore
    return `${object.__typename}:${object.ref}`
  } else if (object.__typename === 'Interface') {
    return null; //Interfaces do not have unique ID's, we'd rather link them with their VMs
  } else {
    return defaultDataIdFromObject(object);
  }
};

export interface CacheWatcher<T> {
  complete: boolean;
  result: T;
}

interface ValueChange {
  changeType: Change,
  value?: Value,
  deleted?: Value,
}

interface Value {
  ref: string
}


export function handleRemoveOfValueByRef<QueryType>(client: DataProxy,
                                                    listQueryDocument: DocumentNode,
                                                    listFieldName: string,
                                                    value: Value) {
  const query = client.readQuery<QueryType>({
    query: listQueryDocument
  });
  const newQuery: typeof query = {
    ...query,
    [listFieldName]: query[listFieldName].filter(item => item.ref !== value.ref)
  };
  client.writeQuery<QueryType>({
    query: listQueryDocument,
    data: newQuery
  });
}


export function handleAddOfValue<QueryType>(client: DataProxy,
                                            listQueryDocument: DocumentNode,
                                            listFieldName: string,
                                            value: Value) {
  console.log("Removal of value: ", value.ref);
  const query = client.readQuery<QueryType>({
    query: listQueryDocument
  });
  const newQuery: typeof query = {
    ...query,
    [listFieldName]: [...query[listFieldName], value],
  };
  client.writeQuery<QueryType>({
    query: listQueryDocument,
    data: newQuery
  });
}

export function handleAddRemove(client: DataProxy,
                                listQueryDocument: DocumentNode,
                                listFieldName: string,
                                change: ValueChange) {
  switch (change.changeType) {
    case Change.Add:
      handleAddOfValue(client, listQueryDocument, listFieldName, change.value);
      break;
    case Change.Remove:
      console.log("Remove value: ", change);
      handleRemoveOfValueByRef(client, listQueryDocument, listFieldName, change.value ? change.value : change.deleted);
      break;
    default:
      break;
  }

}

export function getStateInfoAndTypeFromCache<TCacheObject>(action, cacheReadFunction: (id: string) => TCacheObject): [ReducerActionType, TCacheObject] {
  let info = null;
  let type = null;
  switch (action.type) {
    case "Change":
    case "Add":
      info = cacheReadFunction(action.ref);
      type = "Add";
      break;
    case "Remove":
      info = {ref: action.ref} as unknown as TCacheObject;
      type = "Remove";
      break;
  }
  return [type, info];
}

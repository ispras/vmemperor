import {
  QueryHookOptions as _QueryHookOptions,
  SubscriptionHookOptions,
  MutationHookOptions,
  useQuery as _useQuery,
  useMutation,
  useSubscription
} from "react-apollo-hooks";
import {OperationVariables} from "apollo-client";
import {DocumentNode} from "graphql";
import {Omit} from "../components/AbstractSettingsForm/utils";

type QueryHookOptions<TVariables, TCache = object> = Omit<_QueryHookOptions<TVariables, TCache>, "suspend">

export function useQuery<TData = any, TVariables = OperationVariables, TCache = object>(query: DocumentNode, options: QueryHookOptions<TVariables, TCache> = {}) {
  return _useQuery<TData, TVariables, TCache>(query, {
    suspend: true,
    ...options
  });

}

export {useSubscription, useMutation, QueryHookOptions, SubscriptionHookOptions, MutationHookOptions};



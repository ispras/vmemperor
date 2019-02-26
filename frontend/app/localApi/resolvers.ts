import {
  IResolvers,
  MutationResolvers,
  PowerState,
  QueryResolvers,
  SelectedItemsQuery,
  VmPowerState, VmSelectedIdLists,
  VmTableSelection,
  VmStateForButtonToolbar
} from "../generated-models";

import {ApolloCache} from 'apollo-cache';
import {Set} from 'immutable';
import SelectedItemsResolver = MutationResolvers.SelectedItemsResolver;
import VmSelectedReadyForResolver = QueryResolvers.VmSelectedReadyForResolver;

/* This is workaround. See:  https://github.com/dotansimha/graphql-code-generator/issues/1133 */
interface StringIndexSignatureInterface {
  [index: string]: any
}

/* This is workaround, unless ApolloClient has its own context type */
interface Context {
  cache: ApolloCache<any>
}

type StringIndexed<T> = T & StringIndexSignatureInterface;
type LocalResolvers = StringIndexed<IResolvers>


const selectedItems: SelectedItemsResolver<string[], {}, Context> =
  (parent1, args, context, info) => {
    const previous = context.cache.readQuery<SelectedItemsQuery.Query, SelectedItemsQuery.Variables>(
      {
        query: SelectedItemsQuery.Document,
        variables: {
          tableId: args.tableId
        }
      }
    );

    const getData = (): typeof previous => {
      const dataSet = Set.of(...previous.selectedItems);
      if (!args.isSelect) {
        return {
          selectedItems: dataSet.subtract(args.items).toArray()
        }
      } else {
        return {
          selectedItems: dataSet.union(args.items).toArray()
        }
      }
    };


    const data = getData();
    context.cache.writeQuery<SelectedItemsQuery.Query, SelectedItemsQuery.Variables>({
      query: SelectedItemsQuery.Document,
      variables: {tableId: args.tableId},
      data,
    });
    return data.selectedItems;
  };


const vmSelectedReadyFor: //This resolver is broken
  VmSelectedReadyForResolver<VmStateForButtonToolbar.VmSelectedReadyFor, {}, Context> =
  (parent1, args, context, info) => {

    const tableSelection: VmTableSelection.Query =
      context.cache.readQuery<VmTableSelection.Query, VmTableSelection.Variables>({query: VmTableSelection.Document});

    const powerStates: VmPowerState.Query =
      context.cache.readQuery({query: VmPowerState.Document});


    const tableSelectionSet = Set.of(...tableSelection.selectedItems);

    const start = tableSelectionSet.subtract(powerStates.vms.filter(vm => vm.powerState == PowerState.Running).map(vm => vm.ref)).toArray();
    const stop = tableSelectionSet.subtract(powerStates.vms.filter(vm => vm.powerState == PowerState.Halted).map(vm => vm.ref)).toArray();
    const trash = tableSelectionSet.subtract(stop).toArray();

    const ret = {
      start: start.length == 0 ? null : start,
      stop: stop.length == 0 ? null : stop,
      trash: trash.length == 0 ? null : trash,
      __typename: "VMSelectedIDLists"
    };

    return ret;
  };

export const resolvers: LocalResolvers = {
  Mutation: {
    selectedItems
  },
  Query: {
    vmSelectedReadyFor
  }
};

import {
  Resolvers,
  MutationResolvers as OriginalMutationResolvers,
  SelectedItemsQueryDocument, SelectedItemsQueryQuery, SelectedItemsQueryQueryVariables,
} from "../generated-models";

import {ApolloCache} from 'apollo-cache';
import {Set} from 'immutable';


/* This is workaround. See:  https://github.com/dotansimha/graphql-code-generator/issues/1133 */
interface StringIndexSignatureInterface {
  [index: string]: any
}

/* This is workaround, unless ApolloClient has its own context type */
interface Context {
  cache: ApolloCache<any>
}

type StringIndexed<T> = T & StringIndexSignatureInterface;
type LocalResolvers = StringIndexed<Resolvers>
type MutationResolvers = OriginalMutationResolvers<Context>;

const selectedItems: MutationResolvers["selectedItems"] =
  (parent1, args, context, info) => {
    const previous = context.cache.readQuery<SelectedItemsQueryQuery, SelectedItemsQueryQueryVariables>(
      {
        query: SelectedItemsQueryDocument,
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
    context.cache.writeQuery<SelectedItemsQueryQuery, SelectedItemsQueryQueryVariables>({
      query: SelectedItemsQueryDocument,
      variables: {tableId: args.tableId},
      data,
    });
    return data.selectedItems;
  };


export const resolvers: LocalResolvers = {
  Mutation: {
    selectedItems
  },
};

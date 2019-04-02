import React, {Dispatch} from 'react';
import {useEffect} from "react";
import {ListAction} from "../utils/reducer";
import ApolloClient from "apollo-client";
import {DocumentNode} from "graphql";
import {useSubscription} from './apollo';
import {handleAddRemove} from "../utils/cacheUtils";
import {Change} from "../generated-models";

export const useTableSelectionInInternalState = (dispatch: Dispatch<ListAction>, selectedItems) => {
  useEffect(() => { //Re-add items to our internal state
    for (const item of selectedItems)
      dispatch({
        type: "Add",
        ref: item,
      })
  }, []);
};

export const useUpdateInternalStateWithSubscription = (dispatch: Dispatch<ListAction>, subscription: DocumentNode, listQueryDocument: DocumentNode, client: ApolloClient<any>, listFieldName) => {
  useSubscription(subscription,
    {
      onSubscriptionData({client, subscriptionData}) {
        //Changing is handled automatically, here we're handling removal & addition
        const change = subscriptionData.data[listFieldName];
        switch (change.changeType) {
          case Change.Add:
          case Change.Remove:
            console.log("Add/Remove: ", change);
            handleAddRemove(client, listQueryDocument, listFieldName, change);
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
};

import React from "react";
import ReactDOM from "react-dom";
import {useSubscription} from "../../hooks/subscription";
import {Tasks} from "../../generated-models";
import {toast} from "react-toastify";

const AlertContainer: React.FunctionComponent = () => {
  const {data: {tasks}} = useSubscription<Tasks.Subscription, Tasks.Variables>(Tasks.Document, {
    onSubscriptionData({client, subscriptionData}) {
      toast
    },
  })
};







/**
 *
 * Settings
 *
 */

import React from 'react';
import {VmInfo, VmInfoUpdate} from "../../generated-models";
import VmSettingsForm from "../../components/VmSettingsForm";

import {RouteComponentProps} from "react-router";
import {useQuery} from "react-apollo-hooks";
import {useSubscription} from "../../hooks/subscription";
import {DocumentNode} from "graphql";

export interface SettingsVariables { //These props refer to page argument: see router.
  ref: string
}

export type SettingsRouteProps = RouteComponentProps<SettingsVariables>;

export interface SettingsComponentProps<T> {
  object: T;
}

interface Props<T> {
  id: string;
  Form: React.ComponentType<SettingsComponentProps<T>>;
  documentNode: DocumentNode;
  updateDocumentNode: DocumentNode;
}

function Settings<T>({id, Form, documentNode, updateDocumentNode}: Props<T>) {
  const {data} = useQuery<T, SettingsVariables>(documentNode,
    {
      variables: {
        ref: id,
      }
    });
  useSubscription<T>(updateDocumentNode,
    {
      variables: {
        ref: id,
      }
    }); //Memoization inside
  return <Form object={data}/>;
}

export default Settings;

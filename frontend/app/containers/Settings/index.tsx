/**
 *
 * Settings
 *
 */

import React from 'react';

import {RouteComponentProps} from "react-router";
import {useQuery, useSubscription} from "../../hooks/apollo";
import {DocumentNode} from "graphql";
import {Button, Label} from "reactstrap";

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
  useSubscription<T, SettingsVariables>(updateDocumentNode,
    {
      variables: {
        ref: id,
      }
    });//Memoization inside
  const entries = Object.entries(data);
  if (entries.length == 1 && entries[0][1])
    return <Form object={data}/>;
  else
    return <Label>
      <h1>Access denied or the object <code>'{id}'</code> is not found</h1>
      <Button
        onClick={() => {
          history.back()
        }}
        block={true}
        color="primary"
      >Go back</Button>
    </Label>

}

export default Settings;

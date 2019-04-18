/**
 *
 * RecycleBinButton
 *
 */

import React, {useCallback} from 'react';
// import styled from 'styled-components';

import {faTrashAlt} from "@fortawesome/free-solid-svg-icons/faTrashAlt";
import AwesomeButton, {Props as ButtonProps} from "../AwesomeButton";
import {DocumentNode} from "apollo-link";
import {SelectedForTrashState} from "../../utils/componentStateReducers";
import {useMutation} from "../../hooks/apollo";
import {buttonTitle, TReadCacheFunctionForButtonTitle} from "../../utils/buttonTitle";


interface DestroyVariables {
  ref: string;
}

interface Props extends Pick<ButtonProps, Exclude<keyof ButtonProps, "icon" | "color" | "onClick" | "disabled" | "title">> {
  destroyMutationName: string;
  state: SelectedForTrashState;
  destroyMutationDocument: DocumentNode;
  readCacheFunction: TReadCacheFunctionForButtonTitle;
  afterDelete?: () => any;
}


const RecycleBinButton = ({destroyMutationDocument, state, destroyMutationName, readCacheFunction, afterDelete, ...props}: Props) => {
  const deleteMutation = useMutation<any, DestroyVariables>(destroyMutationDocument);
  const onDelete = useCallback(async () => {
    for (const id of state.selectedForTrash.toArray()) {
      await deleteMutation({
        variables: {
          ref: id,
        }
      })
    }
    if (afterDelete)
      afterDelete();
  }, [state.selectedForTrash]);
  return (
    <AwesomeButton color="danger"
                   icon={faTrashAlt}
                   onClick={onDelete}
                   title={buttonTitle("Delete ", state.selectedForTrash.toArray(), readCacheFunction)}
                   disabled={state.selectedForTrash.isEmpty()}
                   {...props}/>
  );
};


export default RecycleBinButton;

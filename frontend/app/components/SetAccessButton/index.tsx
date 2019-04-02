/**
 *
 * StopButton
 *
 */

import React, {Fragment, useCallback, useState} from 'react';
// import styled from 'styled-components';

import AwesomeButton, {Props as ButtonProps} from '../AwesomeButton';
import {faKey} from "@fortawesome/free-solid-svg-icons";
import {SelectedForSetActionState} from "../../utils/componentStateReducers";
import ActionListModal from "../AccessView/actionListModal";
import {DocumentNode} from "graphql";
import {buttonTitle} from "../../utils/buttonTitle";

type TReadCacheFunctionForButtonTitleAndActions<ActionsType> = (ref: string) => {
  nameLabel: string;
  myActions: Array<ActionsType>;
}


interface Props<ActionType> extends Pick<ButtonProps, Exclude<keyof ButtonProps, "icon" | "color" | "onClick" | "disabled" | "title">> {
  ALL: ActionType;
  state: SelectedForSetActionState,
  mutationName: string;
  mutationNode: DocumentNode;
  readCacheFunction: TReadCacheFunctionForButtonTitleAndActions<ActionType>;
}


function SetAccessButton<ActionType>({ALL, state, mutationName, mutationNode, readCacheFunction, ...props}: Props<ActionType>) {
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const onActionSet = useCallback(() => {
    setActionModalVisible(true);
  }, [setActionModalVisible]);


  return (
    <Fragment>
      <AwesomeButton color="primary"
                     icon={faKey}
                     disabled={state.selectedForSetAction.isEmpty()}
                     onClick={onActionSet}
                     title={buttonTitle("Set access for ", state.selectedForSetAction.toArray(), readCacheFunction)}
                     {...props}/>
      {!state.selectedForSetAction.isEmpty() &&
      (<ActionListModal
        setOpen={setActionModalVisible}
        open={actionModalVisible}
        actions={readCacheFunction(state.selectedForSetAction.first()).myActions}
        refs={state.selectedForSetAction.toArray()}
        ALL={ALL}
        mutationName={mutationName}
        mutationNode={mutationNode}
      />)}
    </Fragment>
  );
};

export default SetAccessButton;

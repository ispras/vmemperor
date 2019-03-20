import ActionList, {Props as ActionListProps} from "./actionList";
import {useState} from "react";
import {Button, Modal} from "reactstrap";
import * as React from "react";

interface Props<T> extends Pick<ActionListProps<T>,
  'actions' | 'refs' | 'mutationNode' | 'mutationName' | 'ALL'> {
  setOpen: (isOpen: boolean) => void;
  open: boolean,
}

function ActionListModal<T>({setOpen, open, ...props}: Props<T>) {
  return (
    <Modal isOpen={open}>
      <ActionList
        isOwner={true}
        {...props}
      />
      <Button
        primary={true}
        onClick={() => setOpen(false)}
      >
        Close
      </Button>
    </Modal>
  )
}

export default ActionListModal;

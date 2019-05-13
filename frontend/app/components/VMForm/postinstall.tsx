import {Button, ButtonGroup} from "reactstrap";
import useReactRouter from 'use-react-router';
import React from "react";

interface Props {
  taskId: string;
  onClose: () => void;
}

export const PostInstall: React.FC<Props> = ({taskId, onClose}) => {
  const {history} = useReactRouter();
  const onGotoTask = () => history.push(`/create_vm/${taskId}`)
  return (
    <ButtonGroup>
      <Button onClick={onClose}>Go back & create another VM</Button>
      <Button color="primary" onClick={onGotoTask}>View installation progress</Button>
    </ButtonGroup>
  );
};

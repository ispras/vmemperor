import {Button} from "reactstrap";
import {ButtonProps} from "reactstrap";
import React, {ReactNode, useMemo, Fragment} from 'react';
import {UncontrolledTooltip} from "reactstrap";


interface DataObject<T> {
  myActions: Array<T>
}

interface Props<T>  extends Pick<ButtonProps, Exclude<keyof ButtonProps, "disabled">> {
  action: T;
  data: DataObject<T>;
  children?: ReactNode;
  id: string;
}


function ActionButton<T>(props: Props<T>) {
  const {action, data, children, ...rest} = props;
  const disabled = useMemo(() => !data.myActions.includes(action), [data, action]);

  return (
    <Fragment>
      <Button
        disabled={disabled}
        {...rest}
      >
        {children}
      </Button>
      {disabled &&
      <UncontrolledTooltip target={props.id}>
        Access denied for action {action}
      </UncontrolledTooltip>
      }
    </Fragment>
  );
}

export default ActionButton;

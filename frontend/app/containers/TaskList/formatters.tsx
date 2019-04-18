import Progress from "reactstrap/lib/Progress";
import * as React from "react";
import {Fragment} from "react";
import {TaskFragmentFragment, TaskStatus, UserFragmentFragment} from "../../generated-models";
import moment from "moment";


export const statusFormatter = (cell: TaskStatus, row: TaskFragmentFragment) => {
  const percent = row.progress * 100;
  const progressColor = () => {
    switch (cell) {
      case TaskStatus.Success:
        return 'success';
      case TaskStatus.Pending:
      case TaskStatus.Cancelling:
        return "info";
      case TaskStatus.Cancelled:
        return "warning";
      case TaskStatus.Failure:
        return "danger";
    }
  };

  return (
    <Fragment>
      <Progress value={percent} color={progressColor()}>
        {cell === TaskStatus.Pending && percent + " %" || cell}
      </Progress>
      {row.errorInfo.length > 0 && <code>{row.errorInfo.join('\n')}</code>}
    </Fragment>
  )
};

export const userFormatter = (cell: UserFragmentFragment, row: TaskFragmentFragment) => {
  if (!cell) {
    return "Administrator";
  }
  return cell.name;
};

export const timeFormatter = (cell: string, row: TaskFragmentFragment) => {
  if (!cell)
    return null;
  const m = moment(cell);
  return m.format("L LTS");
};

import {TaskFragmentFragment, TaskStatus} from "../../generated-models";

export function rowClasses(row: TaskFragmentFragment, rowIndex) {
  /*switch (row.status) {
    case TaskStatus.Success:
      return "table-success";
    case TaskStatus.Pending:
      return "table-primary";
    case TaskStatus.Failure:
      return "table-danger";
    case TaskStatus.Cancelling:
      return "table-light";
    case TaskStatus.Cancelled:
      return "table-warning";
  }
  */
  return null;
}

import {TaskFragmentFragment} from "../../generated-models";
import {RouteComponentProps} from "react-router";

export const onDoubleClick = (history: RouteComponentProps['history']) => (row: TaskFragmentFragment) => {
  if (!row.action)
    return;
  switch (row.objectType) {
    case "VM":
      switch (row.action) {
        default:
          history.push(`/vm/${row.objectRef}`);
      }
      break;
    case "Template":
      switch (row.action) {
        case "create_vm":
          history.push(`/create_vm/${row.ref}`);
          break;
        default:
          history.push(`/template/${row.objectRef}`)
      }
      break;
  }
};

import {
  PlaybookNameForTaskListDocument,
  PlaybookNameForTaskListQuery,
  PlaybookNameForTaskListQueryVariables,
  TaskFragmentFragment,
  TemplateForTaskListDocument,
  TemplateForTaskListQuery,
  TemplateForTaskListQueryVariables, UserGetDocument,
  UserGetQuery, UserGetQueryVariables,
  VMForTaskListDocument,
  VMForTaskListQuery,
  VMForTaskListQueryVariables
} from "../../generated-models";
import {ApolloClient} from "apollo-client";
import Label from "reactstrap/lib/Label";
import * as React from "react";
import {Omit} from "react-apollo-hooks/lib/utils";
import * as moment from "moment";
import {taskSubjectFactory} from "./taskObject";

export interface TaskDataType extends Omit<TaskFragmentFragment, "nameLabel" | "created" | "finished"> {
  nameLabel: React.ReactNode | TaskFragmentFragment['nameLabel']
}


export const getTaskValue: (client: ApolloClient<any>) => (value: TaskFragmentFragment) => Promise<TaskDataType>
  = client => async value => {
  const taskSubject = taskSubjectFactory(value, client);
  return {
    ...value,
    nameLabel: await taskSubject.getTaskName()
  }
};

export default getTaskValue;

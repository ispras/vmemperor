import * as React from "react";
import {GVDIAccessEntry, GVMAccessEntry, User, VDIActions} from "../../generated-models";
import {useMemo} from "react";
import {UserInputField} from "./userInput";
import {Field} from "formik";

interface QuotaObject {
  ref: string;
  mainOwner?: User;
  access: Array<GVMAccessEntry | GVDIAccessEntry>;
}

interface Props {
  object: QuotaObject
}

export const MainOwnerForm: React.FC<Props> = ({object}) => {

  const items = useMemo(() =>
    //@ts-ignore
    object.access.filter((item) => item.actions.includes("ALL"))
      .map(item => item.userId), [object.access]);

  return (
    <Field
      name="mainOwner"
      component={UserInputField}
      placeholder={"Choose a user to make them main owner"}
      users={items}
    >
      <div title={"An user against whom quota is to be calculated"}>
        Choose a main owner
      </div>
    </Field>
  );

};


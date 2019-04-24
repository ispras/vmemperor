import {User} from "../../generated-models";
import * as React from "react";
import {Fragment} from 'react';
import SelectUsers from "../../components/AccessView/selectUsers";

interface Props {
  onUserSelected: (user: User) => void;
}

export const SelectUserForQuota: React.FunctionComponent<Props> = ({onUserSelected}) => {
  return (
    <Fragment>
      <SelectUsers onChange={onUserSelected as any} isMulti={false}/>
    </Fragment>
  );
};

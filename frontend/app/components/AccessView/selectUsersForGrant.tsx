import {useCallback, useEffect, useMemo, useState, Fragment} from "react";
import {Set} from 'immutable';
import {User} from "../../generated-models";
import {useQuery} from "react-apollo-hooks";
import * as React from "react";
import {Button, Modal, Row} from "reactstrap";
import SelectUsers from "./selectUsers";

interface Props {
  onGrantRequested: (user: User[]) => void;
}


export const SelectUsersForGrant: React.FunctionComponent<Props> = ({onGrantRequested}) => {
  const [users, setUsers] = useState<Array<User>>([]);

  const onChange = useCallback((input: Array<User>) => {
    setUsers(input);
  }, [setUsers]);
  return (
    <Fragment>
      <SelectUsers onChange={onChange}/>
      <Button color="primary" onClick={() => onGrantRequested(users)}>Grant actions</Button>
    </Fragment>
  )
};

export default SelectUsersForGrant;

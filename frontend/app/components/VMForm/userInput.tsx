import {useCurrentUserQuery, User} from "../../generated-models";
import {useMemo} from "react";
import {FieldProps} from "formik";
import Select from '../../components/Select';
import * as React from "react";

export function UserInputField(props: FieldProps<any> & { placeholder: string }) {
  const query = useCurrentUserQuery();
  const options = useMemo(() => {
    const currentUser = query.data.currentUser;
    if (currentUser.isAdmin)
      return null;

    const userToOption = (user: User) => ({
      value: user.id,
      label: user.name
    });
    return [userToOption(currentUser.user), ...currentUser.groups.map(userToOption)]

  }, []);
  if (options) {
    return (
      <Select
        {...props}
        options={options}
      />
    )
  } else //Admin does not choose a user to install VM as.
  {
    return null;
  }
}


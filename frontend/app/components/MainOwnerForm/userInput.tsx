import {FieldProps} from "formik";
import {useEffect, useState} from "react";
import {User, UserGetDocument, UserGetQuery, UserGetQueryVariables} from "../../generated-models";
import Select, {SelectFieldProps} from '../../components/Select';
import {useApolloClient} from "react-apollo-hooks";
import * as React from "react";
import {Omit} from "react-apollo-hooks/lib/utils";


interface Props extends Omit<SelectFieldProps<User, any>, "options"> {
  users: Array<string>;
}

/**
 * This input field allows to choose one user from a predefined list of IDs (users) and
 * insert it into a Formik form
 *
 * It gets user information from IDs. Example: ../index.tsx
 * @param users
 * @param props
 * @constructor
 */
export const UserInputField = ({users, ...props}: Props) => {
  const [options, setOptions] = useState<Array<User>>([]);
  const client = useApolloClient();

  const getOptionLabel = (user: User) => {
    return user.name;
  };
  const getOptionValue = (user: User) => {
    return user.id;
  };

  useEffect(() => {
    const func = async () => {
      const asyncMap = users.map(async (userId): Promise<User> => { //Convert user to option
        const {data: {user}} = await client.query<UserGetQuery, UserGetQueryVariables>({
          query: UserGetDocument,
          variables: {
            userId
          }
        });
        return user;
      });
      const newOpts = await Promise.all(asyncMap);
      setOptions(newOpts);
    };
    func();
  }, [users]);


  if (options) {

    return (
      <Select<User, any>
        {...props}
        options={options}
        getOptionLabel={getOptionLabel}
        getOptionValue={getOptionValue}
      />
    )
  } else {
    return null;
  }
};


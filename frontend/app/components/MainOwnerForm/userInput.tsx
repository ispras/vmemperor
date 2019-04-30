import {FieldProps} from "formik";
import {useEffect, useState} from "react";
import {User, UserGetDocument, UserGetQuery, UserGetQueryVariables} from "../../generated-models";
import Select, {SelectFieldProps} from '../../components/Select';
import {useApolloClient} from "react-apollo-hooks";
import * as React from "react";
import {Omit} from "react-apollo-hooks/lib/utils";


interface Props extends Omit<SelectFieldProps<User, any>, "options"> {
  users: Array<User>;
}

/**
 * This input field allows to choose one user from a predefined list of users and
 * insert it into a Formik form
 *
 * @param users
 * @param props
 * @constructor
 */
export const UserInputField = ({users, ...props}: Props) => {
  const [options, setOptions] = useState<Array<{ value: string, label: string }>>([]);
  // const client = useApolloClient();


  const userToOption = (user: User) => ({
    value: user.id,
    label: user.name
  });

  useEffect(() => {
    setOptions(users.map(userToOption));
  }, [users]);
  /*useEffect(() => {
    const func = async () => {
      const asyncMap = users.map(async (userId): Promise<User> => { //Convert user to option
        const {data: {user}, errors} = await client.query<UserGetQuery, UserGetQueryVariables>({
          query: UserGetDocument,
          variables: {
            userId
          }
        });
        if (errors && errors.length) {
          errors.forEach(item => console.error(item));
          throw "User query exception";
        }
        return user;
      });
      const newOpts = await Promise.all(asyncMap);

      setOptions(newOpts);
    };
    func();
  }, [users]);
   */


  if (users.length) {
    return (
      <Select
        {...props}
        options={options}
      />
    )
  } else {
    return null;
  }
};


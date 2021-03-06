import React, {Fragment, useCallback, useState} from "react";
import AsyncSelect from 'react-select/lib/Async';
import {
  FilterUsersDocument,
  FilterUsersQuery,
  FilterUsersQueryVariables,
  User
} from "../../generated-models";
import {useApolloClient} from "react-apollo-hooks";
import {QueryOptions} from "apollo-client";
import {Props as _ReactSelectProps} from 'react-select/lib/Select';

import {Omit} from "../AbstractSettingsForm/utils";
import {AsyncProps} from "react-select/lib/Async";


export type SelectUsersProps = Omit<AsyncProps<User> & _ReactSelectProps<User>, "getOptionValue" | "getOptionLabel" | "loadOptions" | "minInput">;


const SelectUsers: React.FunctionComponent<SelectUsersProps> = ({placeholder, ...props}) => {

  const client = useApolloClient();
  const loadUsers = async (filterQuery) => {
    if (filterQuery.trim().length < 2)
      return [];
    const options: QueryOptions<FilterUsersQueryVariables> = {
      query: FilterUsersDocument,
      variables: {
        query: filterQuery,
      }
    };

    const {data: {findUser}} = await client.query<FilterUsersQuery, FilterUsersQueryVariables>(options);
    console.log("Loaded user data:", findUser);
    return findUser;

  };

  if (!placeholder) {
    placeholder = "Start typing user name or full name..."
  }
  const getOptionValue = (option: User) => option.id;

  return (
    <Fragment>
      <AsyncSelect
        getOptionValue={getOptionValue}
        getOptionLabel={(option: User) => `${option.name} (${option.username})`}
        loadOptions={loadUsers}
        minInput={2}
        placeholder={placeholder}
        {...props}
      />
    </Fragment>
  )
};
export default SelectUsers;

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
import {Option} from '../../components/Select/guards';
import {ValueType} from "react-select/lib/types";

interface Props extends _ReactSelectProps<Option<User>> {
  onChange: (value: ValueType<Option<User>>) => void;
}

const SelectUsers: React.FunctionComponent<Props> = ({onChange, ...props}) => {


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


  const getOptionValue = (option: User) => option.id;

  return (
    <Fragment>
      <AsyncSelect
        getOptionValue={getOptionValue}
        getOptionLabel={(option: User) => `${option.name} (${option.username})`}
        loadOptions={loadUsers}
        minInput={2}
        onChange={onChange}
        isMulti={isMulti}
      />
    </Fragment>
  )
};
export default SelectUsers;

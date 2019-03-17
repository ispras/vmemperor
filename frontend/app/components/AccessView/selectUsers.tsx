import React, {Fragment, useCallback, useState} from "react";
import AsyncSelect from 'react-select/lib/Async';
import {FilterUsers, User} from "../../generated-models";
import {useApolloClient, useQuery} from "react-apollo-hooks";
import {QueryOptions} from "apollo-client";

interface Props {
  onChange : (input : Array<User>) => any;
}

const SelectUsers : React.FunctionComponent<Props> =  ({onChange}) => {



  const client = useApolloClient();
  const loadUsers = async (filterQuery) => {
    if (filterQuery.trim().length < 2)
      return [];
    const options: QueryOptions<FilterUsers.Variables> = {
      query: FilterUsers.Document,
      variables: {
        query: filterQuery,
      }
    };

    const { data : {findUser } }  = await client.query<FilterUsers.Query, FilterUsers.Variables>(options);
    console.log("Loaded user data:", findUser);
    return findUser;

  };


  const getOptionValue = (option : User) => option.id;

  return (
    <Fragment>
      <AsyncSelect
        getOptionValue={getOptionValue}
        getOptionLabel={(option : User) => `${option.name} (${option.username})`}
        loadOptions={loadUsers}
        minInput={2}
        onChange={onChange}
        isMulti={true}
        />
    </Fragment>
  )
};
export default SelectUsers;

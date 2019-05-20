import {Quota, useCurrentUserQuery, User} from "../../generated-models";
import * as React from "react";
import {Fragment} from 'react';
import SelectUsers, {SelectUsersProps} from "../../components/AccessView/selectUsers";
import {FieldProps} from "formik";
import FormGroup from "reactstrap/lib/FormGroup";
import {Omit} from "../../components/AbstractSettingsForm/utils";
import {SelectErrorFeedback, SelectSubtextDiv} from "../../components/Select/feedback";
import {useCurrentUserAndGroups} from "../../hooks/user";
import Select from "react-select";

export interface SelectUserForFormProps extends FieldProps <any>,
  Omit <SelectUsersProps, "onChange" | "onBlur"> {
  onAfterChange?: (userId: string) => any;
}

export const SelectUserForForm: React.FunctionComponent<SelectUserForFormProps> =
  ({form, field, onAfterChange}) => { // Restriction: Field should be of type User
    const onChange = (option: User) => {
      form.setFieldValue(field.name, option);
      //Update form defaults
      if (onAfterChange)
        onAfterChange(option.id);
    };
    const {data: {currentUser}} = useCurrentUserQuery();
    const users = useCurrentUserAndGroups();

    return (
      <FormGroup style={{paddingRight: "20px", paddingLeft: "20px"}}>
        <div style={{margin: '1rem 0'}}>
          {currentUser.isAdmin &&
          (<SelectUsers
            onChange={onChange}
            onBlur={field.onBlur}
            placeholder="Start typing full name or username to choose an user"
            value={field.value}
          />)
          ||
          (<Select<User>
            onChange={onChange}
            onBlur={field.onBlur}
            placeholder="Select an user/group to take a look on quotas"
            getOptionValue={(user: User) => user.id}
            getOptionLabel={(user: User) => user.name}
            value={field.value}
            options={users}
          />)}
          <SelectErrorFeedback field={field} form={form}/>
        </div>
      </FormGroup>
    )
  };

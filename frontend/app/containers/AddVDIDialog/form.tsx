import {useCurrentUserAndGroups} from "../../hooks/user";
import {Field, FormikProps} from "formik";
import {CreateVdiMutationVariables, useCurrentUserQuery, useVDIQuotaQuery} from "../../generated-models";
import * as React from "react";
import {UserInputField} from "../../components/MainOwnerForm/userInput";
import {Fragment, useMemo} from "react";
import {AbstractMemoryInput, Unit} from "../../components/AbstractSettingsForm/abstractMemoryInput";
import Select from '../../components/Select';
import {InputGroup} from "reactstrap";
import {VDISizeComponent} from "../../components/AbstractVMSettingsComponents/VDISizeComponent";
import {ApplyResetForm} from "../../components/ApplyResetForm/form";
import {SRInput} from "../../components/AbstractVMSettingsComponents/srinput";
import {faTag} from "@fortawesome/free-solid-svg-icons";
import Input from "../../components/Input";

interface Props extends FormikProps<CreateVdiMutationVariables> {

}


export const CreateVDIForm: React.FC<Props> = (props) => {
  const currentUserAndGroups = useCurrentUserAndGroups();
  const currentUser = useCurrentUserQuery();
  const {refetch} = useVDIQuotaQuery();
  const user = useMemo(() => {
    refetch({
      user: props.values.user
    });
    return props.values.user;
  }, [currentUser, props.values.user]);
  return (
    <Fragment>
      <ApplyResetForm {...props}>
        {currentUserAndGroups &&
        <Field
          name='user'
          component={UserInputField}
          placeholder="Select an owner user/group"
          users={currentUserAndGroups}
        />
        }
        <Field name="nameLabel"
               component={Input}
               placeholder="How would you name this disk"
               addonIcon={faTag}
        />
        {props.values.user && (<Fragment>
          <SRInput fieldName="srRef"/>
          <VDISizeComponent
            user={user}
            fieldName="size"/>
        </Fragment>)}

      </ApplyResetForm>
    </Fragment>)
};


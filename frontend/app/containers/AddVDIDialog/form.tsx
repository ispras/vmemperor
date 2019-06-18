import {useCurrentUserAndGroups} from "../../hooks/user";
import {FormikProps} from "formik";
import {CreateVdiMutationVariables} from "../../generated-models";
import * as React from "react";

interface Props extends FormikProps<CreateVdiMutationVariables> {

}


const Form: React.FC<Props> = (props) => {
  const currentUserAndGroups = useCurrentUserAndGroups();
  

}

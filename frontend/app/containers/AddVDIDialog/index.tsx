import {useCurrentUserAndGroups} from "../../hooks/user";
import {Formik, FormikConfig} from "formik";
import {CreateVdiMutationVariables, useCreateVdiMutation, useVDIQuotaQuery} from "../../generated-models";
import useRouter from "use-react-router";
import * as React from "react";
import {CreateVDIForm} from "./form";
import {schema} from "./schema";

interface Props {

}


export const AddVDIDialog = () => {
  const createVdi = useCreateVdiMutation();

  const initialValues: CreateVdiMutationVariables = {
    srRef: null,
    nameLabel: "",
    size: 0,
  };
  const {history} = useRouter();
  const onSumbit: FormikConfig<CreateVdiMutationVariables>['onSubmit'] =
    async (values, formikActions) => {

      const result = await createVdi({
        variables: values
      });

      if (!result.data.vdiCreate.granted) {
        formikActions.setStatus({'error': result.data.vdiCreate.reason})
      } else {
        setTimeout(() => history.push(`/vdi_created/${result.data.vdiCreate.taskId}`),
          500);

      }
    };
  return (
    <Formik
      initialValues={initialValues}
      isInitialValid={false}
      enableReinitialize={true}
      onSubmit={onSumbit}
      render={props => (
        <CreateVDIForm {...props}
        />
      )}
      validationSchema={schema}
    />
  )
};


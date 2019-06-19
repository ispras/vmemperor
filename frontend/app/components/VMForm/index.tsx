/**
 *
 * VMform
 *
 */
import React, {useMemo, useState} from 'react';


import * as Yup from "yup";
import {boolean, number, object, string} from "yup";

import {AvForm} from 'availity-reactstrap-validation';
import {Formik, FormikActions} from "formik";
import {HDD_SIZE_GB_MAX, RAM_MB_MAX, RAM_MB_MIN, VCPU_MAX} from "../../utils/constants";
import VMForm from "./form";
import {networkTypeOptions, Values} from "./props";
import {useApolloClient, useMutation} from "react-apollo-hooks";
import {
  AutoInstall,
  CreateVM,
  createVmMutationVariables,
  NetworkConfiguration,
  usecreateVmMutation
} from "../../generated-models";
import {schema as resourceSchema} from '../AbstractVMSettingsComponents/schema';
import {Omit} from "../AbstractSettingsForm/utils";
import {validation} from "../../utils/forms";
import validationSchema from './schema';
import {showTaskNotification} from "../Toast/task";

const baseValues: Values = {
    pool: null,
    template: null,
    storage: null,
    network: null,
    vmOptions: {},
    iso: null,
    networkType: "dhcp",
    autoMode: false,
    installParams: {
      hostname: null,
      username: null,
      password: null,
      partition: null,
    },
    hddSize: 10737418240, //10 GB
    password2: null,
  }
;


const VMFormContainer: React.FunctionComponent = () => {
  const client = useApolloClient();
  const [taskId, setTaskId] = useState<string>(null);
  const createVM = usecreateVmMutation();

  const onSumbit = async (values: Values, formikActions: FormikActions<Values>) => {
    const hddSizeMegabytes = values.hddSize / 1024 / 1024;
    if (!(values.autoMode && values.networkType === 'static'))
      if (values.installParams && values.installParams.staticIpConfig)
        delete values.installParams.staticIpConfig;

    if (values.autoMode) { //Temporary while we do not show partition options to users
      values.installParams.partition = `/-${hddSizeMegabytes}-`;
      delete values.iso;
    } else {
      delete values.installParams;
    }

    const finalValues: createVmMutationVariables = {
      ...values as createVmMutationVariables,
      disks: [
        {
          SR: values.storage,
          size: values.hddSize
        }
      ],
    };
    console.log("VM is created with the following variables: ", finalValues);
    const {data} = await createVM({
      variables: finalValues,

    });

    if (data.createVm.taskId) {
      setTaskId(data.createVm.taskId);
      console.log("VM  created! Task ID: ", taskId);
    } else {
      showTaskNotification(client, `Creating new VM ${values.vmOptions.nameLabel}`,
        data.createVm);
    }
    formikActions.setSubmitting(false);
  };

  const validator = validation(validationSchema);

  return (
    <Formik initialValues={baseValues}
            onSubmit={onSumbit}
            validate={validator}
            render={props =>
              <VMForm taskId={taskId} {...props}/>}
    />
  );
};

export default VMFormContainer;

/**
 *
 * VMform
 *
 */
import React, {useMemo} from 'react';


import * as Yup from "yup";
import {boolean, number, object, string} from "yup";

import {AvForm} from 'availity-reactstrap-validation';
import {Formik, FormikActions} from "formik";
import {HDD_SIZE_GB_MAX, RAM_MB_MAX, RAM_MB_MIN, VCPU_MAX} from "../../utils/constants";
import VMForm from "./form";
import {networkTypeOptions, Values} from "./props";
import {useMutation} from "react-apollo-hooks";
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
    hostname: "",
    username: "",
    password: "",
    partition: "",
  },
  hddSizeGB: 10,
  password2: null,
};


const VMFormContainer: React.FunctionComponent = () => {


  const createVM = usecreateVmMutation();

  const onSumbit = async (values: Values, formikActions: FormikActions<Values>) => {
    const hddSizeMegabytes = values.hddSizeGB * 1024;
    if (!(values.autoMode && values.networkType === 'static'))
      delete values.installParams.staticIpConfig;

    if (values.autoMode) { //Temporary while we do not show partition options to users
      values.installParams.partition = "\\-" + Math.round(hddSizeMegabytes) + "-";
      delete values.iso;
    } else {
      delete values.installParams;
    }

    const finalValues: createVmMutationVariables = {
      ...values as createVmMutationVariables,
      disks: [
        {
          SR: values.storage,
          size: hddSizeMegabytes * 1024 * 1024 //Bytes
        }
      ],
    };
    console.log("VM is created with the following variables: ", finalValues);
    const taskId = await createVM({
      variables: finalValues,

    });
    console.log("VM  created! Task ID: ", taskId);
    formikActions.setSubmitting(false);
  };

  const validator = validation(validationSchema);

  return (
    <Formik initialValues={baseValues}
            onSubmit={onSumbit}
            validate={validator}
            component={VMForm}
    />
  );
};

export default VMFormContainer;

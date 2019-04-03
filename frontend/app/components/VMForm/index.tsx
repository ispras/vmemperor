/**
 *
 * VMform
 *
 */
import React from 'react';


import * as Yup from "yup";
import {boolean, number, object, string} from "yup";

import {AvForm} from 'availity-reactstrap-validation';
import {Formik, FormikActions} from "formik";
import {HDD_SIZE_GB_MAX, RAM_MB_MAX, RAM_MB_MIN, VCPU_MAX} from "../../utils/constants";
import {OptionShape} from "../../hooks/form";
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

const VMFormContainer: React.FunctionComponent = () => {
  const initialValues: Values = {
    pool: null,
    template: null,
    storage: null,
    network: null,
    vmOptions: null,
    iso: null,
    networkType: networkTypeOptions.filter(t => t.value === "dhcp")[0],
    autoMode: false,
    installParams: null,
    hddSizeGB: 0,
  };


  const createVM = usecreateVmMutation();

  const onSumbit = async (values: Values, formikActions: FormikActions<Values>) => {
    const hddSizeMegabytes = values.hddSizeGB * 1024;
    if (!(values.autoMode && values.networkType === 'static'))
      values.installParams.staticIpConfig = null;

    if (values.autoMode) { //Temporary while we do not show partition options to users
      values.installParams.partition = `\-${hddSizeMegabytes}-`
      values.iso = null; //Auto install is done via network
    } else {
      values.installParams = null;
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
    <Formik initialValues={initialValues}
            onSubmit={onSumbit}
            validate={validator}
            component={VMForm}
    />
  );
};

export default VMFormContainer;

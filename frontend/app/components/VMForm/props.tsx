import {FormikProps} from "formik";
import React from "react";
import {Option} from '../../hooks/form';
import {ResourceFormValues} from "../AbstractVMSettingsComponents/schema";
import {AutoInstall, CreateVM, VMInput} from "../../generated-models";
import {Omit} from "react-apollo-hooks/lib/utils";


export interface Values {
  pool: Option;
  template: Option;
  storage: Option;
  network: Option;
  networkType: Option;
  installParams?: AutoInstall
  vmOptions?: VMInput
  iso: Option;
  autoMode: boolean,
}

export type FormikPropsValues = FormikProps<Values>;
export const FormContext = React.createContext<FormikPropsValues>(null);
export const networkTypeOptions: Option[] = [
  {
    value: 'dhcp',
    label: 'Network configuration: DHCP'
  },
  {
    value: 'static',
    label: 'Network configuration: Static IP'
  }
];

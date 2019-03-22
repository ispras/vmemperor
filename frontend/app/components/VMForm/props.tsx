import {FormikProps} from "formik";
import React from "react";
import {Option} from '../../hooks/form';
import {ResourceFormValues} from "../ResourcesForm";

export interface Values extends ResourceFormValues {
  pool: Option;
  template: Option;
  storage: Option;
  network: Option;
  networkType: Option;
  fullname: string;
  username: string;
  password: string;
  password2: string;
  hostname: string;
  nameLabel: string;
  nameDescription: string;
  hdd: number; //GB
  ip: string;
  netmask: string;
  gateway: string;
  dns0: string;
  dns1: string;
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

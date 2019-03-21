/**
 *
 * Vmform
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
import {AutoInstall, CreateVm, NetworkConfiguration} from "../../generated-models";


const initialValues: Values = {
  pool: null,
  template: null,
  storage: null,
  network: null,
  fullname: '',
  username: '',
  hostname: '',
  password: '',
  password2: '',
  nameDescription: '',
  nameLabel: '',
  vcpus: 1,
  ram: 1024,
  hdd: 9,
  ip: '',
  netmask: '',
  gateway: '',
  dns0: '',
  dns1: '',
  iso: null,
  networkType: networkTypeOptions.filter(t => t.value === "dhcp")[0],
  autoMode: false,
};
const IP_REGEX = RegExp('^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$');
const HOSTNAME_REGEX = RegExp('^[a-zA-Z0-9]([a-zA-Z0-9-])*$');
const USERNAME_REGEX = RegExp('^[a-z_][a-z0-9_]*$');
const PASSWORD_REGEX = RegExp('^[\x00-\x7F]*$');


const VMFormContainer: React.FunctionComponent = () => {
  const requiredIpWhenNetwork = (message: string, required = true) => {
    console.log("requiredIp: ", required);
    return string().when(['autoMode', 'network', 'networkType'], {
      is: (autoMode, network, networkType: Option) => {
        return networkType.value === 'dhcp';
      },
      then: string().notRequired().nullable(true),
      otherwise: required ? string().matches(IP_REGEX, message).required() : string().matches(IP_REGEX, message)
    });
  }
  const autoModeRequired = (t) => ({
    is: true,
    then: t().required(),
    otherwise: t().notRequired().nullable(true),
  });

  const createVM = useMutation<CreateVm.Mutation, CreateVm.Variables>(CreateVm.Document);

  const onSumbit = async (values: Values, formikActions: FormikActions<Values>) => {
    const hddSizeMegabytes = values.hdd * 1024;
    const staticNetworkConfiguration: NetworkConfiguration = values.autoMode && values.networkType.value === 'static' ? {
      ip: values.ip,
      gateway: values.gateway,
      netmask: values.netmask,
      dns0: values.dns0,
      dns1: values.dns1,
    } : null;
    const autoInstallParams: AutoInstall = values.autoMode ? {
      hostname: values.hostname,
      username: values.username,
      password: values.password,
      partition: `/-${hddSizeMegabytes}-`,
      staticIpConfig: staticNetworkConfiguration
    } : null;


    const taskId = await createVM({
      variables: {
        nameLabel: values.nameLabel,
        nameDescription: values.nameDescription,
        template: values.template.value,
        network: values.network.value,
        ram: values.ram,
        VCPUs: values.vcpus,
        iso: values.autoMode ? null : values.iso.value,
        disks: [{
          SR: values.storage.value,
          size: hddSizeMegabytes //Input: GB; Output: MB
        }],
        installParams: autoInstallParams,
      }
    });
    console.log("VM  created! Task ID: ", taskId);
    formikActions.setSubmitting(false);
  };


  return (
    <Formik initialValues={initialValues}
            onSubmit={onSumbit}
            validationSchema={object().shape<Values>({
              pool: OptionShape().required(),
              autoMode: boolean().required(),
              template: OptionShape().required(),
              storage: OptionShape().required(),
              network: OptionShape().when('autoMode', autoModeRequired(object)),
              networkType: OptionShape().when('autoMode', autoModeRequired(object)),
              fullname: string(),
              hostname: string().min(1).max(255).matches(HOSTNAME_REGEX).when('autoMode', autoModeRequired(string)),
              username: string().min(1).max(31).matches(USERNAME_REGEX).when('autoMode', autoModeRequired(string)),
              password: string().min(1).matches(PASSWORD_REGEX).when('autoMode', autoModeRequired(string)),
              // @ts-ignore
              password2: string().required().label("Confirm password").test('pass-match', 'Passwords must match',
                function (value) {
                  console.log("Test password!");
                  return this.parent.password === value;
                }),
              nameDescription: string(),
              nameLabel: string().required(),
              vcpus: number().integer().min(1).max(32).required(),
              ram: number().integer().min(256).max(1572864).required(),
              ip: requiredIpWhenNetwork("Enter valid IP"),
              netmask: requiredIpWhenNetwork("Enter valid netmask)"),
              gateway: requiredIpWhenNetwork("Enter valid gateway"),
              dns0: requiredIpWhenNetwork("Enter valid DNS server"),
              dns1: requiredIpWhenNetwork("Enter valid DNS server", false),
              iso: OptionShape().when('autoMode',
                {
                  is: false,
                  then: object().required(),
                  otherwise: object().nullable(true)
                }),
              hdd: number().integer().positive().required().max(2043),

            })}
            component={VMForm}
    />
  );
};

export default VMFormContainer;

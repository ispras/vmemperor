import {boolean, mixed, number, object, ObjectSchema, Shape, string} from "yup";
import {Values} from "./props";
import {AutoInstall, NetworkConfiguration, VMInput} from "../../generated-models";
import {schema} from "../AbstractVMSettingsComponents/schema";


const IP_REGEX = RegExp('^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$');
const HOSTNAME_REGEX = RegExp('^[a-zA-Z0-9]([a-zA-Z0-9-])*$');
const USERNAME_REGEX = RegExp('^[a-z_][a-z0-9_]*$');
const PASSWORD_REGEX = RegExp('^[\x00-\x7F]*$');


const autoModeRequired = (t) => ({
  is: true,
  then: t().required(),
  otherwise: t().notRequired().nullable(true),
});


const requiredIpWhenNetwork = (message: string, required = true) => {
  return string().when(['$networkType'], /* $ means we get these values from the context. The context here is the form values (itself) */ {
    is: (networkType: string) => {
      console.log("requiredIpWhenNetwork: $networkType = ", networkType)
      return networkType === 'dhcp';
    },
    then: string().notRequired().nullable(true),
    otherwise: required ? string().matches(IP_REGEX, message).required() : string().matches(IP_REGEX, message)
  });
};


export default object().shape<Values>({
  pool: string().required(),
  autoMode: boolean().required(),
  template: string().required(),
  storage: string().required(),
  network: string().when('autoMode', autoModeRequired(string)),
  networkType: string().when('autoMode', autoModeRequired(string)),
  installParams: object().shape<AutoInstall>(
    {
      hostname: string().min(1).max(255).matches(HOSTNAME_REGEX),
      fullname: string(),
      username: string().min(1).max(31).matches(USERNAME_REGEX).when('$autoMode', autoModeRequired(string)),
      password: string().min(1).matches(PASSWORD_REGEX).when('$autoMode', autoModeRequired(string)),
      partition: mixed(), //For now we don't support editing partition options. This is TODO
      staticIpConfig: object().shape<NetworkConfiguration>(
        {
          ip: requiredIpWhenNetwork("Enter valid IP"),
          netmask: requiredIpWhenNetwork("Enter valid netmask)"),
          gateway: requiredIpWhenNetwork("Enter valid gateway"),
          dns0: requiredIpWhenNetwork("Enter valid DNS server"),
          dns1: requiredIpWhenNetwork("Enter valid DNS server", false),
        }
      )

    }
  ).when('autoMode', autoModeRequired(object)),

  password2: string().required().label("Confirm password").test('pass-match', 'Passwords must match',
    function (value) {
      return this.options.context['installParams']['password'] === value;
    }),
  iso: string().when('autoMode',
    {
      is: false,
      then: string().required(),
      otherwise: string().nullable(true)
    }),
  hddSizeGB: number().integer().positive().required().max(2043),
  vmOptions: object().shape<VMInput>(schema("vmOptions.")),
});

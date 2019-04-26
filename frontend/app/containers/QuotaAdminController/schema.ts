import {object, number, mixed} from "yup";
import {Quota, User} from "../../generated-models";


export const schema = object().shape<Quota>({
  user: mixed().required(),
  memory: number().min(0).nullable(true),
  vmCount: number().integer().min(0).nullable(true),
  vdiSize: number().min(0).nullable(true),
  vcpuCount: number().integer().min(0).nullable(true),
});

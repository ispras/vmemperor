import {number, object} from "yup";
import {Res} from "awesome-typescript-loader/dist/checker/protocol";

export const schema = {
  VCPUsAtStartup: number().integer().min(1).max(32).required(),
  coresPerSocket: number().required().label("VCPU cores per socket").required().test(
    "vcpus-multiplier-cores", "Number of cores should be a multiplier of number of cores per socket",
    function (value) {
      return this.parent.VCPUsAtStartup % value === 0;
    }
  ),
  ram: number().integer().min(256).max(1572864).required(),
};

export interface ResourceFormValues {
  VCPUsAtStartup: number;
  coresPerSocket: number;
  ram: number; //MB
}

export default object().shape<ResourceFormValues>(schema);


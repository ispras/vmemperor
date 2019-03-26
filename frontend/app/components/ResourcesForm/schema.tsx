import {number, object} from "yup";
import {AbstractVmFragment, VmActions} from "../../generated-models";
import {Omit} from "../AbstractSettingsForm/utils";

export const MEMORY_MAX = 1572864 * 1024 * 1024;
export const schema = {
    VCPUsAtStartup: number().integer().min(1).max(32).required(),
    VCPUsMax: number().integer().max(32).required().test(
      'VCPUs-max', "Maxiumum number of cores should be not less than number of cores at startup",
      function (value) {
        return this.options.context['VCPUsAtStartup'] <= value;
      }
    ),
    platform: object({
      coresPerSocket:
        number().required().label("VCPU cores per socket").required().test(
          "vcpus-multiplier-cores", "Number of cores should be a multiplier of number of cores per socket",
          function (value) {
            return this.options.context['VCPUsAtStartup'] % value === 0;
          })
    }),
    memoryStaticMax:
      number().min(1).max(MEMORY_MAX).required("memoryStaticMax is required"),
    memoryDynamicMax:
      number().min(1).required().test(
        "memory-dynamic-max", "Dynamic memory maximum should not be more than static memory maximum",
        function (value) {
          return this.options.context['memoryStaticMax'] >= value;
        }
      ),
    memoryDynamicMin:
      number().min(1).required().test(
        "memory-dynamic-min", "Dynamic memory minimum should not be more than dynamic memory maximum",
        function (value) {
          return this.options.context['memoryDynamicMax'] >= value;
        }
      ),
    memoryStaticMin:
      number().min(1).required().test(
        "memory-static-min", "Static memory minimum should not be more than dynamic memory minimum",
        function (value) {
          return this.options.context['memoryDynamicMin'] >= value;
        }
      ),

  }
;


export type ResourceFormValues = AbstractVmFragment.Fragment;

export default object().shape<ResourceFormValues>(schema);


import {Arch, Distro, TemplateSettingsFragmentFragment} from "../../generated-models";
import {schema as ResourceSchema} from "../AbstractVMSettingsComponents/schema";
import {mixed, object, string} from "yup";

export type TemplateSettingsFormValues = TemplateSettingsFragmentFragment;

const schema = {
  installOptions: object().shape<TemplateSettingsFormValues['installOptions']>({
    distro: mixed().oneOf([Distro.Debian, Distro.SUSE, Distro.CentOS]),
    arch: mixed().oneOf([Arch.I386, Arch.X86_64]),
    release: string(),
    installRepository: string(),
  }),
  ...ResourceSchema()
};

export default object().shape<TemplateSettingsFormValues>(schema);


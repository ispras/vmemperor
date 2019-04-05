import {defaults as baseDefaults} from '../AbstractVMSettingsComponents/defaults';
import {TemplateInfoFragmentFragment} from "../../generated-models";

export const defaults: Partial<TemplateInfoFragmentFragment> = {
  ...baseDefaults,
  installOptions:
    {
      distro: null,
    }
};

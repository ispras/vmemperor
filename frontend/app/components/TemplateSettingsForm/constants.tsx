import {RadioButtonGroup} from "../RadioButton";
import {TemplateSettingsFormValues} from "./schema";

export const prefix = 'installOptions.';
export const distroId = prefix + 'distro';
export const archId = prefix + 'arch';
export const TemplateRadioButtonGroup = RadioButtonGroup<TemplateSettingsFormValues>();

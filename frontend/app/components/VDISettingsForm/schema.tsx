import {schema as MainOwnerSchema} from "../MainOwnerForm/schema";
import {object} from "yup";
import {VDISettingsFragmentFragment} from "../../generated-models";

const schema = {
  ...MainOwnerSchema
};

export default object().shape<VDISettingsFragmentFragment>(schema);

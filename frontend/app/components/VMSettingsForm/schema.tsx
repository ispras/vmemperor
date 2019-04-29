import {schema as ResourceSchema} from "../AbstractVMSettingsComponents/schema";
import {schema as MainOwnerSchema} from "../MainOwnerForm/schema";
import {object} from "yup";
import {VMSettingsFragmentFragment} from "../../generated-models";

const schema = {
  ...MainOwnerSchema,
  ...ResourceSchema(),

};

export default object().shape<VMSettingsFragmentFragment>(schema);


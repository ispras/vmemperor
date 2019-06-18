import {mixed, number, object, string} from "yup";
import {CreateVdiMutationVariables} from "../../generated-models";

export const schema = object().shape<CreateVdiMutationVariables>({
    nameLabel: string().required(),
    size: number().min(0).required(),
    srRef: string().required(),
    user: string().required(),
  }
);

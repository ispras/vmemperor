import {readCacheObject} from "../../utils/componentStateReducers";
import {VMListFragmentFragment, VMListFragmentFragmentDoc} from "../../generated-models";

export const _readVM = (client) => (ref) => {
  return readCacheObject<VMListFragmentFragment>(client, VMListFragmentFragmentDoc,
    "GVM", ref, "VMListFragment");
};

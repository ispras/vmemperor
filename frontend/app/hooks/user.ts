import {useCurrentUserQuery} from "../generated-models";


export const useCurrentUserAndGroups = () => {
  const {data: {currentUser}} = useCurrentUserQuery();
  return [currentUser.user, ...currentUser.groups];
};

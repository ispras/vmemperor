import {useCurrentUserQuery} from "../generated-models";


export const useCurrentUserAndGroups = () => {
  const {data: {currentUser}} = useCurrentUserQuery();
  if (!currentUser.isAdmin)
    return [currentUser.user, ...currentUser.groups];
  else
    return null;
};

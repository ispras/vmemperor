import {useCallback, useEffect, useMemo, useState} from "react";
import {Set} from 'immutable';
import {User} from "../../generated-models";
import {useQuery} from "react-apollo-hooks";

interface Props<T> {
  allActions: any;
  currentActions: T[];
  user?: User,
}

function GrantActions<T>({allActions, currentActions, user}: Props<T>) {
  const actions = useMemo(() => {
    // @ts-ignore
    return Set.of<T>(Object.keys(allActions).filter(value =>
      allActions[value] != 'NONE' && allActions[value] != 'ALL')
      .map(value => allActions[value]))
      .subtract(currentActions);
  }, [allActions]);

  const [selectedItems, setSelectedItems] = useState(Set.of<T>());
  const onToggle = useCallback((id: T) => {
    setSelectedItems(selectedItems.has(id) ? selectedItems.remove(id) : selectedItems.add(id));
  }, [setSelectedItems, selectedItems]);
  useEffect(() => {
    setSelectedItems(selectedItems.intersect(actions)) //Deselect selected items when they are removed from entry actions list
  }, [selectedItems, setSelectedItems, actions]);
  const onSelectDeselect = useCallback(() => {
      if (selectedItems.count() == actions.length) {
        setSelectedItems(selectedItems.clear());
      } else {
        setSelectedItems(selectedItems.union(actions));
      }
    },
    [actions, selectedItems, setSelectedItems]);

  const [selectedUsers, setSelectedUsers] = useState(Set.of<string>());

  if (user) {
    useEffect(() => {
      if (user)
        setSelectedUsers(selectedUsers.clear().add(user.id));
    }, [user]);
  }
  
}

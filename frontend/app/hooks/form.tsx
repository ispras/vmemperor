import {useMemo} from "react";
import {object, string} from "yup";

export const useReactSelectFromRecord = <T extends ListItem>(dataSource: T[],
                                                             labelFunction: (item: T) => string = null,
                                                             filterFunction: (item: T) => boolean = null) => {
  if (!labelFunction) { // Default is using nameLabel
    labelFunction = (item: T) => item.nameLabel || item.nameDescription || `No name (Ref: ${item.ref})`;
  }
  if (!filterFunction)
    filterFunction = (item) => true;

  const valueFunction = (item: T) => item.ref;

  return useMemo(() => dataSource.filter(filterFunction).map((item): Option => (
      {
        value: valueFunction(item),
        label: labelFunction(item),
      }
    )
  ), [dataSource, labelFunction, filterFunction]);
};

export interface Option {
  value: string,
  label: string,
}


interface ListItem {
  nameLabel?: string,
  nameDescription?: string,
  ref: string,
  uuid?: string,
}

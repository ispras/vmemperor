import {OptionsType} from "react-select/lib/types";

export interface Option<T = any> {
  value: T;
  label: string;
}

export function isOption<T = string>(option): option is Option<T> {
  return (<Option<T>>option).value !== undefined && (<Option<T>>option).label !== undefined;
}

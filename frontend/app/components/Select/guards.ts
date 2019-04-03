import {OptionsType} from "react-select/lib/types";

export interface Option {
  value: string;
  label: string;
}

export function isOption(option): option is Option {
  return (<Option>option).value !== undefined && (<Option>option).label !== undefined;
}

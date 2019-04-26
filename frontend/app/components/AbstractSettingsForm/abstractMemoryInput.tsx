import {FieldProps, getIn} from "formik";
import {useCallback, useMemo, Fragment} from "react";
import {Input, InputGroupAddon, InputGroupText, InputProps} from "reactstrap";
import InputGroup from "reactstrap/lib/InputGroup";
import {ChangeInputEvent} from "./inputUtils";
import {getFeedback, getInvalid} from "../Input/utils";
import React from "react";
import {InputBase, InputBaseProps} from "../Input/inputBase";
import {Omit} from "./utils";

export enum Unit {
  KB = "kB",
  MB = "MB",
  GB = "GB",
}

interface Props extends Omit<InputBaseProps<any>, "onChange" | "type" | "value"> {
  unit: Unit
  onSetValue?: (value: number, field: string) => any;
}

/**
 * This component is usable for inputting memory in bytes (by typing in kb, mb, gb)
 * Use inside InputGroup. Example: RAMInput
 * @param field
 * @param form
 * @param unit
 * @param onSetValue
 * @constructor
 */
export const AbstractMemoryInput: React.FC<Props> = ({field, form, unit, onSetValue, ...props}) => {
  const multiplier = useMemo(() => {
    switch (unit) {
      case Unit.KB:
        return 1024;
      case Unit.MB:
        return 1024 * 1024;
      case Unit.GB:
        return 1024 * 1024 * 1024;
    }
  }, [unit]);
  /**
   * Converts human-readable value to bytes
   */
  const convertInputValue = useCallback((value: string) => {
    const num = Number.parseFloat(value);
    return Math.floor(num * multiplier);
  }, [multiplier]);
  /**
   * Converts bytes to specified human-readable value
   */
  const convertValue = useCallback((value: number | null) => {
    if (value === null)
      return '';
    return value / multiplier;
  }, [multiplier]);

  const handleChange = (e: ChangeInputEvent) => {
    e.preventDefault();
    const value = convertInputValue(e.target.value);
    if (onSetValue)
      onSetValue(value, field.name);
    else
      form.setFieldValue(field.name, value);
  };

  const value = useMemo(() =>
    convertValue(getIn(form.values, field.name)), [form.values]);
  return (
    <Fragment>
      <InputBase
        {...props}
        type="number"
        onChange={handleChange}
        field={field}
        form={form}
        value={value}
      />
      <InputGroupAddon addonType="append"
                       style={{"line-height": "1!important"}}
      >
        <InputGroupText>
          {unit}
        </InputGroupText>
      </InputGroupAddon>
    </Fragment>
  )
};

import {FieldProps} from 'formik'
import React, {ReactNode, useMemo} from 'react'
import Select from 'react-select'
import {Props as _ReactSelectProps} from 'react-select/lib/Select';
import FormGroup from "reactstrap/lib/FormGroup";
import {Option} from './guards';
import {SelectErrorFeedback, SelectSubtextDiv} from "./feedback";
import {getOptionLabel as defaultGetOptionLabel} from "react-select/lib/builtins";
import {getOptionValue as defaultGetOptionValue} from "react-select/lib/builtins";

export interface SelectFieldProps<OptionType, Values> extends _ReactSelectProps<OptionType>, FieldProps<Values> {
  afterChange?: (newValue: string) => void;
  tag?: React.ComponentType<_ReactSelectProps<OptionType>>;
  children?: ReactNode;
}

/* See bug https://github.com/JedWatson/react-select/issues/1453
 and https://github.com/JedWatson/react-select/issues/2930 */


function SelectField<OptionType, Values>
({
   options,
   field,
   form,
   afterChange,
   tag,
   children,
   getOptionValue,
   ...props
 }: SelectFieldProps<OptionType, Values>) {

  if (!getOptionValue)
    getOptionValue = defaultGetOptionValue;

  const value = useMemo(() => {
    if (!options)
      return '';
    if (!options.length)
      return '';
    //@ts-ignore
    const found = options.find(option => getOptionValue(option) === field.value);
    return found ? found : null;
  }, [options, field.value]);
  const onChange = (option: OptionType) => {
    form.setFieldValue(field.name, getOptionValue(option));
    if (afterChange)
      afterChange(getOptionValue(option));
  };
  const SelectComponent: React.ComponentType<_ReactSelectProps<OptionType>>
    = tag ? tag : Select;

  return (
    <FormGroup style={{paddingRight: "20px", paddingLeft: "20px"}}>
      {children}
      <div style={{margin: '1rem 0'}}>
        <SelectComponent
          {...props}
          getOptionValue={getOptionValue}
          options={options}
          name={field.name}
          value={value}
          onChange={onChange}
          onBlur={field.onBlur}
        />
        <SelectErrorFeedback field={field} form={form}/>
      </div>
    </FormGroup>);

}

export default SelectField;

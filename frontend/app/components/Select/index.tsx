import {FieldProps} from 'formik'
import React, {useCallback, useMemo} from 'react'
import Select from 'react-select'
import {Props as _ReactSelectProps} from 'react-select/lib/Select';
import {FormFeedback, InputGroup, InputGroupAddon} from "reactstrap";
import FormGroup from "reactstrap/lib/FormGroup";
import styled from "styled-components";
import {OptionsType} from "react-select/lib/types";
import {isOption, Option} from './guards';


export interface SelectFieldProps<Values> extends _ReactSelectProps<Option>, FieldProps<Values> {
  afterChange?: (newValue: string) => void;
  tag?: React.ComponentType<_ReactSelectProps<Option>>;
}

/* See bug https://github.com/JedWatson/react-select/issues/1453
 and https://github.com/JedWatson/react-select/issues/2930 */


const ErrorDiv = styled.div`
padding-top: 3px;
font-size: small;
`;


function SelectField<Values>
({
   options,
   field,
   form,
   placeholder,
   afterChange,
   tag,
   ...props
 }: SelectFieldProps<Values>) {
  const value = useMemo(() => {
    if (!options)
      return '';
    if (!options.length)
      return '';
    //@ts-ignore
    const found = options.find(option => option.value === field.value);
    return found ? found : null;
  }, [options, field.value]);
  const onChange = (option: Option) => {
    form.setFieldValue(field.name, option.value);
    if (afterChange)
      afterChange(option.value);
  };
  const SelectComponent: React.ComponentType<_ReactSelectProps<Option>>
    = tag ? tag : Select;

  return (
    <FormGroup style={{paddingRight: "20px", paddingLeft: "20px"}}>
      <div style={{margin: '1rem 0'}}>
        <SelectComponent
          {...props}
          options={options}
          name={field.name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onBlur={field.onBlur}
        />

        {form.errors[field.name] && form.touched[field.name] && (
          <ErrorDiv className="text-danger">
            {form.errors[field.name]}
          </ErrorDiv>
        )
        }
      </div>
    </FormGroup>);

}

export default SelectField;

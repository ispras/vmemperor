import {FieldProps} from 'formik'
import React from 'react'
import Select, {Option, ReactSelectProps} from 'react-select'
import {FormFeedback, InputGroup, InputGroupAddon} from "reactstrap";
import FormGroup from "reactstrap/lib/FormGroup";
import styled from "styled-components";


/* See bug https://github.com/JedWatson/react-select/issues/1453
 and https://github.com/JedWatson/react-select/issues/2930 */

const ErrorDiv = styled.div`
padding-top: 3px;
font-size: small;
`;

const SelectField: React.FunctionComponent<ReactSelectProps & FieldProps>
  = ({
       options,
       field,
       form,
       placeholder
     }) => (
  <FormGroup style={{paddingRight: "20px", paddingLeft: "20px"}}>
    <div style={{margin: '1rem 0'}}>
      <Select
        options={options}
        name={field.name}
        value={options ? options.find(option => option === field.value) : ''}
        onChange={(option: Option) => form.setFieldValue(field.name, option.value)}
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
  </FormGroup>
);

export default SelectField;

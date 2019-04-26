import {FieldProps} from "formik";
import React from "react";
import styled from 'styled-components';

export const SelectSubtextDiv = styled.div`
padding-top: 3px;
font-size: small;
`;
export const SelectErrorFeedback = ({form, field}: FieldProps<any>) => {

  if (form.errors[field.name] && form.touched[field.name])
    return (
      <SelectSubtextDiv className="text-danger">
        {form.errors[field.name]}
      </SelectSubtextDiv>
    );
  else
    return null;
};

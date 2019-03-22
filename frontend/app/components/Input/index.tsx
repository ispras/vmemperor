/**
 *
 * Input
 *
 */

import React, {HTMLAttributes} from 'react';
// import styled from 'styled-components';

import AutoInput from './autoInput';
/*
class Input extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <AvInput
        tag={AutoInput}
        {...this.props} />
    );
  }

}
*/
import {FieldProps} from "formik";
import {Col, FormFeedback, Input, InputGroupText, Label} from 'reactstrap';
import {Icon} from "@fortawesome/fontawesome-svg-core";
import InputGroup from "reactstrap/lib/InputGroup";
import InputGroupAddon from "reactstrap/lib/InputGroupAddon";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {InputProps} from "reactstrap";
import {FormGroup} from "../MarginFormGroup";

interface InputComponentProps {
  addonIcon?: Icon,
  appendAddonIcon?: Icon,
  addonText: string | JSX.Element,
  appendAddonText: string | JSX.Element,
  label?: boolean, //Use children to provide label text

};
const InputComponent: React.FunctionComponent<FieldProps & InputProps & InputComponentProps> = (
  {
    field: {...fields},
    form,
    addonIcon,
    addonText,
    label,
    children,
    appendAddonIcon,
    appendAddonText,
    ...props
  }
) => {
  return (
    <FormGroup>
      {label && (
        <Label for={fields.name}>
          {children}
        </Label>
      )
      }
      <InputGroup row={true}>
        {addonIcon && (
          <InputGroupAddon style={{"line-height": "1!important"}} addonType="prepend">
            <InputGroupText>
              <FontAwesomeIcon icon={addonIcon}/>
            </InputGroupText>
          </InputGroupAddon>
        )
        }
        {addonText && (
          <InputGroupAddon style={{"line-height": "1!important"}} addonType="prepend">
            <InputGroupText>
              {addonText}
            </InputGroupText>
          </InputGroupAddon>
        )
        }
        <Input {...props} {...fields}
               invalid={Boolean(form.touched[fields.name]
                 && form.errors[fields.name])}
        />
        {form.touched[fields.name] && form.errors[fields.name] &&
        (<FormFeedback> {form.errors[fields.name]} </FormFeedback>)}

        {appendAddonIcon && (
          <InputGroupAddon style={{"line-height": "1!important"}} addonType="append">
            <InputGroupText>
              <FontAwesomeIcon icon={appendAddonIcon}/>
            </InputGroupText>
          </InputGroupAddon>
        )
        }
        {appendAddonText && (
          <InputGroupAddon style={{"line-height": "1!important"}} addonType="append">
            <InputGroupText>
              {appendAddonText}
            </InputGroupText>
          </InputGroupAddon>
        )
        }
      </InputGroup>
    </FormGroup>
  )
};

export default InputComponent;

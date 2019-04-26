/**
 *
 * Input
 *
 */

import React, {HTMLAttributes, ReactNode} from 'react';
// import styled from 'styled-components';

import {FieldProps} from "formik";
import {Col, FormFeedback, Input, InputGroupText, Label} from 'reactstrap';
import {Icon} from "@fortawesome/fontawesome-svg-core";
import InputGroup from "reactstrap/lib/InputGroup";
import InputGroupAddon from "reactstrap/lib/InputGroupAddon";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {InputProps} from "reactstrap";
import {FormGroup} from "../MarginFormGroup";
import {getFeedback, getInvalid} from "./utils";
import {Omit} from "../AbstractSettingsForm/utils";
import {InputBase, InputBaseProps} from "./inputBase";

interface InputComponentProps {
  addonIcon?: Icon,
  appendAddonIcon?: Icon,
  addonText?: string | JSX.Element,
  appendAddonText?: string | JSX.Element,
  children?: ReactNode;
}

type Props<T> = InputBaseProps<T> & InputComponentProps;

/**
 * This component represents a whole row with input component (FormGroup). If you have a customized FormGroup, use InputBase
 * @param field
 * @param form
 * @param addonIcon
 * @param addonText
 * @param children
 * @param appendAddonIcon
 * @param appendAddonText
 * @constructor
 */
function InputComponent<T>(
  {
    addonIcon,
    addonText,
    children,
    appendAddonIcon,
    appendAddonText,
    ...props
  }: Props<T>
) {
  return (
    <FormGroup>
      {children && (
        <Label for={props.field.name}>
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
        <InputBase {...props}/>
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
}

export default InputComponent;

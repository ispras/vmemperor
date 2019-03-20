/**
 *
 * StopButton
 *
 */

import React from 'react';
// import styled from 'styled-components';

import AwesomeButton, {Props as ButtonProps} from '../AwesomeButton';
import {faKey} from "@fortawesome/free-solid-svg-icons";

type  Props = Pick<ButtonProps, Exclude<keyof ButtonProps, "icon" | "color">>;


const SetAccessButton = (props: Props) => {
  return (
    <AwesomeButton color="primary" icon={faKey} {...props}/>
  );
};

export default SetAccessButton;

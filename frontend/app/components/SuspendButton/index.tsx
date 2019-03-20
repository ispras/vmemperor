import React from 'react';
// import styled from 'styled-components';

import AwesomeButton, {Props as ButtonProps} from '../AwesomeButton';
import {faMinusCircle} from "@fortawesome/free-solid-svg-icons/faMinusCircle";

type  Props = Pick<ButtonProps, Exclude<keyof ButtonProps, "icon" | "color">>;


const SuspendButton = (props: Props) => {
  return (
    <AwesomeButton color="primary" icon={faMinusCircle} {...props}/>
  );
};

export default SuspendButton;

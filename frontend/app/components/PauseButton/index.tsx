import React from 'react';
// import styled from 'styled-components';

import AwesomeButton, {Props as ButtonProps} from '../AwesomeButton';

import {faStepForward, faPlayCircle, faPause} from "@fortawesome/free-solid-svg-icons";
import {IconDefinition} from "@fortawesome/fontawesome-common-types";

interface Props extends Pick<ButtonProps, Exclude<keyof ButtonProps, "icon" | "color">> {
  pause: boolean,
  unpause: boolean,
}


const PauseButton = ({pause, unpause, ...props}: Props) => {
  let icon: IconDefinition = null;
  if (pause && unpause) {
    icon = faStepForward
  } else if (unpause) {
    icon = faPlayCircle;
  } else {
    icon = faPause;
  }
  return (
    <AwesomeButton color="primary" icon={icon} {...props}/>
  );
};

export default PauseButton;

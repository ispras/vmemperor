import React, {Fragment} from "react";

import Input from '../Input';
import {faMemory, faMicrochip} from "@fortawesome/free-solid-svg-icons";
import {Field} from "formik";
import {FormGroup, Label} from "reactstrap";
import CPUInputComponent from "./cpuinput";
import RAMInputComponent from "./raminput";

interface Props {
  namePrefix?: string;
}

export const Fields: React.FunctionComponent<Props> = ({namePrefix}) => {
  return (
    <Fragment>
      <CPUInputComponent
        namePrefix={namePrefix}
      />
      <RAMInputComponent
        namePrefix={namePrefix}
      />
    </Fragment>
  );
};

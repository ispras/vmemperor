import React, {Fragment} from "react";

import Input from '../../components/Input';
import {faMemory, faMicrochip} from "@fortawesome/free-solid-svg-icons";
import {Field} from "formik";
import {FormGroup, Label} from "reactstrap";
import {CPUInputComponent} from "./cpuinput";
import {RAMInputComponent} from "./raminput";

export const Fields = () => {
  return (
    <Fragment>
      <Field
        component={CPUInputComponent}/>
      <Field
        component={RAMInputComponent}/>
    </Fragment>
  );
};

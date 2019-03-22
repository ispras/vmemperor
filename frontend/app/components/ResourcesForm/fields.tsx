import React, {Fragment} from "react";

import Input from '../../components/Input';
import {faMemory, faMicrochip} from "@fortawesome/free-solid-svg-icons";
import {Field} from "formik";
import {FormGroup, Label} from "reactstrap";

export const Fields = () => {
  return (
    <Fragment>
      <Field name="VCPUsAtStartup"
             label={true}
             component={Input}
             type="number"
             addonIcon={faMicrochip}
      >
        Total number of VCPU cores at boot
      </Field>
      <Field name="coresPerSocket"
             label={true}
             component={Input}
             type="number"
      >
        Number of VCPU cores per socket
      </Field>
      <Field name="ram"
             label={true}
             component={Input}
             type="number"
             addonIcon={faMemory}
             appendAddonText={"MB"}
      >
        RAM size
      </Field>

    </Fragment>
  );
};

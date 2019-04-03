import {FieldProps} from "formik";
import {ResourceFormValues} from "./schema";
import {FormGroup} from "../MarginFormGroup";
import {Col, Input, Row} from "reactstrap";
import React from "react";
import Label from "reactstrap/lib/Label";
import {ChangeInputEvent, getInput} from "../AbstractSettingsForm/inputUtils";

interface Props extends FieldProps<any> {
  namePrefix?: string
}

export const CPUInputComponent: React.FunctionComponent<Props> = ({form, namePrefix = ""}) => {
  const VCPUsStartup = namePrefix + "VCPUsAtStartup";
  const VCPUsMax = namePrefix + "VCPUsMax";
  const coresPerSocket = namePrefix + "platform.coresPerSocket";

  function handleChangeVCPUsStartup(e: ChangeInputEvent) {
    const value = parseInt(e.target.value);
    if (value > form.values.VCPUsMax) {
      form.setFieldValue(VCPUsMax, value);
    }
    form.setFieldValue(VCPUsStartup, value);
  }

  function handleChangeVCPUsMax(e: ChangeInputEvent) {
    const value = parseInt(e.target.value);
    if (value < form.values.VCPUsAtStartup) {
      form.setFieldValue(VCPUsStartup, value);
    }
    form.setFieldValue(VCPUsMax, value);
  }

  return (
    <Row>
      <Col md={4}>
        <FormGroup>
          <Label for={VCPUsStartup}>
            VCPUs at startup
          </Label>
          {getInput(form, VCPUsStartup, "number", handleChangeVCPUsStartup)}
        </FormGroup>
      </Col>
      <Col md={4}>
        <FormGroup>
          <Label for={VCPUsMax}>
            Max VCPUs
          </Label>
          {getInput(form, VCPUsMax, "number", handleChangeVCPUsMax)}
        </FormGroup>
      </Col>
      <Col md={4}>
        <FormGroup>
          <Label for={coresPerSocket}>
            Cores per socket
          </Label>
          {getInput(form, coresPerSocket, "number")}
        </FormGroup>
      </Col>
    </Row>
  )

};

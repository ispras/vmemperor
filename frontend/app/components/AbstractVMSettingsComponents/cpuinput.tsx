import {connect, Field, FieldProps, FormikProps} from "formik";
import {ResourceFormValues} from "./schema";
import {FormGroup} from "../MarginFormGroup";
import {Col, Input, Row} from "reactstrap";
import React from "react";
import Label from "reactstrap/lib/Label";
import {ChangeInputEvent, FormInput} from "../AbstractSettingsForm/inputUtils";
import {InputBase} from "../Input/inputBase";

interface OuterProps {
  namePrefix?: string
}

interface Props extends OuterProps {
  formik: FormikProps<any>;
}

const CPUInputComponent: React.FunctionComponent<Props> = ({formik: form, namePrefix = ""}) => {
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
          <Field
            component={InputBase}
            name={VCPUsStartup}
            type="number"
            onChange={handleChangeVCPUsStartup}
          />
        </FormGroup>
      </Col>
      <Col md={4}>
        <FormGroup>
          <Label for={VCPUsMax}>
            Max VCPUs
          </Label>
          <Field
            component={InputBase}
            name={VCPUsMax}
            type="number"
            onChange={handleChangeVCPUsMax}/>
        </FormGroup>
      </Col>
      <Col md={4}>
        <FormGroup>
          <Label for={coresPerSocket}>
            Cores per socket
          </Label>
          <Field
            component={InputBase}
            form={form}
            name={coresPerSocket}
            type="number"
          />
        </FormGroup>
      </Col>
    </Row>
  )

};

export default connect<OuterProps>(CPUInputComponent);

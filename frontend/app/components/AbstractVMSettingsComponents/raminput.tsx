import {ResourceFormValues} from "./schema";
import {getIn, FormikProps, connect, Field} from "formik";
import * as React from "react";
import {Fragment, SyntheticEvent, useCallback, useMemo} from "react";
import {Col, Input, InputGroup, InputGroupText, Label, Row} from "reactstrap";
import {FormGroup} from "../MarginFormGroup";
import {ChangeInputEvent, FormInput} from "../AbstractSettingsForm/inputUtils";
import InputGroupAddon from "reactstrap/lib/InputGroupAddon";
import {getFeedback, getInvalid} from "../Input/utils";
import {AbstractMemoryInput, Unit} from "../AbstractSettingsForm/abstractMemoryInput";
import set = Reflect.set;

interface OuterProps {
  namePrefix?: string;
}

interface Props extends OuterProps {
  formik: FormikProps<any>;
}

const RAMInput = ({name, setValue}) => (
  <InputGroup>
    <Field
      name={name}
      component={AbstractMemoryInput}
      unit={Unit.MB}
      onSetValue={setValue}
    />
  </InputGroup>);

const RAMInputComponent = ({formik, namePrefix}: Props) => {
  if (namePrefix === undefined) {
    namePrefix = "";
  }
  const fields = {
    dmin: namePrefix + "memoryDynamicMin",
    dmax: namePrefix + "memoryDynamicMax",
    smin: namePrefix + "memoryStaticMin",
    smax: namePrefix + "memoryStaticMax",
  };


  const setValue = (value: number, field: string) => {
    if (Number.isNaN(value)) {
      formik.setFieldValue(field, 0);
      return;
    }
    formik.setFieldValue(field, value, false);


    switch (field) {
      case fields.smin:
        if (value > getIn(formik.values, fields.dmin)) //
          setValue(value, fields.dmin);
        break;
      case fields.dmin:
        if (value < getIn(formik.values, fields.smin))
          setValue(value, fields.smin);
        if (value > getIn(formik.values, fields.dmax))
          setValue(value, fields.dmax);
        break;
      case fields.dmax:
        if (value < getIn(formik.values, fields.dmin))
          setValue(value, fields.dmin);
        if (value > getIn(formik.values, fields.smax))
          setValue(value, fields.smax);
        break;
      case fields.smax:
        if (value < getIn(formik.values, fields.dmax))
          setValue(value, fields.dmax);
        break;
    }
  };


  return (
    <Fragment>
      <Label> RAM settings </Label>
      <Row formik="true">
        <Col lg={3} md={6} sm={12}>
          <FormGroup>
            <Label
              for={fields.smin}>
              Static minimum
            </Label>
            <RAMInput name={fields.smin} setValue={setValue}/>
          </FormGroup>
        </Col>
        <Col lg={3} md={6}>
          <FormGroup>
            <Label for={fields.dmin}>
              Dynamic minimum
            </Label>
            <RAMInput name={fields.dmin} setValue={setValue}/>
          </FormGroup>
        </Col>
        <Col lg={3} md={6}>
          <FormGroup>
            <Label for={fields.dmax}>
              Dynamic maximum
            </Label>
            <RAMInput name={fields.dmax} setValue={setValue}/>
          </FormGroup>
        </Col>
        <Col lg={3} md={6}>
          <FormGroup>
            <Label for={fields.smax}>
              Static maximum
            </Label>
            <RAMInput name={fields.smax} setValue={setValue}/>
          </FormGroup>
        </Col>
      </Row>
    </Fragment>
  )
};

export default connect<OuterProps>(RAMInputComponent);

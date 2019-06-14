import {ResourceFormValues} from "./schema";
import {getIn, FormikProps, connect, Field} from "formik";
import * as React from "react";
import {Fragment, SyntheticEvent, useCallback, useEffect, useMemo, useState} from "react";
import {Col, Input, InputGroup, InputGroupText, Label, Row} from "reactstrap";
import {FormGroup} from "../MarginFormGroup";
import {ChangeInputEvent, FormInput} from "../AbstractSettingsForm/inputUtils";
import InputGroupAddon from "reactstrap/lib/InputGroupAddon";
import {getFeedback, getInvalid} from "../Input/utils";
import {AbstractMemoryInput, Unit} from "../AbstractSettingsForm/abstractMemoryInput";
import set = Reflect.set;
import {InputBaseProps} from "../Input/inputBase";

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

  const [commonState, setCommonState] = useState(false);
  const [manualEdit, setManualEdit] = useState(false);

  useEffect(() => {
    if (!manualEdit)
      setCommonState(formik.values[fields.dmin]
        == formik.values[fields.dmax]
        == formik.values[fields.smin]
        == formik.values[fields.smax]);
  }, [formik.values[fields.dmin],
    formik.values[fields.dmax],
    formik.values[fields.smin],
    formik.values[fields.smax]
  ]);
  const setValue = (value: number, field: string) => {
    setManualEdit(true);
    formik.setFieldValue(field, value);
    if (commonState) {
      Object.keys(fields).forEach(key => {
        if (key != field)
          formik.setFieldValue(fields[key], value);
      });
    }
    setManualEdit(false);
  };

  const toggle = () => {
    setCommonState(!commonState);
  }

  return (
    <Fragment>
      <Label> RAM settings </Label>
      <FormGroup check={true}>
        <Label check={true}>
          <Input type="checkbox"
                 checked={!commonState}
                 onChange={toggle}/>
          Variable memory
        </Label>
      </FormGroup>
      {commonState && (
        <Row>
          <Col>
            <FormGroup>
              <Label
                for={fields.smin}>
                Memory size
              </Label>
              <RAMInput
                name={fields.smin}
                setValue={setValue}/>
            </FormGroup>
          </Col>
        </Row>
      ) || (
        <Row formik="true">
          <Col lg={3} md={6} sm={12}>
            <FormGroup>
              <Label
                for={fields.smin}>
                Static minimum
              </Label>
              <RAMInput
                name={fields.smin}
                setValue={setValue}
              />
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
      )}
    </Fragment>
  )
};

export default connect<OuterProps>(RAMInputComponent);

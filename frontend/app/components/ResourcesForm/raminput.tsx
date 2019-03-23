import {ResourceFormValues} from "./schema";
import {FieldProps} from "formik";
import * as React from "react";
import {Fragment, SyntheticEvent, useCallback} from "react";
import {Col, InputGroup, InputGroupText, Label, Row} from "reactstrap";
import {FormGroup} from "../MarginFormGroup";
import {ChangeInputEvent, getInput} from "../AbstractSettingsForm/inputUtils";
import InputGroupAddon from "reactstrap/lib/InputGroupAddon";
import dlv from 'dlv';

export const RAMInputComponent: React.FunctionComponent<FieldProps<ResourceFormValues>> = ({form}) => {
  enum fields {
    dmin = "memoryDynamicMin",
    dmax = "memoryDynamicMax",
    smin = "memoryStaticMin",
    smax = "memoryStaticMax",
  }

  const smin = fields.smin;
  const smax = fields.smax;
  const dmin = fields.dmin;
  const dmax = fields.dmax;
  const convertValue = useCallback((value: number) => {
    //Now bytes to megabytes - API values are bytes, user input is megabytes
    return value / 1024 / 1024;
  }, []);

  const convertInputValue = useCallback((value: string) => {
    return Math.floor(Number.parseFloat(value) * 1024 * 1024);
  }, []);
  const handleChangeSmin = useCallback((e: ChangeInputEvent) => {
    const value = convertInputValue(e.target.value);
    form.setFieldValue(smin, value);
    console.log(form.values[smin])
  }, [form, convertInputValue]);


  const handleChangeSmax = useCallback((e: ChangeInputEvent) => {
    form.setFieldValue(smax, convertInputValue(e.target.value));
  }, [form, convertInputValue]);


  const handleChangeDmin = useCallback((e: ChangeInputEvent) => {
    form.setFieldValue(dmin, convertInputValue(e.target.value));
  }, [form, convertInputValue]);

  const handleChangeDmax = useCallback((e: ChangeInputEvent) => {
    form.setFieldValue(dmax, convertInputValue(e.target.value));
  }, [form, convertInputValue]);

  const getMemoryInput = useCallback((name: fields) => {
    const handleChange = () => {
      switch (name) {
        case dmin:
          return handleChangeDmin;
        case dmax:
          return handleChangeDmax;
        case smin:
          return handleChangeSmin;
        case smax:
          return handleChangeSmax;
      }
    };

    return (
      <InputGroup>
        {getInput(form, name, "number", handleChange(), convertValue(dlv(form.values, name)))}
        <InputGroupAddon addonType="append"
                         style={{"line-height": "1!important"}}
        >
          <InputGroupText>
            MB
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    )
  }, [form, convertValue]);


  return (
    <Fragment>
      <Label>RAM settings</Label>
      <Row form="true">
        <Col sm={3}>
          <FormGroup>
            <Label for={smin}>
              Static minimum
            </Label>
            {getMemoryInput(smin)}
          </FormGroup>
        </Col>
        <Col sm={3}>
          <FormGroup>
            <Label for={dmin}>
              Dynamic minimum
            </Label>
            {getMemoryInput(dmin)}
          </FormGroup>
        </Col>
        <Col sm={3}>
          <FormGroup>
            <Label for={dmax}>
              Dynamic maximum
            </Label>
            {getMemoryInput(dmax)}
          </FormGroup>
        </Col>
        <Col sm={3}>
          <FormGroup>
            <Label for={smax}>
              Static maximum
            </Label>
            {getMemoryInput(smax)}
          </FormGroup>
        </Col>
      </Row>
    </Fragment>
  )
};

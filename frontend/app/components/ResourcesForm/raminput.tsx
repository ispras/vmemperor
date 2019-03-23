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

    const convertValue = useCallback((value: number) => {
      //Now bytes to megabytes - API values are bytes, user input is megabytes
      return value / 1024 / 1024;
    }, []);

    const convertInputValue = useCallback((value: string) => {
      return Math.floor(Number.parseFloat(value) * 1024 * 1024);
    }, []);
    const setValue = useCallback((value: number, field: fields) => {
      if (Number.isNaN(value)) {
        form.setFieldValue(field, 0);
        return;
      }
      form.setFieldValue(field, value);


      switch (field) {
        case fields.smin:
          if (value > dlv(form.values, fields.dmin)) //
            setValue(value, fields.dmin);
          break;
        case fields.dmin:
          if (value < dlv(form.values, fields.smin))
            setValue(value, fields.smin);
          if (value > dlv(form.values, fields.dmax))
            setValue(value, fields.dmax);
          break;
        case fields.dmax:
          if (value < dlv(form.values, fields.dmin))
            setValue(value, fields.dmin);
          if (value > dlv(form.values, fields.smax))
            setValue(value, fields.smax);
          break;
        case fields.smax:
          if (value < dlv(form.values, fields.dmax))
            setValue(value, fields.dmax);
          break;
      }
    }, [form]);

    const getMemoryInput = useCallback((name: fields) => {
      const handleChange = (e: ChangeInputEvent) => {
        const value = convertInputValue(e.target.value);
        setValue(value, name);
      };

      return (
        <InputGroup>
          {getInput(form, name, "number", handleChange, convertValue(dlv(form.values, name)))}
          <InputGroupAddon addonType="append"
                           style={{"line-height": "1!important"}}
          >
            <InputGroupText>
              MB
            </InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      )
    }, [form, convertValue, convertInputValue]);


    return (
      <Fragment>
        <Label>RAM settings</Label>
        <Row form="true">
          <Col sm={3}>
            <FormGroup>
              <Label for={fields.smin}>
                Static minimum
              </Label>
              {getMemoryInput(fields.smin)}
            </FormGroup>
          </Col>
          <Col sm={3}>
            <FormGroup>
              <Label for={fields.dmin}>
                Dynamic minimum
              </Label>
              {getMemoryInput(fields.dmin)}
            </FormGroup>
          </Col>
          <Col sm={3}>
            <FormGroup>
              <Label for={fields.dmax}>
                Dynamic maximum
              </Label>
              {getMemoryInput(fields.dmax)}
            </FormGroup>
          </Col>
          <Col sm={3}>
            <FormGroup>
              <Label for={fields.smax}>
                Static maximum
              </Label>
              {getMemoryInput(fields.smax)}
            </FormGroup>
          </Col>
        </Row>
      </Fragment>
    )
  }
;

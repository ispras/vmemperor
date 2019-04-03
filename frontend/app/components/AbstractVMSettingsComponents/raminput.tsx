import {ResourceFormValues} from "./schema";
import {getIn, FormikProps, connect} from "formik";
import * as React from "react";
import {Fragment, SyntheticEvent, useCallback} from "react";
import {Col, Input, InputGroup, InputGroupText, Label, Row} from "reactstrap";
import {FormGroup} from "../MarginFormGroup";
import {ChangeInputEvent, getInput} from "../AbstractSettingsForm/inputUtils";
import InputGroupAddon from "reactstrap/lib/InputGroupAddon";
import {getFeedback, getInvalid} from "../Input/utils";

interface OuterProps {
  namePrefix?: string;
}

interface Props extends OuterProps {
  formik: FormikProps<any>;
}

const convertValue = (value: number) => {
      //Now bytes to megabytes - API values are bytes, user input is megabytes
      return value / 1024 / 1024;
};
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


  const convertInputValue = useCallback((value: string) => {
    const num = Number.parseFloat(value);
    return Math.floor(num * 1024 * 1024);
    }, []);
  const setValue = useCallback((value: number, field: string) => {
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
  }, [formik]);

  const getMemoryInput = (name: string) => {
      const handleChange = (e: ChangeInputEvent) => {
        e.preventDefault();
        const value = convertInputValue(e.target.value);
        setValue(value, name);
      };

    const value = convertValue(getIn(formik.values, name));
      return (
        <InputGroup>
          <Input
            name={name}
            type="number"
            onChange={handleChange}
            onBlur={formik.handleBlur(name)}
            value={value}
            invalid={getInvalid(formik, name)}
          />
          {getFeedback(formik, name)}
          <InputGroupAddon addonType="append"
                           style={{"line-height": "1!important"}}
          >
            <InputGroupText>
              MBs
            </InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      )
  };


    return (
      <Fragment>
        <Label>RAM settings</Label>
        <Row formik="true">
          <Col lg={3} md={6} sm={12}>
            <FormGroup>
              <Label for={fields.smin}>
                Static minimum
              </Label>
              {getMemoryInput(fields.smin)}
            </FormGroup>
          </Col>
          <Col lg={3} md={6}>
            <FormGroup>
              <Label for={fields.dmin}>
                Dynamic minimum
              </Label>
              {getMemoryInput(fields.dmin)}
            </FormGroup>
          </Col>
          <Col lg={3} md={6}>
            <FormGroup>
              <Label for={fields.dmax}>
                Dynamic maximum
              </Label>
              {getMemoryInput(fields.dmax)}
            </FormGroup>
          </Col>
          <Col lg={3} md={6}>
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
};

export default connect<OuterProps>(RAMInputComponent);

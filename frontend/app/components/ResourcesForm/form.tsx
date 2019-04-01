import {ResourceFormValues} from "../AbstractVMSettingsComponents/schema";
import {FormikProps} from "formik";
import * as React from "react";
import {Alert, Button, Form, FormFeedback} from "reactstrap";
import {Fields} from "../AbstractVMSettingsComponents/fields";
import ButtonGroup from "reactstrap/lib/ButtonGroup";


export const ResourcesForm: React.FunctionComponent<FormikProps<any>> =
  (props) => {
    return (
        <Form onSubmit={props.handleSubmit}>
          {props.children}
          <ButtonGroup>
            <Button type="submit" className="float-right" color="primary">
              Apply
            </Button>
            <Button className="float-right" color="danger" onClick={() => props.resetForm()}>
              Reset
            </Button>
          </ButtonGroup>
          {props.status && props.status.error && (
            <Alert color={"danger"}>
              {props.status.error}
            </Alert>
          )}
        </Form>
    )
  };

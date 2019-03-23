import {ResourceFormValues} from "./schema";
import {FormikProps} from "formik";
import * as React from "react";
import {Button, Form, FormFeedback} from "reactstrap";
import {Fields} from "./fields";
import ButtonGroup from "reactstrap/lib/ButtonGroup";

type FormikPropsValues = FormikProps<ResourceFormValues>;

interface ResourcesFormProps extends FormikProps<ResourceFormValues> {
}

const FormContext = React.createContext<FormikPropsValues>(null); //For providing handleChange, handleBlur etc to fields
export const ResourcesForm: React.FunctionComponent<ResourcesFormProps> =
  (props) => {
    return (
      <FormContext.Provider value={props}>
        <Form onSubmit={props.handleSubmit}>
          <Fields/>
          <ButtonGroup>
            <Button type="submit" className="float-right" color="primary">
              Apply
            </Button>
            <Button className="float-right" color="danger" onClick={() => props.resetForm()}>
              Reset
            </Button>
          </ButtonGroup>
          {props.status && props.status.error && (
            <FormFeedback>
              {props.status.error}
            </FormFeedback>
          )}
        </Form>
      </FormContext.Provider>
    )
  };

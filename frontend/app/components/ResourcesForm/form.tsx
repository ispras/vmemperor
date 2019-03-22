import {ResourceFormValues} from "./index";
import {FormikProps} from "formik";
import * as React from "react";
import {Button, Form} from "reactstrap";
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
        </Form>
      </FormContext.Provider>
    )
  };

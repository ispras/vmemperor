import Form from "reactstrap/lib/Form";
import * as React from "react";
import {Button, FormGroup, UncontrolledAlert} from "reactstrap";
import Label from "reactstrap/lib/Label";
import {Formik} from "formik";
import * as Yup from 'yup';
import {getInput} from "../AbstractSettingsForm/inputUtils";
import {TemplateActions, TemplateInfoFragmentFragment, useTemplateCloneMutation} from "../../generated-models";
import {useState} from "react";

interface NewTemplateValues {
  nameLabel: string;
}

interface Props {
  template: TemplateInfoFragmentFragment;
}

export function TemplateClone({template}: Props) {
  const clone = useTemplateCloneMutation();
  const [error, setError] = useState(null);
  return (
    <Formik<NewTemplateValues>
      render={(props) => {
        return (
          <Form onSubmit={props.handleSubmit} inline={true}>
            <FormGroup>
              <Label for="newName">New template name</Label>
              {getInput(props, "nameLabel", "text", null)}
            </FormGroup>
            <Button type="submit" color="primary"
                    disabled={!props.isValid && template.myActions.includes(TemplateActions.clone)}>
              Clone
            </Button>
            {error && <UncontrolledAlert>
              {error}
            </UncontrolledAlert>}
          </Form>);
      }}
      initialValues={{
        nameLabel: "Clone of " + template.nameLabel
      }}
      isInitialValid={true}
      validationSchema={Yup.object().shape<NewTemplateValues>(
        {
          nameLabel: Yup.string().required()
        }
      )}
      onSubmit={async (values, actions) => {
        console.log("Values", values)
        const result = await clone({
          variables: {
            nameLabel: values.nameLabel,
            ref: template.ref,
          }
        });
        actions.setSubmitting(false);
        if (!result.data.granted) {
          setError(result.data.reason)
        }
      }}
    />
  );
}

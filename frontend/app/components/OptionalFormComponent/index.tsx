import {ReactNode, useState} from "react";
import {Omit} from "../AbstractSettingsForm/utils";
import * as React from "react";
import FormGroup from "reactstrap/lib/FormGroup";
import Label from "reactstrap/lib/Label";
import {Input} from "reactstrap";

interface OmittedProps {
  disabled: boolean
}

interface UsedComponentProps {
  name: string;
}

interface AdditionalProps {
  checkboxLabelContent?: ReactNode;
}


const withCheckBoxOption = <Props extends OmittedProps & UsedComponentProps>(Component: React.ComponentType<Props>):
  React.FC<Omit<Props, keyof OmittedProps>> =>
  ({checkboxLabelContent, ...props}: Props & AdditionalProps) => {
    const [checked, setChecked] = useState<boolean>(null);
    const innerComponentProps = {
      disabled: !checked,
      ...props
    } as Props;
    return (
      /** TODO: Implement onChange **/
      <FormGroup>
        <Label for={innerComponentProps.name}
               tag="input"
               type="checkbox">
          {checkboxLabelContent}
        </Label>
        <Component {...innerComponentProps}/>);
      </FormGroup>)

  };

import {ChangeEvent, ReactNode, useEffect, useMemo, useState} from "react";
import {Omit} from "../AbstractSettingsForm/utils";
import * as React from "react";
import FormGroup from "reactstrap/lib/FormGroup";
import Label from "reactstrap/lib/Label";
import {Input, InputGroup, InputGroupAddon, InputGroupText, InputProps} from "reactstrap";
import {FieldProps, getIn} from "formik";

interface OmittedProps {
  disabled?: boolean
  children?: ReactNode;
}


interface AdditionalProps {
  checkboxLabelContent?: ReactNode;
}


export const withCheckBoxOption = <T, Props extends OmittedProps & FieldProps<T>>(Component: React.ComponentType<Props>):
  React.FC<Omit<Props, keyof OmittedProps>> =>
  ({checkboxLabelContent, children, ...props}: Props & AdditionalProps) => {
    const {form, field} = props;
    const [checked, setChecked] = useState<boolean>(null);
    const [previousValue, setPreviousValue] = useState(null);
    const innerComponentProps = {
      disabled: !checked,
      ...props
    } as Props;
    const initialValue = getIn(form.initialValues, field.name);
    useEffect(() => {
      setChecked(initialValue !== null);
      setPreviousValue(initialValue);

    }, [initialValue]);
    const onChange: InputProps['onChange'] = (e: ChangeEvent<HTMLInputElement>) => {
      if (checked) { //Won't be checked -> disanbled -> nullify value
        setPreviousValue(field.value);
        form.setFieldValue(field.name, null);
      } else { //Will be checked -> enabled -> restore value
        form.setFieldValue(field.name, previousValue);
      }
      setChecked(!checked);
    };
    return (
      <FormGroup>
        <Label>{checkboxLabelContent}</Label>
        <InputGroup>
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <Input
                addon={true}
                type="checkbox"
                aria-label="Enable this setting"
                onChange={onChange}
                checked={checked}
              />

            </InputGroupText>
          </InputGroupAddon>
          <Component {...innerComponentProps}/>
        </InputGroup>
        {children}
      </FormGroup>
    )

  };

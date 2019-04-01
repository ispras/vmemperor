import {connect, FieldProps, FormikProps} from "formik";
import {TemplateSettingsFormValues} from "./schema";
import Input from '../../components/Input';
import * as React from "react";
import {useMemo} from "react";
import {Distro} from "../../generated-models";
import dlv from 'dlv';


interface InputProps {
  placeholder: string;
  disabled: boolean;
}

export const Release: React.FunctionComponent<FieldProps<TemplateSettingsFormValues>> =
  (props) => {
    const inputProps: InputProps = useMemo(() => {
      const distro = props.form.values.installOptions.distro;
      if (distro)
        switch (distro) {
          case Distro.Debian:
            return {
              placeholder: "Debian or Ubuntu release codename (e.g. bionic, wheezy)",
              disabled: false
            };
          case Distro.CentOS:
            return {
              placeholder: "RedHat/CentOS version (e.g. 7)",
              disabled: false
            };
          case Distro.SUSE:
            return {
              placeholder: "",
              disabled: false
            }
        }
    }, [props.form.values.installOptions.distro]);
    return (
      <Input
        {...props}
        {...inputProps}
      >
        Release
      </Input>
    )
  };

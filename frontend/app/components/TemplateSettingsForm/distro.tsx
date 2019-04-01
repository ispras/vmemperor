import * as React from "react";
import {Fragment} from "react";
import {Field} from "formik";
import {RadioButton} from "../RadioButton";
import {Distro} from "../../generated-models";
import {Release} from "./release";
import {distroId, prefix, TemplateRadioButtonGroup} from "./constants";
import Arch from './arch';
import Mirror from './mirror';

export const DistroType: React.FunctionComponent<{}> =
  () => {
    return (
      <Fragment>
        <TemplateRadioButtonGroup
          label="Select distro for autoinstallation"
          id={distroId}>
          <Field
            component={RadioButton}
            name={distroId}
            id={null}
            label='Disable auto-installation'/>
          <Field
            component={RadioButton}
            name={distroId}
            id={Distro.Debian}
            label='Debian'/>
          <Field
            component={RadioButton}
            name={distroId}
            id={Distro.CentOS}
            label='CentOS'/>
          <Field
            component={RadioButton}
            name={distroId}
            id={Distro.SUSE}
            label='SUSE'/>
        </TemplateRadioButtonGroup>
        <Field
          component={Release}
          name={prefix + 'release'}
          label="Release"
        />
        <Arch/>
        <Mirror/>

      </Fragment>
    );
  };

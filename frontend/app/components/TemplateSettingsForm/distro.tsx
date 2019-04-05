import * as React from "react";
import {Fragment, useMemo} from "react";
import {connect, Field, FormikProps} from "formik";
import {RadioButton} from "../RadioButton";
import {Distro, DomainType} from "../../generated-models";
import {Release} from "./release";
import {distroId, prefix, TemplateRadioButtonGroup} from "./constants";
import Arch from './arch';
import Mirror from './mirror';
import {TemplateSettingsFormValues} from "./schema";
import {pick} from 'lodash';
import {defaults} from "./defaults";

interface Props {
  formik: FormikProps<TemplateSettingsFormValues>;
}

const DistroType =
  ({formik}: Props) => {
    const distroChoiceDisabled = useMemo(() => {
      if (formik.values.domainType != DomainType.PV) {
        formik.resetForm({
          installOptions: formik.initialValues.installOptions,
          ...formik.values
        });
        return true;
      } else {
        return false;
      }
    }, [formik.values.domainType]);
    if (distroChoiceDisabled)
      return null;

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

export default connect<{}, TemplateSettingsFormValues>(DistroType);

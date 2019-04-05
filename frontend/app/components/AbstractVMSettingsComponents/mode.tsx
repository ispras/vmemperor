import {RadioButton, RadioButtonGroup} from "../RadioButton";
import {ResourceFormValues} from "./schema";
import * as React from "react";
import {Field} from "formik";
import {DomainType} from "../../generated-models";

const ResourceFormButtonGroup = RadioButtonGroup<ResourceFormValues>();

export const Mode = () => {
  const domainTypeId = "domainType";
  return (
    <ResourceFormButtonGroup
      label="Virtualization mode"
      id={domainTypeId}>
      <Field
        component={RadioButton}
        name={domainTypeId}
        id={DomainType.PV}
        label='PV'/>
      <Field
        component={RadioButton}
        name={domainTypeId}
        id={DomainType.HVM}
        label='HVM'/>
    </ResourceFormButtonGroup>

  );
};


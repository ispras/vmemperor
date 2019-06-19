import {Field} from "formik";
import {AbstractMemoryInput, Unit} from "../AbstractSettingsForm/abstractMemoryInput";
import {InputGroup, InputGroupAddon, InputGroupText} from "reactstrap";
import React from "react";
import {useVDIQuotaQuery} from "../../generated-models";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHdd} from "@fortawesome/free-solid-svg-icons";

interface Props {
  user: string;
  fieldName: string;
}

export const VDISizeComponent: React.FC<Props> = ({user, fieldName}) => {
  const {data: {quotaLeft: {vdiSize}}} = useVDIQuotaQuery({
    variables: {
      user
    }
  });
  return (
    <InputGroup>
      <InputGroupAddon style={{"line-height": "1!important"}} addonType="prepend">
        <InputGroupText>
          <FontAwesomeIcon icon={faHdd}/>
        </InputGroupText>
      </InputGroupAddon>
      <Field
        name={fieldName}
        component={AbstractMemoryInput}
        unit={Unit.GB}
        quotaText="Space left on quota:"
        quotaBytes={vdiSize}
      />
    </InputGroup>
  );
};



import * as React from "react";
import {GAccessEntry, useCurrentUserQuery, User} from "../../generated-models";
import {useEffect, useMemo} from "react";
import {UserInputField} from "./userInput";
import {connect, Field, FormikProps} from "formik";
import {Button, Col, Row} from "reactstrap";

interface QuotaObject {
  ref: string;
  mainOwner?: User;
  access: Array<GAccessEntry>;
}

interface OuterProps {
  object: QuotaObject
}

interface Values {
  mainOwner?: User;
}

interface Props extends OuterProps {
  formik: FormikProps<Values>
}

const MainOwnerForm: React.FC<Props> = ({object, formik}) => {

  const items = useMemo(() =>
    object.access.filter((item) => item.isOwner)
      .map(item => item.userId), [object.access]);
  const {data: {currentUser}} = useCurrentUserQuery();
  const onClick = () => {
    formik.setFieldValue("mainOwner", null);
  };

  return (
    <div title={"An user against whom quota is to be calculated"}>
      <Field
        name="mainOwner"
        component={UserInputField}
        placeholder={"Choose a user to make them main owner"}
        users={items}
      >
        <Row>
          <Col sm={7}>
            <h4>Choose a main owner</h4>
          </Col>
          <Col sm={3}>
            <Button onClick={onClick}
                    title={"Quota will not be accounted for this VM. Only administrator can do that"}
                    disabled={!currentUser.isAdmin}
            >
              Unset
            </Button>
          </Col>
        </Row>
      </Field>
    </div>

  );

};

export default connect<OuterProps>(MainOwnerForm);

import {SettingsComponentProps} from "../../containers/Settings";
import {useCallback, useMemo, useState} from "react";
import * as React from "react";
import XenObjectHeader from "../../components/XenObjectHeader";
import {Badge, Col, Nav, NavItem, NavLink, Row, TabContent, TabPane} from "reactstrap";
import {
  TemplateAccessSetMutationDocument,
  TemplateActions,
  TemplateEditOptionsDocument,
  TemplateInfoQuery
} from "../../generated-models";
import {TabWidget, TabWidgetProps} from "../TabWidget";
import {ResourcesFormContainer} from "../ResourcesForm";
import {defaults} from "../VMSettingsForm/defaults";
import AccessView from "../AccessView";
import {Fields} from "../AbstractVMSettingsComponents/fields";
import schema from "../AbstractVMSettingsComponents/schema";
enum Tab {
  Overview = 'overview',
  Resources = 'resources',
  Access = 'access',
}

const TemplateSettingsForm: React.FunctionComponent<SettingsComponentProps<TemplateInfoQuery>> =
  ({object: {template}}) => {
    const defaultTab = Tab.Overview;
    const header = useMemo(() => (
      <XenObjectHeader
          editMutation={TemplateEditOptionsDocument}
          editMutationName="template"
          xenObject={template}>
          {template.installOptions &&
          <Badge color="primary">{template.installOptions.distro} {template.installOptions.release} </Badge>}
        </XenObjectHeader>
    ), [template.installOptions, template.nameLabel, template.nameDescription]);
    const tabs: TabWidgetProps["tabs"] = new Map(
      [
        [Tab.Overview, {
          header: "Overview",
          content: "Hello",
        }],
        [Tab.Resources, {
          header: "Resources",
          content: (
            <Row>
              <Col sm="12">
                <ResourcesFormContainer
                  object={template}
                  mutationNode={TemplateEditOptionsDocument}
                  mutationName="template"
                  defaultValues={defaults}
                  schema={schema}
                >
                  <Fields/>
                </ResourcesFormContainer>
              </Col>
            </Row>
          )
        }],
        [Tab.Access, {
          header: "Access",
          content: (
            <Row>
              <Col sm="12">
                {<AccessView
                  data={template}
                  ALL={TemplateActions.ALL}
                  mutationName="templateAccessSet"
                  mutationNode={TemplateAccessSetMutationDocument}
                />}
              </Col>
            </Row>
          )
        }]
      ]
    );
    return (
      <TabWidget
        tabs={tabs}
        header={header}
        defaultTab={defaultTab}/>
    );
  };

export default TemplateSettingsForm;

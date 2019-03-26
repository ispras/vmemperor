import {SettingsComponentProps} from "../../containers/Settings";
import {TemplateEditOptions, TemplateInfo} from "../../generated-models";
import {useCallback, useState} from "react";
import * as React from "react";
import XenObjectHeader from "../../components/XenObjectHeader";
import {Badge, Nav, NavItem, NavLink, TabContent, TabPane} from "reactstrap";
import classnames from 'classnames';
enum Tab {
  Overview = 'overview',
  Access = 'access',
}

const TemplateSettingsForm: React.FunctionComponent<SettingsComponentProps<TemplateInfo.Query>> =
  ({object: {template}}) => {
    const [activeTab, setActiveTab] = useState(Tab.Overview);

    const toggleTab = useCallback((tab: Tab) => {
      if (activeTab !== tab) {
        setActiveTab(tab);
      }
    }, [activeTab]);
    return (
      <div>
        <XenObjectHeader
          editMutation={TemplateEditOptions.Document}
          editMutationName="template"
          xenObject={template}>
          {template.installOptions &&
          <Badge color="primary">{template.installOptions.distro} {template.installOptions.release} </Badge>}
        </XenObjectHeader>
        <Nav tabs={true}>
          <NavItem>
            <NavLink
              className={classnames({active: activeTab === Tab.Overview})}
              onClick={() => {
                toggleTab(Tab.Overview);
              }}
            >
              Overview
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab}>
          <TabPane tabId={Tab.Overview}>
            Hello!
          </TabPane>
        </TabContent>
      </div>
    );
  };

export default TemplateSettingsForm;

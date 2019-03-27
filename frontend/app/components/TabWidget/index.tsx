import React, {ReactNode, Fragment, useCallback, useState, useMemo, FunctionComponent, useEffect} from "react";
import {Nav, NavLink, NavItem, TabContent, TabPane} from "reactstrap";
import classnames from "classnames";

export interface Tab {
  header: ReactNode;
  content: ReactNode;
  tabDisabled?: boolean;
}

type TKey = string | number;

export interface TabWidgetProps {
  tabs: Map<TKey, Tab>;
  onAfterActivation?: (activeTab: TKey) => void;
  header: ReactNode;
  defaultTab: TKey;
  /**
   * If not null, turns this into a controlled component
   */
  tab?: TKey;
}

export const TabWidget: FunctionComponent<TabWidgetProps> =
  ({tabs, onAfterActivation, header, defaultTab, tab}: TabWidgetProps) => {
    const [activeTab, setActiveTab] = useState(defaultTab);
    const tabEntries = useMemo(() => [...tabs.entries()], [tabs]);
    const toggleTab = useCallback((tab: TKey) => {
      if (activeTab !== tab) {
        setActiveTab(tab);
        if (onAfterActivation)
          onAfterActivation(tab);
      }
    }, [activeTab, onAfterActivation]);
    useEffect(() => {
      if (tab) {
        setActiveTab(tab);
        if (onAfterActivation)
          onAfterActivation(tab);
      }
    }, [tab]);
    return (
      <div>
        {header}
        <Nav tabs={true}>
          {tabEntries.map(([key, value]) => (
              <NavItem>
                <NavLink
                  className={classnames({active: activeTab === key})}
                  onClick={() => {
                    toggleTab(key);
                  }}
                  disabled={value.tabDisabled}
                >
                  {value.header}
                </NavLink>
              </NavItem>
            )
          )
          }
        </Nav>
        <TabContent activeTab={activeTab}>
          {tabEntries.map(([key, value]) => (
            <TabPane tabId={key}>
              {value.content}
            </TabPane>
          ))
          }
        </TabContent>
      </div>
    )
  };

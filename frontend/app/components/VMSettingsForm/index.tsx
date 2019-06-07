/**
 *
 * VMSettingsForm
 *
 */

import React, {useCallback, useEffect, useMemo, useState} from 'react';
import Overview from './subforms/overview';
import {Badge, Col, Nav, NavItem, NavLink, Row, TabContent, TabPane} from 'reactstrap';
import classnames from 'classnames';
import Vncview from '../../containers/Vncview';
import Network from "./subforms/network";
import Storage from "./subforms/storage";
import AccessView from '../../components/AccessView';
import XenObjectHeader from "../XenObjectHeader";
import {ResourcesFormContainer} from "../ApplyResetForm";
import schema from "./schema";
import {SettingsComponentProps} from "../../containers/Settings";
import {defaults} from "../AbstractVMSettingsComponents/defaults";
import {Omit} from "../AbstractSettingsForm/utils";
import {
  PowerState,
  VMAccessSetMutationDocument, VMActions,
  VMEditOptionsDocument,
  VMInfoFragmentFragment,
  VMInfoQuery
} from "../../generated-models";
import {TabWidget, TabWidgetProps} from "../TabWidget";
import {Fields} from "../AbstractVMSettingsComponents/fields";
import {Mode} from "../AbstractVMSettingsComponents/mode";
import MainOwnerForm from "../MainOwnerForm";
import {Snapshots} from "./subforms/snapshots";
import IFrame from 'react-iframe';

enum Tab {
  Overview = 'overview',
  Resources = 'resources',
  VNC = 'vnc',
  Statistics = 'stats',
  Access = 'access',
  Snapshots = 'snapshots',
  Storage = 'storage',
  Network = 'network',
}


const VMSettingsForm: React.FunctionComponent<SettingsComponentProps<VMInfoQuery>> = ({object: {vm}}) => {
  const defaultTab = Tab.Overview;

  const [overrideTab, setOverrideTab] = useState(null);
  const [vncActivated, setVncActivated] = useState(false);
  const [activeTab, setActiveTab] = useState(defaultTab);
  const onAfterActivation = useCallback((tab: Tab) => {
    setActiveTab(tab);
    if (tab === Tab.VNC) {
      if (!vncActivated) {
        setVncActivated(true);
      }
    }
    setOverrideTab(null);
  }, [vncActivated]);

  useEffect(() => {
    if (vm.powerState !== PowerState.Running) {
      if (activeTab === Tab.VNC) {
        setOverrideTab(defaultTab);
      }
    }
  }, [vm.powerState, activeTab]);

  const header = useMemo(() => (
    <XenObjectHeader
      xenObject={vm}
      editMutationName={"vm"}
      editMutation={VMEditOptionsDocument}
    >
      <Badge color="primary">{vm.powerState}</Badge>
      {vm.osVersion &&
      (<Badge color="success">{vm.osVersion.name}</Badge>)}
    </XenObjectHeader>
  ), [vm.nameLabel, vm.nameDescription, vm.powerState, vm.osVersion]);

  const tabs: TabWidgetProps["tabs"] = new Map(
    [
      [Tab.Overview, {
        header: "Overview",
        content: (
          <Row>
            <Col sm="12">
              <Overview vm={vm}/>
            </Col>
          </Row>
        )
      }],
      [Tab.Resources, {
        header: "Resources",
        content: (
          <Row>
            <Col sm="12">
              <ResourcesFormContainer
                schema={schema}
                object={vm}
                mutationNode={VMEditOptionsDocument}
                mutationName="vm"
                defaultValues={defaults}
              >
                <MainOwnerForm object={vm}/>
                <Mode PVBootloader={vm.PVBootloader}/>
                <Fields/>
              </ResourcesFormContainer>
            </Col>
          </Row>
        )
      }
      ],
      [Tab.VNC, {
        header: "VNC",
        tabDisabled: useMemo(() =>
          vm.powerState !== PowerState.Running || !vm.myActions.includes(VMActions.VNC),
          [vm.powerState, vm.myActions]),
        content: useMemo(() => {
          if (vncActivated)
            return (
              <Vncview vm={vm}/>
            );
          else {
            return (<h1>NO VNC HERE</h1>);
          }

        }, [vncActivated]),
      }],
      [Tab.Statistics, {
        header: "Statistics",
        content: (
          <IFrame
            url={`/grafana/dashboard/script/vm.js?orgId=1&uuid=${vm.uuid}&refresh=5s`}
            display="block"
            height="100%"
            width="100%"
          />
        )
      }],
      [Tab.Access, {
        header: "Access",
        content: (
          <
            Row>
            < Col
              sm="12">
              {
                <AccessView
                  data={vm}
                  ALL={VMActions.ALL}
                  mutationName="vmAccessSet"
                  mutationNode={VMAccessSetMutationDocument}
                />
              }
            </Col>
          </Row>
        )
      }],
      [Tab.Snapshots, {
        header: "Snapshots",
        content: (
          <Row>
            <Col sm="12">
              <Snapshots vm={vm}/>
            </Col>
          </Row>
        )
      }],
      [Tab.Storage, {
        header: "Storage",
        content: (
          <Row>
            <Col sm="12">
              {<Storage
                vm={vm}/>}
            </Col>
          </Row>
        )
      }],
      [Tab.Network, {
        header: "Network",
        content: (
          <Row>
            <Col sm="12">
              {<Network
                vm={vm}
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
      onAfterActivation={onAfterActivation}
      header={header}
      defaultTab={defaultTab}
      tab={overrideTab}
    />
  )
};

export default VMSettingsForm;

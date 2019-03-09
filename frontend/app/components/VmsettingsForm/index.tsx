/**
 *
 * VmsettingsForm
 *
 */

import React, {useCallback, useState} from 'react';
import {PowerState, VmActions, VmInfo} from "../../generated-models";
import Power from './subforms/power';
import {Badge, Col, Nav, NavItem, NavLink, Row, TabContent, TabPane} from 'reactstrap';
import classnames from 'classnames';
import Vncview from '../../containers/Vncview';
import Network from "./subforms/network";
import Storage from "./subforms/storage";
import AccessView from '../../components/AccessView';
import Vm = VmInfo.Vm;


interface Props {
  vm: Vm;
}

enum Tab {
  Power = 'power',
  VNC = 'vnc',
  Access = 'access',
  Storage = 'storage',
  Network = 'network',

}


const VmsettingsForm = ({vm}: Props) => {
  const [activeTab, setActiveTab] = useState(Tab.Power);
  const [vncActivated, setVncActivated] = useState(false);

  const toggleTab = useCallback((tab: Tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
    if (tab === Tab.VNC && !vncActivated) {
      setVncActivated(true);
    }
  }, [activeTab, vncActivated]);

  if (activeTab === Tab.VNC && vm.powerState !== PowerState.Running)
  {
    setVncActivated(false);
    setActiveTab(Tab.Power);
  }
  return (
    <div>
      <h3 className="text-center">{vm.nameLabel} <Badge color="primary">{vm.powerState}</Badge>
        {vm.osVersion &&
        (<Badge color="success">{vm.osVersion.name}</Badge>)}
      </h3>

      <Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({active: activeTab === Tab.Power})}
            onClick={() => {
              toggleTab(Tab.Power);
            }}
          >
            Power
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({active: activeTab === Tab.VNC})}
            onClick={() => {
              toggleTab(Tab.VNC);
            }}
            disabled={vm.powerState !== PowerState.Running}
          >
            VNC
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({active: activeTab === Tab.Access})}
            onClick={() => {
              toggleTab(Tab.Access);
            }}
          >
            Access
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({active: activeTab === Tab.Storage})}
            onClick={() => {
              toggleTab(Tab.Storage);
            }}
          >
            Storage
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({active: activeTab === Tab.Network})}
            onClick={() => {
              toggleTab(Tab.Network);
            }}
          >
            Network
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId={Tab.Power}>
          <Row>
            <Col sm="12">
              <Power vm={vm}/>
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId={Tab.Access}>
          <Row>
            <Col sm="12">
              {<AccessView
                accessList={vm.access}
                allActions={VmActions}
              />}
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId={Tab.Storage}>
          <Row>
            <Col sm="12">
              {<Storage
                vm={vm}/>}
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId={Tab.VNC}>
          {
            vncActivated && (
              <Vncview vm={vm}/>
            ) || (<h1>NO VNC HERE</h1>)
          }
        </TabPane>
        <TabPane tabId={Tab.Network}>
          <Row>
            <Col sm="12">
              {<Network
                vm={vm}
              />}
            </Col>
          </Row>
        </TabPane>
      </TabContent>
    </div>
  )
};

export default VmsettingsForm;

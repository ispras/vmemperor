import * as React from 'react';
import {GAccessEntry, User, VmAccessSetMutation, VmAccessSetMutationArgs} from "../../generated-models";
import {useCallback, useMemo, useState} from "react";
import {Nav, Col, NavItem, TabContent, ListGroup, Button} from 'reactstrap';
import Row from "reactstrap/lib/Row";
import NavLink from "reactstrap/lib/NavLink";
import classnames from 'classnames';
import TabPane from "reactstrap/lib/TabPane";
import ListGroupItem from "reactstrap/lib/ListGroupItem";
import ActionList from "./actionList";

export interface AccessEntry<T> extends GAccessEntry {
  actions: Array<T>,
  userId: User;
}

interface ACLXenObject<T> {
  isOwner: boolean;
  myActions: Array<T>;
  access: Array<AccessEntry<T>>;
  ref: string;
}

interface Props<T> {
  data: ACLXenObject<T>
}

/*
function AccessView<T>(props: Props<T>) {
  const options = useMemo(() => {
    return Object.keys(props. ).filter(value =>
      props.allActions[value] != 'NONE' && props.allActions[value] != 'ALL')
      .map(value => ({
        value: props.allActions[value],
        label: value,
      }))
  }, [props.allActions]);
  console.log(options);

  return (
    <div>
      Hello {JSON.stringify(options)}
    </div>
  )
}
*/
function AccessView<T>({data}: Props<T>) {
  const [activeTab, setActiveTab] = useState("you");
  const toggleTab = useCallback((tab: string) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  }, [activeTab]);
  return (
    <Row>
      <Col xs={6} sm={4} md={4}>
        <Nav tabs={true} vertical={true} pills={true}>
          <NavItem>
            <NavLink
              className={classnames({active: activeTab === 'you'})}
              onClick={() => {
                toggleTab('you')
              }
              }
            >
              You
            </NavLink>
          </NavItem>
          {data.access.map(item => (
            <NavItem>
              <NavLink
                className={classnames({active: activeTab === item.userId.id})}
                onClick={() => {
                  toggleTab(item.userId.id)
                }}
              >
                {item.userId.name}
              </NavLink>
            </NavItem>
          ))}
        </Nav>
      </Col>
      <Col xs="6" sm="6" md="6">
        <TabContent activeTab={activeTab}>

          {data.access.map(item => (
            <TabPane tabId={item.userId.id}>
              <ActionList
                entry={item}
                isOwner={data.isOwner}
                mutationNode={VmAccessSetMutation.Document}
                _ref={data.ref}
                mutationName="vmAccessSet"
              />
            </TabPane>
          ))}
        </TabContent>
      </Col>
    </Row>
  );

}

export default AccessView;

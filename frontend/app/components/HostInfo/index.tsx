/**
*
* HostInfo
*
*/

import React from 'react';
import styled from 'styled-components';
import T from 'prop-types';

import { FormattedMessage, FormattedNumber } from 'react-intl';
import messages from './messages';
import {Col, ListGroup, Card, CardBody, CardTitle, ListGroupItemHeading, ListGroupItem} from 'reactstrap';
import {HostListFragmentFragment} from "../../generated-models";
import CardSubtitle from "reactstrap/lib/CardSubtitle";

const Break = styled.hr`
margin: 10px;
`;

interface Props {
  host: HostListFragmentFragment,
}

 const HostInfo = ({ host }:Props) => {

  return (
    <Col md={4}>
      <Card>
        <CardBody>
        <CardTitle>
          <h5><FormattedMessage {...messages.host} values={{ name: host.nameLabel }} /></h5>
        </CardTitle>
        <CardSubtitle>
          <h6>{host.nameDescription}</h6>
        </CardSubtitle>

          <ListGroup>
            <ListGroupItem>
            <ListGroupItemHeading>
              <FormattedMessage {...messages.memory_total}/>
            </ListGroupItemHeading>
            <FormattedNumber value={host.memoryTotal / 1024} maximumFractionDigits={0}/> MB
            </ListGroupItem>
            <ListGroupItem>
              <ListGroupItemHeading><FormattedMessage {...messages.memory_available} /></ListGroupItemHeading>
              <FormattedNumber value={host.memoryAvailable / 1024}  maximumFractionDigits={0}/> MB
            </ListGroupItem>
            <ListGroupItem>
              <ListGroupItemHeading><FormattedMessage {...messages.memory_free} /></ListGroupItemHeading>
              <FormattedNumber value={host.memoryFree / 1024} maximumFractionDigits={0} /> MB
            </ListGroupItem>
            <Break/>
            <ListGroupItem>
            <ListGroupItemHeading>  <FormattedMessage {...messages.vms_running }/> </ListGroupItemHeading>
              {host.residentVms.length}
            </ListGroupItem>
            <ListGroupItem>
              <ListGroupItemHeading><FormattedMessage {...messages.product_name} /></ListGroupItemHeading>
              { host.softwareVersion.productBrand }
            </ListGroupItem>
            <ListGroupItem>
              <ListGroupItemHeading><FormattedMessage {...messages.product_version} /> </ListGroupItemHeading>
              { host.softwareVersion.productVersion}
            </ListGroupItem>

            <ListGroupItem>
              <ListGroupItemHeading><FormattedMessage {...messages.xen_version} /></ListGroupItemHeading>
              { host.softwareVersion.xen }
            </ListGroupItem>
            <Break/>
              <ListGroupItem>
                <ListGroupItemHeading>
                  CPU
                </ListGroupItemHeading>
              { host.cpuInfo.modelname }
                {/*<dt><FormattedMessage {...messages.processor.frequency} /></dt>
              <dd>{ host.cpu_info.speed }MHz</dd>
              <dt><FormattedMessage {...messages.processor.cores} /></dt>
              <dd>{ host.cpu_info.cpu_count }</dd> */}
              </ListGroupItem>
          </ListGroup>
        </CardBody>
      </Card>
    </Col>
  );
};


export default HostInfo;

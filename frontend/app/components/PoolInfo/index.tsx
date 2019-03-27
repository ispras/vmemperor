/**
 *
 * PoolInfo
 *
 */

import React from 'react';
import T from 'prop-types';
import {FormattedMessage, FormattedNumber} from 'react-intl';
import messages from './messages';
import HostInfo from '../../components/HostInfo';
import {
  HostListDocument,
  HostListQuery,
  PoolListFragmentFragment,
  useHostListQuery,
  useHostListUpdateSubscription
} from "../../generated-models";
import CardTitle from "reactstrap/lib/CardTitle";
import {Card, CardImg, CardSubtitle, CardText, Row} from "reactstrap";
import CardBody from "reactstrap/lib/CardBody";
import {handleAddRemove} from "../../utils/cacheUtils";
import CardHeader from "reactstrap/lib/CardHeader";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faServer} from "@fortawesome/free-solid-svg-icons/faServer";
import Col from "reactstrap/lib/Col";
import Button from "reactstrap/lib/Button";
import CardColumns from "reactstrap/lib/CardColumns";
import CardFooter from "reactstrap/lib/CardFooter";
import {UncontrolledCollapse} from "reactstrap";

interface Props {
  pool: PoolListFragmentFragment,
  key: string,
}

function PoolInfo({
                    pool: {
                      master: {ref: masterId},
                      ref,
                      nameLabel,
                      nameDescription,
                    }
                  }: Props) {
  /*  return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">{ description }</h3>
        </div>
        <div className="panel-body">
          <div className="row">
            { hosts.map((host, idx) => <HostInfo key={idx} host={host} />) }
          </div>
          <dl className="dl-horizontal">
            <dt><FormattedMessage {...messages.hddPromt} /></dt>
            <dd><FormattedNumber value={hdd} /> GB</dd>
          </dl>
        </div>
      </div>
    ); */
  const {data: {hosts}} = useHostListQuery();


  useHostListUpdateSubscription({
    onSubscriptionData({client, subscriptionData}) {
      const change = subscriptionData.data.hosts;
      handleAddRemove(client, HostListDocument, 'hosts', change);
    },

  });
  return (
    <Card>
      <CardHeader>
        <h3><CardTitle>{nameLabel || "Unnamed pool"}</CardTitle></h3>
        <h4><CardSubtitle>{nameDescription}</CardSubtitle></h4>

      </CardHeader>

      <Row>
        {hosts.map(host => <HostInfo key={host.ref} host={host}/>)}
      </Row>

      <CardFooter>
      </CardFooter>
    </Card>
  );
}


export default PoolInfo;

import React, {Fragment, useMemo} from 'react';
import {Button, Card, CardBody, CardFooter, CardSubtitle, CardText, CardTitle, Col, Label, Row} from 'reactstrap';
import FullHeightCard from '../../../components/FullHeightCard';
import {VM_STATE_RUNNING} from "../../../containers/App/constants";
import {FormattedMessage} from 'react-intl';
import messages from '../messages';
import Playbooks from "../../../containers/Playbooks";
import {
  DomainType,
  PowerState,
  ShutdownForce, useRebootVmMutation, useShutdownVMMutation, useStartVMMutation, useVMEditOptionsMutation,
  VMActions, VMInfoFragmentFragment,
} from "../../../generated-models";


import ActionButton from "../../../components/ActionButton";

interface Props {
  vm: VMInfoFragmentFragment
}

const Overview = ({vm}: Props) => {

  const current_date = new Date();
  const start_date = new Date(vm.startTime);

  let uptime_text: string;

  switch (vm.powerState) {
    case VM_STATE_RUNNING:
      uptime_text = "I'm up since " + start_date.toLocaleString() + ".";
      break;
    default:
      uptime_text = "I'm " + vm.powerState.toLowerCase() + ".";
  }

  const onReboot = useRebootVmMutation({
    variables: {
      ref: vm.ref,
      /*force*/ force: ShutdownForce.HARD,
    }
  });

  const onShutdown = useShutdownVMMutation({
    variables: {
      ref: vm.ref,
      force: ShutdownForce.HARD,
    }
  });

  const onChangeDomainType = useVMEditOptionsMutation({
    variables: {
      vm: {
        domainType: vm.domainType === DomainType.HVM ? DomainType.PV : DomainType.HVM,
      },
      ref: vm.ref
    }
  });

  const changeDomainTypeText = useMemo(() => {
    return `Switch to ${vm.domainType === DomainType.HVM ? "PV" : "HVM"}`;
  }, [vm.domainType]);


  const onStart = useStartVMMutation({
    variables: {
      ref: vm.ref,
    }
  });


  return (
    <Fragment>
      <Row>
        <Col sm={6}>
          <FullHeightCard>
            <CardBody>
              <CardTitle>Power status</CardTitle>
              <CardText>{uptime_text} (X days Y hours Z minutes W seconds)
                <br/>
              </CardText>
            </CardBody>
            <CardFooter>
              <div>
                {vm.powerState !== PowerState.Halted && (

                  <ActionButton size="lg"
                                color="danger"
                                onClick={() => onReboot()}
                                action={VMActions.hard_reboot}
                                data={vm}
                                id="button-hard-reboot">
                    Reboot
                  </ActionButton>
                )
                }
                {' '}
                {(vm.powerState !== 'Halted') ? (
                  <ActionButton size="lg"
                                id="button-hard-shutdown"
                                color="primary"
                                onClick={() => onShutdown()}
                                action={VMActions.hard_shutdown}
                                data={vm}

                  >
                    <FormattedMessage {...messages.halt}/>
                  </ActionButton>
                ) : (
                  <ActionButton size="lg"
                                id="button-start"
                                color="primary"
                                onClick={() => onStart()}
                                action={VMActions.start}
                                data={vm}
                  >
                    <FormattedMessage {...messages.turnon}/>
                  </ActionButton>
                )}
              </div>
            </CardFooter>
          </FullHeightCard>
        </Col>
        <Col sm={6}>
          {vm.VIFs && (vm.VIFs.length > 0 && (
              <Fragment>
                {
                  vm.VIFs.map((value, index) => {
                    const ip = value.ip;
                    const ipv6 = value.ipv6;
                    return (<Card key={index}>
                      <CardBody>
                        <CardTitle>
                          {value.network && (
                            <Fragment>
                              Network{` "${value.network.nameLabel}"`}
                            </Fragment>
                          ) || (
                            <Fragment>
                              Unknown network
                            </Fragment>
                          )}
                        </CardTitle>
                        <CardText>
                          {ip && (<Fragment>
                            <Label> <b>IP</b>: {ip}</Label><br/>
                          </Fragment>)}
                          {ipv6 && (<Label> <b>IPv6</b>: {ipv6}</Label>)}
                          {(!ip && !ipv6) && (<Label><h6>No data</h6></Label>)}
                        </CardText>
                      </CardBody>
                    </Card>)

                  })
                }
              </Fragment>
            ) || (
              <h3>Connect your VM to a network to access it </h3>)
          ) || (
            <h3>No authorization to view network information</h3>
          )
          }
        </Col>
      </Row>
      <Row>
        <Col sm={6}>
          <FullHeightCard>
            <CardBody>
              <CardTitle>Virtualization mode</CardTitle>
              {vm.powerState !== 'Halted' && (
                <CardSubtitle>Halt to switch mode</CardSubtitle>)}

              <CardText><h4>{vm.domainType.toUpperCase()}</h4></CardText>
            </CardBody>
            <CardFooter>
              <Button
                disabled={vm.powerState !== PowerState.Halted}
                size="lg"
                color="info"
                onClick={async () => await onChangeDomainType()}
              >
                {changeDomainTypeText}
              </Button>
            </CardFooter>
          </FullHeightCard>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <CardBody>
              <CardTitle>
                Boot parameters
              </CardTitle>
              <CardText>
              </CardText>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Playbooks
            vms={[vm.ref]}/>
        </Col>
      </Row>
    </Fragment>

  );
};

export default Overview;

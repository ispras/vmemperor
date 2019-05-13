import React, {Fragment} from 'react';
import {Card, CardBody, CardFooter, CardSubtitle, CardText, CardTitle, Col, Label, Row} from 'reactstrap';
import FullHeightCard from '../../../components/FullHeightCard';
import {VM_STATE_RUNNING} from "../../../containers/App/constants";
import {FormattedMessage} from 'react-intl';
import messages from '../messages';
import Playbooks from "../../../containers/Playbooks";
import moment from 'moment';
import {
  PowerState,
  ShutdownForce,
  useRebootVmMutation,
  useShutdownVMMutation,
  useStartVMMutation,
  VMActions,
  VMInfoFragmentFragment,
} from "../../../generated-models";


import ActionButton from "../../../components/ActionButton";
import {useApolloClient} from "react-apollo-hooks";
import {showTaskNotification} from "../../Toast/task";

interface Props {
  vm: VMInfoFragmentFragment
}

const Overview = ({vm}: Props) => {
  const startMoment = moment(vm.startTime);
  const client = useApolloClient();
  let uptime_text: string;

  switch (vm.powerState) {
    case VM_STATE_RUNNING:
      uptime_text = `I'm up since ${startMoment.format("L LTS")} (${startMoment.fromNow(true)})`
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


  const onStart = useStartVMMutation({
    variables: {
      ref: vm.ref,
    }
  });

  const onHardRebootClick = async () => {
    const {data, errors} = await onReboot();
    showTaskNotification(client, `Hard rebooting VM "${vm.nameLabel}"`, data.vmReboot);

  };

  const onHardShutdownClick = async () => {
    const {data, errors} = await onShutdown();
    showTaskNotification(client, `Hard halting VM "${vm.nameLabel}"`, data.vmShutdown);
  };

  const onStartClick = async () => {
    const {data, errors} = await onStart();
    showTaskNotification(client, `Starting VM "${vm.nameLabel}"`, data.vmStart);
  };
  return (
    <Fragment>
      <Row>
        <Col sm={6}>
          <FullHeightCard>
            <CardBody>
              <CardTitle>Power status</CardTitle>
              <CardText>{uptime_text}
                <br/>
              </CardText>
            </CardBody>
            <CardFooter>
              <div>
                {vm.powerState !== PowerState.Halted && (

                  <ActionButton size="lg"
                                color="danger"
                                onClick={onHardRebootClick}
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
                                onClick={onHardShutdownClick}
                                action={VMActions.hard_shutdown}
                                data={vm}

                  >
                    <FormattedMessage {...messages.halt}/>
                  </ActionButton>
                ) : (
                  <ActionButton size="lg"
                                id="button-start"
                                color="primary"
                                onClick={onStartClick}
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
                    const ip = value.ipv4;
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
              <CardSubtitle>Go to Resources to switch mode</CardSubtitle>
              <CardText><h4>{vm.domainType.toUpperCase()}</h4></CardText>
            </CardBody>
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
      {vm.myActions.includes(VMActions.launch_playbook) && (
        <Row>
          <Col>
            <Playbooks
              vms={[vm.ref]}/>
          </Col>
        </Row>
      )}
    </Fragment>

  );
};

export default Overview;

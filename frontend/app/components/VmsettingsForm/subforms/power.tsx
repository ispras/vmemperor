import React, {useCallback, useMemo, Fragment} from 'react';
import {Button, Card, CardBody, CardFooter, CardSubtitle, CardText, CardTitle, Col, Label, Row} from 'reactstrap';
import FullHeightCard from '../../../components/FullHeightCard';
import {VM_STATE_RUNNING} from "../../../containers/App/constants";
import {FormattedMessage} from 'react-intl';
import messages from '../messages';
import Playbooks from "../../../containers/Playbooks";
import {
  DomainType,
  PowerState,
  RebootVm,
  ShutdownForce,
  ShutdownVm,
  StartVm,
  VmEditOptions,
  VmInfo
} from "../../../generated-models";
import {useMutation} from "react-apollo-hooks";
import Vm = VmInfo.Vm;


interface Props {
  vm: Vm
}

const Power = ({vm}: Props) => {

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

  const onReboot = useMutation<RebootVm.Mutation, RebootVm.Variables>(RebootVm.Document, {
    variables: {
      ref: vm.ref,
      /*force*/ force: ShutdownForce.Hard,
    }
  });

  const onShutdown = useMutation<ShutdownVm.Mutation, ShutdownVm.Variables>(ShutdownVm.Document, {
    variables: {
      ref: vm.ref,
      force: ShutdownForce.Hard,
    }
  });

  const onChangeDomainType = useMutation<VmEditOptions.Mutation, VmEditOptions.Variables>(VmEditOptions.Document, {
    variables: {
      vm: {
        ref: vm.ref,
        domainType: vm.domainType === DomainType.Hvm ? DomainType.Pv : DomainType.Hvm,
      }
    }
  });

  const changeDomainTypeText = useMemo(() => {
    return `Switch to ${vm.domainType === DomainType.Hvm ? "PV" : "HVM"}`;
  }, [vm.domainType]);


  const onStart = useMutation<StartVm.Mutation, StartVm.Variables>(StartVm.Document, {
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

                  <Button size="lg" color="danger" onClick={() => onReboot()}>
                    Reboot
                  </Button>
                )
                }
                {' '}
                {(vm.powerState !== 'Halted') ? (
                  <Button size="lg" color="primary" onClick={() => onShutdown()}>
                    <FormattedMessage {...messages.halt}/>
                  </Button>
                ) : (
                  <Button size="lg" color="primary" onClick={() => onStart()}>
                    <FormattedMessage {...messages.turnon}/>
                  </Button>
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
                          {ip && (<React.Fragment>
                            <Label> <b>IP</b>: {ip}</Label><br/>
                          </React.Fragment>)}
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

export default Power;

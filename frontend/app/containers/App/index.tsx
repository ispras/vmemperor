import React from 'react';
import {Switch, Route} from 'react-router-dom';

import HomePage from '../../containers/HomePage/Loadable';
import NotFoundPage from '../../containers/NotFoundPage/Loadable';
import Navbar from "../../components/Navbar";
import PrivateRoute from '../../containers/PrivateRoute';
import VMs from '../VMList';
import LoginPage from '../../containers/LoginPage/Loadable';
import CreateVM from "../CreateVM";
import Logout from '../../containers/Logout/Loadable';
import TemplateSettings from '../../containers/TemplateSettings';
import VMSettings from "../VMSettings";
import * as Sentry from '@sentry/browser';
import Templates from "../TemplateList";
import Networks from "../NetworkList";

import styled from "styled-components";
import {GlobalStyle} from '../../global-styles';
import reducer from "./reducer";
import {compose} from "redux";
import NetworkSettings from "../NetworkSettings";
import ISOs from "../ISOList";
import VDIs from "../VDIList";
import VDISettings from "../VDISettings";


interface State {
  error?: Error
}

class App extends React.Component<{}, State> {
  constructor(props) {
    super(props);
    this.state = {error: null};
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({error});
    Sentry.withScope(scope => {
      Object.keys(errorInfo).forEach(key => {
        scope.setExtra(key, errorInfo[key]);
      });
      Sentry.captureException(error);
    })
  }

  render() {
    if (this.state.error) {
      return (
        <a onClick={() => Sentry.showReportDialog()}>Report feedback</a>
      );
    }
    const AppWrapper = styled.div`
  margin: 0 auto;
  background-color: #fafafafa;
  display: flex;
  min-height: 100%;
  padding: 0 16px;
  flex-direction: column;
`;
    return (
      <AppWrapper>
        <Navbar/>
        <Switch>
          <Route exact path="/" component={HomePage}/>
          <Route path="/login" component={LoginPage}/>
          <PrivateRoute path="/vms" component={VMs}/>
          <PrivateRoute path="/templates" component={Templates}/>
          <PrivateRoute path="/template/:ref" component={TemplateSettings}/>
          <PrivateRoute path="/vm/:ref" component={VMSettings}/>
          <PrivateRoute path="/create-vm" component={CreateVM}/>
          <PrivateRoute path="/logout" component={Logout}/>
          {/*<PrivateRoute path="/desktop/:ref" component={VncView}/>*/}
          <PrivateRoute path="/networks" component={Networks}/>
          <PrivateRoute path="/network/:ref" component={NetworkSettings}/>
          <PrivateRoute path="/isos" component={ISOs}/>
          <PrivateRoute path="/vdis" component={VDIs}/>
          <PrivateRoute path="/vdi/:ref" component={VDISettings}/>
          <Route component={NotFoundPage}/>
        </Switch>
        <GlobalStyle/>
      </AppWrapper>
    );
  }
}

export default App;

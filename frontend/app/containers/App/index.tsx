/**
 *
 * App.js
 *
 * This queryComponent is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 * NOTE: while this queryComponent should technically be a stateless functional
 * queryComponent (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */


import React from 'react';
import {Switch, Route} from 'react-router-dom';
//import { ToastContainer } from 'react-toastify';

import HomePage from '../../containers/HomePage/Loadable';
import NotFoundPage from '../../containers/NotFoundPage/Loadable';
import Navbar from "../../components/Navbar";
import PrivateRoute from '../../containers/PrivateRoute';
import VMs from '../VMList';
import LoginPage from '../../containers/LoginPage/Loadable';
import CreateVM from "../CreateVM";
import Logout from '../../containers/Logout/Loadable';


import {compose} from 'redux';
import injectReducer from '../../utils/injectReducer';
import reducer from './reducer';
import VMSettings from "../Vmsettings";
import {AccessController} from "../AccessController";

import * as Sentry from '@sentry/browser';
import Templates from "../TemplateList";
import styled from "styled-components";
import {GlobalStyle} from '../../global-styles';


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
  background-color: #fafafafa
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
          <PrivateRoute path="/vmsettings/:ref" component={VMSettings}/>
          <PrivateRoute path="/create-vm" component={CreateVM}/>
          <PrivateRoute path="/logout" component={Logout}/>
          {/*<PrivateRoute path="/desktop/:ref" component={VncView}/>*/}
          <PrivateRoute path="/resources" component={AccessController}/>
          <Route component={NotFoundPage}/>
        </Switch>
        <GlobalStyle/>
      </AppWrapper>
    );
  }
}

const withReducer = injectReducer({key: 'app', reducer});

export default compose(
  withReducer,
)(App);

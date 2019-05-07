/**
 *
 * Navbar
 *
 */
import React from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

import NavLink from "../../components/NavLink";
import {BrowserRouter, NavLink as RouterNavLink} from "react-router-dom";
import {FormattedMessage} from 'react-intl';
import messages from "./messages";

class MyNavbar extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
      leftLinks: [
        {to: "/vms", text: {...messages.vms}},
        {to: "/templates", text: {...messages.templates}},
        {to: "/create-vm", text: {...messages.createvm}},
        {to: "/quota", text: {...messages.quota}},
        {to: "/history", text: {...messages.history}},
        {to: "/networks", text: {...messages.networks}},
        {to: "/vdis", text: {...messages.vdis}},
        {to: "/isos", text: {...messages.isos}},
        {to: "/srs", text: {...messages.srs}},
        {to: "/pool", text: {...messages.pool}}
      ],
      rightLinks: [{to: "/logout", text: {...messages.logout}}]
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    return (
      <div>
        <Navbar color="light" expand="sm" light>
          <NavbarBrand tag={RouterNavLink} to={'/'}>
            VMEmperor
          </NavbarBrand>

          <NavbarToggler onClick={this.toggle}/>
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="mr-auto" navbar>
              {this.state.leftLinks.map(({to, text}) => {
                return (
                  <NavItem key={to}>
                    <NavLink to={to}><FormattedMessage {...text}/></NavLink>
                  </NavItem>
                );
              })}
            </Nav>
            <Nav navbar>
              {this.state.rightLinks.map(({to, text}) => {
                return (
                  <NavItem key={to}>
                    <NavLink to={to}><FormattedMessage {...text}/></NavLink>
                  </NavItem>
                );
              })}
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

export default MyNavbar;

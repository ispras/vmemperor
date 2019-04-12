/**
 *
 * NavLink
 * This enables use of reactstrap with react-router
 We will use react-router-dom.NavLink as tag for reactstrap's NavLink
 See also: https://github.com/reactstrap/reactstrap/issues/83#issue-168537815

 */

import React, {ReactNode} from 'react';
import {LinkProps, NavLink as RouterNavLink} from 'react-router-dom';
import {NavLink as ReactstrapNavLink} from 'reactstrap';

interface Props {
  to: LinkProps['to'];
  children: ReactNode;
}

const NavLink: React.FunctionComponent<Props> = props => (
  <ReactstrapNavLink tag={RouterNavLink} to={props.to} activeClassName='active'>
    {props.children}
  </ReactstrapNavLink>
);

export default NavLink;

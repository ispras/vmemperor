/**
 *
 * VmSettings
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {FormattedMessage} from 'react-intl';
import {createStructuredSelector} from 'reselect';
import {compose} from 'redux';

import injectSaga from '../../utils/injectSaga';
import injectReducer from '../../utils/injectReducer';
import makeSelectVmsettings from './selectors';
import reducer from './reducer';
import messages from './messages';

import {VmInfo, VmInfoUpdate} from "../../generated-models";
import VmsettingsForm from "../../components/VmsettingsForm";

import {RouteComponentProps} from "react-router";
import {useQuery} from "react-apollo-hooks";
import {useSubscription} from "../../hooks/subscription";

interface RouterProps { //These props refer to page argument: see router.
  ref: string //VM REF
}

type Props = RouteComponentProps<RouterProps>;

const VmSettings = ({match: {params: {ref}}}: Props) => {
  const {data: {vm}} = useQuery<VmInfo.Query, VmInfo.Variables>(VmInfo.Document,
    {
      variables: {
        ref,
      }
    });
  useSubscription<VmInfoUpdate.Subscription>(VmInfoUpdate.Document,
    {
      variables: {
        ref,
      }
    }); //Memoization inside
  return <VmsettingsForm vm={vm}/>;
};

export default VmSettings;

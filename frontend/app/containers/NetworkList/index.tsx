/**
 * Remember to put every new local query in app.tsx initialization, so that
 * it could be initialized with empty local state
 */
import StatefulTable, {ColumnType} from "../StatefulTable";
import {
  Change,
  NetworkListDocument,
  NetworkListFragmentFragment,
  NetworkTableSelectAllDocument,
  NetworkTableSelectDocument,
  NetworkTableSelectionDocument,
  useNetworkListQuery,
  useNetworkListUpdateSubscription, useTemplateListQuery
} from "../../generated-models";
import {nameFormatter} from "../../utils/formatters";
import filterFactory, {textFilter} from 'react-bootstrap-table2-filter';
import {RouteComponentProps} from "react-router";
import {handleAddRemove} from "../../utils/cacheUtils";
import * as React from "react";
import {Fragment, useCallback} from 'react';

type NetworkColumnType = ColumnType<NetworkListFragmentFragment>;

const columns: NetworkColumnType[] = [
  {
    dataField: "nameLabel",
    text: "Name",
    filter: textFilter(),
    headerFormatter: nameFormatter,
    headerClasses: 'align-self-baseline'
  }
];

const Networks: React.FunctionComponent<RouteComponentProps> = ({history}) => {
  const {data: {networks}} = useNetworkListQuery();

  useNetworkListUpdateSubscription({
    onSubscriptionData({client, subscriptionData}) {
      const change = subscriptionData.data.networks;
      switch (change.changeType) {
        case Change.Add:
        case Change.Remove:
          handleAddRemove(client, NetworkListDocument, 'networks', change);
          break;
        case Change.Change:
          //If any internal state update is needed, go here
          break;
      }
    }
  });

  const onDoubleClick = useCallback((e: React.MouseEvent, row: NetworkListFragmentFragment, index) => {
    e.preventDefault();
    history.push(`/network/${row.ref}`);
  }, [history]);
  return (
    <Fragment>
      <StatefulTable
        keyField="ref"
        data={networks}
        tableSelectOne={NetworkTableSelectDocument}
        tableSelectMany={NetworkTableSelectAllDocument}
        tableSelectionQuery={NetworkTableSelectionDocument}
        columns={columns}
        onDoubleClick={onDoubleClick}
        props={{
          striped: true,
          hover: true,
          filter: filterFactory(),
        }}
      />
    </Fragment>
  );


};

export default Networks;

/**
 * Remember to put every new local query in app.tsx initialization, so that
 * it could be initialized with empty local state
 */
import StatefulTable, {ColumnType} from "../StatefulTable";
import {
  Change,
  ISOListDocument,
  ISOListFragmentFragment,
  ISOTableSelectAllDocument,
  ISOTableSelectDocument,
  ISOTableSelectionDocument,
  useISOListQuery,
  useISOListUpdateSubscription,
} from "../../generated-models";
import {nameFormatter} from "../../utils/formatters";
import filterFactory, {textFilter} from 'react-bootstrap-table2-filter';
import {RouteComponentProps} from "react-router";
import {handleAddRemove} from "../../utils/cacheUtils";
import * as React from "react";
import {Fragment, useCallback} from 'react';

type ISOColumnType = ColumnType<ISOListFragmentFragment>;

const columns: ISOColumnType[] = [
  {
    dataField: "nameLabel",
    text: "Name",
    filter: textFilter(),
    headerFormatter: nameFormatter,
    headerClasses: 'align-self-baseline'
  }
];

const ISOs: React.FunctionComponent<RouteComponentProps> = ({history}) => {
  const {data: {vdis}} = useISOListQuery();

  useISOListUpdateSubscription({
    onSubscriptionData({client, subscriptionData}) {
      const change = subscriptionData.data.vdis;
      switch (change.changeType) {
        case Change.Add:
        case Change.Remove:
          handleAddRemove(client, ISOListDocument, 'vdis', change);
          break;
        case Change.Change:
          //If any internal state update is needed, go here
          break;
      }
    }
  });

  const onDoubleClick = useCallback((e: React.MouseEvent, row: ISOListFragmentFragment, index) => {
    e.preventDefault();
    history.push(`/vdi/${row.ref}`);
  }, [history]);
  return (
    <Fragment>
      <StatefulTable
        keyField="ref"
        data={vdis}
        tableSelectOne={ISOTableSelectDocument}
        tableSelectMany={ISOTableSelectAllDocument}
        tableSelectionQuery={ISOTableSelectionDocument}
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

export default ISOs;

import * as React from 'react';
import {RouteComponentProps} from "react-router";
import StatefulTable, {ColumnType} from "../StatefulTable";
import filterFactory, {textFilter} from 'react-bootstrap-table2-filter'
import {useQuery} from "react-apollo-hooks";
import {
  CurrentUser,
  TemplateList, TemplateListFragment,
  TemplateTableSelect,
  TemplateTableSelectAll,
  TemplateTableSelection
} from "../../generated-models";
import {checkBoxFormatter, nameFormatter} from "../../utils/formatters";
import {Fragment} from "react";
import {Button, ButtonToolbar} from "reactstrap";
import {Set} from 'immutable';

type TemplateColumnType = ColumnType<TemplateListFragment.Fragment>;

const columns: TemplateColumnType[] = [
  {
    dataField: "nameLabel",
    text: 'Name',
    filter: textFilter(),
    headerFormatter: nameFormatter,
    headerClasses: 'align-self-baseline'
  },
  {
    dataField: "enabled",
    text: 'Enabled',
    formatter: checkBoxFormatter,
  },
  {
    dataField: "osKind",
    text: "Auto-install type",
  },

];

interface State {
  selectedForEnabling: Set<String>;
  selectedForDisabling: Set<String>;
  selectedForTrash: Set<String>;
}

const TemplateListComponent: React.FunctionComponent<RouteComponentProps> = ({history}) => {
  const {data: {templates}} = useQuery<TemplateList.Query>(TemplateList.Document);
  const {data: {currentUser}} = useQuery<CurrentUser.Query>(CurrentUser.Document);


  return (
    <Fragment>
      {currentUser.isAdmin && (
        <ButtonToolbar>

        </ButtonToolbar>
      )}
      <StatefulTable
        keyField="ref"
        data={templates}
        tableSelectOne={TemplateTableSelect.Document}
        tableSelectMany={TemplateTableSelectAll.Document}
        tableSelectionQuery={TemplateTableSelection.Document}
        columns={columns}/>
    </Fragment>
  );

};

export default TemplateListComponent;

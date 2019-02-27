import React, {useEffect} from 'react';
import {FormattedMessage} from 'react-intl';
import BootstrapTable from 'react-bootstrap-table-next';

import messages from './messages';
import {
  Query,
  Mutation,
  MutationFn,
  graphql,
  ChildDataProps,
  NamedProps,
  QueryProps,
  MutationProps
} from 'react-apollo';
import {useMutation, useQuery} from "react-apollo-hooks";
import {DocumentNode, ExecutionResult} from "graphql";
import {RefetchQueryDescription} from "apollo-client/core/watchQueryOptions";


interface HeaderFormatterComponents {
  sortElement?: JSX.Element;
  filterElement?: JSX.Element;

}

export interface ColumnType<T> {
  dataField: keyof T,
  text: string;
  sort?: boolean;
  formatter?: (cell: T[keyof T], row: T) => JSX.Element | string;
  headerFormatter?: (column: ColumnType<T>, colIndex: number, components: HeaderFormatterComponents) => JSX.Element | string;
  filter?: object;
  headerClasses?: ((column: ColumnType<T>, colIndex: number) => string) | string;
}

export type SelectOneVariablesArgs = {
  item: string;
  isSelect: boolean;
}
export type SelectManyVariablesArgs = {
  items: string[];
  isSelect: boolean;
}

export interface SelectionResponse {
  selectedItems: string[];
}

export type TableSelectOneMutation = React.ComponentType<Partial<MutationProps<any, SelectOneVariablesArgs>>>;

export type TableSelectManyMutation = React.ComponentType<Partial<MutationProps<any, SelectManyVariablesArgs>>>


interface Props<T> {
  keyField: keyof T; //what field to use as key. Key of type KeyType
  data: T[]; //Data provided to table
  tableSelectOne: DocumentNode;
  tableSelectMany: DocumentNode;
  tableSelectionQuery: DocumentNode;
  columns: ColumnType<T>[];
  props?: any;
  onDoubleClick?: (e: React.MouseEvent, row: T, rowIndex: number) => any;
  refetchQueriesOnSelect?: ((result: ExecutionResult) => RefetchQueryDescription) | RefetchQueryDescription;
  onSelect?: (key: string, isSelect: boolean) => any;
  nonSelectable?: string[],
}

export default function StatefulTable<T>(
  {
    tableSelectOne,
    tableSelectMany,
    tableSelectionQuery,
    keyField,
    data,
    columns,
    props,
    onDoubleClick,
    onSelect: executeOnSelect,
    refetchQueriesOnSelect: refetchQueries,
    nonSelectable,
  }: Props<T>) {
  const selectOne = useMutation<SelectionResponse, SelectOneVariablesArgs>(
    tableSelectOne
  );
  const selectMany = useMutation<SelectionResponse, SelectManyVariablesArgs>(
    tableSelectMany
  );

  const onSelectItem = (item, isSelect) => {
    selectOne({
      variables:
        {
          isSelect,
          item
        },
      refetchQueries
    });

    executeOnSelect && executeOnSelect(item, isSelect);
  };


  const onSelect = (row, isSelect) => {
    onSelectItem(row[keyField], isSelect);
  };


  const onSelectAll = (isSelect, rows) => {
    const items = rows.map(row => row[keyField]);
    selectMany({
      variables: {
        isSelect,
        items,
      },
      refetchQueries
    });
    for (const key of items) {
      executeOnSelect && executeOnSelect(key, isSelect);
    }
  };

  const {data: {selectedItems}} = useQuery<SelectionResponse>(tableSelectionQuery);


  useEffect(() => // Remove items that are no longer in data but selected
    {

      selectedItems
      // @ts-ignore
        .filter(key => !data.map(row => row[keyField]).includes(key))
        .forEach((key) =>
          onSelectItem(key, false)
        );

    },
    [data]); //Run only when data is changed

  const selectRow = {
    mode: 'checkbox',
    clickToSelect: false,
    bgColor: 'aqua',
    selected: selectedItems,
    onSelect,
    onSelectAll,
    nonSelectable
  };

  const rowEvents = {
    onDoubleClick
  };

  return (<BootstrapTable
    bootstrap4
    columns={columns}
    data={data}
    rowEvents={rowEvents}
    selectRow={selectRow}
    keyField={keyField}
    {...props} />);


}

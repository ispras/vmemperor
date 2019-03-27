/**
*
* ItemedTable
*
*/

import React from 'react';
import T from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { filterItems } from 'utils/filter';
import styled from 'styled-components';
import SortImg from './components/SortImg';

const FilterInput = styled.input`
  padding: 1px;
  border: solid 1px #DCDCDC;
  transition: box-shadow 0.3s, border 0.3s;
  
  &:focus {
    border: solid 1px #707070;
    box-shadow: 0 0 5px 1px #969696;
  }
`;


const clickWrapper = func => column => {
  if (func) {
    return event => {
      event.preventDefault();
      event.stopPropagation();
      func(column, event.target.value);
    };
  }
  return null;
};
/*
function sortClass(column, sort) {
  const ascOrDesc = sort.order === 'asc' ? styles.headerSortAsc : styles.headerSortDesc;
  return sort.column === column ? ascOrDesc : '';
}
*/

const PlainTableHeader = ({ className, column, children }) => {
  return (
    <th className={className} key={column}>
      {children}
    </th>
  );
};

const SortedTableHeader = styled(PlainTableHeader).attrs({ className: "header" })`
  color: #333;
  background: #f5f5f5;
`;

const TableHeader = ({column, sort, children}) =>
{
  return sort && sort.column === column ?
    <SortedTableHeader> {children} </SortedTableHeader>
    : <PlainTableHeader> {children} </PlainTableHeader>
};

TableHeader.propTypes = {
  column: T.any.isRequired,
  sort: T.any,
};


function sortFunction(first, second, { order, column }) {
  const multiplier = order === 'asc' ? 1 : -1;
  const firstVal = (first[column]() || '').toLowerCase();
  const secondVal = (second[column]() || '').toLowerCase();
  if (firstVal === secondVal) {
    return 0;
  }
  return firstVal < secondVal ? multiplier * -1 : multiplier;
}

class ItemedTable extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    list: T.any.isRequired,
    filters: T.any.isRequired,
    sort: T.any,
    onFilter: T.oneOfType([
      T.func, T.bool,
    ]).isRequired,
    onSort: T.oneOfType([
      T.func, T.bool,
    ]).isRequired,
    itemActions: T.object.isRequired,
    itemMessages: T.object.isRequired,
    ItemComponent: T.any.isRequired,
  };

  static defaultProps = {
    onFilter: false,
    onSort: false,
    sort: false,
  };


  render() {
    const columnNames = Object.keys(this.props.filters);
    const wrappedOnFilter = clickWrapper(this.props.onFilter);
    const wrappedOnSort = clickWrapper(this.props.onSort);
    const { ItemComponent, itemMessages } = this.props;

    const header = columnNames.map(column =>
     <TableHeader column={column} sort={this.props.sort} onClick={wrappedOnSort(column)}> */
        <FormattedMessage {...itemMessages[column]} />
        {
          this.props.sort ?
            <SortImg isCurrent={this.props.sort.column === column} order={this.props.sort.order} /> :
            null
        }
     </TableHeader>
    );

    const filterInputs = this.props.onFilter ?
      columnNames.map(column =>
        <td key={column}>
          <FilterInput type="text" value={this.props.filters[column]} onChange={wrappedOnFilter(column)} />
        </td>
      ) : null;

    const sortedRows = this.props.sort ?
      filterItems(this.props.list, this.props.filters).sort((a, b) => sortFunction(a, b, this.props.sort)) :
      filterItems(this.props.list, this.props.filters);
    const rows = sortedRows.map((item, idx) =>
      <ItemComponent key={item.key ? item.key() : idx} item={item} actions={this.props.itemActions} />);

    return (
      <table className="table table-hover">
        <thead>
        <tr>
          { header }
          <th><FormattedMessage {...itemMessages.actions} /></th>
        </tr>
        <tr>
          { filterInputs }
        </tr>
        </thead>
        <tbody>
        { rows }
        </tbody>
      </table>
    );
  }
}

export default ItemedTable;

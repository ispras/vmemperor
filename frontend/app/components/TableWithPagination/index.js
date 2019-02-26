import React, {PureComponent} from 'react';
import  NextTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import T from 'prop-types';

import {ButtonGroup, Button} from 'reactstrap';


export default class TableWithPagination extends PureComponent
{
  static propTypes =
    {
      fetcher: T.func.isRequired,
      noData: T.func,
      data: T.array,
      sizePerPage: T.number.isRequired,
      columns: T.arrayOf(
        T.shape({
          dataField: T.string.isRequired,
          text: T.string.isRequired,
          formatter: T.func,
        })
      ),
      rowFilter: T.func,
      caption: T.any,
      actions: T.arrayOf(
        T.shape({
          text: T.string.isRequired,
          color: T.string.isRequired,
          type: T.oneOf(['always', 'selection']),
          handler: T.func.isRequired,
        })
      ),
      onDoubleClick: T.func.isRequired,
      localOptions: T.any.isRequired,
      refresh: T.any,
    };
  constructor(props)
  {
    super(props);
    this.state =
      {
        items: [],
        page: 1,
        selected: [],
        refresh: null,
      };
    this.fetch = this.fetch.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleSizePerPageChange = this.handleSizePerPageChange.bind(this);
    this.handleOnSelect = this.handleOnSelect.bind(this);
    this.handleOnSelectAll = this.handleOnSelectAll(this);
    this.fetchHandler = this.fetchHandler.bind(this);
  }


  fetchHandler (data) {
  this.setState({
    items:
      this.props.rowFilter ? data.filter(this.props.rowFilter) : data,
  });
};

  componentDidUpdate(prevProps)
  {
    if (prevProps.refresh !== this.props.refresh)
    {
      this.fetch();
    }
    if (prevProps.data !== this.props.data)
    {
      this.fetchHandler(this.props.data);
    }
  }


  fetch(page = this.state.page, sizePerPage = this.props.sizePerPage)
  {
    const res = this.props.fetcher(page, sizePerPage);
    if (res && res.then)
    {
      res.then(this.fetchHandler);
    }
    this.setState({
      page, sizePerPage
    })
  }

  componentDidMount()
  {
    this.fetch();
  }

  handleOnSelect (row, isSelect)
  {
    if (isSelect)
    {
      this.setState(() => ({
        selected: [...this.state.selected, row],
      }));
    }
    else {
      this.setState(() => ({
        selected: this.state.selected.filter(x => x !== row),
      }));
    }
  }

  handleOnSelectAll  (isSelect, rows) {
    if (isSelect) {
      this.setState(() => ({
        selected: rows
      }));
    } else {
      this.setState(() => ({
        selected: []
      }));
    }
  }

  handlePageChange(type, {page, sizePerPage}) {
    this.fetch(page,sizePerPage);
  }

  handleSizePerPageChange(sizePerPage) {
    // When changing the size per page always navigating to the first page
    this.fetch(1, sizePerPage);
  }



  render() {
    const { page } = this.state;
    const { sizePerPage } = this.props;
    const totalSize = this.state.items.length;
    const selectRow = {
      mode: 'checkbox',
      clickToSelect: true,
      selected: this.state.selected.map(row => row.ref),
      onSelect: this.handleOnSelect,
      onSelectAll: this.handleOnSelectAll
    };

    const rowEvents = {
      onDoubleClick: (e, row, rowIndex) =>
      {
        this.props.onDoubleClick(row);
        this.fetch();
      }
    };

    return (
      <div>
      <NextTable
        remote
        keyField="ref"
        data={this.state.items}
        columns={this.props.columns}
        pagination={paginationFactory(page, sizePerPage, totalSize)}
        onTableChange={this.handlePageChange}
        caption={this.props.caption}
        noDataIndication={this.props.noData}
        selectRow={selectRow}
        rowEvents={rowEvents}
        />
        {
          this.props.actions && (
            <ButtonGroup>
              {
                this.props.actions.map(action =>
                {
                  let handler = null;
                  let disabled = false;
                  if (action.type === "selection")
                  {
                    handler = () => {
                      const rows = this.state.selected;
                      rows.forEach(row => action.handler(row));
                    };
                    const rows = this.state.selected;
                    if (action.filter)
                    {
                      disabled = rows.filter(action.filter).length === 0;
                    }
                    else {
                      disabled = rows.length === 0;
                    }

                  }
                  else if (action.type === 'always')
                  {
                    handler = action.handler;
                    disabled = false;
                  }



                  return <Button
                    color={action.color}
                    onClick={handler}
                    disabled={disabled}>
                    {action.text}
                  </Button>
                })
              }
            </ButtonGroup>
          )
        }
      </div>
    );
  }
}

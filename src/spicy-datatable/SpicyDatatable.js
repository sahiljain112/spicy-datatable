import React, { Component, PropTypes } from 'react';
import Pagination from './Pagination.js';
import DatatableOptions from './DatatableOptions.js';
import { filterRows } from './utils.js';
import style from './table.css';

const miniCache = {
  searchQuery: '',
};

class SpicyDatatable extends Component {

  static propTypes = {
    columns: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string,
      label: PropTypes.string,
    })).isRequired,
    rows: PropTypes.array,
  };

  constructor(props) {
    super(props);
    this.state = {
      itemsPerPage: miniCache.itemsPerPage || 10,
      currentPage: miniCache.currentPage || 1,
      searchQuery: miniCache.searchQuery || '',
    };
  }

  render() {
    const { itemsPerPage, currentPage, searchQuery } = this.state;
    const { columns, rows: originalRows } = this.props;
    const isFilterActive = searchQuery.length > 0;
    const filteredRows = isFilterActive ? filterRows(originalRows, columns, searchQuery.toLocaleLowerCase()) : originalRows;
    const maxOnPage = currentPage * itemsPerPage;
    const rows = filteredRows.slice((currentPage - 1) * itemsPerPage, maxOnPage);
    const total = isFilterActive ? filteredRows.length : originalRows.length;
    const fromEntries = ((currentPage - 1) * itemsPerPage) + 1;
    const toEntries = maxOnPage > total ? total : maxOnPage;

    return (
      <div>
        <DatatableOptions
          onPageSizeChange={this.handlePageSizeChange.bind(this)}
          onSearch={this.handleSearchQueryChange.bind(this)}
        />
        <table className="spicy-datatable">
          <thead>
            <tr>
              {columns.map(c =>
                <th key={c.key}>
                  {c.label}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) =>
              <tr
                key={i}
                onClick={r.onClickHandler ? r.onClickHandler : () => undefined}
                style={{ cursor: r.onClickHandler ? 'pointer' : 'default' }}
                className={r.isActive ? 'spicy-datatable--selected-row' : ''}
              >
                {columns.map((c, i) =>
                  <td key={i}>
                    {r[c.key]}
                  </td>
                )}
              </tr>
            )}
          </tbody>
        </table>
        <div className="spicy-datatable-counter">
          {total > 0 ?
            <p>Showing {fromEntries} to {toEntries} of {total} entries.</p> : <p>No entries to show.</p>}
        </div>
        <Pagination
          onPage={this.handlePagination.bind(this)}
          itemsPerPage={itemsPerPage}
          total={total}
          activePage={currentPage}
        />
      </div>
    );
  }

  handlePagination(nextPage) {
    this.setState({
      currentPage: nextPage,
    });
    miniCache.currentPage = nextPage;
  }

  handleSearchQueryChange(e) {
    const { value } = e.target;
    this.setState({ searchQuery: value, currentPage: 1 });
    miniCache.searchQuery = value;
    miniCache.currentPage = 1;
  }

  handlePageSizeChange(e) {
    const { value } = e.target;
    this.setState({ itemsPerPage: Number(value), currentPage: 1 });
    miniCache.itemsPerPage = Number(value);
    miniCache.currentPage = 1;
  }
}

export default SpicyDatatable;

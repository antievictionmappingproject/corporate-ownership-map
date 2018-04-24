import React from 'react'
import PropTypes from 'prop-types'
import { Column, Cell, Table } from 'fixed-data-table-2'
import { SortHeaderCell, DataCell } from './Cells'
import ResponsiveTableWrapper from './ResponsiveTableWrapper'

class CompanyTable extends React.Component {
  componentWillMount () {
    this.props.fetchData()
  }

  handleFilterStringChange () {
    return (e) => {
      e.preventDefault()
      this.props.filterBy(e.target.value)
    }
  }

  render () {
    const { isFetching, data, filterString, sortKey, sortDesc } = this.props.table
    const { fetchProperties, sortBy } = this.props
    debugger
    const headerCellProps = { sortBy, sortKey, sortDesc }
    return (
      <div style={{width: '38%',
          position: 'fixed',
          height: '100%',
          top: 0,
          right: 0}}>
        <input className='filter-input' value={filterString}
          onChange={this.handleFilterStringChange()}
          type='search' placeholder='Filter Rows'
          autoCorrect='off' autoCapitalize='off' spellCheck='false' />

        {isFetching && <div className='loader-box' />}
        {!isFetching && data.length === 0 &&
          <h3 className='center'>No Matching Results :( </h3>}

        <Table
          width={600}
          height={1000}
          rowHeight={50}
          headerHeight={50}
          rowsCount={data.length}>
          <Column
            columnKey='owner-address'
            header={<SortHeaderCell {...headerCellProps}> Address </SortHeaderCell>}
            cell={<DataCell data={data} fetchProperties={fetchProperties}/>}
            flexGrow={3}
            width={100} />
          <Column
            columnKey='distinct-company-count'
            header={<SortHeaderCell {...headerCellProps}> Companies </SortHeaderCell>}
            cell={<DataCell data={data} fetchProperties={fetchProperties}/>}
            flexGrow={1}
            width={100} />
          <Column
            columnKey='total-units'
            header={<SortHeaderCell {...headerCellProps}> Units </SortHeaderCell>}
            cell={<DataCell data={data} fetchProperties={fetchProperties}/>}
            flexGrow={0.5}
            width={100} />
        </Table>
      </div>
    )
  }
}

CompanyTable.propTypes = {
  // actions
  fetchData: PropTypes.func.isRequired,
  sortBy: PropTypes.func.isRequired,
  filterBy: PropTypes.func.isRequired,

  // state data
  data: PropTypes.array.isRequired,
  filterString: PropTypes.string.isRequired,
  sortKey: PropTypes.string.isRequired,
  sortDesc: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired
}

export default CompanyTable

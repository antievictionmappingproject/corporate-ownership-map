import React from 'react'
import PropTypes from 'prop-types'
import { Cell } from 'fixed-data-table-2'
import 'fixed-data-table-2/dist/fixed-data-table.css'

// Stateless cell components for Table component
export class SortHeaderCell extends React.Component {
  clickFunc () {
    this.props.sortBy(this.props.columnKey)
  }

  render () {
    let {children, sortKey, sortDesc, columnKey, ...props} = this.props
    return (
      <Cell {...props}>
        <a onClick={this.clickFunc.bind(this)}> {children} {sortKey === columnKey && sortDesc && '⬇️ ' } {sortKey === columnKey && !sortDesc && '⬆️ '}</a>
      </Cell>
    )
  }
}

SortHeaderCell.propTypes = {
  sortBy: PropTypes.func.isRequired,
  sortKey: PropTypes.string.isRequired,
  sortDesc: PropTypes.bool.isRequired,
  columnKey: PropTypes.string,
  children: PropTypes.any
}

export class DataCell extends React.Component {
  clickFunc () {
    let { data, rowIndex, columnKey } = this.props
    this.props.fetchProperties(data[rowIndex][columnKey])
  }

  render () {
    const {data, rowIndex, columnKey, ...props} = this.props
    let displayedData = data[rowIndex][columnKey]
    if (columnKey == 'owner-address') {
      return (
        <Cell {...props}>
          <a onClick={this.clickFunc.bind(this)}> {displayedData} </a>
        </Cell>
      )
    } else {
      return (
        <Cell {...props}> {displayedData} </Cell>
      )
    }
  }
}

DataCell.propTypes = {
  data: PropTypes.array.isRequired,
  rowIndex: PropTypes.number,
  columnKey: PropTypes.string,

  // actions
  fetchProperties: PropTypes.func.isRequired
}

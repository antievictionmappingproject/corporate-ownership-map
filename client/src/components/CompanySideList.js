import React from 'react'
import { Column, Cell } from 'fixed-data-table-2'
import { DataCell } from './Cells'
import ResponsiveTableWrapper from './ResponsiveTableWrapper'

class CompanySideList extends React.Component {
  render () {
    let data = this.props.companyNames
    return (
      <div style={{width: '38%', height: '90%', position: 'fixed', top: 0, right: 0}}>
        <ResponsiveTableWrapper rowHeight={50} headerHeight={50} rowsCount={data.length}>
          <Column
            columnKey='owner-name'
            header={<Cell> Company Names </Cell>}
            cell={<DataCell data={data} />}
            flexGrow={0.5}
            width={1}
          />
        </ResponsiveTableWrapper>
        <div style={{'text-align': 'center'}}>
          <button onClick={this.props.backToTable.bind(this)}>
            Back
          </button>
        </div>
      </div>
    )
  }
}

export default CompanySideList

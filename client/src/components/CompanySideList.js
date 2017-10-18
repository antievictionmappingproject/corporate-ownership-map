import React from 'react'

class CompanySideList extends React.Component {
  render () {
    debugger
    return (
      <div
        style={{width: '25%',
          position: 'fixed',
          height: '100%',
          top: 0,
          right: 0,
          'overflow-y':'auto',
          }}
      >
        <h2> Companies at {this.props.ownerAddress} </h2>
        <ul>
          {this.props.companyNames.map(function(listValue){
            return <li>{listValue['owner-name']}</li>
          })}
        </ul>
        <button onClick={this.props.backToTable.bind(this)}>
        Back
      </button>
      </div>
    )
  }
}

export default CompanySideList

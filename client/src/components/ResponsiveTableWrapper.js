import React from 'react'
import PropTypes from 'prop-types'
import { debounce } from 'lodash'
import { Table } from 'fixed-data-table-2'
// import './ResponsiveTableWrapper.styl'
import 'fixed-data-table-2/dist/fixed-data-table.css'

// Handles all <Table> to make it responsive
class ResponsiveTableWrapper extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      tableWidth: 200,
      tableHeight: 600
    }
  }

  handleResize () {
    this.setState({
      tableWidth: window.innerWidth,
      tableHeight: window.innerHeight
    })
  }

  _attachResizeEvent (func) {
    const win = window

    if (win.addEventListener) {
      win.addEventListener('resize', func, false)
    } else if (win.attachEvent) {
      win.attachEvent('resize', func)
    } else {
      win.onresize = func
    }
  }

  componentDidMount () {
    this.handleResize()
    this.handleResize = debounce(
      this.handleResize,
      this.props.refreshRate
    ).bind(this)
    this._attachResizeEvent(this.handleResize)
  }

  componentWillUnmount () {
    const win = window

    if (win.detachEventListener) {
      win.detachEventListener('resize', this.handleResize, false)
    } else if (win.detachEvent) {
      win.detachEvent('resize', this.handleResize)
    } else {
      win.onresize = null
    }
  }

  render () {
    return <Table
      width={this.state.tableWidth}
      height={this.state.tableHeight}
      {...this.props} />
  }
}

ResponsiveTableWrapper.propTypes = {
  padding: PropTypes.object,
  refreshRate: PropTypes.number
}

ResponsiveTableWrapper.defaultProps = {
  refreshRate: 200, // ms
}

export default ResponsiveTableWrapper

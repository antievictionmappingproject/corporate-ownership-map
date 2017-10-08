import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import MainPage from './MainPage'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

class App extends React.Component {
  /* 
  handleDismissClick () {
    return (e) => {
      e.preventDefault()
      this.props.resetErrorMessage()
    }
  }

  renderErrorMessage () {
    const { errorMessage } = this.props
    if (!errorMessage) return null

    return (
      <p className='error'>
        {errorMessage}
        <span className='close' onClick={this.handleDismissClick()}>
          &#x2718;
        </span>
      </p>
    )
  }
  */
  render () {
    return <BrowserRouter>
      <div>
        <main>
          <Switch>
            <Route path='/' exact component={MainPage} />
          </Switch>
        </main>
      </div>
    </BrowserRouter>
  }
}
/*
App.propTypes = {
  errorMessage: PropTypes.any,
  resetErrorMessage: PropTypes.func
}
*/ 
export default connect(
  //(state) => ({ errorMessage: state.errorMessage }),
  //{ resetErrorMessage: resetErrorMessage }
)(App)

import keymirror from 'keymirror'
import fetch from 'isomorphic-fetch'
import querystring from 'querystring'

export const ACTIONS = keymirror({
  REQUEST_COMPANY_DATA: null,
  RECEIVE_COMPANY_DATA: null,
  FILTER_COMPANY_DATA: null,
  SORT_COMPANY_DATA: null,
  REQUEST_PROPERTY_DATA: null,
  RECEIVE_PROPERTY_DATA: null,
  CLOSE_MODAL: null
/*
  SET_ERROR_MESSAGE: null,
  RESET_ERROR_MESSAGE: null
*/
})

function handleResponse (response) {
  if (response.status >= 200 && response.status < 300) {
    return response.json()
  }
 //throw new Error(formatErrorMessage(response))
}

function formatErrorMessage (res) {
  return `[${res.status}]: ${res.statusText} (${res.url})`
}

// Error action that is dispatched on failed fetch requests
function errorAction (error) {
  return {
    //type: ACTIONS.SET_ERROR_MESSAGE,
    error: true,
    errorMessage: error.message
  }
}

// Generic fetchDispatch utility that dispatches 3 actions:
//  Request, Receive and Error
// @param {object} opts:
//  {
//    url: {string} - url to request
//    types: {
//      request: {string} - constant when fetch begins a request,
//      receive: {string} - constant when fetch has successfully received a request
//    },
//    onReceived: {func(data)} - function to invoke when request has succeeded.
//      It must return a object associated with a successful fetch action.
//      First parameter is the json response. By default, data is return in the object
//      Default success action: {type: opts.types.receive, data: data}
//  }
const apiProps = {
  url: "/data",
  types: {
    request: ACTIONS.REQUEST_COMPANY_DATA,
    receive: ACTIONS.RECEIVE_COMPANY_DATA
  }
}

function fetchPropertyOpts(base, queryParams) {
  return {
    url: base + "?" + querystring.stringify(queryParams),
    types: {
      request: ACTIONS.REQUEST_PROPERTY_DATA,
      receive: ACTIONS.RECEIVE_PROPERTY_DATA
    }
  }
}

function fetchDispatch (opts) {
  return (dispatch) => {
    dispatch({ type: opts.types.request })

  return fetch(opts.url, { headers: opts.headers || {} })
    .then(handleResponse)
    .then((data) => { // Dispatch the recevied action with type and data
      debugger
      const obj = opts.onReceived ? opts.onReceived(data) : { data }
      return dispatch(Object.assign({ type: opts.types.receive }, obj))
    })//.catch((error) => dispatch(errorAction(error)))
  }
}

function shouldFetchData ({table}) {
  return (!table.data || !table.isFetching)
}

function fetchData () {
  return (dispatch, getState) => {
    if (shouldFetchData(getState())) {
      return dispatch(fetchDispatch(apiProps))
    }
  }
}

function sortBy (sortKey) { 
  return {
    type: ACTIONS.SORT_COMPANY_DATA,
    sortKey
  }
}

function filterBy (filterString)  { 
  return {
    type: ACTIONS.FILTER_COMPANY_DATA,
    filterString  
  }
}

function closeModal () {
  return {
    type: ACTIONS.CLOSE_MODAL,
  }
}

function shouldFetchPropertyData ({propertyLookup, isFetchingProperty}) {
  if (!isFetchingProperty) {
    return true
  }
  return false
}

function fetchProperties (propertyLookup) {
  return (dispatch, getState) => {
    if (shouldFetchPropertyData(getState())) {
      return dispatch(fetchDispatch(
        fetchPropertyOpts('/property', {'ownerAddress': propertyLookup})
      ))
    }
  }
}

export default { fetchData, sortBy, filterBy, fetchProperties, closeModal }

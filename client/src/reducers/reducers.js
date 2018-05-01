import { ACTIONS } from '../actions/actions'
import { combineReducers } from 'redux'

function handleAppActions (state = {}, action) {
  switch (action.type) {
    case ACTIONS.REQUEST_PROPERTY_DATA:
      return Object.assign({}, state, {
        isFetchingProperty: true,
        showTable: false
      })
    case ACTIONS.RECEIVE_PROPERTY_DATA:
      return Object.assign({}, state, {
        isFetchingProperty: false,
        buildingLookupAddresses: action.data.buildings,
        companyNames: action.data.owners,
        sidebarOwnerAddress: action.data.ownerAddress
      })
    case ACTIONS.CLOSE_MODAL:
      return Object.assign({}, state, {
        closedModal: true
      })
    case ACTIONS.REQUEST_MAP_DATA:
      return Object.assign({}, state, {
        isFetchingMap: true
      })
    case ACTIONS.RECEIVE_MAP_DATA:
      return Object.assign({}, state, {
        isFetchingMap: false,
        allMapData: action.data
      })
    case ACTIONS.CLICK_PROPERTY:
      return Object.assign({}, state, {
        hasClickedProperty: true,
        clickedProperty: action.data
      })
    case ACTIONS.CLICK_BACK:
      return Object.assign({}, state, {
        showTable: true
      })

    case ACTIONS.SET_ERROR_MESSAGE:
      return Object.assign({}, state, {
        error: true,
      })
    default:
      return state
  }
}

function handleTableActions (state, action) {
  switch (action.type) {
    case ACTIONS.REQUEST_COMPANY_DATA:
      return { isFetching: true }
    case ACTIONS.RECEIVE_COMPANY_DATA:
      return {
        isFetching: false,
        data: action.data.data,
        allData: action.data.data,
        filterString: ''
      }
    case ACTIONS.FILTER_COMPANY_DATA:
      return {
        filterString: action.filterString.toLowerCase(),
        data: filter(state.allData, action.filterString.toLowerCase())
      }
    case ACTIONS.SORT_COMPANY_DATA:
      const sortKey = action.sortKey
      const sortDesc = state.sortKey === action.sortKey ? !state.sortDesc : false
      const sorted = sort(state.allData, sortKey, sortDesc)
      return {
        sortKey,
        sortDesc,
        allData: sorted,
        data: filter(sorted, state.filterString)
      }
    default:
      return state
  }
}

function sort (data, sortKey, sortDesc) {
  const multiplier = sortDesc ? -1 : 1
  return data.sort((a, b) => {
    const aVal = a[sortKey] || 0
    const bVal = b[sortKey] || 0
    return aVal > bVal ? multiplier : (aVal < bVal ? -multiplier : 0)
  })
}

function filter (data, filterString) {
  if (typeof data !== 'undefined' && data.length > 0) {
    return data.filter((d) => {
      return d['owner-address'].toLowerCase().includes(filterString)
    })
  }
}

function tableReducer (state = {}, action) {
  return Object.assign({}, state, handleTableActions(state, action))
}

const rootReducer = combineReducers({
  handleAppActions,
  'table': tableReducer
})

export default rootReducer

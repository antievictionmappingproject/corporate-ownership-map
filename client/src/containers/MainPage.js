import React from 'react'
import CompanyTable from '../components/CompanyTable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../actions/actions'
import Modal from 'react-modal'
import { Map, TileLayer, Marker } from 'react-leaflet'

const stamenTonerTiles = 'http://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}.png'
const stamenTonerAttr = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
const mapCenter = [37.7749, -122.4194]

export class MainPage extends React.Component {
  closeModal () {
    this.props.closeModal()
  }

  render () {
    const { isFetchingProperty, buildingLookupAddresses, closedModal, companyNames } = this.props
    if (!closedModal && !isFetchingProperty && buildingLookupAddresses && buildingLookupAddresses.length > 0){
      return (
      <div>
        <Modal
          isOpen={!closedModal}
          onRequestClose={this.closeModal.bind(this)}
        >
            <div>
              <ul>
                {companyNames.map(function(listValue){
                  return <li>{listValue['owner-name']}</li>
                })}
              </ul>
              <Map
                center={mapCenter}
                zoom={11}
              >
                {buildingLookupAddresses.map(function(building){
                  if (building != null && building.latitude > 0 && building.longitude < 0) {
                    console.log(building.latitude, building.longitude)
                    return <Marker position={[building.latitude, building.longitude]}></Marker>
                  }
                })}
                <TileLayer
                  attribution={stamenTonerAttr}
                  url={stamenTonerTiles}
                />
              </Map>
            </div>
            <button onClick={this.closeModal.bind(this)}>Close Modal</button>
        </Modal>
      </div>
      )
    }
    return (
      <div>
        <h2> LLCs In San Francisco </h2>
        <CompanyTable {...this.props} />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
          table: state.table,
          isFetchingProperty: state.handleAppActions.isFetchingProperty,
          buildingLookupAddresses: state.handleAppActions.buildingLookupAddresses,
          closedModal: state.handleAppActions.closedModal,
          companyNames: state.handleAppActions.companyNames
        })
const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(MainPage)

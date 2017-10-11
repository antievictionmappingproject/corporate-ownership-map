import React from 'react'
import CompanyTable from '../components/CompanyTable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../actions/actions'
import ReactMapboxGl, { Layer, Feature }  from 'react-mapbox-gl'

const mapCenter = [-122.431297, 37.7749]

const Map = ReactMapboxGl({
  accessToken: process.env.REACT_APP_MAPBOX_TOKEN,
})

export class MainPage extends React.Component {
  componentWillMount () {
    this.props.fetchMapData()
  }

  render () {
    let { isFetchingMap, allMapData } = this.props
    let features = []

    if (!isFetchingMap && typeof allMapData !== "undefined") {
      features = allMapData.map((d,i) => {
         return (
          <Feature coordinates={[d.longitude, d.latitude]} key={i}/>
         )
      })
    }
    return (
      <div>
      	<Map
          style="mapbox://styles/mapbox/streets-v9"
          containerStyle={{
            height: "100vh",
            width: "100vw"
          }}
          center={mapCenter}
          >
          <Layer
            type="symbol"
            id="marker"
            layout={{ "icon-image": "marker-15" }}
          >
              {features}
          </Layer>
        </Map>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
          table: state.table,
          isFetchingProperty: state.handleAppActions.isFetchingProperty,
          buildingLookupAddresses: state.handleAppActions.buildingLookupAddresses,
          closedModal: state.handleAppActions.closedModal,
          companyNames: state.handleAppActions.companyNames,
          allMapData: state.handleAppActions.allMapData,
          isFetchingMap: state.handleAppActions.isFetchingMap,
        })
const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(MainPage)

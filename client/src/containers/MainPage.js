import React from 'react'
import CompanyTable from '../components/CompanyTable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../actions/actions'
import ReactMapboxGl, { Layer, Feature }  from 'react-mapbox-gl'
import chroma from 'chroma-js'

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
    let stops = []
    let k = 0
    let paint = {}

    if (!isFetchingMap && typeof allMapData !== "undefined") {
      let scales = chroma.scale(['#fafa6e','#2A4858']).mode('lch').colors(Object.keys(allMapData).length)
      for (const [j, ownerAddress] of Object.entries(allMapData)) {
          let innerStops = [j, scales[k]]
          let f = ownerAddress.map((d, i) => {
            return (
              <Feature coordinates={[d.longitude, d.latitude]} key={i} properties={{'owner-address': j}}/>
            )
          })
          features.push.apply(features, f)
          stops.push(innerStops)
          k++
      }

      paint['circle-radius'] = {
          'base': 1.75,
          'stops': [[12, 2], [22, 180]]
      }
      // color circles by ethnicity, using data-driven styles
      paint['circle-color'] = {
        property: 'owner-address',
        type: "categorical",
        stops: stops,
      }
    }
    return (
      <div class="row">
      	<Map
          style="mapbox://styles/jbcima/cj8mqv1b562ch2rnzsw6l1qkc"
          containerStyle={{
            height: "100vh",
            width: "75vw"
          }}
          center={mapCenter}
          >
          <Layer
            type="circle"
            id="marker"
            paint={paint}
          >
              {features}
          </Layer>
        </Map>
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
          companyNames: state.handleAppActions.companyNames,
          allMapData: state.handleAppActions.allMapData,
          isFetchingMap: state.handleAppActions.isFetchingMap,
        })
const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(MainPage)

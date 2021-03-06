import React from 'react'
import CompanyTable from '../components/CompanyTable'
import CompanySideList from '../components/CompanySideList'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../actions/actions'
import ReactMapboxGl, { Feature, Layer, Popup } from 'react-mapbox-gl'
import chroma from 'chroma-js'

const mapCenter = [-122.431297, 37.7749]

const Map = ReactMapboxGl({
  accessToken: process.env.REACT_APP_MAPBOX_TOKEN
})

export class MainPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      hasLocalFeatures: false,
      cachedFeatures: [],
      cachedPaint: []
    }
  }

  componentWillMount () {
    this.props.fetchMapData()
  }

  render () {
    let { isFetchingProperty, isFetchingMap, allMapData, clickedProperty, hasClickedProperty, companyNames, showTable, sidebarOwnerAddress, error, buildings } = this.props
    let { hasLocalFeatures, cachedFeatures, cachedPaint } = this.state
    let features = []
    let stops = []
    let k = 0
    let paint = {
      'circle-radius': {
        'base': 1.75,
        'stops': [[12, 2], [22, 180]]
      },
      'circle-color': {
        property: 'owner-address',
        type: 'categorical'
      }
    }
    let popup = <Feature />
    let sidebar = <div style={{ 'textAlign': 'center', 'width': '100%' }}> <h1> Error fetching assets from server </h1> </div>
    if (error !== true) {
      sidebar = <CompanyTable {...this.props} />
    }

    if (hasClickedProperty) {
      let ownerName = clickedProperty['owner-name']
      if (typeof ownerName === 'undefined') {
        let info = allMapData[clickedProperty['owner-address']].filter((propertyInfo) => { 
          if (propertyInfo.address === clickedProperty.address) {
            return propertyInfo
          }
        })
        ownerName = info[0]['owner-name']
      }
      popup = (
        <Popup
          key={1}
          offset={[0, -50]}
          coordinates={clickedProperty.coordinates}
        >
          Owner Name: {ownerName}
          <br />
          Owner Address: {clickedProperty['owner-address']}
          <br />
          Property Address: {clickedProperty.address}
          <br />
          <button onClick={(() => this.props.propertyOnClick())}> Back </button>
        </Popup>
      )
    }

    if (!isFetchingProperty && companyNames && companyNames.length > 0 && !showTable) {
      sidebar = <CompanySideList companyNames={companyNames} backToTable={this.props.backToTable} />
    }

    if (hasLocalFeatures) {
      features = cachedFeatures
      paint = cachedPaint
    }

    if (buildings && buildings.length > 0) {
      let f = buildings.map((d, i) => {
        let propertyFeatures = {
          'owner-address': sidebarOwnerAddress,
          coordinates: [d.longitude, d.latitude],
          address: d.address
        }
        return (
          <Feature coordinates={[d.longitude, d.latitude]} key={i} properties={{'owner-address': sidebarOwnerAddress}} onClick={(() => this.props.propertyOnClick(propertyFeatures))} />
        )
      })
      features = []
      features.push.apply(features, f)
    }

    if (!hasLocalFeatures && !isFetchingMap && typeof allMapData !== 'undefined') {
      let scales = chroma.scale(['#fafa6e', '#2A4858']).mode('lch').colors(Object.keys(allMapData).length)
      for (const [j, ownerAddress] of Object.entries(allMapData)) {
        let innerStops = [j, scales[k]]
        let f = ownerAddress.map((d, i) => {
          let propertyFeatures = {
            'owner-address': j,
            'owner-name': d['owner-name'],
            coordinates: [d.longitude, d.latitude],
            address: d.address

          }
          return (
            <Feature coordinates={[d.longitude, d.latitude]} key={i} properties={{'owner-address': j}} onClick={(() => this.props.propertyOnClick(propertyFeatures))} />
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
        type: 'categorical',
        stops: stops
      }
      this.setState({hasLocalFeatures: true, cachedFeatures: features, cachedPaint: paint})
    }

    return (
      <div class='row'>
        <div style={{float: 'left', height: '100%'}}>
          <Map
            style='mapbox://styles/jbcima/cj8mqv1b562ch2rnzsw6l1qkc'
            containerStyle={{
              height: '100vh',
              width: '62vw'
            }}
            center={mapCenter}
          >
            <Layer
              type='circle'
              id='marker'
              paint={paint}
            >
              {features}
            </Layer>
            {popup}
          </Map>
        </div>
        <div style={{height: '100%'}}>
          {sidebar}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  table: state.table,
  isFetchingProperty: state.handleAppActions.isFetchingProperty,
  buildingLookupAddresses: state.handleAppActions.buildingLookupAddresses,
  buildings: state.handleAppActions.buildings,
  error: state.handleAppActions.error,
  closedModal: state.handleAppActions.closedModal,
  companyNames: state.handleAppActions.companyNames,
  allMapData: state.handleAppActions.allMapData,
  isFetchingMap: state.handleAppActions.isFetchingMap,
  clickedProperty: state.handleAppActions.clickedProperty,
  hasClickedProperty: state.handleAppActions.hasClickedProperty,
  showTable: state.handleAppActions.showTable,
  sidebarOwnerAddress: state.handleAppActions.sidebarOwnerAddress
})

const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(MainPage)

import React, { Component } from 'react'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'

class App extends Component {
  constructor() {
    super()
    this.state = {
      lat: 51.505,
      lng: -0.09,
      zoom: 1
    }
  }

  submit(e) {
    console.log(e.target)
    e.preventDefault()
  }

  render() {
    const position = [this.state.lat, this.state.lng];
    return (
      <div>
        <div className="form-container">
          <form onSubmit={this.submit.bind(this)}>
           Enter your landlord name: <input type="text">
           </input>
           <input type="submit" value="Submit">
           </input>
          </form>
        </div>
        <div className="map-container">
          <Map center={position} zoom={this.state.zoom}>
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
            />
            <Marker position={position}>
              <Popup>
                <span>A pretty CSS3 popup. <br/> Easily customizable.</span>
              </Popup>
            </Marker>
          </Map>
        </div>
      </div>
    )
  }
}

export default App;

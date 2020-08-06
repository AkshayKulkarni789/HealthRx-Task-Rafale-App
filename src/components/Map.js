import React from 'react';
import { withGoogleMap, withScriptjs, GoogleMap, Polyline, Marker } from 'react-google-maps'
import jet from '../jet.png'

class Map extends React.Component {
  state = {
    progress: [],
  }

  path = [
    { lat: 48.558908, lng: 2.389916 },
    { lat: 30.558853, lng: 76.389922 },
  ]

  icon = {
    url: jet,
    scaledSize: new window.google.maps.Size(50, 50),
    anchor: { x: 10, y: 10 }
  }

  velocity = 500000
  initialDate = new Date()

  getDistance = () => {
    // seconds between when the component loaded and now
    const differentInTime = (new Date() - this.initialDate) / 1000 // pass to seconds
    return differentInTime * this.velocity // d = v*t -- thanks Newton!
  }

  componentDidMount = () => {
    this.interval = window.setInterval(this.moveObject, 1000)
  }

  componentWillUnmount = () => {
    window.clearInterval(this.interval)
  }

  moveObject = () => {
    const distance = this.getDistance()
    if (! distance) {
      return
    }

    let progress = this.path.filter(coordinates => coordinates.distance < distance)

    const nextLine = this.path.find(coordinates => coordinates.distance > distance)
    if (! nextLine) {
      this.setState({ progress })
      return // it's the end!
    }
    const lastLine = progress[progress.length - 1]

    const lastLineLatLng = new window.google.maps.LatLng(
      lastLine.lat,
      lastLine.lng
    )

    const nextLineLatLng = new window.google.maps.LatLng(
      nextLine.lat,
      nextLine.lng
    )

    // distance of this line 
    const totalDistance = nextLine.distance - lastLine.distance
    const percentage = (distance - lastLine.distance) / totalDistance

    const position = window.google.maps.geometry.spherical.interpolate(
      lastLineLatLng,
      nextLineLatLng,
      percentage
    )

    progress = progress.concat(position)
    this.setState({ progress })
  }

  componentWillMount = () => {
    this.path = this.path.map((coordinates, i, array) => {
      if (i === 0) {
        return { ...coordinates, distance: 0 } // it begins here! 
      }
      const { lat: lat1, lng: lng1 } = coordinates
      const latLong1 = new window.google.maps.LatLng(lat1, lng1)

      const { lat: lat2, lng: lng2 } = array[0]
      const latLong2 = new window.google.maps.LatLng(lat2, lng2)

      // in meters:
      const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
        latLong1,
        latLong2
      )

      return { ...coordinates, distance }
    })

    console.log(this.path)
  }

  render = () => {
    return (
      <GoogleMap
        defaultZoom={3.5}
        defaultCenter={{ lat: 34.559008, lng: 41.388881 }}
        >
          { this.state.progress && (
            <>
              <Polyline path={this.state.progress} options={{ strokeColor: "#FF0000 "}} />
              <Marker position={this.state.progress[this.state.progress.length - 1]} options={{icon: this.icon }} />
            </>
          )}
      </GoogleMap>
    )
  }
}

const MapComponent = withScriptjs(withGoogleMap(Map))

export default () => (
  <MapComponent
  googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
  loadingElement={<div style={{ height: `100%` }} />}
  containerElement={<div style={{ height: `700px`, width: '1440px' }} />}
  mapElement={<div style={{ height: `100%` }} />}
  />
)
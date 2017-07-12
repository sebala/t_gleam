import React from 'react'
import { Map, TileLayer,  } from 'react-leaflet'
import { connect } from 'react-redux'
import {getMarkers, getPolylines} from './MyRouteContainer'

const MyMap = ({route, showMarkers, lat, lng, zoom}) => {
    if(typeof route==='undefined'){
      route = [];
    }
    let markers = ''
    if (showMarkers){
      markers = getMarkers(route);

    }
    const polylines = getPolylines(route);
    const position = [lat, lng];

    return (
      <Map center={position} zoom={zoom}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
        />

        {markers}
        {polylines}
      </Map>
    );
}


const MyMapContainer = ({ lng, lat, zoom, route, showMarkers }) => {
  return (
    <MyMap zoom={zoom} lng={lng} lat={lat} route={route} showMarkers={showMarkers}/>
  )
};
function mapStateToProps(state){
  return {
    lat: state.lat,
    lng: state.lng,
    zoom: 13,
    route: state.route,
    showMarkers: state.shouldShowGlobalMarkers
  }
}

export default connect(mapStateToProps)(MyMapContainer);

import React from 'react'
import { Map, TileLayer,  } from 'react-leaflet'
import { connect } from 'react-redux'
import {getMarkers, getPolylines} from './MyRouteContainer'

const MyMap = ({route, showMarkers, lat, lng, zoom, tramstop_geo_locs}) => {
    if(typeof route==='undefined'){
      route = [];
    }
    let markers = ''
    if (showMarkers){
      markers = getMarkers(route, tramstop_geo_locs);

    }
    const polylines = getPolylines(route, tramstop_geo_locs);
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


const MyMapContainer = ({ lng, lat, zoom, route, showMarkers, tramstop_geo_locs }) => {
  return (
    <MyMap
      zoom={zoom}
      lng={lng}
      lat={lat}
      route={route}
      showMarkers={showMarkers}
      tramstop_geo_locs={tramstop_geo_locs}
    />
  )
};
function mapStateToProps(state){
  return {
    lat: state.lat,
    lng: state.lng,
    zoom: 13,
    route: state.screenStates[state.currentView].route,
    showMarkers: state.shouldShowGlobalMarkers,
    tramstop_geo_locs: state.tramstop_geo_locs
  }
}

export default connect(mapStateToProps)(MyMapContainer);

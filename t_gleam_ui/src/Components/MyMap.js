import React from 'react'
import { Map, TileLayer, Rectangle } from 'react-leaflet'
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

    try{

      let legs = route.jounery_legs;
        if (legs.length>1){
          let min_lat = null;
          let max_lat = null;
          let min_lng = null;
          let max_lng = null;
                for(let i = 0; i<legs.length; i++){
                  try{
                    let leg = legs[i]
                    const start = tramstop_geo_locs[leg.halt_id_0]
                    const end = tramstop_geo_locs[leg.halt_id_1]
                    if(min_lat===null){
                      min_lat = Math.min(start.GPS_Latitude, end.GPS_Latitude);
                      max_lat = Math.max(start.GPS_Latitude, end.GPS_Latitude);
                      min_lng = Math.min(start.GPS_Longitude, end.GPS_Longitude);
                      max_lng = Math.max(start.GPS_Longitude, end.GPS_Longitude);
                    }
                    min_lat = Math.min(min_lat, start.GPS_Latitude, end.GPS_Latitude);
                    max_lat = Math.max(max_lat, start.GPS_Latitude, end.GPS_Latitude);
                    min_lng = Math.min(min_lng, start.GPS_Longitude, end.GPS_Longitude);
                    max_lng = Math.max(max_lng, start.GPS_Longitude, end.GPS_Longitude);
                  }catch(the_best_exception_handling_is_clean_data){
                        //TODO Proper error handling...
                  }
                }


                let bounds = [[min_lat, min_lng], [max_lat, max_lng]]
                 bounds = [[max_lat,max_lng], [min_lat,  min_lng]]

              return <Map bounds={bounds} useFlyTo={true}>
                <Rectangle bounds={bounds} onClick={(e) => console.log(JSON.stringify(e.latlng))}/>
                <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                />
                {markers}
                {polylines}
              </Map>
          }
      }catch(ex){
        console.log(ex)
      }
//'http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png'
//'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
    //bounds={bounds}-->
    return (
      <Map center={position} zoom={zoom} zoomControl={false}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
        />
        {markers}
        {polylines}
      </Map>
      //TODO config the environment based on... Something @see config.js
      //url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'

      //  url='https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'
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

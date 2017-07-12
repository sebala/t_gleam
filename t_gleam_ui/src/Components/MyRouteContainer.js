import React from 'react'
import { Marker, Popup,Polyline } from 'react-leaflet'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'


function getMarkers (route){
  const markers = route.map((item) => {
      const pos =  [item.GPS_Latitude,item.GPS_Longitude];
         return <Marker position={pos} key={item.halt_id}>
           <Popup>
             <span>{item.halt_id}.</span>
           </Popup>
         </Marker>;
  });

  return markers;
};

function getPolylines(route){
  let res = [];
  for(var i = 0; i<route.length-1; i++){
    const start = route[i];
    const end = route[i+1];
    const path = [[start.GPS_Latitude,start.GPS_Longitude],[end.GPS_Latitude,end.GPS_Longitude]]
    const to_add = <Polyline color='red' positions={path} key={i}/>
    res.push(to_add);
  }
  return res;
}
const MyRouteContainer = ({ route}) => {
  if(typeof route==='undefined'){
    return null;
  }
  let markers= getMarkers(route);
  return markers;
};

function mapStateToProps(state){
  return {
    route: state.route
  }
}


getMarkers.propTypes = {
  route: PropTypes.array
}

module.exports ={
  MyRouteContainer : connect(mapStateToProps)(MyRouteContainer),
  getMarkers : getMarkers,
  getPolylines : getPolylines

};

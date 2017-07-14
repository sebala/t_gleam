import React from 'react'
import { Marker, Popup,Polyline } from 'react-leaflet'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

function getMarkers (route, tramstop_geo_locs){
  let legs = route.jounery_legs;
  const items = [];
  const seen_halt_ids = {}
  for(var i = 0; i<legs.length; i++){
    let leg = legs[i]
    try{
      if (!(leg.halt_id_0 in seen_halt_ids)){
          const geoPosition = tramstop_geo_locs[leg.halt_id_0]
          items.push(geoPosition)
          seen_halt_ids[geoPosition.halt_id] = true
      }

      if (!(leg.halt_id_1 in seen_halt_ids)){
          const geoPosition = tramstop_geo_locs[leg.halt_id_1]
          items.push(geoPosition)
          seen_halt_ids[geoPosition.halt_id] = true
      }
    }catch(err){
      //TODO - c'mon -- exception handling???
    }
  }
  const markers = items.map((item) => {
      const pos =  [item.GPS_Latitude,item.GPS_Longitude];
         return <Marker position={pos} key={item.halt_id}>
           <Popup>
             <span>{item.halt_id}.</span>
           </Popup>
         </Marker>;
  });

  return markers;
};

function getPolylines(route, tramstop_geo_locs){
  let legs = route.jounery_legs;
  const res = [];

  var has_weight = false;
  //Bring weights in to range 0 to 10 if they exist...
  let max_weight = 1;
  for(var i = 0; i<legs.length; i++){
    let leg = legs[i]
    if ('frequency' in leg.decorations){
      if (leg.decorations.frequency>max_weight){
        max_weight = leg.decorations.frequency
        has_weight = true;
      }
    }
  }

  for(var i = 0; i<legs.length; i++){
    try{
      let leg = legs[i]
      const start = tramstop_geo_locs[leg.halt_id_0]
      const end = tramstop_geo_locs[leg.halt_id_1]
      const path = [[start.GPS_Latitude,start.GPS_Longitude],[end.GPS_Latitude,end.GPS_Longitude]]

      let weight = 3.0;
      var color='red';
      if(has_weight){
        weight = leg.decorations.frequency/max_weight
        weight*=3.0
      }
      if(weight<2.9){
        color = 'green'
      }
      const to_add = <Polyline color={color} positions={path} key={i} weight={weight}/>
      res.push(to_add);
    }catch(the_best_exception_handling_is_clean_data){
      //TODO Proper error handling...
    }
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

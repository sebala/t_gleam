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
          //TODO - Make stops in a leg iterable. not "just 2 elements"
          if (leg.halt_id_0 in tramstop_geo_locs){
            const geoPosition = tramstop_geo_locs[leg.halt_id_0]
            items.push(geoPosition)
            seen_halt_ids[geoPosition.halt_id] = true
          }
      }

      if (!(leg.halt_id_1 in seen_halt_ids)){
          if (leg.halt_id_0 in tramstop_geo_locs){
            const geoPosition = tramstop_geo_locs[leg.halt_id_1]
            items.push(geoPosition)
            seen_halt_ids[geoPosition.halt_id] = true
          }
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
  for(let i = 0; i<legs.length; i++){
    let leg = legs[i]
    if ('frequency' in leg.decorations){
      if (leg.decorations.frequency>max_weight){
        max_weight = leg.decorations.frequency
        has_weight = true;
      }
    }
  }

  for(let i = 0; i<legs.length; i++){
    let leg = legs[i]
    const start = tramstop_geo_locs[leg.halt_id_0]
    const end = tramstop_geo_locs[leg.halt_id_1]
    try{


      const path = [[start.GPS_Latitude,start.GPS_Longitude],[end.GPS_Latitude,end.GPS_Longitude]]

      let weight = 3.0;
      var color='green';

      if(has_weight){
        weight = leg.decorations.frequency/max_weight
        weight*=3.0
      }
      if(weight<2.9){
        color = 'red'
      }
      const to_add = <Polyline color={color} positions={path} key={i} weight={weight}/>
      res.push(to_add);
    }catch(the_best_exception_handling_is_clean_data){
      //TODO Proper error handling...
      console.log('Halt_id_0 ' + leg.halt_id_0 + 'stats' + start)
      console.log('Halt_id_1 ' + leg.halt_id_1+ 'stats' + end)
      console.log(the_best_exception_handling_is_clean_data)
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

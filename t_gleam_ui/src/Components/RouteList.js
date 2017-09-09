import React from 'react';
import { connect } from 'react-redux'

const RouteList = ({ start_halte_id, end_halte_id, route}) => {
  var  ul = <ul></ul>;

  if (route.length>0){
    ul = <ul>
            {route.map(x=><li key={x.halt_id}>{x.halt_id}</li>)}
          </ul>
  }
  return <div>
    <p>{start_halte_id}</p>
    <p>{end_halte_id}</p>
    {ul}
  </div>
}



const mapStateToProps = state => {
  const prototype = {
    'start_halte_id': -1,
    'end_halte_id' : -1,
    'route' : []
  };
  if(typeof state.startTram !== 'undefined'){
    prototype['start_halte_id'] =state.startTram.halt_id;
  }
  if(typeof state.endTram !== 'undefined'){
    prototype['end_halte_id'] =state.endTram.halt_id;
  }

  if(typeof state.route !== 'undefined'){
    prototype['route'] = state.route;
  }
  return prototype;
}

export default connect(mapStateToProps)(RouteList)

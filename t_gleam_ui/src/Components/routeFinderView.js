import React from 'react'
import TramStopPicker from './TramStopPicker'
import ShowMarkersToggleContainer from './ShowMarkersToggle';
import RouteList from './RouteList'
import MyMap from './MyMap'

const RouteFinderView = () => (
   <div>
  <TramStopPicker/>
    <div className='row'>
      <div className="col-md-2">
        <ShowMarkersToggleContainer/>
        <RouteList/>
      </div>
      <div className="col-md-10">
        <MyMap/>
      </div>
    </div>
</div>
)

export default RouteFinderView

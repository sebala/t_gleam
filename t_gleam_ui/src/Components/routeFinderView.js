import React from 'react'
import TramStopPicker from './TramStopPicker'
import ShowMarkersToggleContainer from './ShowMarkersToggle';
import RouteList from './RouteList'
import MyMap from './MyMap'

const RouteFinderView = () => (
   <div>

    <div className='row'>
      <div className="col-md-3">
        <ShowMarkersToggleContainer/>
        <TramStopPicker/>
        <RouteList/>
      </div>
      <div className="col-md-9">
        <MyMap/>
      </div>
    </div>
</div>
)

export default RouteFinderView

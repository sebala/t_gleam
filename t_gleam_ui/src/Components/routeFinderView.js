import React from 'react'
import TramStopPicker from './TramStopPicker'
import ShowMarkersToggleContainer from './ShowMarkersToggle';
import RouteList from './RouteList'
import MyMap from './MyMap'
import {Sidebar} from 'semantic-ui-react'
const RouteFinderView = () => (
  <div>

   <div className='ui grid container'>
     <div className="four wide column">
         <div className='row'>
           <ShowMarkersToggleContainer/>
         </div>

         <div className='row'>

           <TramStopPicker/>
         </div>
         <div className='row'>
           <RouteList/>
         </div>
     </div>
     <div className="eight wide column">
       <MyMap/>
     </div>
   </div>
  </div>
)

export default RouteFinderView

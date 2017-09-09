import React from 'react';
import { connect } from 'react-redux'
import MyMap from './MyMap'
import {Navbar, Layout} from './navBar'
import TramList from './tramList';
import TramStopPicker from './TramStopPicker';
import JourneyFilter from './journeyFilters'
import {switchView} from '../actions/actions'
import RouteFinderView from './routeFinderView'
import NakedApp from './naked'
import SidebarLeftOverlay from './sidebarOverlay'

const App = ({view, dispatch}) => {
  let main = '';
  if (view==='ROUTE_FINDER'){
    main = <RouteFinderView/>
  }else if (view==='LINE_VIEW') {
    main =  <div>

              <div  className="container_moin">
                <div className='row'>
                    <div className="col-md-2">
                      <TramList/>
                    </div>
                    <div className="col-md-10">
                      <MyMap/>
                    </div>
                </div>
            </div></div>
  }else if(view==='EXPERIMENTAL'){
      main = <SidebarLeftOverlay/>
  }
  let navbar =   <Navbar/>
  return  <div>
            <Layout main={main} navbar={navbar}/>
          </div>
}

function mapStateToProps(state){
  return {
    view: state.currentView
  }
}
export default connect(mapStateToProps)(App)

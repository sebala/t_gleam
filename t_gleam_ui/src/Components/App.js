import React from 'react';
import { connect } from 'react-redux'
import MyMap from './MyMap'
import {Navbar, Layout} from './navBar'
import TramList from './tramList';
import RouteFinderView from './routeFinderView'
import TramStopPicker from './TramStopPicker'
const App = ({view}) => {
  let main = '';
  if (view==='ROUTE_FINDER'){
    main = <RouteFinderView/>
  }else if (view==='LINE_VIEW') {
    main =  <div>						<p>Some hidden shim</p>
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
  }

  let navbar =   <Navbar/>
  return  <div className='navbar-dark'>
            <Layout main={main} navbar={navbar}/>
          </div>
}


function mapStateToProps(state){
  return {
    view: state.currentView
  }
}
export default connect(mapStateToProps)(App)

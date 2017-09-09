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
    //main = <div className='animated fadeIn'><RouteFinderView/></div>
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
  }else if(view==='landing_screen'){
    const sview = () => switchView(dispatch, 'landing_screen_2');
    main = <div className='animated fadeIn container_moin'>
            <div className='row'>
              <TramStopPicker/>
            </div>
            <div className='row'>
                <div onClick={sview} className="ui animated button" tabIndex="0">
                  <div className="visible content"/>
                  <div className="hidden content">
                    <i className="right arrow icon"></i>
                  </div>
                </div>
            </div>
          </div>


  }else if(view==='landing_screen_2'){
      main = <div><h1 className='animated fadeIn'>Showing you the lateness factor</h1></div>
      window.setTimeout(() => switchView(dispatch, 'landing_screen_3'),1000)
  }else if(view==='landing_screen_3'){
      main = <div><h1 className="animated bounceOut">Showing you the lateness factor</h1></div>
      window.setTimeout(() => switchView(dispatch, 'ROUTE_FINDER'),1000)
  }else if(view==='EXPERIMENTAL'){
      //main =<TramStopPicker/>
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

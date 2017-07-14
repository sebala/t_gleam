import React from 'react';
import ReactDOM from 'react-dom';

import { createStore } from 'redux'
import { Provider } from 'react-redux'
import App from './Components/App'
import * as ActionTypes from './actions/actions'

const initial_state = {
  start_halte_id: -1,
  shouldShowGlobalMarkers : false,
  currentView: 'ROUTE_FINDER',
  lat: 47.376848,
  lng: 8.540508,
  trams: [],
  currentTram: null,
  tramstops: [],
  tramstop_geo_locs: {},
  screenStates : {
    'ROUTE_FINDER' : {
      route : {
        jounery_legs: []
      }
    },
    'LINE_VIEW' : {
      route : {
        jounery_legs: []
      }
    }
  }
}


const reducer = (state, action) => {
  if (action.type===ActionTypes.SELECT_START) {
    return {
        ...state,
        startTram :action.startTram,
        pickStartTram: action.pickStartTram
      }

  }else if (action.type===ActionTypes.SELECT_END) {
    return {
        ...state,
        endTram :action.endTram,
        pickEndTram:action.pickEndTram
      }
  }else if (action.type===ActionTypes.ROUTE_LOADED) {
    //state.screenStates[state.currentView].route = action.route
    let new_state = {
        ...state
      }
      new_state.screenStates[new_state.currentView].route = action.route
      return new_state
    }
  else if (action.type===ActionTypes.SHOW_GLOBAL_MAP_MARKERS){
    return {
      ...state,
      shouldShowGlobalMarkers : action.show_markers
    }
  }  else if (action.type===ActionTypes.SWITCH_VIEW){
      return {
        ...state,
        currentView : action.newView
      }
    }
    else if (action.type===ActionTypes.ALL_STOPS_AVAILABLE){
      return {
        ...state,
        tramstops : action.tramstops
      }
    }else if (action.type===ActionTypes.ALL_GEOS_AVAILABLE){
      return {
        ...state,
        tramstop_geo_locs : action.tramstop_geo_locs
      }
    }



  else{
    return state
  }
}

const store = createStore(reducer, initial_state);

ActionTypes.load_tramstops(store.dispatch)
ActionTypes.load_geo_for_all_stops(store.dispatch)
class RenderApp extends React.Component {
  render () {
    return (
      <div className="body">
        <Provider store={store}>
          <App/>
        </Provider>
      </div>
    )
  }
}

ReactDOM.render(<RenderApp />,
  document.getElementById('root')
);

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
  currentTram: null
}


const reducer = (state, action) => {
  if (action.type===ActionTypes.SELECT_START) {
    return {
        ...state,
        startTram :action.startTram
      }

  }else if (action.type===ActionTypes.SELECT_END) {
    return {
        ...state,
        endTram :action.endTram
      }
  }else if (action.type===ActionTypes.ROUTE_LOADED) {
    return {
        ...state,
        route :action.route
      }
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

  else{
    return state
  }
}

const store = createStore(reducer, initial_state);



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

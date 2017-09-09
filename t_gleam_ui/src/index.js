import React from 'react';
import ReactDOM from 'react-dom';

import { createStore } from 'redux'
import { Provider } from 'react-redux'
import App from './Components/App'
import * as ActionTypes from './actions/actions'
import * as reducer from './reducers/reducer'
const initial_state = {
  start_halte_id: -1,
  shouldShowGlobalMarkers : false,
  currentView: '',
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
    },
    'EXPERIMENTAL' : {
      route : {
        jounery_legs: []
      }
    }
  }
}

const store = createStore(reducer.reducer, initial_state);

ActionTypes.load_tramstops(store.dispatch)
ActionTypes.load_geo_for_all_stops(store.dispatch)
ActionTypes.switchView(store.dispatch, 'EXPERIMENTAL')//

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

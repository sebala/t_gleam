import * as ActionTypes from '../actions/actions'

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
    }else if(action.type ===ActionTypes.NEAREST_STOP_LOADED){

      return {
        ...state,
        endTram :action.end_halt_id,
        pickEndTram:state.tramstops[action.end_halt_id],

        pickStartTram: state.tramstops[action.halt_id],
        currentView: action.screen
      }
    }



  else{
    return state
  }
}

export {reducer};


import React from 'react';
import { connect } from 'react-redux';
import { switchGlobalMapMarkers} from '../actions/actions'


const ShowMarkersToggle = ({showMarkers, dispatch}) => {
    const localClick = () => switchGlobalMapMarkers(dispatch, !showMarkers);
    return (
      <label className="switch">
        Show Markers
        <input type="checkbox" value={showMarkers}
          onClick={() => localClick()}/>
        <span className="slider round"></span>
      </label>
  )
}

const mapStateToProps = (state) => ({
  showMarkers: state.shouldShowGlobalMarkers
})

export default connect(mapStateToProps)(ShowMarkersToggle)

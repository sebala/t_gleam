
import React from 'react';
import { connect } from 'react-redux';
import { switchGlobalMapMarkers } from '../actions/actions'
import { Button } from 'semantic-ui-react'

const ShowMarkersToggle = ({showMarkers, dispatch}) => {
    const localClick = () => switchGlobalMapMarkers(dispatch, !showMarkers);
    return (
      <Button onClick={() =>  localClick()}>Markers</Button>
  )
}

const mapStateToProps = (state) => ({
  showMarkers: state.shouldShowGlobalMarkers
})

export default connect(mapStateToProps)(ShowMarkersToggle)

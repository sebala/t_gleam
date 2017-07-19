import React, { Component } from 'react'
import { Sidebar, Segment, Button, Menu, Image, Icon, Header } from 'semantic-ui-react'
import MyMap from './MyMap'
import JourneyFilter from './journeyFilters'
import TramStopPicker from './TramStopPicker'
import TramList from './tramList'
import ShowMarkersToggle from './ShowMarkersToggle'
class SidebarLeftOverlay extends Component {
  state = { visible: false,
          viewport : 'default'}

  toggleVisibility = () => this.setState({ visible: !this.state.visible })
  setView(viewName){
    this.setState({
      ...this.state,
      viewport: viewName
    })
  }
  render() {
    let {viewport} = this.state;
    let overlay = '';

    if (viewport==='default'){
        overlay = <JourneyFilter/>;
    }else if (viewport==='stops'){
      overlay = <TramStopPicker/>;
    }else if (viewport==='routelist'){
      overlay = <TramList/>;
    }else if (viewport==='show_markers'){
      overlay = <ShowMarkersToggle/>;
    }

    const { visible } = this.state
    return (
      <div>
      <Button onClick={this.toggleVisibility}>On</Button>
      <Button onClick={() => this.setView('stops')}>By Stop</Button>
      <Button onClick={() => this.setView('default')}>Filters</Button>
      <Button onClick={() => this.setView('routelist')}>By Line</Button>
      <Button onClick={() => this.setView('show_markers')}>Show markers</Button>

        <Sidebar.Pushable as={Segment}>
          <Sidebar animation='overlay' width='wide' visible={visible} icon='labeled'>
              {overlay}

          </Sidebar>
          <Sidebar.Pusher>
            <Segment basic>
              <MyMap/>
            </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    )
  }
}

export default SidebarLeftOverlay;

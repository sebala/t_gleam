import React from 'react'
import { connect } from 'react-redux'
import { switchView } from '../actions/actions'
const Layout = ({ main, navbar, debug }) => (
  <div>
          <div className="main nav">
                  { navbar }
          </div>
          <div className="main container">
                  { main }
          </div>
          <div className="main footer">
            <div className="ui divider"></div>
              { debug }
          </div>
      </div>
)

const Navbar = ({dispatch}) => {

    const to_line_view = () => {switchView(dispatch, 'LINE_VIEW')};
    const to_main_view = () => {switchView(dispatch, 'ROUTE_FINDER')}
    const to_experiments = () => {switchView(dispatch, 'EXPERIMENTAL')}
    return <div className="ui two item menu">

  <a className="item" onClick={to_experiments}>Directions</a>
  <a className="item" onClick={to_line_view}>Tram lines</a>
</div>
}

module.exports = {
   Navbar: connect()(Navbar),
   Layout
 }

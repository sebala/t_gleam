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
              <p>Info</p>
          </div>
      </div>
)

const Navbar = ({dispatch}) => {

    const to_line_view = () => {switchView(dispatch, 'LINE_VIEW')};
    const to_main_view = () => {switchView(dispatch, 'ROUTE_FINDER')}
    const to_experiments = () => {switchView(dispatch, 'EXPERIMENTAL')}
    return <div className="ui three item menu">
  <a className="item" onClick={to_main_view}>Home</a>
  <a className="item" onClick={to_line_view}>Away</a>
  <a className="item" onClick={to_experiments}>Experiments</a>
</div>
}

module.exports = {
   Navbar: connect()(Navbar),
   Layout
 }

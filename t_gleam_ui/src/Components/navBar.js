import React from 'react'
import { connect } from 'react-redux'
import { switchView } from '../actions/actions'
const Layout = ({ main, navbar, debug }) => (
    <div className="container-fluid">
        <div className="row">
            <div className="col-xs navbar">
                { navbar }
            </div>
        </div>
        <div className="row container_moin"/>
        <div className="row content ">
            <div className="col-xs main">
                { main }
            </div>
            { debug }
        </div>
    </div>
)

const Navbar = ({dispatch}) => {

    const to_line_view = () => {switchView(dispatch, 'LINE_VIEW')};
    const to_main_view = () => {switchView(dispatch, 'ROUTE_FINDER')}

    return <div className="navbar navbar-fixed-top bg-inverse navbar-dark">
        <a className="navbar-brand" href="#">gleam</a>
        <ul className="nav navbar-nav">
            <li className="nav-item">
              <a className="nav-link" href="#" onClick={to_main_view}>Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#" onClick={to_line_view}>Away</a>
            </li>
        </ul>
    </div>
}

module.exports = {
   Navbar: connect()(Navbar),
   Layout
 }

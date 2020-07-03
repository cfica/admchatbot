import React, { Component } from "react";
import $ from "jquery";
import Mousewheel from "jquery-mousewheel";
import mCustomScrollbar from "malihu-custom-scrollbar-plugin";
//import { bake_cookie, read_cookie, delete_cookie } from 'sfcookies';
import { browserHistory } from 'react-router';
import Cookies from 'universal-cookie';
import {DropdownButton, Dropdown, ButtonGroup} from 'react-bootstrap';

export default class SidebarAction extends Component {
  componentDidMount(){
  }

  _handleLogout = (event)=>{
    const cookies = new Cookies();
    remove('tokenAdm');
    browserHistory.push('/login');
  }

  render() {
    return (
      	<nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <button type="button" id="sidebarCollapse" className="btn btn-info">
                    <i className="fas fa-align-left"></i>
                    <span>&nbsp;Menú</span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="nav navbar-nav ml-auto">
                    <li className="nav-item active">
                        <a className="nav-link" href="#">User manual</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">Page</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">Page</a>
                    </li>
                    <li className="nav-item">
                        <DropdownButton as={ButtonGroup} variant="link" title="Account" id="bg-vertical-dropdown-3">
                            <Dropdown.Item eventKey="1">Edit Account</Dropdown.Item>
                            <Dropdown.Item eventKey="2" onClick={this._handleLogout}>Sign off</Dropdown.Item>
                        </DropdownButton>
                    </li>
                </ul>
            </div>

            </div>
        </nav>
    );
  }
}
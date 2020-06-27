import React, { Component } from "react";
import { Alert, Navbar, Nav, Modal, Collapse,Form,NavDropdown,FormControl,Container, Row, Col,Media,Jumbotron, Button, Breadcrumbs, Table} from 'react-bootstrap';
import config from 'react-global-configuration';
import axios from 'axios';
import  { Redirect } from 'react-router-dom';
import { browserHistory } from 'react-router';
import { bake_cookie, read_cookie, delete_cookie } from 'sfcookies';

export default class Login extends Component {
  constructor(props){
    super(props);
    this.state = {
      urlAuth: config.get('baseUrlAuth')+'/oauth?client_id='+config.get('client_id')+'&redirect_uri='+config.get('baseUrlApp')+'/auth/callback&scope=read:current_user update:current_user_metadata'
    };
  }

  componentDidMount(){
    if(read_cookie('token') != ''){
      browserHistory.push('/dashboard');
    }else{
      browserHistory.push('/');
    }
  }

  _handleLogin = (event) =>{
    window.location.href = this.state.urlAuth;
  }

  render() {
    return (
      <div id="login">
            <Jumbotron className="content-form">
                  <h5>Inicia sesión para poder acceder.</h5>
                  <hr/>
                  <Button onClick={this._handleLogin} variant="primary" type="button">
                    Log in
                  </Button>
            </Jumbotron>
      </div>
    );
  }
}
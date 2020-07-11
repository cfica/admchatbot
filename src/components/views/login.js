import React, { Component } from "react";
import { Alert, Navbar, Nav, Modal, Collapse,Form,NavDropdown,FormControl,Container, Row, Col,Media,Jumbotron, Button, Breadcrumbs, Table} from 'react-bootstrap';
import config from 'react-global-configuration';
import axios from 'axios';
import  { Redirect } from 'react-router-dom';
import { browserHistory } from 'react-router';

export default class Login extends Component {
  constructor(props){
    super(props);
    this.state = {
      urlAuth: config.get('baseUrlAuth')+'/oauth?redirect_uri='+config.get('baseUrlApp')+'/auth/callback'
    };
  }

  componentDidMount(){
    if(localStorage.getItem('tokenAdm') != undefined){
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
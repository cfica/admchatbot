import React, { Component } from "react";
import { Alert, Navbar, Nav, Modal, Collapse,Form,NavDropdown,FormControl,Container, Row, Col,Media,Jumbotron, Button, Breadcrumbs, Table} from 'react-bootstrap';
import config from 'react-global-configuration';
import axios from 'axios';
import  { Redirect } from 'react-router-dom';
import UserProfile from '../../UserProfile';
import { browserHistory } from 'react-router';
import { bake_cookie, read_cookie, delete_cookie } from 'sfcookies';

export default class Login extends Component {
  constructor(props){
    super(props);
    this.state = {
      validated : false,
      errorSaveForm: "",
      email: "",
      password: ""
    };
  }

  componentDidMount(){
    if(read_cookie('username') != ''){
      browserHistory.push('/dashboard');
    }else{
      browserHistory.push('/');
    }
  }

  _handleChangeEmail = (event)=>{
    var _value = event.target.value;
    this.setState({email: _value});
  }

  _handleChangePassword = (event)=>{
    var _value = event.target.value;
    this.setState({password: _value});
  }

  handleSubmitForm = (event) =>{
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
          event.stopPropagation();
          this.setState({validated : true});
        }else{
            this.setState({validated : false});
            var _dataPost = {"email" : this.state.email,"password" : this.state.password};
            axios.post(config.get('baseUrl')+'/api/v1/login', JSON.stringify(_dataPost), {headers: {'Content-Type': 'application/json;charset=UTF-8'}})
            .then(res => {
                //console.log(res);
                if(typeof res.data.login != 'undefined'){
                    //localStorage.setItem('username', this.state.email);
                    bake_cookie('username', this.state.email);
                    this.setState({errorSaveForm : false});
                    this.setState({password: ''});
                    this.setState({'email': ''});
                    form.reset();
                    browserHistory.push('/dashboard');
                }else{
                  this.setState({errorSaveForm : true});
                }
            }).catch(function (error) {
              alert(error);
                //this.setState({errorSaveForm : true});
            }).then(function () {
                // always executed
            });
        }
  }

  render() {
    return (
      <div id="login">
            <Jumbotron className="content-form">
                  <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmitForm}>
                        {this.state.errorSaveForm === false && <Alert key="success" variant="success">Success to login!</Alert>}
                        {this.state.errorSaveForm === true && <Alert key="danger" variant="danger">Please check the username or password.</Alert>}

                        <Form.Group controlId="formBasicEmail">
                          <Form.Label>Email address</Form.Label>
                          <Form.Control required value={this.state.email} onChange={this._handleChangeEmail} type="email" placeholder="Enter email" />
                          
                          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">Please enter a valid data.</Form.Control.Feedback>
                          
                          <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                          </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                          <Form.Label>Password</Form.Label>
                          <Form.Control required value={this.state.password} onChange={this._handleChangePassword} type="password" placeholder="Password" />
                          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">Please enter a valid data.</Form.Control.Feedback>
                        </Form.Group>

                        <Button variant="primary" type="submit">
                          Log in
                        </Button>
                    </Form>
            </Jumbotron>
      </div>
    );
  }
}
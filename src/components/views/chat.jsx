import React, { Component } from "react";
import { Alert, Navbar, Nav, InputGroup,Modal, Collapse,Form,NavDropdown,FormControl,Container, Row, Col,Media,Jumbotron, Button, Breadcrumbs, Table} from 'react-bootstrap';
import config from 'react-global-configuration';
import axios from 'axios';
import  { Redirect } from 'react-router-dom';
import { browserHistory } from 'react-router';
import { bake_cookie, read_cookie, delete_cookie } from 'sfcookies';
import './../css/belisa.css';

export default class Login extends Component {
  constructor(props){
    super(props);
    this.state = {
      validated : false,
      errorSaveForm: '',
      inputMessage: '',
      listMessages: [],
      'token' : '',
      'key_temp' : '',
      'client_id' : '',
      showContChat: false,
      showContHello: true,
      inputName: '',
      inputEmail: '',
      inputTelephone: ''
    };
  }

  componentDidMount(){
    const client_id = this.props.location.query.i;
    if(client_id == null || client_id.length < 25 || this.clsAlphaNoOnly(client_id) == false || this.inIframe() == false){
    //if(client_id == null || client_id.length < 25 || this.clsAlphaNoOnly(client_id) == false){
    }else{
      //this.auth();
    }

    //delete_cookie('token');
    //delete_cookie('key_temp');

    if(read_cookie('token') != ''){
      this.setState({showContHello : false});
      this.setState({showContChat : true});
    }else{
      this.setState({showContHello : true});
      this.setState({showContChat : false});
    }
  }

  _handleSend = (event)=>{
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
          event.stopPropagation();
          this.setState({validated : true});
        }else{
          const item = {'type' : '_req','msg' : this.state.inputMessage};
          const items = this.state.listMessages.slice();
          items.push(item);
          this.setState({'listMessages' : items});
          this.setState({inputMessage : ''});
          //
          this.setState({validated : false});
          var _dataPost = {"message" : this.state.inputMessage};
          //const token = this.props.location.query.i;
          axios.post(config.get('baseUrlApi')+'/api/v1/message',JSON.stringify(_dataPost), 
              {headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization' : 'Bearer ' + read_cookie('token'),
                'x-dsi-restful' : read_cookie('key_temp')
              }}
          ).then(res => {
                const item = {'type' : '_res', 'msg' : res.data.data.response};
                const items = this.state.listMessages.slice();
                items.push(item);
                this.setState({'listMessages' : items});
                form.reset();
          }).catch(function (error) {
                delete_cookie('token');
                delete_cookie('key_temp');
          }).then(function () {
                // always executed
          });

          if(read_cookie('token') == ''){
            this.setState({showContHello : true});
            this.setState({showContChat : false});
          }
        }
  }

  _handleStarChat = (event) =>{
      event.preventDefault();
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
          event.stopPropagation();
          this.setState({validated : true});
      }else{
        this.setState({validated : false});
        const client_id = this.props.location.query.i;
        var url = (window.location != window.parent.location)
                ? document.referrer
                : document.location.href;
        axios.post(config.get('baseUrlApi')+'/api/v1/auth',JSON.stringify({name: this.state.inputName, email: this.state.inputEmail, telephone: this.state.inputTelephone}), 
            {headers: {'Content-Type': 'application/json;charset=UTF-8', 
                       'Authorization' : 'Bearer ' + client_id,
                       'x-dsi-time' : 1800
            }}
        ).then(res => {
             this.setState({showContHello : false});
             this.setState({showContChat : true});
             /*##*/
             bake_cookie('token', res.data.data.token);
             bake_cookie('key_temp', res.data.data.key_temp);
        }).catch(function (error) {
              //this.setState({errorSaveForm : true});
        }).then(function () {
              // always executed
        });
      }
  }

  inIframe () {
      try {
          return window.self !== window.top;
      } catch (e) {
          return true;
      }
  }

  clsAlphaNoOnly(text){ 
      var letters = /^[a-zA-Z0-9]+$/;
      if(text.match(letters)){
        return true;
      }else{
        return false;
      }
  }

  render() {
    //add recaptcha..
    const client_id = this.props.location.query.i;
    if(client_id == null || client_id.length < 25 || this.clsAlphaNoOnly(client_id) == false || this.inIframe() == false){
    //if(client_id == null || client_id.length < 25 || this.clsAlphaNoOnly(client_id) == false){
      return ('');
    }else{
        return (
            <div id="chat">
                {this.state.showContHello &&
                  <div className="contHello">
                      <Form noValidate validated={this.state.validated} onSubmit={this._handleStarChat}>
                        <p>Please complete the following information to start a conversation.</p>
                        <Form.Group controlId="formName">
                          <Form.Control required size="sm" value={this.state.inputName} onChange={this.inp = (e) => {this.setState({inputName: e.target.value})}} type="text" placeholder="Enter Name" />
                        </Form.Group>

                        <Form.Group controlId="formEmail">
                          <Form.Control required size="sm" value={this.state.inputEmail} onChange={this.inp = (e) => {this.setState({inputEmail: e.target.value})}} type="email" placeholder="Enter email" />
                        </Form.Group>

                        <Form.Group controlId="formTelephone">
                          <Form.Control required size="sm" type="text" value={this.state.inputTelephone} onChange={this.inp = (e) => {this.setState({inputTelephone: e.target.value})}} placeholder="Enter Telephone" />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                          Start Conversation
                        </Button>
                      </Form>
                  </div>
                }

                  {this.state.showContChat && 
                        <div className="contChat">
                              <div className="contentResponse">
                                {this.state.listMessages.map(item => {
                                  if(item.type == '_req'){
                                    return (
                                      <div className="contentMessageClient">
                                          <div>
                                             <div className="contentUser"><h5>You</h5></div>
                                             <div className="contentMsg">
                                                  <span>{item.msg}</span>
                                             </div>
                                          </div>
                                      </div>
                                    );
                                  }else if(item.type == '_res'){
                                    return (
                                        <div className="contentMessageChat">
                                               <div>
                                                   <div className="contentUser"><h5>Belisa</h5></div>
                                                   <div className="contentMsg">
                                                   <span>{item.msg}</span>
                                                   </div>
                                               </div>
                                        </div>
                                    );
                                  }
                                })}
                              </div>
                              
                              <Form noValidate validated={this.state.validated} onSubmit={this._handleSend}>
                                  <Form.Group  controlId="sendMessage" className="contentSend">
                                    <InputGroup>
                                        <FormControl required minLength="3" value={this.state.inputMessage} size="lg" onChange={this.inp = (e) => {this.setState({inputMessage: e.target.value})}}
                                          placeholder="Add Message"
                                          aria-label="Add Message"
                                          aria-describedby="basic-addon2"
                                        />

                                        <InputGroup.Append>
                                          <Button size="lg" type="submit" variant="outline-secondary">Send</Button>
                                        </InputGroup.Append>
                                    </InputGroup>
                                  </Form.Group>
                              </Form>
                        </div>
                  }
            </div>
          );
    }
  }
}
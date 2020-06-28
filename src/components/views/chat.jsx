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
      'client_id' : ''
    };
  }

  componentDidMount(){
    const client_id = this.props.location.query.i;
    if(client_id == null || client_id.length < 25 || this.clsAlphaNoOnly(client_id) == false || this.inIframe() == false){
    }else{
      this.auth();
    }
  }

  auth(){
    const client_id = this.props.location.query.i;
    var url = (window.location != window.parent.location)
            ? document.referrer
            : document.location.href;
    //console.log(document.host);
    console.log(url);
    axios.post(config.get('baseUrlApi')+'/api/v1/auth',JSON.stringify({}), 
        {headers: {'Content-Type': 'application/json;charset=UTF-8', 
                   'Authorization' : 'Bearer ' + client_id
        }}
    ).then(res => {
         this.setState({token: res.data.data.token}); 
    }).catch(function (error) {
          //this.setState({errorSaveForm : true});
    }).then(function () {
          // always executed
    });
  }

  _handleSend = (event)=>{
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
          event.stopPropagation();
          this.setState({validated : true});
        }else{
          //
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
              {headers: {'Content-Type': 'application/json;charset=UTF-8', 'Authorization' : 'Bearer ' + this.state.token}}
          ).then(res => {
                const item = {'type' : '_res', 'msg' : res.data.data.response};
                const items = this.state.listMessages.slice();
                items.push(item);
                this.setState({'listMessages' : items});
                form.reset();
          }).catch(function (error) {
                if(error.response.status == 401 || error.response.status == 404){
                  const item = {'type' : '_res', 'msg' : 'Oops! Houston, we have a problem.'};
                  const items = this.state.listMessages.slice();
                  items.push(item);
                  this.setState({'listMessages' : items});
                }
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
      return ('');
    }else{
        return (
            <div id="chat">
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
          );
    }
  }
}
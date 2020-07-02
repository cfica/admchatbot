import React, { Component } from "react";
import { Alert, Navbar, Nav, InputGroup,Modal, Collapse,Form,NavDropdown,FormControl,Container, Row, Col,Media,Jumbotron, Button, Breadcrumbs, Table} from 'react-bootstrap';
import config from 'react-global-configuration';
import axios from 'axios';
import  { Redirect } from 'react-router-dom';
import { browserHistory } from 'react-router';
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
      inputTelephone: '',
      welcomeInputs:[],
      welcomeMessageInit: ''
    };
  }

  bake_cookie(name, value) {
    var cookie = [name, '=', JSON.stringify(value), ';SameSite=None; Secure; domain_.', window.location.host.toString(), '; path=/;'].join('');
    document.cookie = cookie;
  }

  // reads a cookie according to the given name
  read_cookie(name) {
    var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
    result = result != null ? JSON.parse(result[1]) : [];
    return result;
  }

  delete_cookie(name) {
    document.cookie = [name, '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/; domain.', window.location.host.toString()].join('');
  }

  componentDidMount(){
    const client_id = this.props.location.query.i;
    //console.log(this.read_cookie('token'));
    //if(this._vldParamasGet() == false){
    if(true == false){
    }else{
      //this.auth();
      //this.delCookie();
      if(this.read_cookie('token') != ''){
        this.setState({showContHello : false});
        this.setState({showContChat : true});
        this.setState({'listMessages' : this.read_cookie('messages')});
      }else{
        this.setState({showContHello : true});
        this.setState({showContChat : false});
        const client_id = this.props.location.query.i;
        const init = this.props.location.query.init;
        axios.post(config.get('baseUrlApi')+'/api/v1/setting-init',JSON.stringify({}), 
              {headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'x-dsi-restful-i' : client_id,
                'x-dsi-restful-init' : init
              }}
        ).then(res => {
            console.log(res.data.data.config[0]);
            this.bake_cookie('init', res.data.data.config[0]);
        }).catch(function (error) {
          this.bake_cookie('init', false);
        }).then(function () {
        });

        print(this.read_cookie('init'));
        print(config.get('chat_welcome_inputs'));

        if(this.read_cookie('init') == false){
            this.setState({welcomeInputs: config.get('chat_welcome_inputs')});
            this.setState({welcomeMessageInit: config.get('chat_welcome_message_init')});
        }else{
            const _init = this.read_cookie('init');
            this.setState({welcomeInputs: _init.start_conversation});
            this.setState({welcomeMessageInit: _init.welcome_message_init});
        }
      }
    }
  }

  delCookie(){
      this.delete_cookie('token');
      this.delete_cookie('key_temp');
      this.delete_cookie('messages');
      this.delete_cookie('init');
  }

  setMessage(_type,message){
    const item = {'type' : _type,'msg' : message};
    var oldItems = this.read_cookie('messages') || [];
    const items = oldItems.slice();
    items.push(item);
    this.bake_cookie("messages", items);
    this.setState({'listMessages' : this.read_cookie('messages')});
  }

  _handleSend = (event)=>{
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
          event.stopPropagation();
          this.setState({validated : true});
        }else{
          this.setMessage('_req', this.state.inputMessage);
          this.setState({inputMessage : ''});
          //
          this.setState({validated : false});
          var _dataPost = {"message" : this.state.inputMessage};
          //const token = this.props.location.query.i;
          axios.post(config.get('baseUrlApi')+'/api/v1/message',JSON.stringify(_dataPost), 
              {headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization' : 'Bearer ' + this.read_cookie('token'),
                'x-dsi-restful' : this.read_cookie('key_temp')
              }}
          ).then(res => {
              this.setMessage('_res', res.data.data.response);
              form.reset();
          }).catch(function (error) {
            if(typeof error.response.status != 'undefined'){
                if(error.response.status == 403){
                    document.cookie = ['token', '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/; domain.', window.location.host.toString()].join('');
                    document.cookie = ['key_temp', '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/; domain.', window.location.host.toString()].join('');
                    document.cookie = ['messages', '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/; domain.', window.location.host.toString()].join('');
                    document.cookie = ['init', '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/; domain.', window.location.host.toString()].join('');
                }
            }
          }).then(function () {
                // always executed
          });

          if(this.read_cookie('token') == ''){
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
        axios.post(
          config.get('baseUrlApi')+'/api/v1/auth',
          JSON.stringify({name: this.state.inputName, email: this.state.inputEmail, telephone: this.state.inputTelephone}), 
          {headers: {'Content-Type': 'application/json;charset=UTF-8', 'Authorization' : 'Bearer ' + client_id,'x-dsi-time' : 1800}}
        ).then(res => {
             this.setState({showContHello : false});
             this.setState({showContChat : true});
             /*##*/
             this.bake_cookie('token', res.data.data.token);
             this.bake_cookie('key_temp', res.data.data.key_temp);
             if(this.read_cookie('init') == false){
              this.setMessage('_res', config.get('chat_welcome_message_start'));
             }else{
                const _init = this.read_cookie('init');
                this.setMessage('_res', _init.welcome_message);
             }
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

  _vldParamasGet(){
    const client_id = this.props.location.query.i;
    const init = this.props.location.query.init;
    if(client_id == null || init == null){
      return false;
    }else{
      if(this.inIframe() == false){
        return false;
      }else{
        if(client_id == null || client_id.length < 25 || this.clsAlphaNoOnly(client_id) == false){
          return false;
        }else{
          if(init == null || init.length < 25 || this.clsAlphaNoOnly(init) == false){
            return false;
          }else{
            return true;
          }
        }
      }
    }
  }

  render() {
    //add recaptcha..
    //if(this._vldParamasGet() == false){
    if(true == false){
      return ('');
    }else{
        return (
            <div id="chat">
                {this.state.showContHello &&
                  <div className="contHello">
                      <Form noValidate validated={this.state.validated} onSubmit={this._handleStarChat}>

                        <div dangerouslySetInnerHTML={{__html: this.state.welcomeMessageInit}}></div>

                        <Form.Group controlId="formName">
                          <Form.Control required size="sm" value={this.state.inputName} onChange={this.inp = (e) => {this.setState({inputName: e.target.value})}} type="text" placeholder="Enter Name" />
                        </Form.Group>

                        {this.state.welcomeInputs.map((item, index) => {
                            if(item == 'Email'){
                              return (<Form.Group controlId="formEmail">
                                        <Form.Control required size="sm" value={this.state.inputEmail} onChange={this.inp = (e) => {this.setState({inputEmail: e.target.value})}} type="email" placeholder="Enter email" />
                                      </Form.Group>);
                            }else if(item == 'Telephone'){
                              return (<Form.Group controlId="formTelephone">
                                        <Form.Control required size="sm" type="text" value={this.state.inputTelephone} onChange={this.inp = (e) => {this.setState({inputTelephone: e.target.value})}} placeholder="Enter Telephone" />
                                      </Form.Group>);
                            }
                        })}

                        <Button variant="primary" type="submit">
                          Start Conversation
                        </Button>
                      </Form>
                  </div>
                }

                  {this.state.showContChat && 
                        <div className="contChat">
                              <div className="contentResponse">
                                {this.state.listMessages.map((item, index) => {
                                  if(item.type == '_req'){
                                    return (
                                      <div key={index} className="contentMessageClient">
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
                                        <div key={index} className="contentMessageChat">
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
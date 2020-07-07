import React, { Component } from "react";
import { Alert, Navbar, Nav, InputGroup,Modal, Collapse,Form,NavDropdown,FormControl,Container, Row, Col,Media,Jumbotron, Button, Breadcrumbs, Table} from 'react-bootstrap';
import config from 'react-global-configuration';
import axios from 'axios';
import  { Redirect } from 'react-router-dom';
import { browserHistory } from 'react-router';
import './../css/belisa.css';
import Cookies from 'universal-cookie';
import Utils from './utils';
import {InputsTypeForm,ResponseForm} from './components/componentsUtils';

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
      welcomeMessageInit: '',
      confChatInit: '',
      cookieOptions: {path: '/', sameSite: 'none', secure: true}
    };
  }

  componentDidMount(){
    const client_id = this.props.location.query.i;

    /*const cookies = new Cookies();
    cookies.remove('messages',this.state.cookieOptions);
    cookies.remove('token',this.state.cookieOptions);
    cookies.remove('key_temp',this.state.cookieOptions);
    cookies.remove('confChatInit',this.state.cookieOptions);*/

    //if(this._vldParamasGet() == false){
    if(true == false){
    }else{
      const cookies = new Cookies();
      console.log(cookies.get('token'));
      console.log(cookies.get('confChatInit'));
      console.log(cookies.get('messages'));
      console.log(cookies.get('key_temp'));

      if(cookies.get('token') != undefined &&
         cookies.get('confChatInit') != undefined &&
         cookies.get('messages') != undefined){
        this.setState({showContHello : false});
        this.setState({showContChat : true});
        this.setState({'listMessages' : cookies.get('messages')});
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
            const cookies = new Cookies();
            cookies.set('confChatInit', res.data.data.config[0], this.state.cookieOptions);
            this.setState({'confChatInit': res.data.data.config[0]});
        }).catch(function (error) {
          //const cookies = new Cookies();
          //cookies.set('confChatInit', false, this.state.cookieOptions);
        }).then(function () {});


        console.log('result:');
        console.log(cookies.get('confChatInit'));
        console.log(this.state.confChatInit);

        //const cookies = new Cookies();
        if(cookies.get('confChatInit') == undefined){
            this.setState({welcomeInputs: config.get('chat_welcome_inputs')});
            this.setState({welcomeMessageInit: config.get('chat_welcome_message_init')});
        }else{
            const _init = cookies.get('confChatInit');
            this.setState({welcomeInputs: _init.start_conversation});
            this.setState({welcomeMessageInit: _init.welcome_message_init});
        }
      }
    }
  }


  setMessage(_type,message){
    const cookies = new Cookies();
    const item = {'type' : _type,'msg' : message.response, type_resp: message.type};
    var oldItems = cookies.get('messages') || [];
    const items = oldItems.slice();
    items.push(item);
    cookies.set('messages', items, this.state.cookieOptions);
    this.setState({'listMessages' : cookies.get('messages')});
    //console.log(this.state.listMessages);
  }

  _handleSend = (event)=>{
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
          event.stopPropagation();
          this.setState({validated : true});
        }else{
          this.setMessage('_req', {type:'Text', response: this.state.inputMessage});
          this.setState({inputMessage : ''});
          //
          this.setState({validated : false});
          var _dataPost = {"message" : this.state.inputMessage};
          const cookies = new Cookies();
          axios.post(config.get('baseUrlApi')+'/api/v1/message',JSON.stringify(_dataPost), 
              {headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization' : 'Bearer ' + cookies.get('token'),
                'x-dsi-restful' : cookies.get('key_temp')
              }}
          ).then(res => {
              this.setMessage('_res', res.data.data);
              form.reset();
          }).catch(function (error) {
            //console.log(error.response.status);
            if(error.response){
                if(error.response.status == 403){
                    const cookies = new Cookies();
                    cookies.remove('messages',{path: '/', sameSite: 'none', secure: true});
                    cookies.remove('token',{path: '/', sameSite: 'none', secure: true});
                    cookies.remove('key_temp',{path: '/', sameSite: 'none', secure: true});
                    cookies.remove('confChatInit',{path: '/', sameSite: 'none', secure: true});
                }
            }
          }).then(function () {
                // always executed
          });

          if(cookies.get('token') === undefined){
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
             const cookies = new Cookies();
             cookies.set('token', res.data.data.token, this.state.cookieOptions);
             cookies.set('key_temp', res.data.data.key_temp, this.state.cookieOptions);
             
             if(cookies.get('confChatInit') == false){
              this.setMessage('_res', {type: 'Text', response: config.get('chat_welcome_message_start')});
             }else{
                const _init = cookies.get('confChatInit');
                this.setMessage('_res', {type: 'Text', response: _init.welcome_message});
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
          return window.self != window.top;
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

  inputChange = (e, index, indexParent) =>{
    const _value = e.target.value;
    const _items = this.state.listMessages;
    _items[indexParent]['msg']['inputs'][index]['value'] = _value;
    this.setState({listMessages: _items});
  }

  inputChangeOptions = (value, item, indexItems, index, indexParent,type) =>{
    const _items = this.state.listMessages;
    const __items = _items[indexParent]['msg']['inputs'][index]['items'];
    const __itemSelected = _items[indexParent]['msg']['inputs'][index]['items'][indexItems];
    if(type == 'radio' || type == 'select'){ //value unique choice
      __items.forEach(function(e, index){
        __items[index]['value'] = false;
      });
      __itemSelected['value'] = true;
    }else if (type == 'checkbox'){ //multi value choice
      if(!__itemSelected['value'] || __itemSelected['value'] == ""){
        __itemSelected['value'] = true;
      }else{
        __itemSelected['value'] = false;
      }
    }
    this.setState({listMessages: _items});
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
                          <Form.Control required value={this.state.inputName} onChange={this.inp = (e) => {this.setState({inputName: e.target.value})}} type="text" placeholder="Enter Name" />
                          <Form.Label >Enter Name</Form.Label>
                        </Form.Group>

                        {this.state.welcomeInputs.map((item, index) => {
                            if(item == 'Email'){
                              return (<Form.Group controlId="formEmail">
                                        <Form.Control required  value={this.state.inputEmail} onChange={this.inp = (e) => {this.setState({inputEmail: e.target.value})}} type="email" />
                                        <Form.Label >Enter Email</Form.Label>
                                      </Form.Group>);
                            }else if(item == 'Telephone'){
                              return (<Form.Group controlId="formTelephone">
                                        <Form.Control required  type="text" value={this.state.inputTelephone} onChange={this.inp = (e) => {this.setState({inputTelephone: e.target.value})}}/>
                                        <Form.Label >Enter Telephone</Form.Label>
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
                                    if(item.type_resp == 'Text'){
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
                                    }else if(item.type_resp == 'Html'){
                                        return (
                                            <div key={index} className="contentMessageChat">
                                                   <div>
                                                       <div className="contentUser"><h5>Belisa</h5></div>
                                                       <div className="contentMsg" dangerouslySetInnerHTML={{__html: item.msg}}></div>
                                                   </div>
                                            </div>
                                        );
                                    }else if(item.type_resp == 'Form'){
                                        return (
                                            <div key={index} className="contentMessageChat">
                                                   <div>
                                                       <div className="contentUser"><h5>Belisa</h5></div>
                                                       <div className="contentMsg">
                                                            <ResponseForm 
                                                                index = {index}
                                                                messageData = {item.msg}
                                                                inputChange = {this.inputChange}
                                                                inputChangeOptions = {this.inputChangeOptions}
                                                            />
                                                       </div>
                                                   </div>
                                                   {/*<div style={{ marginTop: 20 }}>{JSON.stringify(item)}</div>*/}
                                            </div>
                                        );
                                    }
                                  }
                                })}
                              </div>
                              
                              <Form noValidate validated={this.state.validated} onSubmit={this._handleSend}>
                                  <Form.Group  controlId="sendMessage" className="contentSend">
                                    <InputGroup>
                                        <FormControl required minLength="3" value={this.state.inputMessage} size="lg" onChange={this.inp = (e) => {this.setState({inputMessage: e.target.value})}}
                                          aria-label="Add Message"
                                          aria-describedby="basic-addon2"
                                        />
                                        <Form.Label >Message</Form.Label>

                                        <InputGroup.Append className="btnSend">
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
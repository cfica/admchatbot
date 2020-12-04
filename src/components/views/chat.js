import React, { Component,useState, useEffect,useRef } from "react";
import ReactDOM from 'react-dom';
import { Alert, Navbar, Nav, InputGroup,Modal, Collapse,Form,NavDropdown,FormControl,Container, Row, Col,Media,Jumbotron, Button, Breadcrumbs, Table} from 'react-bootstrap';
import config from 'react-global-configuration';
import axios from 'axios';
import  { Redirect } from 'react-router-dom';
import { browserHistory } from 'react-router';
import './../css/belisa.css';
import Utils from './utils';
import {GetSlide} from './components/slide';
import {ChatMessages} from './components/chat';
//import {Validation} from './components/componentsUtils';
import ReCAPTCHA from "react-google-recaptcha";
import * as moment from 'moment';
//events
//import RNEventSource from 'react-native-event-source';



export default class Login extends Component {
  constructor(props){
    super(props);
    

    this.state = {
      validated : false,
      errorSaveForm: '',
      inputMessage: '',
      listMessages: [],
      showContChat: false,
      showContHello: true,
      errorInit: false,
      inputName: '',
      inputEmail: '',
      inputTelephone: '',
      welcomeInputs:[],
      welcomeMessageInit: '',
      confChatInit: {
        welcome_message_init: '<p>Please complete the following information to start a conversation.</p>',
        welcome_message: 'Hello, My name is BELISA and I am a virutal assistant. How I can help?',
        header_message: 'BELISA, Virtual assistant',
        start_conversation: []
      },
      recaptchaRef: React.createRef(),
      messagesEnd: React.createRef(),
      eventSource: ''
    };
  }

  scrollToBottom = () => {
    //console.log(this.state.messagesEnd);
    //window.HTMLElement.prototype.scrollIntoView = function() {};
    if(this.state.messagesEnd.current != null){
      this.state.messagesEnd.current.scrollIntoView({ behavior: "smooth"});
    }
  }

  onChangeRecaptchaLogin(value){
    //console.log('recaptcha: '+value);
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

  componentDidMount(){
      const client_id = this.props.location.query.i;
      const init = this.props.location.query.init;
      this.getSettings(client_id, init);
      this.initSettings();
      
      /*localStorage.removeItem('messages');
      localStorage.removeItem('token');
      localStorage.removeItem('key_temp');*/

      this.scrollToBottom();
      //var base= document.createElement('base');
      //base.target= '_parent';
      //base.href = 'http://www.w3.org/';
      //document.getElementsByTagName('head')[0].appendChild(base);
      //document.body.appendChild(base);
  }

  componentWillUnmount(){
    //this.state.eventSource.removeAllListeners();
    //this.state.eventSource.close();
  }

  componentDidUpdate(prevProps, prevState) {
    //console.log(this.state.listMessages);
    //console.log(prevState.listMessages.length);
    if(typeof this.state.listMessages != "undefined" && typeof prevState.listMessages != "undefined"){
      if(this.state.listMessages.length !== prevState.listMessages.length){
        this.scrollToBottom();
      }
    }
  } 

  //useEffect(() => {    document.title = 'You clicked 1 times';  });

  initSettings = () =>{
      if(this._vldParamasGet() == false){
      //if(true == false){
      }else{
        //console.log(localStorage.getItem('token'));
        //console.log(localStorage.getItem('messages'));
        if(localStorage.getItem('token') != "undefined" && localStorage.getItem('messages') != "undefined"){
          this.setState({showContHello : false});
          this.setState({showContChat : true});
          //this.getMessages();
          var items = JSON.parse(localStorage.getItem('messages')) || [];
          this.setState({'listMessages' : items});
          
          if(new ChatMessages().getManualResponse()){
              this.getMessagesSSE(this);
          }
        }
      }
      return null;
  }

  getSettings(client_id, init){
    var self = this;
    function setData(response) {
        self.setState({
            confChatInit: response,
        });
    }
    const result = axios.post(config.get('baseUrlApi')+'/api/v1/setting-init',JSON.stringify({}),
      {headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'x-dsi-restful-i' : client_id,
        'x-dsi-restful-init' : init
      }})
    .then(res => {
      setData(res.data.data.config[0]);
    }).catch(error => {
       if(error.response){
          if(error.response.status == 401){
            this.setState({errorInit: true});
          }
       }
    });
  }

  setMessage = (_type, message) =>{
    const items = new ChatMessages().setMessage(_type, message);
    //console.log(items);
    this.setState({'listMessages' : items});
  }

  setMessages(messages){
    if(messages.length > 0){
      const _messages = new ChatMessages().setMessages(messages);
      this.setState({'listMessages' : _messages});
    }
  }

  /*getMessages = () =>{
    async function _requestApi(_this){
        const _messages = await new ChatMessages().loadMessages();
        //console.log(_messages);
        if(typeof _messages != "undefined"){
          _this.setMessages(_messages);
        }else{
          _this.setState({showContHello : true});
          _this.setState({showContChat : false});
          _this.setState({inputMessage: ''});
        }
    }
    _requestApi(this);
  }*/


  _handleSend = (event)=>{
    event.preventDefault();
    if(localStorage.getItem('token') == "undefined" || localStorage.getItem('token') == null){
      this.setState({showContHello : true});
      this.setState({showContChat : false});
    }else{
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        event.stopPropagation();
        this.setState({validated : true});
      }else{
        this.setMessage('_req', {type:'Text', response: this.state.inputMessage});
        this.setState({inputMessage : ''});
        this.setState({validated : false});
        
        async function _requestApi(_this, form){
          const res = await new ChatMessages().sendMessage(_this.state.inputMessage);
          if(typeof res.messages == "undefined"){
            //console.log(res.messages);
            _this.closeSession();
          }else{
            if(!new ChatMessages().getManualResponse()){
              _this.setMessages(res.messages.items);
              //_this.setMessage('_res', res.response, res.previus_responses);
            }
            form.reset();
          }

          if(new ChatMessages().getManualResponse()){
              _this.getMessagesSSE(_this);
          }
        }

        _requestApi(this, form);
      }
    }  
  }

  getMessagesSSE(_this){
    var _strUrl = localStorage.getItem('token')+'&x-dsi1-restful='+localStorage.getItem('key_temp')+'&x-dsi2-restful='+localStorage.getItem('client_id');
    var sse = new ChatMessages().loadMessagesSSE(_strUrl);
    sse.onmessage = function(event){
      var _res = JSON.parse(event.data);
      _this.setMessages(_res.items);
    };

    sse.onerror = msg => {
    }
  }

  sendAction = (x, index, indexParent) =>{
    //console.log(x);
    const _items = this.state.listMessages;
    _items[indexParent]['msg'] = x.title;
    _items[indexParent]['type_resp'] = 'Text';
    localStorage.setItem('messages', JSON.stringify(_items));
    this.setState({'listMessages' : JSON.parse(localStorage.getItem('messages'))});
    this.setMessage('_req', {type:'Text', response: x.title});
    /**/
    async function _requestApi(_this, x){
      const res = await new ChatMessages().sendMessage(x.title, x.action);
      //if(typeof res.type != 'undefined'){
      //  _this.setMessage('_res', res);
      //}
      _this.setMessages(res.messages.items);
    }
    _requestApi(this, x);
  }

  _handleStarChat = (event) =>{
      event.preventDefault();
      this.state.recaptchaRef.current.execute();
      const form = event.currentTarget;
      const recaptchaValue = this.state.recaptchaRef.current.getValue();
      if (form.checkValidity() === false || recaptchaValue.length == 0) {
          event.stopPropagation();
          this.setState({validated : true});
      }else{
        //console.log(recaptchaValue);
        this.setState({validated : false});
        const client_id = this.props.location.query.i;
        const init = this.props.location.query.init;
        var url = (window.location != window.parent.location)
                ? document.referrer
                : document.location.href;
        axios.post(
          config.get('baseUrlApi')+'/api/v1/auth',
          JSON.stringify({name: this.state.inputName, email: this.state.inputEmail, telephone: this.state.inputTelephone}), 
          {headers: {
            'Content-Type': 'application/json;charset=UTF-8', 
            'x-dsi-restful-i' :  client_id,
            'x-dsi-restful-init' : init,'x-dsi-time' : 2300
          }}
        ).then(res => {
             this.setState({showContHello : false});
             this.setState({showContChat : true});
             this.setState({'listMessages' : []});
             localStorage.setItem('messages', []);

             localStorage.removeItem('manual_response');
             localStorage.setItem('token', res.data.data.token);
             localStorage.setItem('key_temp', res.data.data.key_temp);
             localStorage.setItem('client_id', client_id);

             const _init = this.state.confChatInit;
             this.setMessage('_res', {type: 'Text', response: _init.welcome_message});
        }).catch(error => {
            if(error.response){
              if(error.response.status == 401){
                this.setState({errorInit: true});
              }
            }
        }).then(function () {
              // always executed
        });
      }
  }


  /*#########EVENTS CHANGES###########*/
  inputChange = (e, index, indexParent) =>{
    const _value = e.target.value;
    const _items = this.state.listMessages;
    _items[indexParent]['msg']['inputs'][index]['value'] = _value;
    const _validation = _items[indexParent]['msg']['inputs'][index]['validation'];
    /*validation*/
    //const _result = new Validation()._validation(_value, _validation);
    const _result = new ChatMessages()._validation(_value, _validation);
    _items[indexParent]['msg']['inputs'][index]['classValidation'] = _result._class;
    _items[indexParent]['msg']['inputs'][index]['errorValidation'] = _result.error;
    /*validation*/
    //this.setState({listMessages: _items});
    localStorage.setItem('messages', JSON.stringify(_items));
    this.setState({'listMessages' : JSON.parse(localStorage.getItem('messages'))});
  }

  statusValidation(result, item, index,indexParent){
    const _items = this.state.listMessages;
    _items[indexParent]['msg']['inputs'][index]['validation'] = result.error;
    //this.setState({listMessages: _items});
    /*##*/
    localStorage.setItem('messages', JSON.stringify(_items));
    this.setState({'listMessages' : JSON.parse(localStorage.getItem('messages'))});
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
    //this.setState({listMessages: _items});
    localStorage.setItem('messages', JSON.stringify(_items));
    this.setState({'listMessages' : JSON.parse(localStorage.getItem('messages'))});
  }

  updateScheduleEvents = (itemSelected, events, index, indexParent) =>{
     const _items = this.state.listMessages;
     _items[indexParent]['msg']['inputs'][index]['itemSelected'] = itemSelected;
     _items[indexParent]['msg']['inputs'][index]['items'] = events;
     //this.setState({listMessages: _items});
     localStorage.setItem('messages', JSON.stringify(_items));
     this.setState({'listMessages' : JSON.parse(localStorage.getItem('messages'))});
  }

  successSentForm = (indexParent, code) => {
    const _items = this.state.listMessages;
    if(code == 200){
      _items[indexParent]['status'] = 'Form-Sent-Success';
    }else if(code == 423){
      _items[indexParent]['status'] = 'Form-Error-Saved';
    }
    /**/
    localStorage.setItem('messages', JSON.stringify(_items));
    this.setState({'listMessages' : JSON.parse(localStorage.getItem('messages'))});
  }
  /*#########EVENTS CHANGES###########*/

  closeSession = (event) =>{
      localStorage.removeItem('messages');
      localStorage.removeItem('token');
      localStorage.removeItem('key_temp');
      localStorage.removeItem('client_id');
      localStorage.removeItem('manual_response');
      this.setState({showContHello : true});
      this.setState({showContChat : false});
  }

  render() {
    //add recaptcha..
    if(this._vldParamasGet() == false){
    //if(true == false){
      return (
          <div style={{margin: "10px", width: "auto"}} role="alert" className="fade alert alert-danger show">
               Oops, something is wrong. Please contact the administrator.
          </div>
      );
    }else if(this.state.errorInit == false){
        return (
              <div id="chat" >
                      {this.state.showContHello && 
                          <div className="contHello">
                                  <Form noValidate validated={this.state.validated} onSubmit={this._handleStarChat}>
                                    <div dangerouslySetInnerHTML={{__html: this.state.confChatInit.welcome_message_init}}></div>
                                    <Form.Group controlId="formName">
                                      <Form.Control autocomplete="off" required value={this.state.inputName} onChange={this.inp = (e) => {this.setState({inputName: e.target.value})}} type="text" placeholder="Enter Name" />
                                      <Form.Label >Enter Name</Form.Label>
                                    </Form.Group>

                                    {this.state.confChatInit.start_conversation.map((item, index) => {
                                        if(item == 'Email'){
                                          return (<Form.Group key={index} controlId="formEmail">
                                                    <Form.Control autocomplete="off" required placeholder="Enter Email"  value={this.state.inputEmail} onChange={this.inp = (e) => {this.setState({inputEmail: e.target.value})}} type="email" />
                                                    <Form.Label >Enter Email</Form.Label>
                                                  </Form.Group>);
                                        }else if(item == 'Telephone'){
                                          return (<Form.Group key={index} controlId="formTelephone">
                                                    <Form.Control autocomplete="off" required placeholder="Enter Telephone"  type="text" value={this.state.inputTelephone} onChange={this.inp = (e) => {this.setState({inputTelephone: e.target.value})}}/>
                                                    <Form.Label >Enter Telephone</Form.Label>
                                                  </Form.Group>);
                                        }
                                    })}

                                    <ReCAPTCHA
                                      size="invisible"
                                      ref={this.state.recaptchaRef}
                                      sitekey="6Lef87EZAAAAAFydGK3frj6cN9f3-swocdFoCgHP"
                                      onChange={this.onChangeRecaptchaLogin}
                                    />

                                    <div className="contentBtn">
                                      <Button variant="outline-primary" type="submit">
                                        Start Conversation
                                      </Button>
                                    </div>
                                  </Form>
                                <p className="termsRecaptcha">This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy">Privacy Policy</a> and <a href="https://policies.google.com/terms">Terms of Service</a> apply.</p>
                          </div>
                      }
                      
                      {this.state.showContChat && 
                              <div className="contChat">
                                    
                                    <div className="contentResponse" >
                                      {(this.state.listMessages || []).map((item, index) => {
                                        if(item.type == '_req'){
                                          return new ChatMessages().messageClien(index, item, this.state.listMessages, this.state.messagesEnd);
                                        }else if(item.type == '_res'){
                                          return new ChatMessages().messageResponse(
                                            index, 
                                            item, 
                                            this.state.listMessages, 
                                            this.state.messagesEnd, 
                                            this.sendAction,
                                            this.setMessage,
                                            this.statusValidation,
                                            this.inputChange,
                                            this.inputChangeOptions,
                                            this.updateScheduleEvents,
                                            this.successSentForm,
                                            this.closeSession
                                          );
                                        }
                                      })}
                                      {/*<div style={{ marginTop: 20 }}>{JSON.stringify(this.state.listMessages)}</div>*/}
                                    </div>

                                    
                                    <Form noValidate validated={this.state.validated} onSubmit={this._handleSend}>
                                        <div className="contentSend">
                                          <Form.Group  controlId="sendMessage">
                                            <InputGroup>
                                                <FormControl placeholder="Add Message" required minLength="3" value={this.state.inputMessage} size="lg" onChange={this.inp = (e) => {this.setState({inputMessage: e.target.value})}}
                                                  aria-label="Add Message"
                                                  autocomplete="off"
                                                />
                                                <Form.Label >Message</Form.Label>

                                                <InputGroup.Append className="btnSend">
                                                  <Button size="lg" type="submit" variant="outline-secondary">Send</Button>
                                                </InputGroup.Append>
                                            </InputGroup>
                                          </Form.Group>
                                        </div>
                                    </Form>
                              </div>
                      }
              </div>
        );
    }else{
      return (
        <div style={{margin: "10px", width: "auto"}} role="alert" className="fade alert alert-danger show">
             Oops, something is wrong. Please contact the administrator.
        </div>
      );
    }
  }
}
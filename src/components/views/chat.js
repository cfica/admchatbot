import React, { Component,useState, useEffect,useRef } from "react";
import ReactDOM from 'react-dom';
import { Alert, Navbar, Nav, ButtonGroup, DropdownButton, Dropdown, InputGroup,Modal, Collapse,Form,NavDropdown,FormControl,Container, Row, Col,Media,Jumbotron, Button, Breadcrumbs, Table} from 'react-bootstrap';
import config from 'react-global-configuration';
import axios from 'axios';
import  { Redirect } from 'react-router-dom';
import { browserHistory } from 'react-router';
import './../css/belisa.css';
import Utils from './utils';
import {GetSlide} from './components/slide';
import {Helper} from './components/helper';
import {VarStorage} from './components/varsStorage';
//import {Validation} from './components/componentsUtils';
import ReCAPTCHA from "react-google-recaptcha";
import * as moment from 'moment';
import * as Icon from 'react-bootstrap-icons';
//events



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
      confChatInit: {
        welcome_message_init: '<p>Please complete the following information to start a conversation.</p>',
        welcome_message: 'Hello, My name is BELISA and I am a virutal assistant. How I can help?',
        header_message: 'BELISA, Virtual assistant',
        start_conversation: []
      },
      recaptchaRef: React.createRef(),
      messagesEnd: React.createRef(),
      connectionSSE: null
    };
  }

  scrollToBottom() {
    if(this.state.messagesEnd.current != null){
      this.state.messagesEnd.current.scrollIntoView({"behavior": "smooth", 'block': "center", 'scrollMode': 'if-needed'});
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
      this.scrollToBottom();
  }

  componentWillUnmount(){

  }

  componentDidUpdate(prevProps, prevState) {
    if(typeof this.state.listMessages != "undefined" && typeof prevState.listMessages != "undefined"){
      //console.log(this.state.listMessages.length, '1');
      //console.log(prevState.listMessages.length, '2');
      if(this.state.listMessages.length == prevState.listMessages.length){
        this.scrollToBottom();
      }
    }
  } 

  //useEffect(() => {    document.title = 'You clicked 1 times';  });

  initSettings = () =>{
      if(this._vldParamasGet() == false){
      }else{
        //if(new VarStorage().getToken() && new VarStorage().getMessages()){
        if(new VarStorage().getToken()){
          this.setState({showContHello : false});
          this.setState({showContChat : true});
          //this.getMessages();
          var items = JSON.parse(new VarStorage().getMessages()) || [];
          this.setState({'listMessages' : items});
          
          if(new VarStorage().getManualResponse()){
              this.getMessagesSSE(this);
          }
        }else{
          this._closeSession();
        }
      }
      return null;
  }



  getSettings(client_id, init){
    async function _requestApi(_this){
        var _url = config.get('baseUrlApi')+'/api/v1/setting-init';
        const res = await new Helper().getRequest(_url,'init',{client_id: client_id, init: init});
        //console.log(res);
        if(res){
          _this.setState({confChatInit: res.config[0]});
        }

    }
    _requestApi(this);
  }


  /*loadMessages(){
    async function _requestApi(_this){
      const items = await new Helper().loadMessages();
      _this.setState({'listMessages' : items});
    }
    _requestApi(this);
  }*/


  setMessage = (message) =>{
    console.log(message);
    const _items = this.state.listMessages;
    const _newItems = _items;

    if(message.type_resp == 'Form'){
       _items.forEach(function(el, index){
         if(el.type_resp == 'Form'){
             _newItems[index]['status'] = 'Form-Exists';
         }
       });
       message.status = 'Init';
    }

    _newItems.push(message);

    this.setState({'listMessages' : _newItems});
    new VarStorage().setMessages(JSON.stringify(_newItems));

    this.scrollToBottom();
  }

  setMessages(messages){
    if(messages.length > 0){
      //const _messages = new Helper().setMessages(messages);
      this.setState({'listMessages' : messages});
      new VarStorage().setMessages(JSON.stringify(messages));
    }
  }

  syncMessage(message, form = null){
      async function _requestApi(_this, message, form){
        const res = await new Helper().sendMessage(message);
        if(typeof res == "undefined"){
          _this.closeSession();
        }else{
            if(!new VarStorage().getManualResponse()){
              //console.log(res);
              //_this.setMessages(res.messages.items);
              _this.setMessage(res.response);
            }
            if(form){
              form.reset();
            }
        }
      }
      _requestApi(this, message, form);
  }




  sendMessage = (event)=>{
    event.preventDefault();
    if(!new VarStorage().getToken()){
      this.setState({showContHello : true});
      this.setState({showContChat : false});
    }else{
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        event.stopPropagation();
        this.setState({validated : true});
      }else{
        const msg = {
             _id: '',
             type : '_req',
             msg : this.state.inputMessage, 
             type_resp: 'Text', 
             status: '',
             _created: moment().format('YYYY-MM-DD H:mm:ss')
        };
        this.setMessage(msg); //request
        var message = this.state.inputMessage;
        this.setState({inputMessage : ''});
        this.setState({validated : false});
        this.syncMessage(message, form);
      }
    }  
  }

  menu = (event)=>{
    async function _requestApi(_this){
      const res = await new Helper().sendMessage('Topics', 'Topics');
      if(typeof res.messages != "undefined"){
        _this.setMessage(res.response);
      }
    }
    _requestApi(this);
  }

  sendAction = (x, index, indexParent) =>{
      const msg = {
           _id: '',
           type : '_req',
           msg : x.title, 
           type_resp: 'Text', 
           status: '',
           _created: moment().format('YYYY-MM-DD H:mm:ss')
      };
      this.setMessage(msg); //request

      async function _requestApi(_this, x){
        const res = await new Helper().sendMessage(x.title, x.action, {id: x.value});
        if(typeof res.messages != "undefined"){
          _this.setMessage(res.response);
        }

        if(x.action == "Contact" && new VarStorage().getManualResponse()){
          if(typeof res.options._id != "undefined"){
            new VarStorage().setManualResponse(res.options._id);
          }
        }

        if(new VarStorage().getManualResponse()){
           _this.getMessagesSSE(_this, null, res.options._id);
        }
      }
      _requestApi(this, x);
  }

  sendRequestMessage(_message, _type = null, _options = null){
    const msg = {
         _id: '',
         type : '_req',
         msg : _message, 
         type_resp: 'Text', 
         status: '',
         _created: moment().format('YYYY-MM-DD H:mm:ss')
    };
    this.setMessage(msg); //request

    async function _requestApi(_this, _message, _options){
      const res = await new Helper().sendMessage(_message, _type, _options);
      //console.log(res);
      if(typeof res.messages == "undefined"){
        //console.log(res.messages);
        _this.closeSession();
      }else{
        if(!new VarStorage().getManualResponse() && res.messages.length > 0){
          //_this.setMessages(res.messages.items);
        }
      }

      if(_type == "Contact_End"){
         _this.getMessagesSSE(_this, true);
      }
    }
    _requestApi(this, _message, _options);
  }

  endConversationManual = (event) =>{
    this._endConversationManual();
  }

  _endConversationManual(){
    var _id = new VarStorage().getManualResponse();
    new VarStorage().setManualResponse(false);
    this.sendRequestMessage("Conversation ended", "Contact_End", {id: _id});
  }

  getMessagesSSE(_this, _close = null, _idcontact = null){
    var sse = this.state.connectionSSE;
    if(sse){
      if(_close){
        sse.close();
        this.setState({connectionSSE: null});
      }
    }else{
        if(_idcontact != null){
          var _strUrl = new VarStorage().getToken()+'&x-dsi1-restful='+new VarStorage().getKeyTemp()+'&x-dsi2-restful='+new VarStorage().getClientId()+'&_id='+_idcontact;
          var sse = new Helper().loadMessagesSSE(_strUrl);
          this.setState({connectionSSE: sse});

          sse.onmessage = function(event){
            var _res = JSON.parse(event.data);
            _this.setMessages(_res.items);
          };

          var self = this;
          sse.addEventListener('message', function(event) {
              var data = JSON.parse(event.data);
              //console.log(data);
              if(data.state == 'processing' && data.status == 'closed'){
                sse.close();
                new VarStorage().setManualResponse(false);
                self.setState({connectionSSE: null});
              }
          }, false);

          sse.onerror = msg => {
          }
        }
    }
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
        var url = (window.location != window.parent.location)
                ? document.referrer
                : document.location.href; /*?*/
        
        
        async function _requestApi(_this){
            var _url = config.get('baseUrlApi')+'/api/v1/auth';
            var _data = {name: _this.state.inputName, email: _this.state.inputEmail, telephone: _this.state.inputTelephone};
            const res = await new Helper().postRequest(_url, _data, 'auth', {client_id: _this.props.location.query.i, init: _this.props.location.query.init});
            //console.log(res, 'start res');
            if(typeof res != "undefined"){
               _this.setState({showContHello : false});
               _this.setState({showContChat : true});
               _this.setState({'listMessages' : []});

               //new VarStorage().setMessages([]);
               new VarStorage().setToken(res.token);
               new VarStorage().setNameClient(_this.state.inputName);
               new VarStorage().setKeyTemp(res.key_temp);
               new VarStorage().setClientId(_this.props.location.query.i);
               new VarStorage().delManualResponse();

               const _init = _this.state.confChatInit;
                const msg = {
                     _id: '',
                     type : '_res',
                     msg : _init.welcome_message, 
                     type_resp: 'Text', 
                     status: '',
                     _created: moment().format('YYYY-MM-DD H:mm:ss')
                };
                _this.setMessage(msg); //request
                _this.syncMessage(_init.welcome_message);
            }
        }
        _requestApi(this);
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
    const _result = new Helper()._validation(_value, _validation);
    _items[indexParent]['msg']['inputs'][index]['classValidation'] = _result._class;
    _items[indexParent]['msg']['inputs'][index]['errorValidation'] = _result.error;
    /*validation*/
    //this.setState({listMessages: _items});
    //new VarStorage().setMessages(JSON.stringify(_items));
    //this.setState({'listMessages' : JSON.parse(new VarStorage().getMessages())});
    this.setState({'listMessages' : _items});
  }

  statusValidation(result, item, index,indexParent){
    const _items = this.state.listMessages;
    _items[indexParent]['msg']['inputs'][index]['validation'] = result.error;
    //this.setState({listMessages: _items});
    /*##*/
    //new VarStorage().setMessages(JSON.stringify(_items));
    //this.setState({'listMessages' : JSON.parse(new VarStorage().getMessages())});
    this.setState({'listMessages' : _items});
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
    //new VarStorage().setMessages(JSON.stringify(_items));
    //this.setState({'listMessages' : JSON.parse(new VarStorage().getMessages())});
    this.setState({'listMessages' : _items});
  }

  updateScheduleEvents = (itemSelected, events, index, indexParent) =>{
     const _items = this.state.listMessages;
     _items[indexParent]['msg']['inputs'][index]['itemSelected'] = itemSelected;
     _items[indexParent]['msg']['inputs'][index]['items'] = events;
     //this.setState({listMessages: _items});
     //new VarStorage().setMessages(JSON.stringify(_items));
     //this.setState({'listMessages' : JSON.parse(new VarStorage().getMessages())});
     this.setState({'listMessages' : _items});
  }

  successSentForm = (indexParent, code) => {
    const _items = this.state.listMessages;
    if(code == 200){
      _items[indexParent]['status'] = 'Form-Sent-Success';
    }else if(code == 423){
      _items[indexParent]['status'] = 'Form-Error-Saved';
    }
    //console.log(code);
    //console.log(_items);
    /**/
    //new VarStorage().setMessages(JSON.stringify(_items));
    //this.setState({'listMessages' : JSON.parse(new VarStorage().getMessages())});
    this.setState({'listMessages' : _items});
  }
  /*#########EVENTS CHANGES###########*/

  closeSession = (event) =>{
      this._closeSession();
  }

  _closeSession(){
      if(new VarStorage().getManualResponse()){
        this._endConversationManual();
      }
      new VarStorage().delAll();
      this.setState({showContHello : true});
      this.setState({showContChat : false});
  }

  /*minimizeIframe = (event) =>{
    //console.log(window.parent);
    window.parent.document.body.getElementById('fhgt45a4fgsl-open-button').style.display = "none";
    window.parent.document.body.getElementById('fhgt45a4fgsl-form-chat').style.display = "none";
  }*/



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
                      
                      {/*<div class="fhgt45a4fgsl-cont-top">            
                        <div class="fhgt45a4fgsl-cont-top-title"><h1>Asistente Virtual</h1></div>            
                        <div class="fhgt45a4fgsl-cont-top-action"> 
                          <ul>                
                            <li><a href="#" class="minimize" onClick={this.minimizeIframe} title="Minimize"><span>-</span></a>
                            </li>              
                          </ul>            
                        </div>          
                      </div>*/}


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
                                          return new Helper().messageClient(index, item, this.state.listMessages, this.state.messagesEnd);
                                        }else if(item.type == '_res'){
                                          return new Helper().messageResponse(
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

                                        //console.log(index);
                                        //console.log((this.state.listMessages.length - 1))
                                        
                                        //if(index == (this.state.listMessages.length - 1)){
                                          //return(<div className="endMessages" ref={this.state.messagesEnd}></div>);
                                        //}
        

                                      })}
                                     

                                      {/*<div style={{ marginTop: 20 }}>{JSON.stringify(this.state.listMessages)}</div>*/}
                                    </div>

                                    {/*}
                                      <div className="options">
                                            <ButtonGroup size="sm">
                                              <DropdownButton variant="outline-secondary" as={ButtonGroup} title="Options" id="bg-nested-dropdown">
                                                

                                              </DropdownButton>

                                            </ButtonGroup>
                                      </div>*/}
                                    

                                    
                                    <Form className="form-chat-send" noValidate validated={this.state.validated} onSubmit={this.sendMessage}>
                                        <div className="contentSend">
                                          <Form.Group  controlId="sendMessage">
                                            <InputGroup>
                                                <FormControl placeholder="Add Message" required minLength="3" value={this.state.inputMessage} size="lg" onChange={this.inp = (e) => {this.setState({inputMessage: e.target.value})}}
                                                  aria-label="Add Message"
                                                  autocomplete="off"
                                                />
                                                <Form.Label >Message</Form.Label>

                                                <InputGroup.Append className="btnSend">
                                                  <Button size="lg" type="submit" variant="outline-secondary"><Icon.ArrowReturnLeft className="ml-4" size={23}/></Button>
                                                </InputGroup.Append>
                                            </InputGroup>
                                          </Form.Group>
                                        </div>

                                        <div className="options dropdown-options-3p">
                                            <DropdownButton
                                                menuAlign="right"
                                                title="..."
                                                id="dropdown-menu"
                                              >

                                                {new VarStorage().getManualResponse() &&
                                                  <Dropdown.Item eventKey="1" onClick={this.endConversationManual}>End conversation</Dropdown.Item>
                                                }

                                                <Dropdown.Item eventKey="2" onClick={this.menu}>Menu</Dropdown.Item>

                                                <Dropdown.Divider />
                                                <Dropdown.Item eventKey="3" onClick={this.closeSession}>Close Sesion</Dropdown.Item>
                                              </DropdownButton>
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
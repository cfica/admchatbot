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
import {InputsTypeForm,ResponseForm,Validation,ResponseTopic} from './components/componentsUtils';
import ReCAPTCHA from "react-google-recaptcha";
import * as moment from 'moment';
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
      messagesEnd: React.createRef()
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
    console.log('recaptcha: '+value);
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

  componentDidUpdate(prevProps, prevState) {
    if(this.state.listMessages.length !== prevState.listMessages.length){
      this.scrollToBottom();
    }
  } 

  //useEffect(() => {    document.title = 'You clicked 1 times';  });

  initSettings = () =>{
      if(this._vldParamasGet() == false){
      //if(true == false){
      }else{
        //console.log(localStorage.getItem('token'));
        if(localStorage.getItem('token') != undefined && localStorage.getItem('messages') != undefined){
          this.setState({showContHello : false});
          this.setState({showContChat : true});
          this.setState({'listMessages' : JSON.parse(localStorage.getItem('messages'))});
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

  setMessage = (_type,message) =>{
    const item = {
        _id: message._id,
        type : _type,
        msg : message.response, 
        type_resp: message.type, 
        status: '',
        _created: moment()
    };
    var oldItems = JSON.parse(localStorage.getItem('messages')) || [];
    const items = oldItems.slice();
    if(item.type_resp == 'Form'){
      items.forEach(function(el, index){
        if(el.type_resp == 'Form'){
            items[index]['status'] = 'Form-Exists';
        }
      });
      item.status = 'Init';
    }
    console.log(items);
    items.push(item);
    localStorage.setItem('messages', JSON.stringify(items));
    this.setState({'listMessages' : JSON.parse(localStorage.getItem('messages'))});
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
          this.setState({validated : false});
          var _dataPost = {"message" : this.state.inputMessage};
          axios.post(config.get('baseUrlApi')+'/api/v1/message',JSON.stringify(_dataPost), 
              {headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization' : 'Bearer ' + localStorage.getItem('token'),
                'x-dsi-restful' : localStorage.getItem('key_temp'),
                'x-dsi2-restful' : localStorage.getItem('client_id')
              }}
          ).then(res => {
              this.setMessage('_res', res.data.data);
              form.reset();
          }).catch(function (error) {
            if(error.response){
                if(error.response.status == 403){
                    localStorage.removeItem('messages');
                    localStorage.removeItem('token');
                    localStorage.removeItem('key_temp');
                    localStorage.removeItem('client_id');
                }
            }
          }).then(function () {
                // always executed
          });

          if(localStorage.getItem('token') == undefined){
            this.setState({showContHello : true});
            this.setState({showContChat : false});
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
            'x-dsi-restful-init' : init,'x-dsi-time' : 1800
          }}
        ).then(res => {
             this.setState({showContHello : false});
             this.setState({showContChat : true});
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
    const _result = new Validation()._validation(_value, _validation);
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
                                      {this.state.listMessages.map((item, index) => {
                                        if(item.type == '_req'){
                                          return (
                                            <div key={index} className="contentMessageClient" ref={index == (this.state.listMessages.length - 1)  ? this.state.messagesEnd : ''}>
                                                <div>
                                                   <div className="contentUser">
                                                          <h5>You</h5>
                                                          <span>{moment(item._created).fromNow()}</span>
                                                   </div>
                                                   <div className="contentMsg">
                                                        <span>{item.msg}</span>
                                                   </div>
                                                </div>
                                            </div>
                                          );
                                        }else if(item.type == '_res'){
                                              return(
                                                    <div key={index} className="contentMessageChat" ref={index == (this.state.listMessages.length - 1)  ? this.state.messagesEnd : ''}>
                                                           <div>
                                                               <div className="contentUser">
                                                                    <h5>Belisa</h5>
                                                                    <span>{moment(item._created).fromNow()}</span>
                                                               </div>

                                                               <div className="contentMsg">
                                                                  {item.type_resp == 'Text' && 
                                                                      <span>{item.msg}</span>
                                                                  }
                                                                 
                                                                  {item.type_resp == 'Html' &&
                                                                    <div dangerouslySetInnerHTML={{__html: item.msg}}></div>
                                                                  }

                                                                  {item.type_resp == 'Topic' &&
                                                                        <ResponseTopic
                                                                            index = {index}
                                                                            messageData = {item.msg}
                                                                            messageId = {item._id}
                                                                        />
                                                                  }

                                                                  {item.type_resp == 'Form' && item.status == 'Init' &&
                                                                        <ResponseForm
                                                                            setMessage = {this.setMessage}
                                                                            statusValidation = {this.statusValidation}
                                                                            index = {index}
                                                                            messageData = {item.msg}
                                                                            messageId = {item._id}
                                                                            inputChange = {this.inputChange}
                                                                            inputChangeOptions = {this.inputChangeOptions}
                                                                            updateScheduleEvents = {this.updateScheduleEvents}
                                                                            successSentForm = {this.successSentForm}
                                                                            closeSession = {this.closeSession}
                                                                        />
                                                                  }

                                                                  {item.type_resp == 'Form' && item.status == 'Form-Exists' &&
                                                                     <div>Form disable.</div>
                                                                  }

                                                                  {item.type_resp == 'Form' && item.status == 'Form-Sent-Success' &&
                                                                     <div>Form sent correctly.</div>
                                                                  }

                                                                  {item.type_resp == 'Form' && item.status == 'Form-Error-Saved' &&
                                                                     <div className="is-invalid">
                                                                      *The form could not be saved, the reasons are:<br/>
                                                                      1.- You already made a reservation previously.<br/>
                                                                      2.- The time is not available.
                                                                     </div>
                                                                  }

                                                                  {item.type_resp == 'Slide' &&
                                                                        <div>
                                                                          <span>{item.msg.textResponse}</span>
                                                                          <GetSlide
                                                                                index = {index}
                                                                                messageData = {item.msg}
                                                                          />
                                                                        </div>
                                                                  }
                                                               </div>
                                                           </div>
                                                    </div>
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
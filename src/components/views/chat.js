import React, { Component } from "react";
import { Alert, Navbar, Nav, InputGroup,Modal, Collapse,Form,NavDropdown,FormControl,Container, Row, Col,Media,Jumbotron, Button, Breadcrumbs, Table} from 'react-bootstrap';
import config from 'react-global-configuration';
import axios from 'axios';
import  { Redirect } from 'react-router-dom';
import { browserHistory } from 'react-router';
import './../css/belisa.css';
import Utils from './utils';
import {InputsTypeForm,ResponseForm,Validation} from './components/componentsUtils';

export default class Login extends Component {
  constructor(props){
    super(props);
    this.state = {
      validated : false,
      errorSaveForm: '',
      inputMessage: '',
      listMessages: [],
      token : '',
      key_temp : '',
      client_id : '',
      showContChat: false,
      showContHello: true,
      inputName: '',
      inputEmail: '',
      inputTelephone: '',
      welcomeInputs:[],
      welcomeMessageInit: '',
      confChatInit: ''
    };
    
  }

  componentDidMount(){
      this.initSettings();
  }

  componentDidUpdate(){}


  initSettings = () =>{
      const client_id = this.props.location.query.i;
      /*localStorage.removeItem('messages');
      localStorage.removeItem('token');
      localStorage.removeItem('key_temp');
      localStorage.removeItem('confChatInit');*/

      //if(this._vldParamasGet() == false){
      if(true == false){
      }else{
        if(localStorage.getItem('token') != undefined &&
           localStorage.getItem('confChatInit') != undefined &&
           localStorage.getItem('messages') != undefined){
          this.setState({showContHello : false});
          this.setState({showContChat : true});
          this.setState({'listMessages' : JSON.parse(localStorage.getItem('messages'))});
        }else{
          this.setState({showContHello : true});
          this.setState({showContChat : false});
          const client_id = this.props.location.query.i;
          const init = this.props.location.query.init;
          this.getSettings(client_id, init);
          
          console.log(localStorage.getItem('confChatInit'));
          console.log(this.state.confChatInit);

          if(localStorage.getItem('confChatInit') == undefined){
              this.setState({welcomeInputs: config.get('chat_welcome_inputs')});
              this.setState({welcomeMessageInit: config.get('chat_welcome_message_init')});
          }else{
              const _init = JSON.parse(localStorage.getItem('confChatInit'));
              this.setState({welcomeInputs: _init.start_conversation});
              this.setState({welcomeMessageInit: _init.welcome_message_init});
          }
        }
      }
      return null;
  }

  async getSettings(client_id, init){
    const response = await axios.post(config.get('baseUrlApi')+'/api/v1/setting-init',JSON.stringify({}),{headers: {'Content-Type': 'application/json;charset=UTF-8','x-dsi-restful-i' : client_id,'x-dsi-restful-init' : init}});
    const data = await response;
    const result = data.data.data.config[0]; 
    localStorage.setItem('confChatInit', JSON.stringify(result));
    this.setState({'confChatInit': result});
  }

  setMessage = (_type,message) =>{
    const item = {'type' : _type,'msg' : message.response, type_resp: message.type};
    var oldItems = JSON.parse(localStorage.getItem('messages')) || [];
    const items = oldItems.slice();
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
          //
          this.setState({validated : false});
          var _dataPost = {"message" : this.state.inputMessage};
          axios.post(config.get('baseUrlApi')+'/api/v1/message',JSON.stringify(_dataPost), 
              {headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization' : 'Bearer ' + localStorage.getItem('token'),
                'x-dsi-restful' : localStorage.getItem('key_temp')
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
                    localStorage.removeItem('confChatInit');
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
             localStorage.setItem('token', res.data.data.token);
             localStorage.setItem('key_temp', res.data.data.key_temp);
             
             if(localStorage.getItem('confChatInit') == undefined){
              this.setMessage('_res', {type: 'Text', response: config.get('chat_welcome_message_start')});
             }else{
                const _init = JSON.parse(localStorage.getItem('confChatInit'));
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
    const _validation = _items[indexParent]['msg']['inputs'][index]['validation'];
    /*validation*/
    const _result = new Validation()._validation(_value, _validation);
    _items[indexParent]['msg']['inputs'][index]['classValidation'] = _result._class;
    _items[indexParent]['msg']['inputs'][index]['errorValidation'] = _result.error;
    /*validation*/
    this.setState({listMessages: _items});
  }

  statusValidation(result, item, index,indexParent){
    const _items = this.state.listMessages;
    _items[indexParent]['msg']['inputs'][index]['validation'] = result.error;
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
            <div id="chat" >
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
                              return (<Form.Group key={index} controlId="formEmail">
                                        <Form.Control required placeholder="Enter Email"  value={this.state.inputEmail} onChange={this.inp = (e) => {this.setState({inputEmail: e.target.value})}} type="email" />
                                        <Form.Label >Enter Email</Form.Label>
                                      </Form.Group>);
                            }else if(item == 'Telephone'){
                              return (<Form.Group key={index} controlId="formTelephone">
                                        <Form.Control required placeholder="Enter Telephone"  type="text" value={this.state.inputTelephone} onChange={this.inp = (e) => {this.setState({inputTelephone: e.target.value})}}/>
                                        <Form.Label >Enter Telephone</Form.Label>
                                      </Form.Group>);
                            }
                        })}

                        <div className="contentBtn">
                          <Button variant="outline-primary" type="submit">
                            Start Conversation
                          </Button>
                        </div>
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
                                                   <div key={"i"+index}>
                                                       <div className="contentUser"><h5>Belisa</h5></div>
                                                       <div className="contentMsg">
                                                            <ResponseForm
                                                                setMessage = {this.setMessage}
                                                                statusValidation = {this.statusValidation}
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
                                  <div className="contentSend">
                                    <Form.Group  controlId="sendMessage">
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
                                  </div>
                              </Form>
                        </div>
                  }
            </div>
          );
    }
  }
}
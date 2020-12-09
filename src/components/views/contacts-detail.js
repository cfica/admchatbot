import React, { Component } from "react";
import config from 'react-global-configuration';
import $ from "jquery";
import Mousewheel from "jquery-mousewheel";
import mCustomScrollbar from "malihu-custom-scrollbar-plugin";
import SidebarMenu from './components/sidebar-menu';
import {ChatMessages} from './components/chat';
import SidebarAction from './components/sidebar-action';
import { Alert, Navbar, Nav, DropdownButton, Dropdown, Tab, Modal, Badge, Tabs, InputGroup, Collapse, ButtonGroup,ListGroup, Form,NavDropdown,FormControl,Container, Row, Col,Media,Jumbotron, Button, Breadcrumbs, Table} from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import ModalToLearn from './components/modal-add-pattern';
import { browserHistory } from 'react-router';


export default class ContactDetail extends Component {
	constructor(props) {
	    super(props);
	    if(localStorage.getItem('tokenAdm') == undefined){
	      browserHistory.push('/login');
	    }

	    this.state = {
    	  scope: ['admin'].includes(localStorage.getItem('scope')),
          token: localStorage.getItem('tokenAdm'),
          user_id: localStorage.getItem('_id'),
          client: localStorage.getItem('client'),
	      error: null,
	      perPage: 50,
	      items: [],
	      offset: 0,
	      showModalToLearn: false,
	      itemsAccess: [],
	      patternSelected: [],
	      validated : false,
	      inputMessage: '',
	      listMessages: [],
	      detail: {},
	      connectionSSE: null
	    };
	}

	setMessage = (_type, message) =>{
	    const items = new ChatMessages().setMessageV2(_type, message);
	    this.setState({'listMessages' : items});
	}

	setMessages(messages){
	    const _messages = new ChatMessages().setMessagesV2(messages);
	    this.setState({'listMessages' : _messages});
	}

	componentDidMount(){
		localStorage.setItem('m_messages', []);	

	    this.getMessagesSSE(this);
	    /*##*/
	    async function _requestApi(_this){
		    var _url = config.get('baseUrlApi')+'/api/v1/contact?id='+_this.props.params.id;
		    const res = await new ChatMessages().getRequest(_url,'back');
		    //console.log(res);
		    _this.setState({'detail': res});
		}
		_requestApi(this);
	}

	getMessagesSSE(_this){
		var sse = this.state.connectionSSE;
		if(sse){
			//close
		}else{
			var _strUrl = localStorage.getItem('tokenAdm')+'&x-dsi1-restful=&x-dsi2-restful='+localStorage.getItem('client')+'&x-dsi3-restful='+localStorage.getItem('_id')+'&_id='+this.props.params.id; 
		    var sse = new ChatMessages().loadMessagesSSE(_strUrl);
		    sse.onmessage = function(event){
		      var _res = JSON.parse(event.data);
		      _this.setMessages(_res.items);
		    };

		    sse.onerror = msg => {
		    }
		}
	}

	startChat = (event) =>{
		async function _requestApi(_this){
		    var _url = config.get('baseUrlApi')+'/api/v1/contact';
		    const res = await new ChatMessages().putRequest(_url, {'id': _this.props.params.id, 'state': 'processing', 'status': 'open'}, 'back');
		    //console.log(res);
		    //_this.setState({'detail': res});
		}
		_requestApi(this);
	}

	getMessages = () =>{
		async function _requestApi(_this){
		    const _messages = await new ChatMessages().loadMessagesV2(_this.props.params.id);
		    //console.log(_messages);
		    _this.setMessages(_messages);
		}
		_requestApi(this);
	}


	_handleSend = (event)=>{
	    event.preventDefault();
	    const form = event.currentTarget;
	    if (form.checkValidity() === false) {
	      event.stopPropagation();
	      this.setState({validated : true});
	    }else{
	      this.setMessage('_req', {type:'Text', response: this.state.inputMessage});
	      this.setState({validated : false});
	      
	      async function _requestApi(_this, form){
	        const res = await new ChatMessages().sendMessageV2(_this.state.inputMessage, 'manual_response', _this.props.params.id);
	        //_this.setMessages(res.messages.items);
	        form.reset();
	      }
	      _requestApi(this, form);
		  this.setState({inputMessage : ''});

	      /*if(localStorage.getItem('token') == undefined){
	        this.setState({showContHello : true});
	        this.setState({showContChat : false});
	      }*/

	    }  
	}


  render() {
    return (
        <div className="wrapper">
		    <SidebarMenu/>
		    <div id="content">
	            <SidebarAction/>

				<h2>Detail Chat</h2>
	            <p>Last hits</p>
	            <div className="line"></div>
	            <section>
		          <Tab.Container id="left-tabs-example" defaultActiveKey="first">
					  <Row>
					    <Col sm={2}>
					      <Nav variant="pills" className="flex-column">
					        <Nav.Item>
					          <Nav.Link eventKey="first">Response</Nav.Link>
					        </Nav.Item>
					        <Nav.Item>
					          <Nav.Link eventKey="second">History</Nav.Link>
					        </Nav.Item>
					      </Nav>
					    </Col>
					    <Col sm={10}>
					      <Tab.Content>
					        <Tab.Pane eventKey="first">
								
								  <Row>
								    <Col lg={8}>
							    		<div className="main-buttons">
							    			<ButtonGroup>
												  <DropdownButton as={ButtonGroup} variant="light" title="Dropdown" id="bg-nested-dropdown">
												    <Dropdown.Item eventKey="1">Lock</Dropdown.Item>
												    <Dropdown.Item eventKey="2">Asign</Dropdown.Item>
												  </DropdownButton>

												  {this.state.detail.state == 'processing' && this.state.detail.status == 'open' &&
												     <Button variant="warning" onClick="">End Chat</Button>
												  }
												  
												  {this.state.detail.status == 'pending' &&
												  	<Button variant="success" onClick={this.startChat}>Start Chat</Button>
												  }
											
											</ButtonGroup>
							    		</div>

							    		<div className="contChat app">
						          			
					          				<div className="contentResponse">
					          					{this.state.listMessages.map((item, index) => {
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
					          				</div>
						          			


					          				{this.state.detail.state == 'processing' && this.state.detail.status == 'open' &&
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
		                                	}

						          			
						          		</div>
								    </Col>

								    <Col lg={4}>
								    		<div>
								    			<h1>Information</h1>
								    		</div>

								    		<div>
								    			<h1>Location</h1>
								    		</div>
								    </Col>
								  </Row>

					        </Tab.Pane>

					        <Tab.Pane eventKey="second">
					          
					        </Tab.Pane>

					      </Tab.Content>
					    </Col>
					  </Row>
					</Tab.Container>
		        </section>

	        </div>

	        <div className="overlay"></div>
		</div>
    );
  }
}

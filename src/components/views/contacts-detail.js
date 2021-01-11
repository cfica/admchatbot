import React, { Component } from "react";
import config from 'react-global-configuration';
import $ from "jquery";
import Mousewheel from "jquery-mousewheel";
import mCustomScrollbar from "malihu-custom-scrollbar-plugin";
import SidebarMenu from './components/sidebar-menu';
import {Helper} from './components/helper';
import SidebarAction from './components/sidebar-action';
import { Alert, Navbar, Nav, Accordion, Card,DropdownButton, Dropdown, Tab, Modal, Badge, Tabs, InputGroup, Collapse, ButtonGroup,ListGroup, Form,NavDropdown,FormControl,Container, Row, Col,Media,Jumbotron, Button, Breadcrumbs, Table} from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import ModalToLearn from './components/modal-add-pattern';
import { browserHistory } from 'react-router';
import * as moment from 'moment';


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
	      vldFormComment : false,
	      inputMessage: '',
	      listMessages: [],
	      detail: {},
	      connectionSSE: null,
	      inputComment: '',
	      comments: []
	    };
	}

	setMessage = (_type, message) =>{
	    const items = new Helper().setMessageV2(_type, message);
	    this.setState({'listMessages' : items});
	}

	setMessages(messages){
	    const _messages = new Helper().setMessagesV2(messages);
	    this.setState({'listMessages' : _messages});
	}

	componentDidMount(){
		localStorage.setItem('m_messages', []);	
		this.getDetail();
		this.getMessagesSSE(this);
		this.getComments();
	}

	getDetail(){
		async function _requestApi(_this){
		    var _url = config.get('baseUrlApi')+'/api/v1/contact?id='+_this.props.params.id;
		    const res = await new Helper().getRequest(_url,'back');
		    console.log(res);
		    _this.setState({'detail': res});
		}
		_requestApi(this);
	}

	getMessagesSSE(_this, _close = null){
		var sse = this.state.connectionSSE;
		if(sse){
			if(_close){
			  sse.close();
			  this.setState({connectionSSE: null});
			}
		}else{
			var _strUrl = localStorage.getItem('tokenAdm')+'&x-dsi1-restful=&x-dsi2-restful='+localStorage.getItem('client')+'&x-dsi3-restful='+localStorage.getItem('_id')+'&_id='+this.props.params.id; 
		    var sse = new Helper().loadMessagesSSE(_strUrl);
		    this.setState({connectionSSE: sse});
		    sse.onmessage = function(event){
		      var _res = JSON.parse(event.data);
		      _this.setMessages(_res.items);
		    };

		    sse.onerror = msg => {
		    }
		}
	}

	startChat = (event) =>{
		var _message = 'An executive has joined the conversation.';
		this.setMessage('_res', {type:'Text', response: _message});
      	this.sendMessage(this, _message);

		async function _requestApi(_this){
		    var _url = config.get('baseUrlApi')+'/api/v1/contact';
		    const res = await new Helper().putRequest(_url, {'id': _this.props.params.id, 'state': 'processing', 'status': 'open'}, 'back');
		    //_this.setState({'detail': res});
		    //add message join conversation user
		    _this.getDetail();
		}
		_requestApi(this);
	}

	endChat = (event) =>{
		var _message = 'The session has ended.';
		this.setMessage('_res', {type:'Text', response: _message});
      	this.sendMessage(this, _message, null, {'action': 'Contact_End'});

		async function _requestApi(_this){
		    var _url = config.get('baseUrlApi')+'/api/v1/contact';
		    const res = await new Helper().putRequest(_url, {'id': _this.props.params.id, 'state': 'processing', 'status': 'close'}, 'back');
		    //_this.setState({'detail': res});
		    //add message join conversation user
		    _this.getDetail();
		}
		_requestApi(this);
	}

	getMessages = () =>{
		async function _requestApi(_this){
		    const _messages = await new Helper().loadMessagesV2(_this.props.params.id);
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
	      this.setMessage('_res', {type:'Text', response: this.state.inputMessage});
	      this.setState({validated : false});

	      this.sendMessage(this, this.state.inputMessage, form);
		  this.setState({inputMessage : ''});
	    }  
	}

	_handleSendComment = (event) => {
		event.preventDefault();
		const form = event.currentTarget;
		if (form.checkValidity() === false) {
	      event.stopPropagation();
	      this.setState({vldFormComment : true});
	    }else{
	    	this.setState({vldFormComment : false});
	    	//this.sendMessage(this, this.state.inputComment, form);
	    	async function _requestApi(_this, comment, form){
		        var _url = config.get('baseUrlApi')+'/api/v1/comment';
		        const res = await new Helper().postRequest(_url,{id: _this.props.params.id, comment: comment}, 'back');
		        _this.setState({inputComment : ''});
		        if(form){
		        	form.reset();
		        }
		        _this.getComments();
		    }
		    _requestApi(this, this.state.inputComment, form);
	    }
	}

	getComments(){
		async function _requestApi(_this){
		    var _url = config.get('baseUrlApi')+'/api/v1/comments?id='+_this.props.params.id;
		    const res = await new Helper().getRequest(_url,'back');
		    //console.log(res);
		    _this.setState({'comments': res['items']});
		}
		_requestApi(this);
	}


	sendMessage(_this, message, form = null, options = null){
		async function _requestApi(_this, message, form, options){
	        const res = await new Helper().sendMessageV2(message, 'manual_response', _this.props.params.id, options);
	        //_this.setMessages(res.messages.items);
	        if(form){
	        	form.reset();
	        }
	    }
	    _requestApi(_this, message, form, options);
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
												     <Button variant="warning" onClick={this.endChat}>End Chat</Button>
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

								    		
								    		{this.state.detail.info && 
								    			 <div className="detail-info">
								    			 	<strong>IP:</strong>{' '}{this.state.detail.info.ip}
								    			 </div>
								    		}

								    		{this.state.detail.info && 
									    		<div className="detail-info">
								    			 	<strong>User Agent:</strong>{' '}{this.state.detail.info.user_agent}
								    			</div>
								    		}

								    		{this.state.detail._customer && 
									    		<div className="detail-info">
								    			 	<strong>Name:</strong>{' '}{this.state.detail._customer[0].name}
								    			</div>
								    		}

								    		{this.state.detail._customer && 
									    		<div className="detail-info">
								    			 	<strong>Telephone:</strong>{' '}{this.state.detail._customer[0].telephone}
								    			</div>
								    		}

								    		{this.state.detail._customer && 
									    		<div className="detail-info">
								    			 	<strong>Email:</strong>{' '}{this.state.detail._customer[0].email}
								    			</div>
								    		}


								    		<Form className="add-comment" noValidate validated={this.state.vldFormComment} onSubmit={this._handleSendComment}>
												  <Form.Group controlId="comment.ControlTextarea">
												    <Form.Label>Add Comment</Form.Label>
												    <Form.Control value={this.state.inputComment} required minLength="3" size="sm" onChange={(e) => this.setState({inputComment: e.target.value})} as="textarea" rows={1} />
												  </Form.Group>

												  <Button variant="primary" type="submit">
												    Add
												  </Button>

											</Form>
								    		

								    		<div className="comments">
								    			<h5>Last Comments</h5>
								    			
								    			<div className="list">
								    				{

										    			this.state.comments.map((item, index) => 
									    					<div className="item">
									    							<div className="comment">{item.comment}</div>
									    							<div className="footer"><strong>{item._user[0].fullname}</strong> {' '} {moment(item._created).fromNow()}</div>
									    					</div>
										    			)
									    			}
								    			</div>

								    		</div>
								    </Col>
								  </Row>

					        </Tab.Pane>

					        <Tab.Pane eventKey="second">
					          	<Accordion defaultActiveKey="0">
								  <Card>
								    <Card.Header>
								      <Accordion.Toggle as={Button} variant="link" eventKey="0">
								        Movements
								      </Accordion.Toggle>
								    </Card.Header>
								    <Accordion.Collapse eventKey="0">
								      <Card.Body>Hello! I'm the body</Card.Body>
								    </Accordion.Collapse>
								  </Card>
								  <Card>
								    <Card.Header>
								      <Accordion.Toggle as={Button} variant="link" eventKey="1">
								        Chats with clients
								      </Accordion.Toggle>
								    </Card.Header>
								    <Accordion.Collapse eventKey="1">
								      <Card.Body>Hello! I'm another body</Card.Body>
								    </Accordion.Collapse>
								  </Card>
								</Accordion>
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

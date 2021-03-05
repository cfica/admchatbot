import React, { Component } from "react";
import {Modal,Button,Table, Popover, OverlayTrigger, Carousel,DropdownButton,Jumbotron,Dropdown,ButtonGroup,ToggleButtonGroup,ListGroup,ToggleButton,Form,Col,InputGroup,FormControl,Row} from 'react-bootstrap';
import axios from 'axios';
import config from 'react-global-configuration';
import ReactPaginate from 'react-paginate';
import {Validation, Status, RequestAsync} from './componentsUtils';
import ModalToConfirm from './confirm';
import { browserHistory } from 'react-router';
import * as Icon from 'react-bootstrap-icons';
import {Helper} from './helper';
//import { Editor } from 'react-draft-wysiwyg';
//import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
//https://jpuri.github.io/react-draft-wysiwyg/#/docs?_k=jjqinp
import EditorHtml from './editorHtml';
import * as moment from 'moment';
import MessageResult from './message-result';
import ModalConfChat from './modal-confchat';
import Preview from './preview';

export class SettingsChat extends Component {
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
	      errorSaveForm: '',
	      validated: false,
	      welcomeMessage: '',
	      welcomeMessageInit: '',
	      headerMessage:'',
	      checksSelected:[],
	      client_id: '',
	      settingChat: {
	      	client_id: '',
	      	config: ''
	      },
	      listMessages: [],
	      inputsAditionalLogin: [],
	      popoverColorMain: '',
	      popoverColorConversation: '',
	      colors: [
	         {color: 'rgb(235, 20, 76)'},
	         {color: 'rgb(255, 105, 0)'},
	         {color: 'rgb(252, 185, 0)'},
	         {color: 'rgb(181, 204, 24)'},
	         {color: 'rgb(0, 208, 132)'},
	         {color: 'rgb(123, 220, 181)'},
	         {color: 'rgb(142, 209, 252)'},
	         {color: 'rgb(153, 0, 239)'},
	         {color: 'rgb(224, 57, 151)'},
	         {color: 'rgb(247, 141, 167)'},
	         {color: 'rgb(165, 103, 63)'},
	         {color: 'rgb(171, 184, 195)'},
	         {color: 'rgb(118, 118, 118)'},
	      ],
	      colorMain: '',
	      styleConversation: '',
	      showButtonConfigChatbot: false
	    };
	}

	_handleSelectClient = (event) =>{
		this.loadSettingChat(event.target.value);
		this.setState({idClient: event.target.value});
	}

	handleSubmitSaveSettingsChat = (event)=>{
		event.preventDefault();
		const form = event.currentTarget;
	    if (form.checkValidity() === false) {
	      event.stopPropagation();
	      this.setState({errorSaveForm : ''});
	      this.setState({validated : true});
	    }else{
	    	this.setState({validated : false});
   		    var _dataPost = {
   		    	"client" : this.state.idClient,
   		    	"welcome_message" : this.state.welcomeMessage,
   		    	color_main: this.state.colorMain,
   		    	style_conversation: this.state.styleConversation,
   		    	"header_message" : this.state.headerMessage,
   		    	"start_conversation": this.state.checksSelected, 
   		    	"welcome_message_init": this.state.welcomeMessageInit 
   		    };
   		    axios.post(
   		    	config.get('baseUrlApi')+'/api/v1/add-setting-chat', 
   		    	JSON.stringify(_dataPost), 
   		    	{headers: {'Content-Type': 'application/json;charset=UTF-8', 'Authorization' : 'Bearer ' + this.state.token}}
   		    ).then(res => {
		    	this.setState({errorSaveForm : false});
		    	//form.reset();
		    	this.handleGenConfigChat(this.state.client);
		    }).catch(function (error) {}).then(function () {});
	    }
	}

	loadSettingChat(_value){
		axios.post(
			config.get('baseUrlApi')+'/api/v1/chat-settings',
			JSON.stringify({'client' : _value}), 
			{headers: {'Content-Type': 'application/json;charset=UTF-8', 'Authorization' : 'Bearer ' + this.state.token}})
	    .then(res => {
	    	this.setState({welcomeMessage:''});
	    	this.setState({headerMessage:''});
	    	this.setState({checksSelected: []});
	    	this.setState({client_id: ''});
	        /**/
	        this.setState({client_id: res.data.data.client_id});
	    	this.setState({idClient: _value});
	    	
	    	if(typeof res.data.data.config[0] != 'undefined'){ 
	    		this.setState({welcomeMessage: res.data.data.config[0].welcome_message});
	    		this.setState({headerMessage: res.data.data.config[0].header_message});
	    		this.setState({checksSelected: res.data.data.config[0].start_conversation});
	    		this.setState({welcomeMessageInit: res.data.data.config[0].welcome_message_init});
	    		
	    		this.setState({colorMain: res.data.data.config[0].color_main});
	    		this.setState({styleConversation: res.data.data.config[0].style_conversation});

	    		//console.log(res);

	    		var _itemRes = {
				     _id: '',
				     type : '_res',
				     msg : this.state.welcomeMessage, 
				     type_resp: 'Text', 
				     status: '',
				     _created: moment().format('YYYY-MM-DD H:mm:ss'),
				     user_name: 'Belisa'
				};


				var _itemReq = {
				     _id: '',
				     type : '_req',
				     msg : 'Hello! Thanks, I need to know about...', 
				     type_resp: 'Text', 
				     status: '',
				     _created: moment().format('YYYY-MM-DD H:mm:ss'),
				     user_name: 'Client'
				};

				var _items = [];
				_items.push(_itemRes);
				_items.push(_itemReq);
				this.setState({listMessages: _items});	
				this.setState({showButtonConfigChatbot: true});
	    	}else{
	    		//hidden button getconfig
	    		this.setState({showButtonConfigChatbot: false});
	    	}
	    });
	}

	componentDidMount(){
		this.selectedCheckSettingChat = new Set();
		if(!this.state.scope){
			this.loadSettingChat(this.state.client);
			this.setState({idClient : this.state.client});
		}

		this.setState({popoverColorMain: 
			<Popover  className="popover-colors">
			    <Popover.Title as="h3">Colors</Popover.Title>
			    <Popover.Content>
			        <div className="items-color">
			        	 {this.state.colors.map((item, index) => {
			        	 	return(<Button variant="link" onClick={(e) => this.selectColorMain(item.color)}><div className="color" style={{backgroundColor: item.color}}></div></Button>);
			        	 })}
			        </div>
			    </Popover.Content>
			</Popover>
		});

		this.setState({popoverColorConversation: 
			<Popover className="popover-colors">
			    <Popover.Title as="h3">Colors</Popover.Title>
			    <Popover.Content>
			        <div className="items-color">
			        	 {this.state.colors.map((item, index) => {
			        	 	return(<Button variant="link" onClick={(e) => this.selectColorConversation(item.color)}><div className="color" style={{backgroundColor: item.color}}></div></Button>);
			        	 })}
			        </div>
			    </Popover.Content>
			</Popover>
		});

	}


	selectColorMain = (color) => {
		console.log(color);
		this.setState({colorMain: color});
	}

	selectColorConversation = (color) =>{
		this.setState({styleConversation: {style: {backgroundColor: color, border: 'none', color: "#fff", borderRadius: '10px'}}});
	}

	toggleCheckbox = event => {
		var _value = event.target.value;
		if (this.selectedCheckSettingChat.has(_value)) {
		    this.selectedCheckSettingChat.delete(_value);
		} else {
		    this.selectedCheckSettingChat.add(_value);
		}
		//console.log(this.selectedCheckSettingChat);
		this.setState({checksSelected: Array.from(this.selectedCheckSettingChat)});
	}

	hiddenModalConfigChatbot = data =>{
		this.setState({showModalConfigChatbot : false});
	}

	handleGenConfigChat(id){
		//console.log(id);
		this.setState({showModalConfigChatbot : true});	
		this.setState({idClient : id});	
	}

	changeWelcomeMessage = (event) => {
		this.setState({welcomeMessage: event.target.value});
		
		
		var _itemRes = {
		     _id: '',
		     type : '_res',
		     msg : this.state.welcomeMessage, 
		     type_resp: 'Text', 
		     status: '',
		     _created: moment().format('YYYY-MM-DD H:mm:ss'),
		     user_name: 'Belisa'
		};


		var _itemReq = {
		     _id: '',
		     type : '_req',
		     msg : 'Hello! Thanks, I need to know about...', 
		     type_resp: 'Text', 
		     status: '',
		     _created: moment().format('YYYY-MM-DD H:mm:ss'),
		     user_name: 'Client'
		};

		var _items = [];
		_items.push(_itemRes);
		_items.push(_itemReq);
		this.setState({listMessages: _items});	
	}

	render() {

		return(
			 <div>	
	 				<h2>Chat settings</h2>
	    			<p>Configure the chat display for your clients</p>
	    			<hr className="divide"></hr>
		        	
		        	<Form.Row>
						<Col xs={12}>							        
					        	<Form noValidate validated={this.state.validated} onSubmit={this.handleSubmitSaveSettingsChat}>
					        	    <MessageResult status ={this.state.errorSaveForm}/>
					        	    


					        	    {this.state.scope && 
						        	    <Form.Row>
						        	        <Col xs={12}>
								        		<Form.Group required controlId="ControlSelect1">
												    <Form.Control placeholder="Client" required as="select" onChange={this._handleSelectClient}>
												        <option value="">Select</option>
													    {this.props.clients.map((item) => 
													      <option key={item._id.$oid} value={item._id.$oid}>{item.name}</option>
										                )}
												    </Form.Control>
												    <Form.Label>Client</Form.Label>
												  </Form.Group>
								    		</Col>
									    </Form.Row>
									}

									{this.state.idClient &&
										<div>	
												<Form.Row>
								        	        <Col xs={12}>
													     <Button variant="primary" onClick={(e) => this.handleGenConfigChat(this.state.idClient)}>Get code HEAD site</Button>
												         <hr className="divide"></hr>
												         {this.state.showModalConfigChatbot && 
													        	<ModalConfChat
													        	 hiddenModal = {this.hiddenModalConfigChatbot} 
													        	 idSelected = {this.state.idClient}
													        	/>
													     }
										         	</Col>
											    </Form.Row>
										    





										    <Form.Row className="titleFragment lg">
											    <Col xs={6}><h2>Configuration General</h2></Col>
											    <Col xs={6} className="buttons options"></Col>
											</Form.Row>

										    

							        	    <Form.Row>
							        	        <Col xs={12}>
							        				<Form.Group  controlId="formClientId">
											            <Form.Control size="sm" required  readOnly type="text" value={this.state.client_id}  placeholder="Client Id" />
											            <Form.Label  size="sm">Client ID</Form.Label>
											        </Form.Group>
										        </Col>
										    </Form.Row>

										    <Form.Row>
							        	        <Col xs={12}>
							        				<Form.Group  controlId="formWelcomeMessage">
											            <Form.Control required size="sm" type="text" 
											                          value={this.state.headerMessage}
											                          onChange={this.changeName1 = (event) => {this.setState({headerMessage: event.target.value})}} 
											                          placeholder="Header Message" />
											            <Form.Label  size="sm">Header Message</Form.Label>
											        </Form.Group>
										        </Col>
										    </Form.Row>


										    <Form.Row>
							        	        <Col xs={12}>
							        				<Form.Group  controlId="formClientId">
											            
											            <OverlayTrigger  rootClose trigger="click" placement="right" overlay={this.state.popoverColorMain}>
														    <Button variant="outline-dark" size="sm">Main Color</Button>
														</OverlayTrigger>

											        </Form.Group>
										        </Col>
										    </Form.Row>


										    


										    <Form.Row className="titleFragment lg">
											    <Col xs={6}><h2>Configuration Chat</h2></Col>
											    <Col xs={6} className="buttons options"></Col>
											</Form.Row>


											<Form.Row>
												    <Col xs={6}>
												    	<Form.Row>
										        	        <Col xs={12}>
										        				<Form.Group  controlId="formClientId">

										        				    <OverlayTrigger rootClose trigger="click" placement="right" overlay={this.state.popoverColorConversation}>
																	    <Button variant="outline-dark" size="sm">Conversation color</Button>
																	</OverlayTrigger>

														        </Form.Group>
													        </Col>
													    </Form.Row>

												    	<Form.Row>
										        	        <Col xs={12}>
										        				<Form.Group controlId="welcomeMessage">
																    <Form.Control placeholder="Welcome Message" required as="textarea" 
																     value={this.state.welcomeMessage} 
																     onChange={this.changeWelcomeMessage} rows="3" />
																    <Form.Label>Welcome Message</Form.Label>
																</Form.Group>
													        </Col>
													    </Form.Row>

												    </Col>

												    <Col xs={1}></Col>

												    <Col xs={5}>
												       <Form.Row className="previewSettings">
												            <Col xs={9}>
												        		<Preview 
												        			listMessages = {this.state.listMessages}
												        			welcomeMessage = {this.state.welcomeMessage}
												        			headerMessage = {this.state.headerMessage}
												        			_type = {'chat'}
												        			colorMain={this.state.colorMain}
												        			styleConversation={this.state.styleConversation}
												        		/>
												        	</Col>
												       </Form.Row> 
												    </Col>
											</Form.Row>


										    <Form.Row className="titleFragment lg">
											    <Col xs={6}><h2>Configuration Login</h2></Col>
											    <Col xs={6} className="buttons options"></Col>
											</Form.Row>

											<Form.Row>
												<Col xs={6}>
														<Form.Row>
										        	        <Col xs={12}>
										        				
														        <Form.Group controlId="welcomeMessageInit">
																    <Form.Control 
																     placeholder="Welcome Message" 
																     required as="textarea" 
																     value={this.state.welcomeMessageInit} 
																     onChange={this.changeName = (event) => {this.setState({welcomeMessageInit: event.target.value})}} 
																     rows="3" />
																    <Form.Label>Welcome message start conversation</Form.Label>
																</Form.Group>


													        </Col>
													    </Form.Row>


													    <Form.Row>
													    	<Form.Group  controlId="formClientId">
															        <strong  size="sm">Request to start conversation</strong>
															</Form.Group>
														</Form.Row>
													    <Form.Row>
										        	        
										        	        <Col xs={4}>
										        				<Form.Check type="checkbox" disabled checked className="mb-2" label="Request Name"/>
													        </Col>

										        	        <Col xs={4}>
										        				<Form.Check
															        type="checkbox"
															        className="mb-2"
															        onChange={this.toggleCheckbox}
															        label="Request Email"
															        checked={this.state.checksSelected.includes('Email')}
															        value="Email"
															    />
													        </Col>

													        <Col xs={4}>
										        				<Form.Check
															        type="checkbox"
															        className="mb-2"
															        onChange={ this.toggleCheckbox}
															        value="Telephone"
															        checked={this.state.checksSelected.includes('Telephone')}
															        label="Request Telephone"
															    />
													        </Col>
													    </Form.Row>
											    </Col>

											    <Col xs={1}> </Col>

											    <Col xs={5}>
											       <Form.Row className="previewSettings">
											            <Col xs={9}>
											        		<Preview 
											        			welcomeMessage = {this.state.welcomeMessageInit}
											        			_type = {'login'}
											        			_inputs = {this.state.checksSelected}
											        			colorMain={this.state.colorMain}
											        		/>
											        	</Col>
											       </Form.Row> 
											    </Col>
											</Form.Row>


										    <Button variant="primary" type="submit">
											    Save Settings
											</Button>
										</div>
								    }
					        	</Form>
					    </Col>


					    
					</Form.Row>

			 </div>
		);
	}

}
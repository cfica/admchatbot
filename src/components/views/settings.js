import React, { Component } from "react";
import $ from "jquery";
import Mousewheel from "jquery-mousewheel";
import mCustomScrollbar from "malihu-custom-scrollbar-plugin";
import SidebarMenu from './components/sidebar-menu';
import SidebarAction from './components/sidebar-action';
import { Alert, Navbar, Nav, DropdownButton,Dropdown,Tab, Modal, Badge, Tabs, InputGroup, Collapse, ButtonGroup,ListGroup, Form,NavDropdown,FormControl,Container, Row, Col,Media,Jumbotron, Button, Breadcrumbs, Table} from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import ModalClient from './components/modal-client';
import ModalConfChat from './components/modal-confchat';
import ModalToConfirm from './components/confirm';
import {Users} from './components/users';
import MessageResult from './components/message-result';
import Topics from './components/topics';
import Templates from './components/templates';
import Integrations from './components/integrations';
import config from 'react-global-configuration';
import { browserHistory } from 'react-router';
import * as Icon from 'react-bootstrap-icons';
import {Validation, Status} from './components/componentsUtils';
import {Helper} from './components/helper';

export default class Settings extends Component {
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
	      listPatterns : [],
	      showModalClient: false,
	      idPattern: 0,
	      logTraining: [],
	      showModalConfigChatbot : false,
	      idClient: '',
	      errorSaveForm: '',
	      validated: false,
	      clientSelected:'',
	      welcomeMessage: '',
	      welcomeMessageInit: '',
	      headerMessage:'',
	      checksSelected:[],
	      client_id: '',
	      settingChat: {
	      	client_id: '',
	      	config: ''
	      },
	      statusClient: {},
	      deactivateClient: false
	    };
	}

	loadClients() {
		async function _requestApi(_this, allReg){
		    var _url = config.get('baseUrlApi')+'/api/v1/clients?limit='+_this.state.perPage+'&offset='+_this.state.offset;
		    const res = await new Helper().getRequest(_url,'back');
		    if(typeof res != "undefined"){
		    	_this.setState({items: res.items,pageCount: Math.ceil(res.total_count / res.limit)});
		    }
		}
		_requestApi(this);
	}


	handlePageClickClients = data => {
	    let selected = data.selected;
	    let offset = Math.ceil(selected * this.state.perPage);
	    this.setState({ offset: offset }, () => {
	      this.loadClients();
	    });
	};

	componentDidMount(){
	    this.loadClients();
	    this.selectedCheckSettingChat = new Set();
	    //console.log(this.state.client);
        if(!this.state.scope){
			this.loadSettingChat(this.state.client);
		}
	}

	handleShowModalClient = (event)=>{
		this.setState({showModalClient : true});
		this.setState({idClient : ''});
	}

	handleHiddenModalClient = data => {
	    this.setState({showModalClient : false});
	    this.loadClients();
	};

	editClient(id){
		this.setState({idClient: id});
		this.setState({showModalClient : true});
	}

	delClient(id){

	}

	handleGenConfigChat(id){
		//console.log(id);
		this.setState({showModalConfigChatbot : true});	
		this.setState({idClient : id});	
	}

	hiddenModalConfigChatbot = data =>{
		this.setState({showModalConfigChatbot : false});
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
   		    	"client" : this.state.clientSelected,
   		    	"welcome_message" : this.state.welcomeMessage,
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
		    }).catch(function (error) {}).then(function () {});
	    }
	}

	_handleSelectClient = (event) =>{
		this.loadSettingChat(event.target.value);
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
	    	this.setState({clientSelected: _value});
	    	if(typeof res.data.data.config[0] != 'undefined'){ 
	    		this.setState({welcomeMessage: res.data.data.config[0].welcome_message});
	    		this.setState({headerMessage: res.data.data.config[0].header_message});
	    		this.setState({checksSelected: res.data.data.config[0].start_conversation});
	    		this.setState({welcomeMessageInit: res.data.data.config[0].welcome_message_init});
	    	}
	    });
	}

	changeStatusClient(id, status,event){
		this.setState({deactivateClient: true});
		this.setState({statusClient : {_id: id, _status: status}});
	}

	changeStatusClientConfirm = ()=>{
		axios.post(
		    	config.get('baseUrlApi')+'/api/v1/status-client', 
		    	JSON.stringify(this.state.statusClient), 
		    	{headers: {'Content-Type': 'application/json;charset=UTF-8', 'Authorization' : 'Bearer ' + this.state.token}}
		).then(res => {
			this.setState({deactivateClient: false});
			this.loadClients();
		});
	}

	deactivateClientClose = () =>{
		this.setState({deactivateClient: false});
	}

    render() {
      return (
        <div className="wrapper">
		    <SidebarMenu/>
		    <div id="content">
	            <SidebarAction/>
	            <h2>Settings</h2>
	            <p>Application settings</p>
	            <div className="line"></div>
	            
	            {this.state.scope &&
		            <Jumbotron className="content-form jumbotron-sm jumbotron-right">
			            <Button variant="secondary" onClick={this.handleShowModalClient}>Add Client <Icon.Plus size={25}/></Button>
					</Jumbotron>
				}

				{this.state.showModalClient && 
		        	<ModalClient
		        	 hiddenModal = {this.handleHiddenModalClient}
		        	 id = {this.state.idClient}
		        	/>
		        }

		  		<br/>
		  		<Tab.Container id="left-tabs-example" defaultActiveKey={this.state.scope ? 'clients' : 'users'}>
				  <Row>
				    <Col sm={2}>
				      <Nav variant="pills" className="flex-column">
				        
				        {this.state.scope &&
					        <Nav.Item>
					          <Nav.Link eventKey="clients">Clients</Nav.Link>
					        </Nav.Item>
					    }

				        <Nav.Item>
				          <Nav.Link eventKey="users">Users</Nav.Link>
				        </Nav.Item>

				        

				        <Nav.Item>
				          <Nav.Link eventKey="topics">Topics Menu</Nav.Link>
				        </Nav.Item>


				        <Nav.Item>
				          <Nav.Link eventKey="templates">Templates Email</Nav.Link>
				        </Nav.Item>


				        <Nav.Item>
				          <Nav.Link eventKey="integrations">Integrations</Nav.Link>
				        </Nav.Item>


				        <Nav.Item>
				          <Nav.Link eventKey="payments">Payments</Nav.Link>
				        </Nav.Item>

				        <Nav.Item>
				          <Nav.Link eventKey="config">Configuration Chat</Nav.Link>
				        </Nav.Item>

				      </Nav>
				    </Col>
				    <Col sm={10}>
				      <Tab.Content>
				        {this.state.scope &&
					        <Tab.Pane eventKey="clients">
					            <section>
					            {this.state.showModalConfigChatbot && 
						        	<ModalConfChat
						        	 hiddenModal = {this.hiddenModalConfigChatbot} 
						        	 idSelected = {this.state.idClient}
						        	/>
						        }

						            <Table id="itemTable" striped bordered hover size="sm">
						              <thead>
						                <tr>
						                  <th>Domain</th>
						                  <th>Name</th>
						                  <th>Status</th>
						                  <th></th>
						                </tr>
						              </thead>
						              <tbody>
						                {this.state.items.map((item) => 
						                  <tr key={item._id.$oid}>
						                    <td>#{item.domain}</td>
						                    <td>{item.name}</td>
						                    <td>
						                      <Status status={item.status}/>
						                    </td>

						                    <td>
						                      <DropdownButton as={ButtonGroup} size="sm" variant="outline-primary" title="Options" id="bg-vertical-dropdown-1">
												    <Dropdown.Item eventKey="4" onClick={(e) => this.editClient(item._id.$oid)}>Edit</Dropdown.Item>

												    {/*<Dropdown.Item eventKey="4" onClick={(e) => this.delClient(item._id.$oid)}>Delete</Dropdown.Item>*/}

												    <Dropdown.Item eventKey="1" onClick={(e) => this.handleGenConfigChat(item._id.$oid, e)}>Get code Chatbot</Dropdown.Item>
												    

												    <Dropdown.Item eventKey="5" onClick="">Group Client Account</Dropdown.Item>

												    {item.status == 'Active' &&
												      <Dropdown.Item eventKey="3" onClick={(e) => this.changeStatusClient(item._id.$oid,'Inactive', e)}>Deactivate</Dropdown.Item>
												    }

												    {item.status == 'Inactive' &&
												      <Dropdown.Item eventKey="3" onClick={(e) => this.changeStatusClient(item._id.$oid,'Active', e)}>Activate</Dropdown.Item>
												    }
											  
											  </DropdownButton>
						                    </td>
						                  </tr>
						                )}
						              </tbody>
						            </Table>

						            {this.state.deactivateClient && 
								        <ModalToConfirm
						                   handleConfirm={this.changeStatusClientConfirm}
						                   hiddenModal={this.deactivateClientClose}
						                   message="Are you sure you want to do this?"
						                />
						            }

						            <div id="react-paginate">
							            <ReactPaginate
								          previousLabel={'Anterior'}
								          nextLabel={'Siguiente'}
								          breakLabel={'...'}
								          breakClassName={'break-me'}
								          pageCount={this.state.pageCount}
								          marginPagesDisplayed={2}
								          pageRangeDisplayed={5}
								          onPageChange={this.handlePageClickClients}
								          containerClassName={'pagination'}
								          subContainerClassName={'pages pagination'}
								          activeClassName={'active'}
								        />
							        </div>
						        </section>
					        </Tab.Pane>
					    }


					    <Tab.Pane eventKey="templates">
					    	<Templates/>
				        </Tab.Pane>

				        <Tab.Pane eventKey="integrations">
				           <Integrations/>
				        </Tab.Pane>


				        <Tab.Pane eventKey="users">
				        	<Users/>
				        </Tab.Pane>

				        <Tab.Pane eventKey="topics">
				        	<Topics/>
				        </Tab.Pane>

				        <Tab.Pane eventKey="config">
				            <h2>Chat settings</h2>
	            			<p>Configure the chat display for your clients</p>
	            			<hr className="divide"></hr>
				        	<Form noValidate validated={this.state.validated} onSubmit={this.handleSubmitSaveSettingsChat}>
				        	    <MessageResult status ={this.state.errorSaveForm}/>
				        	    
				        	    {this.state.scope && 
					        	    <Form.Row>
					        	        <Col xs={4}>
							        		<Form.Group required controlId="exampleForm.ControlSelect1">
											    <Form.Control placeholder="Client" required as="select" onChange={this._handleSelectClient}>
											        <option value="">Select</option>
												    {this.state.items.map((item) => 
												      <option key={item._id.$oid} value={item._id.$oid}>{item.name}</option>
									                )}
											    </Form.Control>
											    <Form.Label>Client</Form.Label>
											  </Form.Group>
							    		</Col>
								    </Form.Row>
								}

								{!this.state.scope &&
									<Form.Row>
					        	        <Col xs={4}>
										     <Button variant="primary" onClick={(e) => this.handleGenConfigChat(this.state.client, e)}>Get code HEAD site</Button>
									         <hr className="divide"></hr>
									         {this.state.showModalConfigChatbot && 
										        	<ModalConfChat
										        	 hiddenModal = {this.hiddenModalConfigChatbot} 
										        	 idSelected = {this.state.idClient}
										        	/>
										     }
							         	</Col>
								    </Form.Row>
							    }

							    

				        	    <Form.Row>
				        	        <Col xs={4}>
				        				<Form.Group  controlId="formClientId">
								            <Form.Control size="sm" required  readOnly type="text" value={this.state.client_id}  placeholder="Client Id" />
								            <Form.Label  size="sm">Client ID</Form.Label>
								        </Form.Group>
							        </Col>
							    </Form.Row>

							    <hr className="divide"></hr>

							    <Form.Row>
				        	        <Col xs={4}>
				        				<Form.Group  controlId="formWelcomeMessage">
								            <Form.Control required size="sm" type="text" 
								            			  value={this.state.welcomeMessage}  
								            			  onChange={this.changeName = (event) => {this.setState({welcomeMessage: event.target.value})}}
								            			  placeholder="Welcome message" />
								            <Form.Label  size="sm">Welcome message start conversation</Form.Label>
								        </Form.Group>
							        </Col>
							    </Form.Row>


							    <hr className="divide"></hr>

							    <Form.Row>
				        	        <Col xs={4}>
				        				<Form.Group  controlId="formWelcomeMessage">
								            <Form.Control required size="sm" type="text" 
								                          value={this.state.headerMessage}
								                          onChange={this.changeName1 = (event) => {this.setState({headerMessage: event.target.value})}} 
								                          placeholder="Header Message" />
								            <Form.Label  size="sm">Header Message</Form.Label>
								        </Form.Group>
							        </Col>
							    </Form.Row>


							    <hr className="divide"></hr>

							    <Form.Row>
				        	        <Col xs={4}>
				        				<Form.Group controlId="welcomeMessage">
										    <Form.Control placeholder="Welcome Message" required as="textarea" value={this.state.welcomeMessageInit} 
										     onChange={this.changeName1 = (event) => {this.setState({welcomeMessageInit: event.target.value})}} rows="3" />
										    <Form.Label>Welcome Message</Form.Label>
										</Form.Group>
							        </Col>
							    </Form.Row>


							    <hr className="divide"></hr>


							    <Form.Row>
							    	<Form.Group  controlId="formClientId">
									        <strong  size="sm">Request to start conversation</strong>
									</Form.Group>
								</Form.Row>
							    <Form.Row>
				        	        
				        	        <Col xs={2}>
				        				<Form.Check type="checkbox" disabled checked className="mb-2" label="Request Name"/>
							        </Col>

				        	        <Col xs={2}>
				        				<Form.Check
									        type="checkbox"
									        className="mb-2"
									        onChange={this.toggleCheckbox}
									        label="Request Email"
									        checked={this.state.checksSelected.includes('Email')}
									        value="Email"
									    />
							        </Col>

							        <Col xs={2}>
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

							    <hr className="divide"></hr>

							    <Button variant="primary" type="submit">
								    Save Settings
								</Button>
				        	</Form>
				        </Tab.Pane>
				      </Tab.Content>
				    </Col>		    
				  </Row>
				</Tab.Container>

			    
	        </div>
	        <div className="overlay"></div>
		</div>
    );
  }
}
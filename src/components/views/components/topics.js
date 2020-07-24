import React, { Component } from "react";
import {Modal,Button,Table,Carousel,DropdownButton,Jumbotron,Dropdown,ButtonGroup,ToggleButtonGroup,ListGroup,ToggleButton,Form,Col,InputGroup,FormControl,Row} from 'react-bootstrap';
import axios from 'axios';
import config from 'react-global-configuration';
import ReactPaginate from 'react-paginate';
import {Validation, Status} from './componentsUtils';
import ModalToConfirm from './confirm';
import { browserHistory } from 'react-router';
import * as Icon from 'react-bootstrap-icons';


export class TopicForm extends Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    	scope: ['admin'].includes(localStorage.getItem('scope')),
	    	token: localStorage.getItem('tokenAdm'),
	    	showModal: true,
	    	validated: false,
	    	collect: {},
	    	name: '',
	    	client: '',
	    	clients: [],
	    	typeUser: this.props.typeUser,
	    	topicSelected: '',
	    	header: {headers: {'Content-Type': 'application/json;charset=UTF-8', 'Authorization' : 'Bearer ' + localStorage.getItem('tokenAdm')}},
	    	urlAddTopic: config.get('baseUrlApi')+'/api/v1/add-topic',
	    	topics: []
	    };
	}

	handleClose = () => {
		this.setState({showModal: false});
		this.props.hiddenModal();
	}

	componentDidMount(){
		if(this.state.scope){
		 	this.loadClients();
		}
		
		if(this.props.idUser){
	        this.getUser(this.props.idUser, false);
		}
	}

	getUser(_id, client){
		axios.post(config.get('baseUrlApi')+'/api/v1/get-user',JSON.stringify({_id: _id, client: client}), 
		 {headers: {'Content-Type': 'application/json;charset=UTF-8', 'Authorization' : 'Bearer ' + this.state.token}}
		).then(res => {
			this.setState({fullname: res.data.data.result[0].fullname});
			this.setState({email: res.data.data.result[0].email});
	    }).catch(function (error) {
	    }).then(function () {});
	}

	handleSave = (event) => {
		event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
          event.stopPropagation();
          this.setState({validated : true});
        }else{
        	this.setState({validated : false});
        	var _dataPost = {
        		client: this.state.client,
        		name : this.state.name,
        		topics: this.state.topics,
        		text_response : this.state.textResponse
            };
   		    //if(this.props.idUser){
   		    //	_url = '/api/v1/update-user';
   		    //	_dataPost._id = this.props.idUser;
   		    //}
   		    axios.post(
   		    	this.state.urlAddTopic,
   		    	JSON.stringify(_dataPost),
   		    	this.state.header
   		    ).then(res => {
   		    	//this.props.success();
		    	form.reset();
		    }).catch(function (error) {
		    }).then(function () {});	
        }
	}

	loadClients() {
	    axios.get(config.get('baseUrlApi')+'/api/v1/clients?limit=50&offset=0', 
    		{headers: {'Content-Type': 'application/json;charset=UTF-8', 'Authorization' : 'Bearer ' + this.state.token}})
	    .then(res => {
	    	this.setState({clients: res.data.data.items});
	    }).catch(function (error) {});
	}

	_handleSelectClient = (event) =>{
		this.setState({client: event.target.value});
		//if(this.props.idUser){
		//	this.getUser(this.props.idUser,event.target.value);
		//}
	}

	_handleSelectTopic = (event) =>{
		this.setState({topicSelected: event.target.value});
	}

	btnAddNewTopic = (event) =>{
		const item = {
			type_topic: this.state.topicSelected,
			value:{}
		}
		const items = this.state.topics;
		items.push(item);
		this.setState({topics: items});
	}

	onchageTopic = (value, index, item, _name)=>{
		const items = this.state.topics;
		if(item.type_topic == 'Link'){
			items[index]['value'][_name] = value;
		}
		this.setState({topics: items});
	}

	render(){
		return(
			<Modal show={this.state.showModal} onHide={this.handleClose} dialogClassName="modal-50w">
		        <Form noValidate validated={this.state.validated} onSubmit={this.handleSave}>
			        <Modal.Header closeButton>
			          <Modal.Title>{this.props.idUser ? 'Edit Topic' : 'Add Topic'}</Modal.Title>
			        </Modal.Header>
			        
			        <Modal.Body>
			        		<Form.Row>
			        	        <Col xs={12}>
					        		
					        		{this.state.typeUser != 'account' && this.state.scope &&
						        		<Form.Group required controlId="clients">
										    <Form.Control placeholder="Client" required as="select" onChange={this._handleSelectClient}>
										        <option value="">Select</option>
											    {this.state.clients.map((item) => 
											      <option key={item._id.$oid} value={item._id.$oid}>{item.name}</option>
								                )}
										    </Form.Control>
										    <Form.Label>Client</Form.Label>
										 </Form.Group>
					        		}

					        		<Form.Group controlId="name">
									    <FormControl required value={this.state.name} onChange={e => this.setState({name: e.target.value})} size="sm" placeholder="Fullname"/>
									    <Form.Label>Name Topic</Form.Label>
									</Form.Group>

									<Form.Group controlId="text_response">
									    <Form.Control 
									                required 
									                size="sm"
									                name={'text_response'} 
									    			placeholder="Text Reponse" 
									    			value={this.state.textResponse} 
									    			onChange={e => this.setState({textResponse: e.target.value})} 
									    			as="textarea" rows="2"/>
									    <Form.Label>Text Response</Form.Label>
									</Form.Group>

									<div className="divide"></div>

									<Form.Group  controlId="topics">
										<InputGroup className="mb-3">
										    <Form.Control placeholder="Type Topic" required as="select" onChange={this._handleSelectTopic}>
										        <option key={0} value="">Select</option>
											    <option key={1} value="Link">Link</option>
											    <option key={2} value="Pattern">Pattern</option>
											    <option key={3} value="Custom">Custom (Html)</option>
										    </Form.Control>
										    <Form.Label>Type Topic</Form.Label>
										    
										    <InputGroup.Append>
										      <Button size="sm" onClick={this.btnAddNewTopic} variant="outline-secondary">Add</Button>
										    </InputGroup.Append>
										</InputGroup>
					                    <Form.Text className="text-muted">
					                      todo..
					                    </Form.Text>
					                </Form.Group>


					                {this.state.topics.map((item, index) => {
					                	if(item.type_topic == 'Link'){
					                		return(
					                			<Form.Row key={index}>
											    	<Col xs={6}>
											    		<Form.Group controlId="formTitle">
														    <Form.Control size="sm" 
														    			  type="text" 
														    			  value={item.value.title} 
														    			  onChange={e => this.onchageTopic(e.target.value, index, item, 'title')} 
														    			  placeholder="Enter Title" />
														    <Form.Label>Title</Form.Label>
														</Form.Group>
											    	</Col>

											    	<Col xs={6}>
											    		<Form.Group controlId="formLink">
														    <Form.Control size="sm" 
														                  type="text" 
														                  value={item.value.link} 
														                  onChange={e => this.onchageTopic(e.target.value, index, item, 'link')} 
														                  placeholder="Enter Link" />
														    <Form.Label>Link (Url)</Form.Label>
														</Form.Group>
											    	</Col>
											    </Form.Row>
					                		);
					                	} else if(item.type_topic == 'Pattern'){
					                		return (
					                			<Form.Group required controlId="clients" key={index}>
												    <Form.Control placeholder="Type Topic" required as="select" onChange={this._handleSelectTopic}>
												        <option value="">Select Pattern</option>
													    <option key={0} value="Link">Pattern 1</option>
													    <option key={1} value="Pattern">Pattern 1</option>
													    <option key={1} value="Custom">Pattern 3</option>
												    </Form.Control>
												    <Form.Label>Select Pattern</Form.Label>
												</Form.Group>
					                		);
					                	} else if(item.type_topic == 'Custom'){
					                		return (
					                			<div key={index}></div>
					                		);
					                	}
					                })}
					    		</Col>
						    </Form.Row>
			        </Modal.Body>

			        <Modal.Footer>
			          <Button variant="secondary" onClick={this.handleClose}>
			            Close
			          </Button>
			          <Button variant="primary" type="submit">
			            Confirm
			          </Button>
			        </Modal.Footer>
			    </Form>
		    </Modal>
		);
	}
}


export default class Topics extends Component {
  	constructor(props) {
	    super(props);
	    if(localStorage.getItem('tokenAdm') == undefined){
	      browserHistory.push('/login');
	    }
	    this.state = {
	      scope: ['admin'].includes(localStorage.getItem('scope')),
	      token: localStorage.getItem('tokenAdm'),
	      user_id: localStorage.getItem('_id'),
	      inputLink: '',
	      inputDescription:'',
	      validated : false,
	      imageFile: '',
	      errorSaveForm: '',
	      collect: [{link: '', description: '', imageFile: '', 'namefile':''}],
	      items: [],
	      pageCount: 10,
	      offset: 0,
	      showAddUser: false,
	      perPage: 10,
	      idUser: '',
	      deactivateUser: false
	    };
	}

	componentDidMount(){
		this.loadTopics();
	}

	handlePageClick = (e)=>{

	}

	loadTopics() {
		var _url = config.get('baseUrlApi')+'/api/v1/topics?limit='+this.state.perPage+'&offset='+this.state.offset;
		var _config = {headers: {'Content-Type': 'application/json;charset=UTF-8', 'Authorization' : 'Bearer ' + this.state.token}};
	    axios.get(_url, _config).then(res => {
	    	this.setState({items: res.data.data.items,pageCount: Math.ceil(res.data.data.total_count / res.data.data.limit),});
	    }).catch(function (error) {});
	}

	successUser = ()=>{
		this.setState({showAddUser : false});
		this.loadTopics();
	}

	addUser = (event)=>{
		this.setState({showAddUser : true});
		this.setState({idUser : ''});
	}

	hiddenAddUser = data => {
	    this.setState({showAddUser : false});
	};

	editUser(item){
		this.setState({showAddUser : true});
		this.setState({idUser : item._id.$oid});
	}

	deactivateUser(item){
		this.setState({idUser : item._id.$oid});
		this.setState({deactivateUser : true});
	}

	deactivateUserConfirm = ()=>{
		axios.post(
		    	config.get('baseUrlApi')+'/api/v1/deactivate-user', 
		    	JSON.stringify({_id: this.state.idUser}), 
		    	{headers: {'Content-Type': 'application/json;charset=UTF-8', 'Authorization' : 'Bearer ' + this.state.token}}
		).then(res => {}).catch(function (error) {
	    }).then(function () {});
	}

	deactivateUserClose = ()=>{
		this.setState({deactivateUser : false});
	}
  		render() {
				return (
							<section>
							    <Jumbotron className="content-form jumbotron-sm jumbotron-right">
						            <Button variant="secondary" onClick={this.addUser}>Add Topic <Icon.Plus size={25}/></Button>
						            {this.state.showAddUser && 
							        	<TopicForm 
							        		hiddenModal = {this.hiddenAddUser} 
							        		idUser={this.state.idUser}
							        		success={this.successUser}
							        	/>
							        }

							        {this.state.deactivateUser && 
								        <ModalToConfirm
						                   handleConfirm={this.deactivateUserConfirm}
						                   hiddenModal={this.deactivateUserClose}
						                   message="Are you sure to deactivate this item?"
						                />
						            }
								</Jumbotron>

					            <Table id="itemTable" striped bordered hover size="sm">
					              <thead>
					                <tr>
					                  <th>Name</th>
					                  <th>Status</th>
					                  <th>Created</th>
					                  <th></th>
					                </tr>
					              </thead>
					              <tbody>
					                {this.state.items.map((item) => 
					                  <tr key={item._id.$oid}>
					                    <td>{item.name}</td>
					                    <td>
					                      <Status status={item.status}/>
					                    </td>
					                    <td>{item._created}</td>
					                    <td>
					                    	<DropdownButton as={ButtonGroup} title="Options" id="bg-vertical-dropdown-1">
												    <Dropdown.Item eventKey="1" onClick={(e) => this.editUser(item)}>Edit</Dropdown.Item>
												    {this.state.user_id != item._id.$oid && 
												    	<Dropdown.Item eventKey="2" onClick={(e) => this.deactivateUser(item)}>Deactivate</Dropdown.Item>
												    }

											</DropdownButton>
					                    </td>
					                 </tr>
					                )}
					              </tbody>
					            </Table>

					            <div id="react-paginate">
						            <ReactPaginate
							          previousLabel={'Anterior'}
							          nextLabel={'Siguiente'}
							          breakLabel={'...'}
							          breakClassName={'break-me'}
							          pageCount={this.state.pageCount}
							          marginPagesDisplayed={2}
							          pageRangeDisplayed={5}
							          onPageChange={this.handlePageClick}
							          containerClassName={'pagination'}
							          subContainerClassName={'pages pagination'}
							          activeClassName={'active'}
							        />
						        </div>
					        </section>
		  );
  		}
}

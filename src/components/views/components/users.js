import React, { Component } from "react";
import {Modal,Button,Table,Carousel,DropdownButton,Jumbotron,Dropdown,ButtonGroup,ToggleButtonGroup,ListGroup,ToggleButton,Form,Col,InputGroup,FormControl,Row} from 'react-bootstrap';
import axios from 'axios';
import config from 'react-global-configuration';
import ReactPaginate from 'react-paginate';
import {Validation, Status} from './componentsUtils';
import ModalToConfirm from './confirm';
import { browserHistory } from 'react-router';
import * as Icon from 'react-bootstrap-icons';

export class FormUser extends Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    	showModal: true,
	    	validated: false,
	    	token: localStorage.getItem('tokenAdm'),
	    	collect: {},
	    	fullname: '',
	    	email: '',
	    	password: '',
	    	client: '',
	    	clients: []
	    };
	}

	handleClose = () => {
		this.setState({showModal: false});
		this.props.hiddenModal();
	}

	componentDidMount(){
		this.loadClients();
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
   		    	"fullname" : this.state.fullname,
   		    	"email" : this.state.email,
   		    	"password" : this.state.password,
   		    	"client" : this.state.client
   		    };
   		    var _url = '/api/v1/add-user';
   		    if(this.props.idUser){
   		    	_url = '/api/v1/update-user';
   		    	_dataPost._id = this.props.idUser;
   		    }
   		    axios.post(config.get('baseUrlApi')+_url, JSON.stringify(_dataPost), 
   		    	{headers: {'Content-Type': 'application/json;charset=UTF-8', 'Authorization' : 'Bearer ' + this.state.token}}
   		    ).then(res => {
   		    	this.props.success();
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
		if(this.props.idUser){
			this.getUser(this.props.idUser,event.target.value);
		}
	}

	render(){
		return(
			<Modal show={this.state.showModal} onHide={this.handleClose}>
		        <Form noValidate validated={this.state.validated} onSubmit={this.handleSave}>
			        <Modal.Header closeButton>
			          <Modal.Title>Add User</Modal.Title>
			        </Modal.Header>
			        
			        <Modal.Body>
			        		<Form.Row>
			        	        <Col xs={12}>
					        		<Form.Group required controlId="clients">
									    <Form.Control placeholder="Client" required as="select" onChange={this._handleSelectClient}>
									        <option value="">Select</option>
										    {this.state.clients.map((item) => 
										      <option key={item._id.$oid} value={item._id.$oid}>{item.name}</option>
							                )}
									    </Form.Control>
									    <Form.Label>Client</Form.Label>
									 </Form.Group>


					        		<Form.Group controlId="fullname">
									    <FormControl required value={this.state.fullname} onChange={e => this.setState({fullname: e.target.value})} size="sm" placeholder="Fullname"/>
									    <Form.Label>Fullname</Form.Label>
									</Form.Group>

									<Form.Group controlId="email">
									    <FormControl required value={this.state.email} onChange={e => this.setState({email: e.target.value})} type="email" size="sm" placeholder="Email"/>
									    <Form.Label>Email</Form.Label>
									</Form.Group>

									<Form.Group controlId="password">
									    <FormControl required value={this.state.password} onChange={e => this.setState({password: e.target.value})} type="password" size="sm" placeholder="Password"/>
									    <Form.Label>Password</Form.Label>
									</Form.Group>
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

export class Users extends Component {
	constructor(props) {
	    super(props);
	    if(localStorage.getItem('tokenAdm') == undefined){
	      browserHistory.push('/login');
	    }
	    this.state = {
	      inputLink: '',
	      inputDescription:'',
	      token: localStorage.getItem('tokenAdm'),
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
		this.loadUsers();
	}

	handlePageClick = (e)=>{

	}

	loadUsers() {
	    axios.get(config.get('baseUrlApi')+'/api/v1/users?limit='+this.state.perPage+'&offset='+this.state.offset, {headers: {'Content-Type': 'application/json;charset=UTF-8', 'Authorization' : 'Bearer ' + this.state.token}})
	    .then(res => {
	    	this.setState({items: res.data.data.items,pageCount: Math.ceil(res.data.data.total_count / res.data.data.limit),});
	    }).catch(function (error) {});
	}

	successUser = ()=>{
		this.setState({showAddUser : false});
		this.loadUsers();
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
		            <Button variant="secondary" onClick={this.addUser}>Add User <Icon.Plus size={25}/></Button>
		            {this.state.showAddUser && 
			        	<FormUser 
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
	                  <th>Fullname</th>
	                  <th>Email</th>
	                  <th>Status</th>
	                  <th>Created</th>
	                  <th></th>
	                </tr>
	              </thead>
	              <tbody>
	                {this.state.items.map((item) => 
	                  <tr key={item._id.$oid}>
	                    <td>{item.fullname}</td>
	                    <td>{item.email}</td>
	                    <td>
	                      <Status status={item.status}/>
	                    </td>
	                    <td>{item._created}</td>
	                    <td>
	                    	<DropdownButton as={ButtonGroup} title="Options" id="bg-vertical-dropdown-1">
								    <Dropdown.Item eventKey="1" onClick={(e) => this.editUser(item)}>Edit</Dropdown.Item>
								    <Dropdown.Item eventKey="2" onClick={(e) => this.deactivateUser(item)}>Deactivate</Dropdown.Item>
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
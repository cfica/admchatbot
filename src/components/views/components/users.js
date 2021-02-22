import React, { Component } from "react";
import {Modal,Button,Table,Carousel,DropdownButton,Jumbotron,Dropdown,ButtonGroup,ToggleButtonGroup,ListGroup,ToggleButton,Form,Col,InputGroup,FormControl,Row} from 'react-bootstrap';
import axios from 'axios';
import config from 'react-global-configuration';
import ReactPaginate from 'react-paginate';
import {Validation, Status} from './componentsUtils';
import ModalToConfirm from './confirm';
import { browserHistory } from 'react-router';
import * as Icon from 'react-bootstrap-icons';
import {Helper} from './helper';
import * as moment from 'moment';

export class FormUser extends Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    	scope: ['admin'].includes(localStorage.getItem('scope')),
	    	token: localStorage.getItem('tokenAdm'),
	    	showModal: true,
	    	validated: false,
	    	collect: {},
	    	fullname: '',
	    	email: '',
	    	password: '',
	    	client: '',
	    	clients: [],
	    	typeUser: this.props.typeUser
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
   		    	"fullname" : this.state.fullname,
   		    	"email" : this.state.email,
   		    	"password" : this.state.password,
   		    	"client" : this.state.scope ? this.state.client : localStorage.getItem('client')
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
			          <Modal.Title>{this.props.idUser ? 'Edit User' : 'Add User'}</Modal.Title>
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


					        		<Form.Group controlId="fullname">
									    <FormControl required value={this.state.fullname} onChange={e => this.setState({fullname: e.target.value})} size="sm" placeholder="Fullname"/>
									    <Form.Label>Fullname</Form.Label>
									</Form.Group>

									<Form.Group controlId="email">
									    <FormControl disabled={this.props.idUser ? true : false} required value={this.state.email} onChange={e => this.setState({email: e.target.value})} type="email" size="sm" placeholder="Email"/>
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
		this.loadUsers();
	}

	handlePageClick = (e)=>{

	}

	loadUsers() {
		var _url = config.get('baseUrlApi')+'/api/v1/users?limit='+this.state.perPage+'&offset='+this.state.offset;
		var _config = {headers: {'Content-Type': 'application/json;charset=UTF-8', 'Authorization' : 'Bearer ' + this.state.token}};
	    axios.get(_url, _config).then(res => {
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

				<Form.Row className="titleFragment lg">
				    <Col xs={6}><h2>Users</h2></Col>
				    <Col xs={6} className="buttons options">
				    	<Button variant="link" onClick={this.addUser}>Add User <Icon.Plus size={25}/></Button>
				    </Col>
				</Form.Row>


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


	            <Table id="itemTable" striped bordered variant="dark" hover size="sm">
	              <thead>
	                <tr>
	                  <th>Email</th>
	                </tr>
	              </thead>
	              <tbody>
	                {this.state.items.map((item) => 
	                  <tr key={item._id.$oid}>
	                    <td>{item.email}{' '}<Status status={item.status}/>
	                        <div className="table-options">
	                    		<span className="_created">{moment(new Helper().formatDate(item._created)).fromNow()}</span>
		                    	<DropdownButton className="btn-3p" as={ButtonGroup} title="...">
									<Dropdown.Item eventKey="1" onClick={(e) => this.editUser(item)}>Edit</Dropdown.Item>
								    {this.state.user_id != item._id.$oid && 
								    	<Dropdown.Item eventKey="2" onClick={(e) => this.deactivateUser(item)}>Deactivate</Dropdown.Item>
								    }
								</DropdownButton>
	                    	</div>
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
import React, { Component } from "react";
import $ from "jquery";
import { Alert, Navbar, Nav, Tab, Modal, Badge, Tabs, InputGroup, Collapse, ButtonGroup,ListGroup, Form,NavDropdown,FormControl,Container, Row, Col,Media,Jumbotron, Button, Breadcrumbs, Table} from 'react-bootstrap';
import axios from 'axios';
import config from 'react-global-configuration';
import { bake_cookie, read_cookie, delete_cookie } from 'sfcookies';
import { browserHistory } from 'react-router';

export default class ModalClient extends Component {
  		constructor(props) {
		    super(props);
		    if(read_cookie('token') == ''){
		      browserHistory.push('/login');
		    }

		    this.state = {
		      showModal : true,
		      validated : false,
		      errorSaveForm: "",
		      token: read_cookie('token'),
		      inputDomain : '',
		      inputName : ''
		    };
		}

		handleClose = () => {
			this.setState({showModal: false});
			this.props.hiddenModal();
		}

		handleConfirm = () => {
			this.setState({showModal: false});
			this.props.handleConfirm();
		}

		handleSubmitForm = (event)=>{
			event.preventDefault();
			const form = event.currentTarget;
		    if (form.checkValidity() === false) {
		      event.stopPropagation();
		      this.setState({errorSaveForm : ''});
		      this.setState({validated : true});
		    }else{
		    	this.setState({validated : false});
	   		    var _dataPost = {
	   		    	"domain" : this.state.inputDomain,
	   		    	"name" : this.state.inputName
	   		    };

	   		    axios.post(config.get('baseUrlApi')+'/api/v1/add-client', 
	   		    	JSON.stringify(_dataPost), {headers: {'Content-Type': 'application/json;charset=UTF-8', 'Authorization' : 'Bearer ' + this.state.token}})
			    .then(res => {
			    	this.setState({errorSaveForm : false});
			    	form.reset();
			    })
			    .catch(function (error) {
				    this.setState({errorSaveForm : true});
				})
				.then(function () {
				    // always executed
				});
		    }
		}

		render(){
			return(
				<div className="modal-client">
		  			<Modal show={this.state.showModal} onHide={this.handleClose}>
		  			    <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmitForm}>
					        <Modal.Header closeButton>
					          <Modal.Title>Add Client</Modal.Title>
					        </Modal.Header>

					        <Modal.Body>
					        		    <Form.Group  controlId="formDomain">
								            <Form.Label >Domain</Form.Label>
								            <Form.Control required size="sm" 
								                          type="text" value={this.state.inputDomain} 
								                          onChange={this.changeDomain = (event)=>{this.setState({inputDomain: event.target.value});}} placeholder="Domain" />
								            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
								            <Form.Control.Feedback type="invalid">Please enter a valid data.</Form.Control.Feedback>
								            <Form.Text className="text-muted">
								              This tag must be unique. Example, hello_how_are_you
								            </Form.Text>
								        </Form.Group>

								        <Form.Group  controlId="formName">
								            <Form.Label >Name</Form.Label>
								            <Form.Control required size="sm" type="text" value={this.state.inputName} 
								                          onChange={this.changeName = (event) => {this.setState({inputName: event.target.value})}} placeholder="Name" />
								            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
								            <Form.Control.Feedback type="invalid">Please enter a valid data.</Form.Control.Feedback>
								            <Form.Text className="text-muted">
								              This tag must be unique. Example, hello_how_are_you
								            </Form.Text>
								        </Form.Group>

					        </Modal.Body>


					        <Modal.Footer>
					          <Button variant="secondary" onClick={this.handleClose}>
					            Close
					          </Button>
					          <Button variant="primary" type="submit">
					            Save Client
					          </Button>
					        </Modal.Footer>
					    </Form>
				    </Modal>
			  	</div>
			);
		}
}
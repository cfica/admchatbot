import React, { Component } from "react";
import { Alert, Navbar, Nav, Tab, Modal, Badge, ToggleButton,Tabs, InputGroup, Collapse, ButtonGroup,ListGroup, Form,NavDropdown,FormControl,Container, Row, Col,Media,Jumbotron, Button, Breadcrumbs, Table} from 'react-bootstrap';
import axios from 'axios';
import config from 'react-global-configuration';
import { browserHistory } from 'react-router';
import {Helper} from './helper';

export default class ModalClient extends Component {
  		constructor(props) {
		    super(props);
		    if(localStorage.getItem('tokenAdm') == undefined){
		      browserHistory.push('/login');
		    }

		    this.state = {
		      showModal : true,
		      validated : false,
		      errorSaveForm: "",
		      token: localStorage.getItem('tokenAdm'),
		      inputDomain : '',
		      inputIp : '',
		      inputName : '',
		      clients: [],
		      //groupAccount: false
		    };
		}

		loadClients() {
			async function _requestApi(_this){
			    var _url = config.get('baseUrlApi')+'/api/v1/clients';
			    const res = await new Helper().getRequest(_url,'back');
			    console.log(res);
			    _this.setState({clients: res.items});
			}
			_requestApi(this);
		}


		handleClose = () => {
			this.setState({showModal: false});
			this.props.hiddenModal();
		}

		handleConfirm = () => {
			this.setState({showModal: false});
			this.props.handleConfirm();
		}

		componentDidMount(){
			if(this.props.id.length > 0){
				async function _requestApi(_this, id){
				    var _url = config.get('baseUrlApi')+'/api/v1/client?id='+id;
				    const res = await new Helper().getRequest(_url,'back');
				    _this.setState({'inputDomain': res.result.domain});
				    _this.setState({'inputIp': res.result.ip});
				    _this.setState({'inputName': res.result.name});
				}
				_requestApi(this, this.props.id);
			}

			this.loadClients();
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
	   		    	"ip" : this.state.inputIp,
	   		    	"name" : this.state.inputName
	   		    };

	   		    async function _requestApi(_this, _dataPost){
				    if(_this.props.id.length > 0){
				    	var _url = config.get('baseUrlApi')+'/api/v1/client?id='+_this.props.id;
				    	const res = await new Helper().putRequest(_url,_dataPost,'back');
	   		    	}else{
	   		    		var _url = config.get('baseUrlApi')+'/api/v1/client';
	   		    		const res = await new Helper().postRequest(_url,_dataPost,'back');
	   		    	}
	   		    	_this.setState({errorSaveForm : false});
	   		    	form.reset();
	   		    	_this.props.hiddenModal();

				}
				_requestApi(this, _dataPost);
		    }
		}


		/*groupAccount = () => {
			if(this.state.groupAccount){
				this.setState({groupAccount: false});	
			}else{
			   this.setState({groupAccount: true});	
			}
		}*/


		render(){
			return(
				<div className="modal-client">
		  			<Modal show={this.state.showModal} onHide={this.handleClose}>
		  			    <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmitForm}>
					        <Modal.Header closeButton>
					          <Modal.Title>
					            {this.props.id.length > 0 && 'Update Client'}
					            {this.props.id.length == 0 && 'Add Client'}
					          </Modal.Title>
					        </Modal.Header>

					        <Modal.Body>
					        		    
					        		    <Form.Group  controlId="formDomain">
								            <Form.Control required size="sm" 
								                          type="text" value={this.state.inputDomain} 
								                          onChange={this.changeDomain = (event)=>{this.setState({inputDomain: event.target.value});}} placeholder="Domain" />
								            <Form.Label >Domain</Form.Label>
								            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
								            <Form.Control.Feedback type="invalid">Please enter a valid data.</Form.Control.Feedback>
								            <Form.Text className="text-muted">
								              This tag must be unique. Example, hello_how_are_you
								            </Form.Text>
								        </Form.Group>

								        <Form.Group  controlId="formIp">
								            
								            <Form.Control required size="sm" 
								                          type="text" value={this.state.inputIp} 
								                          onChange={this.changeDomain = (event)=>{this.setState({inputIp: event.target.value});}} placeholder="Domain" />
								            <Form.Label >Ip Domain</Form.Label>

								            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
								            <Form.Control.Feedback type="invalid">Please enter a valid data.</Form.Control.Feedback>
								            <Form.Text className="text-muted">
								              This tag must be unique. Example, hello_how_are_you
								            </Form.Text>
								        </Form.Group>

								        <Form.Group  controlId="formName">
								            <Form.Control required size="sm" type="text" value={this.state.inputName} 
								                          onChange={this.changeName = (event) => {this.setState({inputName: event.target.value})}} placeholder="Name" />
								            <Form.Label >Name</Form.Label>
								            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
								            <Form.Control.Feedback type="invalid">Please enter a valid data.</Form.Control.Feedback>
								            <Form.Text className="text-muted">
								              This tag must be unique. Example, hello_how_are_you
								            </Form.Text>
								        </Form.Group>

								        <Form.Group controlId="groupClients">
										    <Form.Check type="checkbox" value={this.state.groupAccount} onClick={this.groupAccount} label="Group account?" />
										</Form.Group>


										{/*this.state.groupAccount && 
									        <div>
									        	<Form.Group controlId="formGroupIn">
												    <Form.Label>Group in</Form.Label>
												    <Form.Control as="select" size="sm" multiple>
												        
												        {this.state.clients.map((item) => 
												      		<option>{item.domain}</option>
												        )}
												    </Form.Control>
												</Form.Group>

												<Form.Group  controlId="formNameGroup">
										            
										            <Form.Control size="sm" type="text" value={this.state.groupName} 
										                          onChange={(e) => this.setState({groupName: e.target.value} )} placeholder="Name" />
										            
										            <Form.Label >Name Group</Form.Label>
										            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
										            <Form.Control.Feedback type="invalid">Please enter a valid data.</Form.Control.Feedback>
										            <Form.Text className="text-muted">
										              This tag must be unique. Example, hello_how_are_you
										            </Form.Text>
										        </Form.Group>
									        </div>
									    */}

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
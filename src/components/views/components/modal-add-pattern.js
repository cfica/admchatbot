import React, { Component } from "react";
import { Alert, Navbar, Nav, Tab, Modal, Badge, Tabs, InputGroup, Collapse, ButtonGroup,ListGroup, Form,NavDropdown,FormControl,Container, Row, Col,Media,Jumbotron, Button, Breadcrumbs, Table} from 'react-bootstrap';
import axios from 'axios';
import config from 'react-global-configuration';
//import { bake_cookie, read_cookie, delete_cookie } from 'sfcookies';
import { browserHistory } from 'react-router';
import Cookies from 'universal-cookie';
import EditorHtml from './editorHtml';
import SingleOptions from './singleOptions';

export default class ModalToLearn extends Component {
  		constructor(props) {
		    super(props);
		    const cookies = new Cookies();
		    if(cookies.get('tokenAdm') == undefined){
		      browserHistory.push('/login');
		    }

		    //console.log(this.props.patternSelected);
		    var _valueInputAddPattern = typeof this.props.patternSelected[1] != 'undefined' ? this.props.patternSelected[1] : '';
		    this.state = {
		      showModal : true,
		      searchTerm : "",
		      resultFiler: [],
		      searchResults : [],
		      showFilterInput: false,
		      valuePattern : _valueInputAddPattern,
		      valuePatternHidden: '',
		      listPatternsAdd : [],
		      showResponseType : '',
		      responseTypeValue : '',
		      valueResponseText : '',
		      valueResponseTextHidden : '',
		      listResponseTextAdd : [],
		      responseTypeHtml : '',
		      validated : false,
		      errorSaveForm: "",
		      token: cookies.get('tokenAdm')
		    };
		}

		handleClose = (e) => {
			this.setState({showModal: false})
			this.props.hiddenModal();
	    };

		handleChange = event => {
			var _value = event.target.value;
			this.setState({searchTerm: _value});
			if(this.state.searchTerm.length > 2){
				axios.post(config.get('baseUrlApi')+'/api/v1/filter-tags', 
				JSON.stringify({ tag: _value}), {headers: {'Content-Type': 'application/json;charset=UTF-8', 'Authorization' : 'Bearer ' + this.state.token}})
			    .then(res => {
			    	var _items = [];
			    	res.data.data.items.forEach(function(elem){
			    		_items.push(elem.tag);
			    	});
			    	this.setState({resultFiler: _items});

			    	if(_items.length > 0){
				    	this.setState({showFilterInput: true});
				    	this.setState({searchResults : _items});
				    }else{
				    	this.setState({showFilterInput: false});
				    	this.setState({searchResults : []});
				    }

			    });
			}
		};
		
		_handonchangeInputPattern = (event)=>{
			var _value = event.target.value;
			this.setState({valuePattern : _value});
		}
		
	    _handleonAddPattern = (event)=>{    	
	    	if(this.state.valuePattern.length > 3){
	    		const _items = this.state.listPatternsAdd;
		    	_items.push(this.state.valuePattern);
		    	this.setState({valuePattern : ''});
				this.setState({listPatternsAdd : _items});
				this.setState({valuePatternHidden : _items});
			}
		}
		
		/*INPUT ADD RESPONSE*/
		_handleonTypeResponse = (event) =>{
			    this.setState({responseTypeValue : event.target.value});
			//if(event.target.value == 'Text'){
				this.setState({showResponseType : event.target.value});
			//}else{
				//this.setState({showResponseType : false});
			//}
		}

		/*INPUT ADD RESPONSE TEXT*/
		_handleChangeInputResponseText = (event)=>{
			var _value = event.target.value;
			this.setState({valueResponseText: _value});
		}

		_handleAddResponseText = (event) => {
	    	if(this.state.valueResponseText.length > 3){
	    		const _items = this.state.listResponseTextAdd;
		    	_items.push(this.state.valueResponseText);
		    	this.setState({valueResponseText: ''});
				this.setState({listResponseTextAdd : _items});
				this.setState({valueResponseTextHidden : _items});
			}
		}

		/*SUBMIT FORM*/
		handleSubmitFormAddPattern = (event) =>{
			event.preventDefault();
			const form = event.currentTarget;
		    if (form.checkValidity() === false || 
		    	this.state.valueResponseTextHidden.length == 0 ||
		    	this.state.valuePatternHidden.length == 0 
		    ) {
		      event.stopPropagation();
		      this.setState({errorSaveForm : ''});
		      this.setState({valueResponseTextHidden : false});
		      this.setState({valuePatternHidden : false});
		      this.setState({validated : true});
		    }else{
		    	this.setState({validated : false});
	 			
	   		    const _valueResponse = '';
	   		    if(this.state.showResponseType == 'Text'){
	   		    	this._valueResponse = this.state.listResponseTextAdd;
	   		    }else if(this.state.showResponseType == 'Html'){
	   		    	this._valueResponse = this.state.responseTypeHtml;
	   		    }

	   		    var _dataPost = {
	   		    	"tag" : this.state.searchTerm,
	   		    	"patterns" : this.state.listPatternsAdd,
	   		    	"responses" : {"type" : this.state.showResponseType, "value" : this._valueResponse}
	   		    };
	   		    //this.state.responseTypeValue
	   		    axios.post(config.get('baseUrlApi')+'/api/v1/add-pattern', 
	   		    	JSON.stringify(_dataPost), {headers: {'Content-Type': 'application/json;charset=UTF-8', 'Authorization' : 'Bearer ' + this.state.token}})
			    .then(res => {
			    	this.setState({errorSaveForm : false});
			    	this.setState({searchTerm : ''});
			    	this.setState({valueResponseTextHidden : ''});
			    	this.setState({valuePatternHidden : ''});
			    	this.setState({listResponseTextAdd : []});
			    	this.setState({listPatternsAdd : []});
			    	this.setState({searchResults : []});
			    	this.setState({showResponseType : ''});
			    	this.setState({valueResponseTextHidden : ''});
		      		this.setState({valuePatternHidden : ''});
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

		handleChangeValueHtmlCode = (code) => {
			this.setState({responseTypeHtml: code});
		}

  		render() {
				return (
				  	<div className="content-button">
				      {/*<Button variant="secondary" onClick={handleShow}>Add Pattern</Button>*/}
				      <Modal show={this.state.showModal} dialogClassName="modal-90w" onHide={this.handleClose}>
				        <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmitFormAddPattern}>
						        <Modal.Header closeButton>
						          <Modal.Title>Add Pattern</Modal.Title>
						        </Modal.Header>
						        <Modal.Body>
					                    <Form.Row>
					                        <Col xs={4}>
							                    <Form.Group  controlId="formBasicTag">
										            <Form.Label >1.- Tag</Form.Label>
										            <Form.Control required size="sm" type="text" value={this.state.searchTerm} onChange={this.handleChange} placeholder="Search Tag" />
										            {this.state.showFilterInput &&
										                <div className="contFilterList">
										                	<ListGroup variant="flush">
										                    	{this.state.searchResults.map(item => (
														          <ListGroup.Item action href="#link1">{item}</ListGroup.Item>
														        ))}
															</ListGroup>
										                </div>
										            }
										            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
										            <Form.Control.Feedback type="invalid">Please enter a valid data.</Form.Control.Feedback>
										            <Form.Text className="text-muted">
										              This tag must be unique. Example, hello_how_are_you
										            </Form.Text>
										        </Form.Group>
										    </Col>
									    </Form.Row>

									    <Form.Row>
									        <Col xs={4}>
									                <Form.Group  controlId="formBasicPatterns">
									                    <Form.Label >2.- Patterns</Form.Label>
														<InputGroup className="mb-3">
														    <FormControl value={this.state.valuePattern} onChange={this._handonchangeInputPattern} size="sm"
														      placeholder="Add Pattern"
														      aria-label="Add Pattern"
														      aria-describedby="basic-addon2"
														    />
														    <InputGroup.Append>
														      <Button size="sm" onClick={this._handleonAddPattern} variant="outline-secondary">Add</Button>
														    </InputGroup.Append>
														</InputGroup>
														<FormControl required type="hidden" name="valuePattern" value={this.state.valuePatternHidden} size="sm"/>
									                    {this.state.valuePatternHidden.length > 0 && <div className="valid-feedback-custom">Looks good!</div>}
									                    {this.state.valuePatternHidden === false && <div className="invalid-feedback-custom">*You must enter the least 1 item.</div>}

									                    <ul className="listItemsSelected">
													        {this.state.listPatternsAdd.map((li, i) => <li key={i}><Badge variant="secondary">{li} <a href="#" itemID = {i}>x</a></Badge></li>)}
									                    </ul>

									                    <Form.Text className="text-muted">
									                      Possible questions that the user will ask through the chat.
									                    </Form.Text>
									                 </Form.Group>
									        </Col>
									    </Form.Row>


									    <Form.Row>
									        <Col xs={4}>
								                <Form.Group  controlId="formBasicResponse">
								                    <Form.Label >3.- Type Response</Form.Label>
								                    <div className="contentListGroupSelect">
													    <Form.Control required size="sm" as="select" onChange={this._handleonTypeResponse}>
														    <option value="">Select</option>
														    <option value="Text">Text</option>
														    <option value="Form">Form</option>
														    <option value="Slide">Slide</option>
														    <option value="Html">Html</option>
														    <option value="Single-option">Single option</option>
														    <option value="Multiple-choices">Multiple choices</option>
														    <option value="Data-Set">Data Set</option>
														</Form.Control>
														<Form.Control.Feedback>Looks good!</Form.Control.Feedback>
										            	<Form.Control.Feedback type="invalid">Please enter a valid data.</Form.Control.Feedback>
								                    </div>
										            <Form.Text className="text-muted">
								                      Possible responses that the user will ask through the chat.
								                    </Form.Text>
								                </Form.Group>
								         	</Col>
									    </Form.Row>

						                {this.state.showResponseType == 'Text' &&
							                <Form.Row>
									        	<Col xs={4}>
									                <div className="formTypeResponse">						
														<Form.Group  controlId="formBasicResponseText">
											                    <Form.Label >Responses</Form.Label>
																<InputGroup className="mb-3">
																    <FormControl value={this.state.valueResponseText} onChange={this._handleChangeInputResponseText} size="sm"
																      placeholder="Add Response"
																      aria-label="Add Response"
																      aria-describedby="basic-addon2"
																    />
																    <InputGroup.Append>
																      <Button size="sm" onClick={this._handleAddResponseText} variant="outline-secondary">Add</Button>
																    </InputGroup.Append>
																</InputGroup>

																<FormControl required type="hidden" name="valueResponseTextHidden" value={this.state.valueResponseTextHidden} size="sm"/>
																{this.state.valueResponseTextHidden.length > 0 && <div className="valid-feedback-custom">Looks good!</div>}
									                    		{this.state.valueResponseTextHidden === false && <div className="invalid-feedback-custom">*You must enter the least 1 item.</div>}

											                    <ul className="listItemsSelected">
															        {this.state.listResponseTextAdd.map((li, i) => <li key={i}><Badge variant="secondary">{li} <a href="#" itemID = {i}>x</a></Badge></li>)}
											                    </ul>
										                </Form.Group>
													</div>
											    </Col>
										    </Form.Row>
										}

										{this.state.showResponseType == 'Html' &&
										    <Form.Row>
									        	<Col xs={12}>
									                <div className="formTypeResponse">						
														<EditorHtml 
														   onChangeValue={this.handleChangeValueHtmlCode} 
														   valueCode={this.state.responseTypeHtml}
														/>
													</div>
											    </Col>
										    </Form.Row>
									    }


									    {this.state.showResponseType == 'Single-option' &&
										    <Form.Row>
									        	<Col xs={12}>
									                <SingleOptions/>
											    </Col>
										    </Form.Row>
									    }
					               
						        </Modal.Body>
						        
						        <Modal.Footer>
						          {this.state.errorSaveForm === false && <Alert key="success" variant="success">The configuration was successfully saved,</Alert>}
						          {this.state.errorSaveForm === true && <Alert key="danger" variant="danger">An error occurred while saving the configuration.</Alert>}

						          <Button variant="secondary" onClick={this.handleClose}>
						            Close
						          </Button>
						          <Button variant="primary" type="submit">
						            Save Changes
						          </Button>
						        </Modal.Footer>
				        </Form>
				      </Modal>
				    </div>
				);
  		}
}

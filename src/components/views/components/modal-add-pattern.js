import React, { Component } from "react";
import { Alert, Navbar, Nav, Tab, Modal, Badge, Tabs, InputGroup, Collapse, ButtonGroup,ListGroup, Form,NavDropdown,FormControl,Container, Row, Col,Media,Jumbotron, Button, Breadcrumbs, Table} from 'react-bootstrap';
import axios from 'axios';
import config from 'react-global-configuration';
import { browserHistory } from 'react-router';
import EditorHtml from './editorHtml';
import SingleOptions from './singleOptions';
import MultiChoices from './multiChoices';
import ChatForm from './chatForm';
import {Slide} from './slide';
import Preview from './preview';

export default class ModalToLearn extends Component {
  		constructor(props) {
		    super(props);
		    if(localStorage.getItem('tokenAdm') == undefined){
		      browserHistory.push('/login');
		    }

		    //console.log(this.props.patternSelected);
		    var _valueInputAddPattern = typeof this.props.patternSelected[1] != 'undefined' ? this.props.patternSelected[1] : '';
		    this.state = {
		      scope: ['admin'].includes(localStorage.getItem('scope')),
	          token: localStorage.getItem('tokenAdm'),
	          user_id: localStorage.getItem('_id'),
	          client: localStorage.getItem('client'),
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
		      listOptionsMChoices: [],
		      valuesDataForm: {},
		      valueDataSlide: {},
		      clients: [],
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
				this.search(_value);
			}
		};


		search = async val =>{
			var _config = {headers: {'Content-Type': 'application/json;charset=UTF-8', 'Authorization' : 'Bearer ' + this.state.token}};
			const res = await axios.post(config.get('baseUrlApi')+'/api/v1/filter-tags',JSON.stringify({ tag: val}), _config);
		    const data = await res.data.data.items;
		    var _items = [];
	    	data.forEach(function(elem){
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
		}
		
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

		componentDidMount(){
			if(this.state.scope){
				this.loadClients();
			}else{
				this.setState({client: this.state.client});
			}
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
			var _valueResponse = '';
			var _url = config.get('baseUrlApi')+'/api/v1/add-pattern';
			var _config = {headers: {'Content-Type': 'application/json;charset=UTF-8', 'Authorization' : 'Bearer ' + this.state.token}};
   		    //console.log(this.state.client);
   		    var _dataPost = {
   		    	"client": this.state.client,
   		    	"tag" : this.state.searchTerm,
   		    	"patterns" : this.state.listPatternsAdd,
   		    	"responses" : {"type" : this.state.showResponseType, "value" : _valueResponse}
   		    };
   		    /****/
   		    if(this.state.showResponseType == 'Text'){
   		    	_dataPost.responses.value = this.state.listResponseTextAdd;
   		    	_dataPost = JSON.stringify(_dataPost);
   		    }else if(this.state.showResponseType == 'Html'){
   		    	_dataPost.responses.value = this.state.responseTypeHtml;
   		    	_dataPost = JSON.stringify(_dataPost);
   		    }else if(this.state.showResponseType == 'Form'){
   		    	_dataPost.responses.value = this.state.valuesDataForm;
   		    	_dataPost = JSON.stringify(_dataPost);
   		    }else if(this.state.showResponseType == 'Slide'){
   		    	const FormData = require('form-data');
   		    	_url = config.get('baseUrlApi')+'/api/v1/add-pattern-slide';
   		    	_config = { headers: { 'Content-Type': 'multipart/form-data', 'Authorization' : 'Bearer ' + this.state.token} };
   		    	/***/
   		    	_dataPost = new FormData();
   		    	_dataPost.append('client', this.state.client);
   		    	_dataPost.append('tag', this.state.searchTerm);
   		    	_dataPost.append('patterns', JSON.stringify(this.state.listPatternsAdd));
   		    	_dataPost.append('responses', JSON.stringify({"type" : this.state.showResponseType, "value" : this.state.valueDataSlide}));
				this.state.valueDataSlide['items'].forEach((file, i) => {
			      _dataPost.append('file'+i, file.imageFile)
			    });
   		    }

   		    console.log(_dataPost);

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
	   		    axios.post(_url,_dataPost, _config)
			    .then(res => {
			    	this.setState({errorSaveForm : false});
			    	this.setState({searchTerm : ''});
			    	this.setState({valuePatternHidden : ''});
			    	this.setState({listResponseTextAdd : []});
			    	this.setState({listPatternsAdd : []});
			    	this.setState({searchResults : []});
			    	this.setState({showResponseType : ''});
			    	this.setState({valueResponseTextHidden : ''});
			    	form.reset();
			    }).catch(function (error) {}).then(function () {});
		    }
		}

		handleChangeValueHtmlCode = (code) => {
			this.setState({responseTypeHtml: code});
		}

		dataForm = (data) =>{
			this.setState({valuesDataForm: data});
		}

		dataSlide = (data) =>{
			this.setState({valueDataSlide: data});
		}

		_handleSelectClient = (event) =>{
			var _value = event.target.value;
			this.setState({client: _value});
		}

		loadClients() {
		    axios.get(config.get('baseUrlApi')+'/api/v1/clients?limit=10&offset=0', {headers: {'Content-Type': 'application/json;charset=UTF-8', 'Authorization' : 'Bearer ' + this.state.token}})
		    .then(res => {
		    	this.setState({clients: res.data.data.items});
		    }).catch(function (error) {
		    	//if(error.response.status == 401){
		    	//	delete_cookie('token');
		    	//	browserHistory.push('/login');
		    	//}
			});
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

						                <Tabs defaultActiveKey="tag" transition={false} id="noanim-tab-example">
										  <Tab eventKey="tag" title="1) Tag">
											    	<div>&nbsp;</div>
											    	
											    	{this.state.scope &&
												    	<Form.Row>
										        	        <Col xs={4}>
												        		<Form.Group required controlId="exampleForm.ControlSelect1">
																    <Form.Control placeholder="Client" required as="select" onChange={this._handleSelectClient}>
																        <option value="">Select</option>
																	    {this.state.clients.map((item) => 
																	      <option key={item._id.$oid} value={item._id.$oid}>{item.name}</option>
														                )}
																    </Form.Control>
																    <Form.Label>Client</Form.Label>
																  </Form.Group>
												    		</Col>
													    </Form.Row>
													}

											    	<Form.Row>
								                        <Col xs={4}>
										                    <Form.Group  controlId="formBasicTag">
													            <Form.Control required size="sm" type="text" value={this.state.searchTerm} onChange={this.handleChange} placeholder="Search Tag" />
													            <Form.Label >Tag Name</Form.Label>
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
										  </Tab>
										  <Tab eventKey="pattern" title="2) Pattern">
										            <div>&nbsp;</div>
											    	<Form.Row>
												        <Col xs={4}>
												                <Form.Group  controlId="formBasicPatterns">
																	<InputGroup className="mb-3">
																	    <FormControl value={this.state.valuePattern} onChange={this._handonchangeInputPattern} size="sm"
																	      placeholder="Add Pattern"/>
																	    <Form.Label >Add Pattern</Form.Label>

																	    <InputGroup.Append>
																	      <Button size="sm" onClick={this._handleonAddPattern} variant="outline-secondary">Add</Button>
																	    </InputGroup.Append>
																	</InputGroup>


																	<FormControl required type="hidden" name="valuePattern" value={this.state.valuePatternHidden} size="sm"/>
												                    {this.state.valuePatternHidden.length > 0 && <div className="valid-feedback-custom">Looks good!</div>}
												                    {this.state.valuePatternHidden === false && <div className="invalid-feedback-custom">*You must enter the least 1 item.</div>}

												                    <ul className="listItemsSelected">
																        {this.state.listPatternsAdd.map((li, i) => <li key={i}><h4><Badge variant="secondary">{li} <a href="#" itemID = {i}>x</a></Badge></h4></li>)}
												                    </ul>

												                    <Form.Text className="text-muted">
												                      Possible questions that the user will ask through the chat.
												                    </Form.Text>
												                 </Form.Group>
												        </Col>
												    </Form.Row>
										  </Tab>
										  <Tab eventKey="response" title="3) Response">
										                <div>&nbsp;</div>
											   			<Form.Row>
													        <Col xs={9}>
													            <Form.Row>
													                <Col xs={4}>
														                <Form.Group  controlId="formBasicResponse">
														                    <div className="contentListGroupSelect">
																			    <Form.Control required size="sm" as="select" onChange={this._handleonTypeResponse}>
																				    <option value="">Select</option>
																				    <option value="Text">Text</option>
																				    <option value="Form">Form</option>
																				    <option value="Slide">Slide</option>
																				    <option value="Html">Html</option>
																				    <option value="Single-option">Yes/No</option>
																				    <option value="Multiple-choices">Multiple choices</option>
																				    <option value="Data-Set">Data Set</option>
																				</Form.Control>
																				<Form.Label >Type Response</Form.Label>
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
																	                    
																						<InputGroup className="mb-3">
																						    <FormControl value={this.state.valueResponseText} onChange={this._handleChangeInputResponseText} size="sm"
																						      placeholder="Add Response"/>
																						    <Form.Label >Add Response</Form.Label>
																						    <InputGroup.Append>
																						      <Button size="sm" onClick={this._handleAddResponseText} variant="outline-secondary">Add</Button>
																						    </InputGroup.Append>
																						</InputGroup>

																						<FormControl required type="hidden" name="valueResponseTextHidden" value={this.state.valueResponseTextHidden} size="sm"/>
																						{this.state.valueResponseTextHidden.length > 0 && <div className="valid-feedback-custom">Looks good!</div>}
															                    		{this.state.valueResponseTextHidden === false && <div className="invalid-feedback-custom">*You must enter the least 1 item.</div>}

																	                    <ul className="listItemsSelected">
																					        {this.state.listResponseTextAdd.map((li, i) => <li key={i}><h4><Badge variant="secondary">{li} <a href="#" itemID = {i}>x</a></Badge></h4></li>)}
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

															    {this.state.showResponseType == 'Multiple-choices' &&
																    <Form.Row>
															        	<Col xs={12}>
															                <MultiChoices/>
																	    </Col>
																    </Form.Row>
															    }

															    {this.state.showResponseType == 'Form' &&
																    <Form.Row>
															        	<Col xs={12}>
															                <ChatForm dataForm={this.dataForm}/>
																	    </Col>
																    </Form.Row>
															    }

															    {this.state.showResponseType == 'Slide' &&
																    <Form.Row>
															        	<Col xs={12}>
															                <Slide dataSlide={this.dataSlide}/>
																	    </Col>
																    </Form.Row>
															    }
												         	</Col>


												         	<Col xs={3}>
												         		<Preview 
												         		    textDescription={this.state.valueResponseText} 
												         		    valueCode={this.state.responseTypeHtml}
												         		    listOptions={this.state.listOptionsMChoices}
												         		/>
												         	</Col>
													    </Form.Row>
										  </Tab>
										</Tabs>

										
										<div style={{ marginTop: 20 }}>{JSON.stringify(this.state.valuesDataForm)}</div>
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

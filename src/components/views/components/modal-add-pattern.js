import React, { Component } from "react";
import { Alert, Navbar, Nav, Tab, Modal, Badge, Tabs, InputGroup, Collapse, ButtonGroup,ListGroup, Form,NavDropdown,FormControl,Container, Row, Col,Media,Jumbotron, Button, Breadcrumbs, Table} from 'react-bootstrap';
import axios from 'axios';
import config from 'react-global-configuration';
import { browserHistory } from 'react-router';
import EditorHtml from './editorHtml';
import SingleOptions from './singleOptions';
import MultiChoices from './multiChoices';
import FormResponse from './formResponse';
import {Slide} from './slide';
import Preview from './preview';
import {Helper} from './helper';

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
		      //searchTerm : "",
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
		      selectTypeResponse: '',
		      optionsTypeResponse: [
		      	{value: 'Text', label: 'Text'},
		      	{value: 'Form', label: 'Form'},
		      	{value: 'Slide', label: 'Slider Image'},
		      	{value: 'Html', label: 'Html'},
		      	{value: 'Single-option', label: 'Yes/No'},
		      	{value: 'Multiple-choices', label: 'Multiple choices'},
		      	{value: 'Data-Set', label: 'Data Set'}
		      ]
		    };
		}

		handleClose = (e) => {
			this.closeModal();
	    };

	    closeModal(){
	    	this.setState({showModal: false})
			this.props.hiddenModal();
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
				this.setState({selectTypeResponse: event.target.value});
			//}
		}

		componentDidMount(){
			if(this.state.scope){
				this.loadClients();
			}else{
				this.setState({client: this.state.client});
			}

			if(this.props.id.length > 0){
				this.getPattern(this.props.id);
			}
		}


	    getPattern(_id){
	    	async function _requestApi(_this,_id){
			    var _url = config.get('baseUrlApi')+'/api/v1/pattern?id='+_id;
			    const res = await new Helper().getRequest(_url,'back');
			    console.log(res);
			    //_this.setState({clients: res.items});
			    _this.setState({listPatternsAdd : res.data.sentence});
			    _this.setState({selectTypeResponse: res.data.response.type});
			    _this.setState({showResponseType : res.data.response.type});

			    if(_this.state.selectTypeResponse == 'Text'){
			    	_this.setState({listResponseTextAdd : res.data.response.value});
			    }else if(_this.state.selectTypeResponse == 'Form'){
			    	//load data in form
			    	//console.log(res.data.response.value);
			    	_this.setState({valuesDataForm: res.data.response.value});
			    }else if(_this.state.selectTypeResponse == 'Form'){
			    }else if(_this.state.selectTypeResponse == 'Slide'){
			    }else if(_this.state.selectTypeResponse == 'Html'){
			    }else if(_this.state.selectTypeResponse == 'Single-option'){
			    }else if(_this.state.selectTypeResponse == 'Multiple-choices'){
			    }else if(_this.state.selectTypeResponse == 'Data-Set'){
			    }
			}
			_requestApi(this,_id);
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

   		    //console.log(_dataPost);

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

		    	var _valueResponse = '';
				var _url = config.get('baseUrlApi')+'/api/v1/pattern';
				var _config = {headers: {'Content-Type': 'application/json;charset=UTF-8', 'Authorization' : 'Bearer ' + this.state.token}};
	   		    //console.log(this.state.client);
	   		    var _dataPost = {
	   		    	"client": this.state.client,
	   		    	//"tag" : this.state.searchTerm,
	   		    	"patterns" : this.state.listPatternsAdd,
	   		    	"responses" : {"type" : this.state.showResponseType, "value" : _valueResponse}
	   		    };
	   		    /****/
	   		    if(this.state.showResponseType == 'Text'){
	   		    	_dataPost.responses.value = this.state.listResponseTextAdd;
	   		    	//_dataPost = JSON.stringify(_dataPost);
	   		    }else if(this.state.showResponseType == 'Html'){
	   		    	_dataPost.responses.value = this.state.responseTypeHtml;
	   		    	//_dataPost = JSON.stringify(_dataPost);
	   		    }else if(this.state.showResponseType == 'Form'){
	   		    	_dataPost.responses.value = this.state.valuesDataForm;
	   		    	//_dataPost = JSON.stringify(_dataPost);
	   		    }else if(this.state.showResponseType == 'Slide'){
	   		    	const FormData = require('form-data');
	   		    	_url = config.get('baseUrlApi')+'/api/v1/add-pattern-slide';
	   		    	//_config = { headers: { 'Content-Type': 'multipart/form-data', 'Authorization' : 'Bearer ' + this.state.token} };
	   		    	/***/
	   		    	_dataPost = new FormData();
	   		    	_dataPost.append('client', this.state.client);
	   		    	//_dataPost.append('tag', this.state.searchTerm);
	   		    	_dataPost.append('patterns', JSON.stringify(this.state.listPatternsAdd));
	   		    	_dataPost.append('responses', JSON.stringify({"type" : this.state.showResponseType, "value" : this.state.valueDataSlide}));
					this.state.valueDataSlide['items'].forEach((file, i) => {
				      _dataPost.append('file'+i, file.imageFile)
				    });
	   		    }


		    	async function _requestApi(_this, form, _url, _dataPost){
				    //var _url = config.get('baseUrlApi')+'/api/v1/pattern?id='+_id;
				    if(_this.props.id.length > 0){
				    	var _header = 'back';
				    	if(_this.state.showResponseType == 'Slide'){
				    		_header = 'back-multipart';
				    	}
				    	const res = await new Helper().putRequest(_url+'?id='+_this.props.id, _dataPost, _header);
				    }else{
				    	var _header = 'back';
				    	if(_this.state.showResponseType == 'Slide'){
				    		_header = 'back-multipart';
				    	}
				    	const res = await new Helper().postRequest(_url, _dataPost, _header);
				    }

				    _this.setState({errorSaveForm : false});
			    	//_this.setState({searchTerm : ''});
			    	_this.setState({valuePatternHidden : ''});
			    	_this.setState({listResponseTextAdd : []});
			    	_this.setState({listPatternsAdd : []});
			    	_this.setState({searchResults : []});
			    	_this.setState({showResponseType : ''});
			    	_this.setState({valueResponseTextHidden : ''});
			    	form.reset();
			    	_this.closeModal();
				}

				_requestApi(this,form, _url, _dataPost);

		    }
		}

		handleChangeValueHtmlCode = (code) => {
			this.setState({responseTypeHtml: code});
		}

		dataForm = (data) =>{
			this.setState({valuesDataForm: data});
		}

		//getDataForm(){
		//	return this.state.valuesDataForm;
		//}

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
				      <Modal show={this.state.showModal} dialogClassName="modal-70w" onHide={this.handleClose}>
				        <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmitFormAddPattern}>
						        <Modal.Header closeButton>
						          <Modal.Title>Add Pattern</Modal.Title>
						        </Modal.Header>

						        <Modal.Body>

						                <Tabs defaultActiveKey="pattern" transition={false} id="noanim-tab-example">
										  {/*<Tab eventKey="tag" title="1) Tag">
											    	<div>&nbsp;</div>
											    	
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
										  </Tab>*/}


										  <Tab eventKey="pattern" title={
										  	<React.Fragment>
										  		<h4><Badge variant="secondary">1</Badge> Message Pattern</h4>
								            </React.Fragment>
										  }>
										            {this.state.scope &&
												    	<Form.Row>
										        	        <Col xs={12}>
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

										            <div>&nbsp;</div>
											    	<Form.Row>
												        <Col xs={8}>
												                <Form.Group  controlId="formBasicPatterns">
																	<InputGroup className="mb-3">
																	  

																	    <Form.Control as="textarea"  value={this.state.valuePattern} onChange={this._handonchangeInputPattern} placeholder="Add Pattern" rows={1} />
																	      
																	    <Form.Label >Add Pattern</Form.Label>

																	    <InputGroup.Append>
																	      <Button size="sm" onClick={this._handleonAddPattern} variant="outline-secondary">Add</Button>
																	    </InputGroup.Append>
																	</InputGroup>


																	<FormControl required type="hidden" name="valuePattern" value={this.state.valuePatternHidden}/>
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

												        <Col xs={1}></Col>
												        <Col xs={3}>
											         		<Preview 
											         		    messageClient={this.state.listPatternsAdd[(this.state.listPatternsAdd.length - 1)]} 
											         		    valueCode={this.state.responseTypeHtml}
											         		    listOptions={this.state.listOptionsMChoices}
											         		/>
											         	</Col>
												    </Form.Row>
										  </Tab>
										 

										  <Tab eventKey="response" title={
										  	<React.Fragment>
								              <h4><Badge variant="secondary">2</Badge> Response</h4>
								            </React.Fragment>
								        }>
										                <div className="divide"></div>
											   			<Form.Row>
													        <Col xs={8}>
													            <Form.Row>
													                <Col xs={12}>

														                {new Helper().getInputSelect(
								   											'typeresponse',
																	        this._handleonTypeResponse,
																	        'Type Response',
																	        true,
																	        this.state.selectTypeResponse,
																	        null,
																	        this.state.optionsTypeResponse
								   										)}

														         	</Col>
																</Form.Row>

												                {this.state.showResponseType == 'Text' &&
													                <Form.Row>
															        	<Col xs={12}>
															                <div className="formTypeResponse">						
																				<Form.Group  controlId="formBasicResponseText">
																	                    
																						<InputGroup className="mb-3">
																						     <Form.Control  required as="textarea"  value={this.state.valueResponseText} onChange={this._handleChangeInputResponseText} placeholder="Add Response" rows={1} />
																						    <Form.Label >Add Response</Form.Label>
																						    <InputGroup.Append>
																						      <Button  onClick={this._handleAddResponseText} variant="outline-secondary">Add</Button>
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
															                <FormResponse dataForm={this.dataForm} id={this.props.id} valueForm={this.state.valuesDataForm}/>
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

												         	<Col xs={1}></Col>
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

										
										{/*<div style={{ marginTop: 20 }}>{JSON.stringify(this.state.valuesDataForm)}</div>*/}
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

import React, { Component } from "react";
import $ from "jquery";
import { Alert, Navbar, Nav, Tab, Modal, Badge, Tabs, InputGroup, Collapse, ButtonGroup,ListGroup, Form,NavDropdown,FormControl,Container, Row, Col,Media,Jumbotron, Button, Breadcrumbs, Table} from 'react-bootstrap';
import axios from 'axios';

export default class ModalToLearn extends Component {
  		constructor(props) {
		    super(props);
		    //console.log(this.props.patternSelected);
		    var _valueInputAddPattern = typeof this.props.patternSelected[1] != 'undefined' ? this.props.patternSelected[1] : '';
		    this.state = {
		      showModal : true,
		      searchTerm : "",
		      resultFiler: [],
		      searchResults : [],
		      showFilterInput: false,
		      valuePattern : _valueInputAddPattern,
		      listPatternsAdd : [],
		      showResponseTypeText : false,
		      responseTypeValue : '',
		      valueResponseText : '',
		      listResponseTextAdd : []
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
				axios.post('http://127.0.0.1:8082/api/v1/filter-tags', JSON.stringify({ tag: _value}), {headers: {'Content-Type': 'application/json;charset=UTF-8'}})
			    .then(res => {
			    	var _items = [];
			    	res.data.items.forEach(function(elem){
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
			}
		}
		
		/*INPUT ADD RESPONSE*/
		_handleonTypeResponse = (event) =>{
			this.setState({responseTypeValue : event.target.value});
			if(event.target.value == 'Text'){
				this.setState({showResponseTypeText : true});
			}else{
				this.setState({showResponseTypeText : false});
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
			}
		}

		/*SUBMIT FORM*/
		handleSubmitFormAddPattern = (event) =>{
   		    event.preventDefault();
   		    var _dataPost = {
   		    	"tag" : this.state.searchTerm,
   		    	"patterns" : this.state.listPatternsAdd,
   		    	"responses" : this.state.listResponseTextAdd
   		    };

   		    //this.state.responseTypeValue
   		    axios.post('http://127.0.0.1:8082/api/v1/add-pattern', JSON.stringify(_dataPost), {headers: {'Content-Type': 'application/json;charset=UTF-8'}})
		    .then(res => {
		    	alert('result');
		    });
		}

  		render() {
				return (
				  	<div className="content-button">
				      {/*<Button variant="secondary" onClick={handleShow}>Add Pattern</Button>*/}
				      <Modal show={this.state.showModal} onHide={this.handleClose}>
				        <Form onSubmit={this.handleSubmitFormAddPattern}>
						        <Modal.Header closeButton>
						          <Modal.Title>Add Pattern</Modal.Title>
						        </Modal.Header>
						        <Modal.Body>
					                    <Form.Group  controlId="formBasicTag">
								            <Form.Label >1.- Tag</Form.Label>
								            <Form.Control size="sm" type="text" value={this.state.searchTerm} onChange={this.handleChange} placeholder="Search Tag" />
								            {this.state.showFilterInput &&
								                <div className="contFilterList">
								                	<ListGroup variant="flush">
								                    	{this.state.searchResults.map(item => (
												          <ListGroup.Item action href="#link1">{item}</ListGroup.Item>
												        ))}
													</ListGroup>
								                </div>
								            }
								            <Form.Text className="text-muted">
								              This tag must be unique. Example, hello_how_are_you
								            </Form.Text>
								        </Form.Group>

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
						                    <ul className="listItemsSelected">
										        {this.state.listPatternsAdd.map((li, i) => <li key={i}><Badge variant="secondary">{li} <a href="#" itemID = {i}>x</a></Badge></li>)}
						                    </ul>
						                    <Form.Text className="text-muted">
						                      Possible questions that the user will ask through the chat.
						                    </Form.Text>
						                 </Form.Group>


						                <Form.Group  controlId="formBasicResponse">
						                    <Form.Label >3.- Type Response</Form.Label>
						                    <div className="contentListGroupSelect">
											    <Form.Control size="sm" as="select" onChange={this._handleonTypeResponse}>
												    <option>Select</option>
												    <option value="Text">Text</option>
												    <option value="Form">Form</option>
												    <option value="Single-option">Single option</option>
												    <option value="Multiple-choices">Multiple choices</option>
												</Form.Control>
						                    </div>

											<div className="formTypeResponse">						
													{this.state.showResponseTypeText &&
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
											                    <ul className="listItemsSelected">
															        {this.state.listResponseTextAdd.map((li, i) => <li key={i}><Badge variant="secondary">{li} <a href="#" itemID = {i}>x</a></Badge></li>)}
											                    </ul>
											                    <Form.Text className="text-muted">
											                      Possible responses that the user will ask through the chat.
											                    </Form.Text>
										                </Form.Group>
									            	}
											</div>
						                </Form.Group>
					               
						        </Modal.Body>
						        
						        <Modal.Footer>
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

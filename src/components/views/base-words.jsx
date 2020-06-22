import React, { Component } from "react";
import $ from "jquery";
import Mousewheel from "jquery-mousewheel";
import mCustomScrollbar from "malihu-custom-scrollbar-plugin";
import SidebarMenu from './sidebar-menu';
import SidebarAction from './sidebar-action';
import { Alert, Navbar, Nav, Tab, Modal, Badge, Tabs, InputGroup, Collapse, ButtonGroup,ListGroup, Form,NavDropdown,FormControl,Container, Row, Col,Media,Jumbotron, Button, Breadcrumbs, Table} from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
//https://github.com/AdeleD/react-paginate/blob/master/demo/js/demo.js
import axios from 'axios';

export default class BaseWords extends Component {
	constructor(props) {
	    super(props);
	    this.state = {
	      error: null,
	      perPage: 50,
	      items: [],
	      offset: 0,
	      listPatterns : []
	    };
	}

	loadWords() {
	    $.ajax({
	      url: 'http://127.0.0.1:8082/api/v1/base-words',
	      data: { limit: this.state.perPage, offset: this.state.offset},
	      dataType: 'json',
	      type: 'GET',
	      success: data => {
	        this.setState({
	          items: data.items,
	          pageCountWords: Math.ceil(data.total_count / data.limit),
	        });
	      },
	      error: (xhr, status, err) => {
	        this.setState({
	           err
	        });
	      },
	    });
	}


	loadPatterns() {
	    $.ajax({
	      url: 'http://127.0.0.1:8082/api/v1/patterns',
	      data: { limit: this.state.perPage, offset: this.state.offset},
	      dataType: 'json',
	      type: 'GET',
	      success: data => {
	        this.setState({
	          listPatterns: data.items,
	          pageCountPatterns: Math.ceil(data.total_count / data.limit),
	        });
	      },
	      error: (xhr, status, err) => {
	        this.setState({
	           err
	        });
	      },
	    });
	}

	handlePageClickPatterns = data => {
	    let selected = data.selected;
	    let offset = Math.ceil(selected * this.state.perPage);
	    this.setState({ offset: offset }, () => {
	      this.loadPatterns();
	    });
	};


	componentDidMount(){
	    this.loadWords();
	    this.loadPatterns();
	}

	handlePageClickWords = data => {
	    let selected = data.selected;
	    let offset = Math.ceil(selected * this.state.perPage);
	    this.setState({ offset: offset }, () => {
	      this.loadWords();
	    });
	};


    addPatternForm() {
	    const [show, setShow] = React.useState(false);
	    const handleClose = () => setShow(false);
	    const handleShow = () => setShow(true);

	    /*FILTER INPUT*/
	  	const [searchTerm, setSearchTerm] = React.useState("");
		const [searchResults, setSearchResults] = React.useState([]);
		const [resultFiler, setResultFiler] = React.useState([]);
		const [showFilterInput, setShowFilterInput] = React.useState(false);
		const handleChange = event => {
			var _value = event.target.value;
			setSearchTerm(_value);
			if(searchTerm.length > 2){
				axios.post('http://127.0.0.1:8082/api/v1/filter-tags', JSON.stringify({ tag: _value}), {headers: {'Content-Type': 'application/json;charset=UTF-8'}})
			    .then(res => {
			    	var _items = [];
			    	res.data.items.forEach(function(elem){
			    		_items.push(elem.tag);
			    	});
			    	setResultFiler(_items);
			    });
			}
		};

		React.useEffect(() => {
			//console.log(searchTerm);
		    if(resultFiler.length > 0 && searchTerm.length > 0){
		    	setShowFilterInput(true);
		    	setSearchResults(resultFiler);
		    }else{
		    	setShowFilterInput(false);
		    	setSearchResults([]);
		    }
		}, [searchTerm]);
		/*FILTER INPUT*/


		/*INPUT ADD PATTERN*/
		const [valuePattern, setValuePattern] = React.useState('');
		const [listPatternsAdd, setListPatternsAdd] = React.useState([]);
		const _handonchangeInputPattern = (event)=>{
			var _value = event.target.value;
			setValuePattern(_value);
		}
		const _handleonAddPattern = (event)=>{    	
	    	if(valuePattern.length > 3){
	    		const _items = listPatternsAdd;
		    	_items.push(valuePattern);
		    	setValuePattern('');
				setListPatternsAdd(_items);
			}
		}
		
		/*INPUT ADD RESPONSE*/
		const [showResponseTypeText, setShowResponseTypeText] = React.useState(false);
		const [responseTypeValue, setResponseTypeValue] = React.useState(false);
		const _handleonTypeResponse = (event) =>{
			setResponseTypeValue(event.target.value);
			if(event.target.value == 'Text'){
				setShowResponseTypeText(true);
			}else{
				setShowResponseTypeText(false);
			}
		}

		/*INPUT ADD RESPONSE TEXT*/
		const [valueResponseText, setValueResponseText] = React.useState('');
		const [listResponseTextAdd, setListResponseTextAdd] = React.useState([]);
		const _handleChangeInputResponseText = (event)=>{
			var _value = event.target.value;
			setValueResponseText(_value);
		}
		const _handleAddResponseText = (event)=>{
	    	if(valueResponseText.length > 3){
	    		const _items = listResponseTextAdd;
		    	_items.push(valueResponseText);
		    	setValueResponseText('');
				setListResponseTextAdd(_items);
			}
		}

		/*SUBMIT FORM*/
		const handleSubmitFormAddPattern = (event) =>{
   		    event.preventDefault();
   		    var _dataPost = {
   		    	"tag" : searchTerm,
   		    	"patterns" : listPatternsAdd,
   		    	"responses" : listResponseTextAdd
   		    };

   		    axios.post('http://127.0.0.1:8082/api/v1/add-pattern', JSON.stringify(_dataPost), {headers: {'Content-Type': 'application/json;charset=UTF-8'}})
		    .then(res => {
		    	alert('result');
		    });
		}

		return (
		  	<div className="content-button">
		      <Button variant="secondary" onClick={handleShow}>Add Pattern</Button>
		      <Modal show={show} onHide={handleClose}>
		        <Form onSubmit={handleSubmitFormAddPattern}>
				        <Modal.Header closeButton>
				          <Modal.Title>Add Pattern</Modal.Title>
				        </Modal.Header>
				        
				        <Modal.Body>
				        	{/*<p>Woohoo, you're reading this text in a modal!</p>*/}
				            
			                    <Form.Group  controlId="formBasicTag">
						            <Form.Label >1.- Tag</Form.Label>
						            <Form.Control size="sm" type="text" value={searchTerm} onChange={handleChange} placeholder="Search Tag" />
						            {showFilterInput &&
						                <div className="contFilterList">
						                	<ListGroup variant="flush">
						                    	{searchResults.map(item => (
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
									    <FormControl value={valuePattern} onChange={_handonchangeInputPattern} size="sm"
									      placeholder="Add Pattern"
									      aria-label="Add Pattern"
									      aria-describedby="basic-addon2"
									    />
									    <InputGroup.Append>
									      <Button size="sm" onClick={_handleonAddPattern} variant="outline-secondary">Add</Button>
									    </InputGroup.Append>
									</InputGroup>
				                    <ul className="listItemsSelected">
								        {listPatternsAdd.map((li, i) => <li key={i}><Badge variant="secondary">{li} <a href="#" itemID = {i}>x</a></Badge></li>)}
				                    </ul>
				                    <Form.Text className="text-muted">
				                      Possible questions that the user will ask through the chat.
				                    </Form.Text>
				                 </Form.Group>


				                <Form.Group  controlId="formBasicResponse">
				                    <Form.Label >3.- Type Response</Form.Label>
				                    <div className="contentListGroupSelect">
									    <Form.Control size="sm" as="select" onChange={_handleonTypeResponse}>
										    <option>Select</option>
										    <option value="Text">Text</option>
										    <option value="Form">Form</option>
										    <option value="Single-option">Single option</option>
										    <option value="Multiple-choices">Multiple choices</option>
										</Form.Control>
				                    </div>

									<div className="formTypeResponse">						
											{showResponseTypeText &&
												<Form.Group  controlId="formBasicResponseText">
									                    <Form.Label >Responses</Form.Label>
														<InputGroup className="mb-3">
														    <FormControl value={valueResponseText} onChange={_handleChangeInputResponseText} size="sm"
														      placeholder="Add Response"
														      aria-label="Add Response"
														      aria-describedby="basic-addon2"
														    />
														    <InputGroup.Append>
														      <Button size="sm" onClick={_handleAddResponseText} variant="outline-secondary">Add</Button>
														    </InputGroup.Append>
														</InputGroup>
									                    <ul className="listItemsSelected">
													        {listResponseTextAdd.map((li, i) => <li key={i}><Badge variant="secondary">{li} <a href="#" itemID = {i}>x</a></Badge></li>)}
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
				          <Button variant="secondary" onClick={handleClose}>
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


  render() {
    return (
        <div className="wrapper">
		    <SidebarMenu/>
		    <div id="content">
	            <SidebarAction/>
	            <h2>Words Base</h2>
	            <p>You can generate question patterns that can be asked by chat.</p>
	            <div className="line"></div>
	            <Jumbotron className="content-form jumbotron-sm jumbotron-right">
		            <Button variant="primary">Train Chat</Button>{' '}
		            <this.addPatternForm/>
				</Jumbotron>
				<Tabs defaultActiveKey="patterns" id="uncontrolled-tab-example">
				  <Tab eventKey="patterns" title="Patterns">
				  			<br/>
						        <div className="line"></div>
						  		<p>Patterns and responses to display to users</p>
							    <section>
						          <section>
						            <Table id="itemTable" striped bordered hover size="sm">
						              <thead>
						                <tr>
						                  <th>ID</th>
						                  <th>Tag</th>
						                  <th>Patterns</th>
						                  <th>Responses</th>
						                </tr>
						              </thead>
						              <tbody>
						                {this.state.listPatterns.map((item) => 
						                  <tr key={item._id.$oid}>
						                    <td>#{item.code}</td>
						                    <td>{item.tag}</td>
						                    <td>
						                    	<ol>
						                    		{item.words_origin.map((item1) => 
							                    		<li>
							                    			<span>
									                    		{item1.map((item2) => item2 + ' ')}
								                    		</span>
							                    		</li>
							                    	)}
						                    	</ol>
						                    	
						                    </td>

						                    <td>
						                    	<ol>
						                    	    <li>
							                    		{item.responses.map((item1) => 
								                    		<span>{item1}</span>
								                    	)}
							                    	</li>
						                    	</ol>
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
								          pageCount={this.state.pageCountPatterns}
								          marginPagesDisplayed={2}
								          pageRangeDisplayed={5}
								          onPageChange={this.handlePageClickPatterns}
								          containerClassName={'pagination'}
								          subContainerClassName={'pages pagination'}
								          activeClassName={'active'}
								        />
							        </div>

						          </section>
						        </section>
				  </Tab>
				  <Tab eventKey="words" title="Words">
				  		<br/>
				        <div className="line"></div>
				  		<p>You can generate question patterns that can be asked by chat.</p>
					    <section>
				          <section>
				            
				            <Table id="itemTable" striped bordered hover size="sm">
				              <thead>
				                <tr>
				                  <th>ID</th>
				                  <th>Tag</th>
				                  <th>Category</th>
				                  <th>Word</th>
				                  <th></th>
				                </tr>
				              </thead>
				              <tbody>
				                {this.state.items.map((item) => 
				                  <tr key={item._id.$oid}>
				                    <td>#{item.code}</td>
				                    <td>{item.tag}</td>
				                    <td>{item.category}</td>
				                    <td>{item.word}</td>
				                    <td>
				                      {/* Here add the onClick for the action "remove it" on the span 
				                      <a href="" ><span>Bloquear</span></a> / <a href="" ><span>Aprender</span></a>*/}
				                      Algo
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
						          pageCount={this.state.pageCountWords}
						          marginPagesDisplayed={2}
						          pageRangeDisplayed={5}
						          onPageChange={this.handlePageClickWords}
						          containerClassName={'pagination'}
						          subContainerClassName={'pages pagination'}
						          activeClassName={'active'}
						        />
					        </div>

				          </section>
				        </section>
				  </Tab>
				</Tabs>
	        </div>

	        <div className="overlay"></div>
		</div>
    );
  }
}
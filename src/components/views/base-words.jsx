import React, { Component } from "react";
import $ from "jquery";
import Mousewheel from "jquery-mousewheel";
import mCustomScrollbar from "malihu-custom-scrollbar-plugin";
import SidebarMenu from './sidebar-menu';
import SidebarAction from './sidebar-action';
import { Alert, Navbar, Nav, Modal, Badge, Collapse, ListGroup, Form,NavDropdown,FormControl,Container, Row, Col,Media,Jumbotron, Button, Breadcrumbs, Table} from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
//https://github.com/AdeleD/react-paginate/blob/master/demo/js/demo.js
import axios from 'axios';

export default class BaseWords extends Component {
	/*constructor(props){
	  	super(props);
		this.state = {
		      tableContent: []
		};

	    //this.handleChange = this.handleChange.bind(this);
	    //this.handleClick = this.handleClick.bind(this);
	}*/

	constructor(props) {
	    super(props);
	    this.state = {
	      error: null,
	      isLoaded: false,
	      perPage: 50,
	      items: [],
	      offset: 0
	    };
	}

	loadCommentsFromServer() {
	    $.ajax({
	      url: 'http://127.0.0.1:8082/api/v1/base-words',
	      data: { limit: this.state.perPage, offset: this.state.offset},
	      dataType: 'json',
	      type: 'GET',
	      success: data => {
	        this.setState({
	          isLoaded: true,
	          items: data.items,
	          pageCount: Math.ceil(data.total_count / data.limit),
	        });
	      },

	      error: (xhr, status, err) => {
	        //console.error(this.props.url, status, err.toString()); // eslint-disable-line
	        this.setState({
	           isLoaded: true,
	           err
	        });
	      },
	    });
	}


	componentDidMount(){
	    this.loadCommentsFromServer();
	}

	handlePageClick = data => {
	    let selected = data.selected;
	    let offset = Math.ceil(selected * this.state.perPage);
	    this.setState({ offset: offset }, () => {
	      this.loadCommentsFromServer();
	    });
	};


    addPattern() {
	    const [show, setShow] = React.useState(false);
	    const handleClose = () => setShow(false);
	    const handleShow = () => setShow(true);
	    
	    const people = [];
	  	const [searchTerm, setSearchTerm] = React.useState("");
		const [searchResults, setSearchResults] = React.useState([]);
		const [resultFiler, setResultFiler] = React.useState([]);
		const [showFilterInput, setShowFilterInput] = React.useState(false);
		const handleChange = event => {
			var _value = event.target.value;
			setSearchTerm(_value);
			//if(searchTerm.length > 2){
				axios.post('http://127.0.0.1:8082/api/v1/filter-tags', JSON.stringify({ tag: _value}), {headers: {'Content-Type': 'application/json;charset=UTF-8'}})
			    .then(res => {
			    	var _items = [];
			    	res.data.items.forEach(function(elem){
			    		_items.push(elem.tag);
			    	});
			    	setResultFiler(_items);
			    });
		    //}
		};

		React.useEffect(() => {
			console.log(resultFiler);
		    if(resultFiler.length > 0){
		    	setShowFilterInput(true);
		    	setSearchResults(resultFiler);
		    }else{
		    	setShowFilterInput(false);
		    	setSearchResults([]);
		    }
		}, [searchTerm]);
		/*FILTER INPUT*/

		return (
		  	<div className="content-button">
		      <Button variant="secondary" onClick={handleShow}>Add Pattern</Button>
		      <Modal show={show} onHide={handleClose}>
		        <Modal.Header closeButton>
		          <Modal.Title>Add Pattern</Modal.Title>
		        </Modal.Header>
		        
		        <Modal.Body>
		        	{/*<p>Woohoo, you're reading this text in a modal!</p>*/}
		        	<Form>
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
	                    <Form.Control size="sm" type="text" placeholder="Search Pattern" />
	                    <Form.Text className="text-muted">
	                      We'll never share your email with anyone else.
	                    </Form.Text>
	                    <div className="listPatternsSelected">
	                      	<Badge variant="secondary">New X</Badge><Badge variant="secondary">New X</Badge><Badge variant="secondary">New X</Badge>
	                      	<Badge variant="secondary">New X</Badge><Badge variant="secondary">New X</Badge>
	                    </div>
	                  </Form.Group>


	                  <Form.Group  controlId="formBasicResponse">
	                    <Form.Label >3.- Type Response</Form.Label>
	                    <Form.Text className="text-muted">
	                     Select the type of response to display to the user.
	                    </Form.Text>
	                    
	                    <div className="contentListGroupSelect">
	                    	<ListGroup className="list-group-sm">
							  <ListGroup.Item action href="#link1">Text</ListGroup.Item>
							  <ListGroup.Item action href="#link2">Form</ListGroup.Item>
							  <ListGroup.Item action href="#link3">Single option</ListGroup.Item>
							  <ListGroup.Item action href="#link4">Multiple choices</ListGroup.Item>
							</ListGroup>
	                    </div>

						<div className="formTypeResponse">
							<Form.Group  controlId="formBasicPatterns">
			                    <Form.Label >Responses</Form.Label>
			                    <Form.Control size="sm" type="text" placeholder="Add Response" />
			                    <Form.Text className="text-muted">
			                      We'll never share your email with anyone else.
			                    </Form.Text>
			                    <div className="listPatternsSelected">
			                      	<Badge variant="secondary">New X</Badge> <Badge variant="secondary">New X</Badge> <Badge variant="secondary">New X</Badge>
			                      	<Badge variant="secondary">New X</Badge> <Badge variant="secondary">New X</Badge>
			                    </div>
			                 </Form.Group>
						</div>
	                  </Form.Group>
	                </Form>
		        </Modal.Body>
		        
		        <Modal.Footer>
		          <Button variant="secondary" onClick={handleClose}>
		            Close
		          </Button>
		          <Button variant="primary" onClick={handleClose}>
		            Save Changes
		          </Button>
		        </Modal.Footer>
		      </Modal>
		    </div>
		);
    }


  render() {
  	const { error, isLoaded, items } = this.state;
    return (
        <div className="wrapper">
		    <SidebarMenu/>
		    
		    <div id="content">
	            <SidebarAction/>

	            <h2>Words Base</h2>
	            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
	            
	            <div className="line"></div>
	            
	            <Jumbotron className="content-form jumbotron-sm jumbotron-right">
		            <Button variant="primary">Train Chat</Button>{' '}
		            <this.addPattern/>{' '}
					{/*<Button variant="secondary">Add Pattern</Button>{' '}
					<Button variant="success">Success</Button>{' '}
					<Button variant="warning">Warning</Button>{' '}
					<Button variant="danger">Danger</Button> <Button variant="info">Info</Button>{' '}
					<Button variant="light">Light</Button> <Button variant="dark">Dark</Button>{' '}
					<Button variant="link">Link</Button>*/}
				</Jumbotron>


	            <section>
		          <section>
		            <Table id="itemTable" striped bordered hover size="sm">
		              <thead>
		                <tr>
		                  <th>Category</th>
		                  <th>Tag</th>
		                  <th>Word</th>
		                  <th>Code Word</th>
		                </tr>
		              </thead>
		              <tbody>
		                {this.state.items.map((item) => 
		                  <tr key={item._id.$oid}>
		                    <td>{item.category}</td>
		                    <td>{item.tag}</td>
		                    <td>{item.word}</td>
		                    <td>{item.code}</td>
		                    <td>
		                      {/* Here add the onClick for the action "remove it" on the span */}
		                      <a href="" ><span>Bloquear</span></a> / <a href="" ><span>Aprender</span></a>
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
		        </section>


	        </div>

	        <div className="overlay"></div>
		</div>
    );
  }
}
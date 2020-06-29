import React, { Component } from "react";
import $ from "jquery";
import Mousewheel from "jquery-mousewheel";
import mCustomScrollbar from "malihu-custom-scrollbar-plugin";
import SidebarMenu from './sidebar-menu';
import SidebarAction from './sidebar-action';
import { Alert, Navbar, Nav, DropdownButton,Dropdown,Tab, Modal, Badge, Tabs, InputGroup, Collapse, ButtonGroup,ListGroup, Form,NavDropdown,FormControl,Container, Row, Col,Media,Jumbotron, Button, Breadcrumbs, Table} from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import ModalClient from './components/modal-client';
import ModalConfChat from './components/modal-confchat.jsx';
import ModalToConfirm from './components/confirm';
import config from 'react-global-configuration';
import { browserHistory } from 'react-router';
import { bake_cookie, read_cookie, delete_cookie } from 'sfcookies';

export default class Clients extends Component {
	constructor(props) {
	    super(props);
	    if(read_cookie('token') == ''){
	      browserHistory.push('/login');
	    }

	    this.state = {
	      error: null,
	      perPage: 50,
	      items: [],
	      offset: 0,
	      listPatterns : [],
	      showModalClient: false,
	      idPattern: 0,
	      logTraining: [],
	      token: read_cookie('token'),
	      showModalConfigChatbot : false,
	      idClient: ''
	    };
	}

	loadClients() {
	    axios.get(config.get('baseUrlApi')+'/api/v1/clients?limit='+this.state.perPage+'&offset='+this.state.offset, 
    		{headers: {'Content-Type': 'application/json;charset=UTF-8', 'Authorization' : 'Bearer ' + this.state.token}})
	    .then(res => {
	    	this.setState({items: res.data.data.items,pageCount: Math.ceil(res.data.data.total_count / res.data.data.limit),});
	    }).catch(function (error) {
	    	if(error.response.status == 401){
	    		delete_cookie('token');
	    		browserHistory.push('/login');
	    	}
		});
	}


	handlePageClickClients = data => {
	    let selected = data.selected;
	    let offset = Math.ceil(selected * this.state.perPage);
	    this.setState({ offset: offset }, () => {
	      this.loadClients();
	    });
	};

	componentDidMount(){
	    this.loadClients();
	}

	handleShowModalClient = (event)=>{
		this.setState({showModalClient : true});
	}

	handleHiddenModalClient = data => {
	    this.setState({showModalClient : false});
	};

	handleGenConfigChat(id){
		console.log(id);
		this.setState({showModalConfigChatbot : true});	
		this.setState({idClient : id});	
	}

	hiddenModalConfigChatbot = data =>{
		this.setState({showModalConfigChatbot : false});
	}

    render() {
      return (
        <div className="wrapper">
		    <SidebarMenu/>
		    <div id="content">
	            <SidebarAction/>
	            <h2>Clients</h2>
	            <p>You can generate question patterns that can be asked by chat.</p>
	            <div className="line"></div>
	            <Jumbotron className="content-form jumbotron-sm jumbotron-right">
		            <Button variant="secondary" onClick={this.handleShowModalClient}>Add Client</Button>
				</Jumbotron>

				{this.state.showModalClient && 
		        	<ModalClient
		        	 hiddenModal = {this.handleHiddenModalClient} 
		        	/>
		        }

		  		<br/>
		  		<Tab.Container id="left-tabs-example" defaultActiveKey="clients">
				  <Row>
				    <Col sm={2}>
				      <Nav variant="pills" className="flex-column">
				        <Nav.Item>
				          <Nav.Link eventKey="clients">Clients</Nav.Link>
				        </Nav.Item>
				        <Nav.Item>
				          <Nav.Link eventKey="users">Users</Nav.Link>
				        </Nav.Item>
				        <Nav.Item>
				          <Nav.Link eventKey="config">Configuration Chat</Nav.Link>
				        </Nav.Item>
				      </Nav>
				    </Col>
				    <Col sm={10}>
				      <Tab.Content>
				        <Tab.Pane eventKey="clients">
				            <section>
				            {this.state.showModalConfigChatbot && 
					        	<ModalConfChat
					        	 hiddenModal = {this.hiddenModalConfigChatbot} 
					        	 idSelected = {this.state.idClient}
					        	/>
					        }

					            <Table id="itemTable" striped bordered hover size="sm">
					              <thead>
					                <tr>
					                  <th>Domain</th>
					                  <th>Name</th>
					                  <th></th>
					                </tr>
					              </thead>
					              <tbody>
					                {this.state.items.map((item) => 
					                  <tr key={item._id.$oid}>
					                    <td>#{item.domain}</td>
					                    <td>{item.name}</td>
					                    <td>
					                      
					                      <DropdownButton as={ButtonGroup} title="Options" id="bg-vertical-dropdown-1">
											    <Dropdown.Item eventKey="1" onClick={(e) => this.handleGenConfigChat(item._id.$oid, e)}>Get code Chatbot</Dropdown.Item>
											    <Dropdown.Item eventKey="2">Edit</Dropdown.Item>
											    <Dropdown.Item eventKey="3">Delete</Dropdown.Item>
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
							          onPageChange={this.handlePageClickClients}
							          containerClassName={'pagination'}
							          subContainerClassName={'pages pagination'}
							          activeClassName={'active'}
							        />
						        </div>
					        </section>
				        </Tab.Pane>
				        
				        <Tab.Pane eventKey="users">
				        	users
				        </Tab.Pane>

				        <Tab.Pane eventKey="config">
				        	configuration chat
				        	</Tab.Pane>
				      </Tab.Content>
				    </Col>		    
				  </Row>
				</Tab.Container>

			    
	        </div>
	        <div className="overlay"></div>
		</div>
    );
  }
}
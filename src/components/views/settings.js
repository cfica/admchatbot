import React, { Component } from "react";
import $ from "jquery";
import Mousewheel from "jquery-mousewheel";
import mCustomScrollbar from "malihu-custom-scrollbar-plugin";
import SidebarMenu from './components/sidebar-menu';
import SidebarAction from './components/sidebar-action';
import { Alert, Navbar, Nav, DropdownButton,Dropdown,Tab, Modal, Badge, Tabs, InputGroup, Collapse, ButtonGroup,ListGroup, Form,NavDropdown,FormControl,Container, Row, Col,Media,Jumbotron, Button, Breadcrumbs, Table} from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import ModalClient from './components/modal-client';
import ModalConfChat from './components/modal-confchat';
import ModalToConfirm from './components/confirm';
import {Users} from './components/users';
import MessageResult from './components/message-result';
import Topics from './components/topics';
import Templates from './components/templates';
import Integrations from './components/integrations';
import config from 'react-global-configuration';
import { browserHistory } from 'react-router';
import * as Icon from 'react-bootstrap-icons';
import {Validation, Status} from './components/componentsUtils';
import {Helper} from './components/helper';
import {SettingsChat} from './components/settingsChat';
import * as moment from 'moment';

export default class Settings extends Component {
	constructor(props) {
	    super(props);
	    if(localStorage.getItem('tokenAdm') == undefined){
	      browserHistory.push('/login');
	    }

	    this.state = {
	      scope: ['admin'].includes(localStorage.getItem('scope')),
	      token: localStorage.getItem('tokenAdm'),
	      user_id: localStorage.getItem('_id'),
	      client: localStorage.getItem('client'),
	      error: null,
	      perPage: 10,
	      items: [],
	      offset: 0,
	      listPatterns : [],
	      showModalClient: false,
	      idPattern: 0,
	      logTraining: [],
	      idClient: '',
	      errorSaveForm: '',
	      validated: false,
	      clientSelected:'',
	      headerMessage:'',
	      checksSelected:[],
	      client_id: '',
	      statusClient: {},
	      deactivateClient: false
	    };
	}

	loadClients() {
		async function _requestApi(_this, allReg){
		    var _url = config.get('baseUrlApi')+'/api/v1/clients?limit='+_this.state.perPage+'&offset='+_this.state.offset;
		    const res = await new Helper().getRequest(_url,'back');
		    if(typeof res != "undefined"){
		    	_this.setState({items: res.items,pageCount: Math.ceil(res.total_count / res.limit)});
		    }
		}
		_requestApi(this);
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
		this.setState({idClient : ''});
	}

	handleHiddenModalClient = data => {
	    this.setState({showModalClient : false});
	    this.loadClients();
	};

	editClient(id){
		this.setState({idClient: id});
		this.setState({showModalClient : true});
	}

	delClient(id){

	}


	changeStatusClient(id, status,event){
		this.setState({deactivateClient: true});
		this.setState({statusClient : {_id: id, _status: status}});
	}

	changeStatusClientConfirm = ()=>{
		axios.post(
		    	config.get('baseUrlApi')+'/api/v1/status-client', 
		    	JSON.stringify(this.state.statusClient), 
		    	{headers: {'Content-Type': 'application/json;charset=UTF-8', 'Authorization' : 'Bearer ' + this.state.token}}
		).then(res => {
			this.setState({deactivateClient: false});
			this.loadClients();
		});
	}

	deactivateClientClose = () =>{
		this.setState({deactivateClient: false});
	}

    render() {
      return (
        <div className="wrapper">
		    <SidebarMenu/>
		    <div id="content">
	            <SidebarAction/>
	            <h2>Settings</h2>
	            <p>Application settings</p>
	            <div className="line"></div>
	            
	            {this.state.scope &&
		            <Jumbotron className="content-form jumbotron-sm jumbotron-right">
			            <Button variant="secondary" onClick={this.handleShowModalClient}>Add Client <Icon.Plus size={25}/></Button>
					</Jumbotron>
				}

				{this.state.showModalClient && 
		        	<ModalClient
		        	 hiddenModal = {this.handleHiddenModalClient}
		        	 id = {this.state.idClient}
		        	/>
		        }

		  		<br/>
		  		<Tab.Container id="left-tabs-example" defaultActiveKey={this.state.scope ? 'clients' : 'users'}>
				  <Row>
				    <Col sm={2}>
				      <Nav variant="pills" className="flex-column">
				        
				        {this.state.scope &&
					        <Nav.Item>
					          <Nav.Link eventKey="clients">Clients</Nav.Link>
					        </Nav.Item>
					    }

				        <Nav.Item>
				          <Nav.Link eventKey="users">Users</Nav.Link>
				        </Nav.Item>

				        

				        <Nav.Item>
				          <Nav.Link eventKey="topics">Topics Menu</Nav.Link>
				        </Nav.Item>


				        <Nav.Item>
				          <Nav.Link eventKey="templates">Templates Email</Nav.Link>
				        </Nav.Item>


				        <Nav.Item>
				          <Nav.Link eventKey="integrations">Integrations</Nav.Link>
				        </Nav.Item>


				        <Nav.Item>
				          <Nav.Link eventKey="payments">Payments</Nav.Link>
				        </Nav.Item>

				        <Nav.Item>
				          <Nav.Link eventKey="config">Configuration Chat</Nav.Link>
				        </Nav.Item>

				      </Nav>
				    </Col>
				    <Col sm={10}>
				      <Tab.Content>
				        {this.state.scope &&
					        <Tab.Pane eventKey="clients">
					            <section>
					            {this.state.showModalConfigChatbot && 
						        	<ModalConfChat
						        	 hiddenModal = {this.hiddenModalConfigChatbot} 
						        	 idSelected = {this.state.idClient}
						        	/>
						        }

						            <Table id="itemTable" variant="dark" striped bordered hover size="sm">
						              <thead>
						                <tr>
						                  <th>Domain</th>
						                  <th>Name</th>
						                </tr>
						              </thead>
						              
						              <tbody>
						                {this.state.items.map((item) => 
						                  <tr key={item._id.$oid}>
						                    <td>#<a href={'http://'+item.domain} target="_blank"> {item.domain} </a></td>
						                    <td>{item.name}{' '}<Status status={item.status}/>

						                    	<div className="table-options">
						                    		<span className="_created">{moment(new Helper().formatDate(item._created)).fromNow()}</span>
							                    	
							                    	{item.status == 'Active' && 
								                    	<DropdownButton className="btn-3p" as={ButtonGroup} title="...">
																<Dropdown.Item eventKey="4" onClick={(e) => this.editClient(item._id.$oid)}>Edit</Dropdown.Item>

															    {/*<Dropdown.Item eventKey="4" onClick={(e) => this.delClient(item._id.$oid)}>Delete</Dropdown.Item>*/}


															    {item.status == 'Active' &&
															      <Dropdown.Item eventKey="3" onClick={(e) => this.changeStatusClient(item._id.$oid,'Inactive', e)}>Deactivate</Dropdown.Item>
															    }

															    {item.status == 'Inactive' &&
															      <Dropdown.Item eventKey="3" onClick={(e) => this.changeStatusClient(item._id.$oid,'Active', e)}>Activate</Dropdown.Item>
															    }
														</DropdownButton>
													}

						                    	</div>

						                    </td>
						                  </tr>
						                )}
						              </tbody>
						            </Table>

						            {this.state.deactivateClient && 
								        <ModalToConfirm
						                   handleConfirm={this.changeStatusClientConfirm}
						                   hiddenModal={this.deactivateClientClose}
						                   message="Are you sure you want to do this?"
						                />
						            }

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
					    }


					    <Tab.Pane eventKey="templates">
					    	<Templates/>
				        </Tab.Pane>

				        <Tab.Pane eventKey="integrations">
				           <Integrations/>
				        </Tab.Pane>


				        <Tab.Pane eventKey="users">
				        	<Users/>
				        </Tab.Pane>

				        <Tab.Pane eventKey="topics">
				        	<Topics/>
				        </Tab.Pane>

				        <Tab.Pane eventKey="config">
				        	<SettingsChat clients={this.state.items}/>
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
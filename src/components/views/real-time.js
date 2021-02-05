import React, { Component } from "react";
import config from 'react-global-configuration';
import $ from "jquery";
import Mousewheel from "jquery-mousewheel";
import mCustomScrollbar from "malihu-custom-scrollbar-plugin";
import SidebarMenu from './components/sidebar-menu';
import SidebarAction from './components/sidebar-action';
import { Alert, Navbar, Nav, DropdownButton, Dropdown, Accordion, Card, Tab, Modal, Badge, Tabs, InputGroup, Collapse, ButtonGroup,ListGroup, Form,NavDropdown,FormControl,Container, Row, Col,Media,Jumbotron, Button, Breadcrumbs, Table} from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import ModalToLearn from './components/modal-add-pattern';
import { browserHistory } from 'react-router';
import * as moment from 'moment';
import {Helper} from './components/helper';
import {Filters} from './components/filters';
import {ConnectionSSE} from './components/connectionSSE';

import DatePicker from "react-datepicker"; 
import "react-datepicker/dist/react-datepicker.css";
import * as Icon from 'react-bootstrap-icons';



export default class RealTime extends Component {
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
	      
	      items: [],
	      
	      pageCountWords: 0,
	      pageCountAccess: 0,
	      pageCountContact: 0,

	      showModalToLearn: false,
	      itemsAccess: [],
	      itemsContact: [],
	      
	      patternSelected: [],
	      connectionSSERealTime: null,
	      connectionSSERAccess: null,
	      connectionSSEcontact: null,
	      
	      filter_from: '',
	      filter_to: '',
	      filter_user: '',
	      filters_active: [],
	      validated: false,
	      contactPendingCount:0
	    };
	}

	/*async setConnectionSSE(value, _where){
		await this.setState({connectionSSERealTime: value });
	}*/

	/*getRealTimeSSE(_close = null, _filters = null){
	    return new ConnectionSSE().getRealTimeSSE(_close, _filters);
	}*/


	/*loadAccess() {
		axios.get(config.get('baseUrlApi')+'/api/v1/access-chat?limit='+this.state.perPage+'&offset='+this.state.offset, 
    		{headers: {'Content-Type': 'application/json;charset=UTF-8', 'Authorization' : 'Bearer ' + this.state.token}})
	    .then(res => {
	    	this.setState({
	          itemsAccess: res.data.data.items,
	          pageCount: Math.ceil(res.data.data.total_count / res.data.data.limit),
	        });
	    });
	}*/

	

	componentDidMount(){
	    //this.getRealTimeSSE();
	    //this.loadAccess();
	    //this.loadContacts();
	}


	

	
	handleClickToLearn(data){
	   this.setState({showModalToLearn : true, patternSelected: data});
	}

	hiddenModalToLearn = data =>{
	   this.setState({showModalToLearn : false});
	}

	handleClickToBlock(data){
	   console.log(data);
	}


	/*loadContacts() {
		axios.get(config.get('baseUrlApi')+'/api/v1/contacts?limit='+this.state.perPage+'&offset='+this.state.offset, 
    		{headers: {'Content-Type': 'application/json;charset=UTF-8', 'Authorization' : 'Bearer ' + this.state.token}})
	    .then(res => {
	    	this.setState({
	          itemsContact: res.data.data.items,
	          pageCount: Math.ceil(res.data.data.total_count / res.data.data.limit),
	        });
	    });
	}*/


	/*CONNECTION REAL TIME CHAT*/
	async setConnectionSSErealtime  (_this, value){
		await _this.setState({connectionSSERealTime: value});
	}

	getConnectionSSErealtime(_this){
		return _this.state.connectionSSERealTime;
	}

	setItemsRealTime = (items, res) =>{
		this.setState({'items': items});
	}

	setPageCount = (value) =>{
		this.setState({'pageCountWords': value});
	}

	getPageCount = (_this) =>{
		return _this.state.pageCountWords;
	}
	/*CONNECTION REAL TIME CHAT*/


	/*CONNECTION ACCESS*/
	async setConnectionSSEaccess(_this, value){
		await _this.setState({connectionSSERAccess: value});
	}

	getConnectionSSEaccess(_this){
		return _this.state.connectionSSERAccess;
	}

	setItemsAccess = (items, res) =>{
		this.setState({'itemsAccess': items});
	}

	setPageCountAccess = (value) =>{
		this.setState({'pageCountAccess': value});
	}

	getPageCountAccess(_this){
		return _this.state.pageCountAccess;
	}
	/*CONNECTION ACCESS*/


	/*CONNECTION CONTACT*/
	async setConnectionSSEcontact  (_this, value){
		await _this.setState({connectionSSEcontact: value});
	}

	getConnectionSSEcontact (_this){
		return _this.state.connectionSSEcontact;
	}

	setItemsContact = (items, res) =>{
		/*var _itemsPending = 0;
		items.forEach(function(el){
           if(el.status == 'pending'){
           	_itemsPending++;
           }
		});*/

		this.setState({'contactPendingCount': res.pending});
		this.setState({'itemsContact': items});
	}

	setPageCountContact = (value) =>{
		this.setState({'pageCountContact': value});
	}

	getPageCountContact(_this){
		return _this.state.pageCountContact;
	}
	/*CONNECTION CONTACT*/


	
  render() {
  	const filtersContact = [{'name': 'from'}, {'name': 'to'}, {'name': 'status'}];
  	const filtersRealTime = [{'name': 'from'}, {'name': 'to'}];
  	const filtersAccess = [{'name': 'from'}, {'name': 'to'}];

    return (
        <div className="wrapper">
		    <SidebarMenu/>
		    <div id="content">
	            <SidebarAction/>

	            <Tabs defaultActiveKey="Messages" transition={false} id="noanim-tab-example">
				 
				  <Tab eventKey="Messages" title={
		            <React.Fragment>
		              <Icon.ChatQuote size={20}/> Messages
		            </React.Fragment>
		          }>
				    		<h2 className="title-page">Real Time Chat</h2>
				            <p>Last messages</p>
				            <div className="line"></div>
				            

				            <ConnectionSSE
				                _setConnectionSSE={this.setConnectionSSErealtime}
					            _getConnectionSSE={this.getConnectionSSErealtime}
				            	_setItems={this.setItemsRealTime} 
				            	_setPageCount = {this.setPageCount}
				            	_getPageCount = {this.state.pageCountWords}
				            	_url = {'/api/v1/real-time'}
				            	_this = {this}
				            	_filters= {filtersRealTime}
				            />

					        <section className="parent-cont-real-time">
					            {this.state.items.map((item) =>
						            <div key={item._id.$oid}>
						            	<div className={item.type + " cont-real-time"}>
							                <div className="header">
							                	<Alert.Heading className="name_client">{item.user_name}</Alert.Heading>


							                	<DropdownButton variant="link" className="options" size="sm" as={ButtonGroup} title="Options" id="bg-nested-dropdown">
												    <Dropdown.Item eventKey="1" onClick={(e) => this.handleClickToLearn([item._id.$oid, item._input.message], e)}>To Learn</Dropdown.Item>
												    <Dropdown.Item eventKey="2" onClick={(e) => this.handleClickToBlock([item._id.$oid, item._input.message], e)}>To Lock</Dropdown.Item>
												</DropdownButton>

							                	{this.state.scope &&
						                    	item._client.map((item1) => 
							                    		<div className="domain">{item1.client_domain}</div>
							                    	)
								                }

												<div className="_created">{moment(item._created).fromNow()}</div>
							                </div>	

							            	

											  
											  <div className="body">
											  		{/*item.type == '_req' &&
											  		  <p>
													    {item._input.message}
													  </p>
													*/}

													{/*<div>{JSON.stringify(item)}</div>*/}

													  {item.type_resp == 'Text' &&
														  <p>
														     {item.msg}
														  </p>
													  }

													  {item.type_resp != 'Text' &&
														  <p>
														     {item.type_resp}
														  </p>
													  }
											  </div>
										
										</div>
						            </div>
								)}

								{this.state.items.length == 0 &&
								   new Helper().setAlertApp('warning', 'There are no records to display.')
								}
					        </section>
				  </Tab>
				  

				  <Tab eventKey="access" title="Login Chat History">
				    			<h2 className="title-page">Login Chat History</h2>
					            <p>Last hits</p>
					            <div className="line"></div>
					            
					            <ConnectionSSE 
					            	_setItems={this.setItemsAccess} 
					            	_setPageCount = {this.setPageCountAccess}
					            	_getPageCount = {this.state.pageCountAccess}
					            	_setConnectionSSE={this.setConnectionSSEaccess}
					            	_getConnectionSSE={this.getConnectionSSEaccess}
					            	_url = {'/api/v1/access-chat'}
					            	_this = {this}
					            	_filters= {filtersAccess}
					            />

					            <section>
					            	<Accordion defaultActiveKey="">
											{this.state.itemsAccess.map((item, index) =>
									          	
								          		<Card className="cont-real-time">
												    <Card.Header className="header">
													    <Accordion.Toggle className="name_client" as={Button} variant="link" eventKey={index}>
													      	{item.name}
													    </Accordion.Toggle>

												        <DropdownButton variant="link" className="options" size="sm" as={ButtonGroup} title="Options" id="bg-nested-dropdown">
														    <Dropdown.Item eventKey="2" onClick="">Messages</Dropdown.Item>
														    <Dropdown.Item eventKey="2" onClick="">To Lock</Dropdown.Item>
														</DropdownButton>

									                	{this.state.scope &&
								                    	item._client.map((item1) => 
									                    		<div className="domain">{item1.client_domain}</div>
									                    	)
										                }
														<div className="_created">{moment(item._created).fromNow()}</div>
														
												    </Card.Header>

												    <Accordion.Collapse eventKey={index}>
												      <Card.Body>
												      		<p>{item.name}</p>
										                  	<p>{item.email}</p>
										                  	<p>{item.telephone}</p>
										                  	<p>{item._created}</p>
												      </Card.Body>
												    </Accordion.Collapse>
												</Card>
									        )}

									        {this.state.itemsAccess.length == 0 &&
											   new Helper().setAlertApp('warning', 'There are no records to display.')
											}
							        </Accordion>
						        </section>
				  </Tab>

				  <Tab eventKey="contact-chat" title={
		            <React.Fragment>
		              <Icon.ChatQuote size={20}/> Contact Chat {this.state.contactPendingCount > 0 && 
                        <Badge variant='warning'>{this.state.contactPendingCount}</Badge>
		              }
		            </React.Fragment>
		          }>
				  	<h2 className="title-page">Contact Chat</h2>
					<p>Last hits</p>
					
					<ConnectionSSE 
		            	_setItems={this.setItemsContact} 
		            	_setPageCount = {this.setPageCountContact}
		            	_getPageCount = {this.state.pageCountContact}
		            	_setConnectionSSE={this.setConnectionSSEcontact}
		            	_getConnectionSSE={this.getConnectionSSEcontact}
		            	_url = {'/api/v1/contacts'}
		            	_this = {this}
		            	_filters= {filtersContact}
		            />

					<section>
				           	
							<Accordion defaultActiveKey="">
									{this.state.itemsContact.map((item, index) =>
							          	
						          		<Card className="cont-real-time">
										    <Card.Header className="header">
											    <Accordion.Toggle className="name_client" as={Button} variant="link" eventKey={index}>
											      	{item._customer[0].name}&nbsp;
											      	
											      	{item.status == 'pending' &&
											      	   <Badge variant='warning'>Pending</Badge>	
											      	}

											      	{item.status == 'open' &&
											      	   <Badge variant='warning'>Open</Badge>	
											      	}

											      	{item.status == 'closed' &&
											      	   <Badge variant='success'>Closed</Badge>	
											      	}
											    </Accordion.Toggle>

										        {/*<DropdownButton variant="link" className="options" size="sm" as={ButtonGroup} title="Options" id="bg-nested-dropdown">
												    <Dropdown.Item eventKey="1" href={"contacts/" + item._id}>Detail</Dropdown.Item>
										   			<Dropdown.Item eventKey="2">Asign</Dropdown.Item>
												</DropdownButton>*/}

												<Button href={"contacts/" + item._id} size="sm" variant="outline-secondary">Detail</Button>


							                	{this.state.scope &&
						                    	item._client.map((item1) => 
							                    		<div className="domain">{item1.client_domain}</div>
							                    	)
								                }
												<div className="_created">{moment(item._created).fromNow()}</div>

										    </Card.Header>

										    <Accordion.Collapse eventKey={index}>
										      <Card.Body>{item.status}</Card.Body>
										    </Accordion.Collapse>
										</Card>

							          	
							        )}

							        {this.state.itemsContact.length == 0 &&
									   new Helper().setAlertApp('warning', 'There are no records to display.')
									}

					        </Accordion>
				        </section>
				  </Tab>

				  {/*<Tab eventKey="words-base" title={
		            <React.Fragment>
		              <Icon.FileText size={20}/> Words Base
		            </React.Fragment>
		          }>

		          </Tab>*/}
				</Tabs>




		        {this.state.showModalToLearn && 
		        	<ModalToLearn
		        	 hiddenModal = {this.hiddenModalToLearn} 
		        	 patternSelected = {this.state.patternSelected}
		        	/>
		        }

	        </div>

	        <div className="overlay"></div>
		</div>
    );
  }
}

/*
<Greeting {...greeting} />
const Greeting = ({ subject, description }) => (
  <div>
    <Title title={`Welcome to ${subject}`} />
    <Description description={description} />
  </div>
);*/
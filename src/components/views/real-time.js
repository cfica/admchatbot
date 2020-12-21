import React, { Component } from "react";
import config from 'react-global-configuration';
import $ from "jquery";
import Mousewheel from "jquery-mousewheel";
import mCustomScrollbar from "malihu-custom-scrollbar-plugin";
import SidebarMenu from './components/sidebar-menu';
import SidebarAction from './components/sidebar-action';
import { Alert, Navbar, Nav, DropdownButton, Dropdown, Tab, Modal, Badge, Tabs, InputGroup, Collapse, ButtonGroup,ListGroup, Form,NavDropdown,FormControl,Container, Row, Col,Media,Jumbotron, Button, Breadcrumbs, Table} from 'react-bootstrap';
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
	      perPage: 50,
	      items: [],
	      offset: 0,
	      pageCountWords: 50,
	      showModalToLearn: false,
	      itemsAccess: [],
	      itemsContact: [],
	      perPageContact: 50,
	      patternSelected: [],
	      connectionSSERealTime: null,
	      filter_from: '',
	      filter_to: '',
	      filter_user: '',
	      filters_active: [],
	      validated: false
	    };
	}

	/*async setConnectionSSE(value, _where){
		await this.setState({connectionSSERealTime: value });
	}*/

	getRealTimeSSE(_close = null, _filters = null){
	    return new ConnectionSSE().getRealTimeSSE(_close, _filters);

	    /*if(_close){
	    	  var sse = this.state.connectionSSERealTime;
		      if(sse){
		        sse.close();
		        async function updateSSE(_this, sse){
		        	await _this.setConnectionSSE(null, 'close connection state');
		        }
		        updateSSE(this, sse);
		      }
	    }else{
		      var _filters = _filters == null ? '' : _filters;
	          var _strUrl = config.get('baseUrlApi')+'/api/v1/real-time?limit='+this.state.perPage+'&offset='+this.state.offset+'&t-dsi-restful='+this.state.token+_filters;
	          var sse = new Helper().requestSSE(_strUrl);
	          
	          async function updateSSE(_this, sse){
	          	await _this.setConnectionSSE(sse, 'open connection state');
	          	sse.onmessage = function(event){
		            var _res = JSON.parse(event.data);
		            _this.setState({
			          items: _res.items,
			          pageCountWords: Math.ceil(_res.total_count / _res.limit),
			        });
		        };

		        sse.addEventListener('message', function(event) {
		        }, false);

		        sse.onerror = msg => {}
	          }
	          updateSSE(this, sse);
	    }*/
	}


	loadAccess() {
		axios.get(config.get('baseUrlApi')+'/api/v1/access-chat?limit='+this.state.perPage+'&offset='+this.state.offset, 
    		{headers: {'Content-Type': 'application/json;charset=UTF-8', 'Authorization' : 'Bearer ' + this.state.token}})
	    .then(res => {
	    	this.setState({
	          itemsAccess: res.data.data.items,
	          pageCount: Math.ceil(res.data.data.total_count / res.data.data.limit),
	        });
	    });
	}

	handlePageClickAccess = data => {
	    let selected = data.selected;
	    let offset = Math.ceil(selected * this.state.perPage);
	    this.setState({ offset: offset }, () => {
	      this.loadAccess();
	    });
	};

	componentDidMount(){
	    //this.getRealTimeSSE();
	    this.loadAccess();
	    this.loadContacts();
	}


	handlePageClick = data => {
	    let selected = data.selected;
	    let offset = Math.ceil(selected * this.state.perPage);
	    this.setState({ offset: offset }, () => {
	      //this.getRealTimeSSE();
	    });
	};

	
	handleClickToLearn(data){
	   this.setState({showModalToLearn : true, patternSelected: data});
	}

	hiddenModalToLearn = data =>{
	   this.setState({showModalToLearn : false});
	}

	handleClickToBlock(data){
	   console.log(data);
	}


	loadContacts() {
		axios.get(config.get('baseUrlApi')+'/api/v1/contacts?limit='+this.state.perPage+'&offset='+this.state.offset, 
    		{headers: {'Content-Type': 'application/json;charset=UTF-8', 'Authorization' : 'Bearer ' + this.state.token}})
	    .then(res => {
	    	this.setState({
	          itemsContact: res.data.data.items,
	          pageCount: Math.ceil(res.data.data.total_count / res.data.data.limit),
	        });
	    });
	}

	handlePageClickContact = data => {
	    let selected = data.selected;
	    let offset = Math.ceil(selected * this.state.perPageContact);
	    this.setState({ offset: offset }, () => {
	      this.loadContacts();
	    });
	};

	handlePageClick = data => {
	    let selected = data.selected;
	    let offset = Math.ceil(selected * this.state.perPageContact);
	    this.setState({ offset: offset }, () => {
	      //this.loadWords();
	    });
	};

	
	setItemsRealTime = (items) =>{
		this.setState({'items': items});
	}

	setPageCount = (value) =>{
		this.setState({'pageCountWords': value});
	}

	
  render() {
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
				            

				            <ConnectionSSE _setItems={this.setItemsRealTime} _setPageCount = {this.setPageCount}/>

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

					            <div id="react-paginate">
						            <ReactPaginate
							          previousLabel={'Anterior'}
							          nextLabel={'Siguiente'}
							          breakLabel={'...'}
							          breakClassName={'break-me'}
							          pageCount={this.state.pageCountWords}
							          marginPagesDisplayed={2}
							          pageRangeDisplayed={5}
							          onPageChange={this.handlePageClick}
							          containerClassName={'pagination'}
							          subContainerClassName={'pages pagination'}
							          activeClassName={'active'}
							        />
						        </div>
					        </section>
				  </Tab>
				  

				  <Tab eventKey="access" title="Login Chat History">
				    			<h2 className="title-page">Login Chat History</h2>
					            <p>Last hits</p>
					            <div className="line"></div>
					            <section>
						          <section>
						            <Table id="itemTable" striped bordered hover size="sm">
						              <thead>
						                <tr>
						                  {this.state.scope &&
						                  	<th>Client</th>
						                  }
						                  <th>Name</th>
						                  <th>Email</th>
						                  <th>Telephone</th>
						                  <th>Created</th>
						                </tr>
						              </thead>
						              <tbody>
						                {this.state.itemsAccess.map((item) => 
						                  <tr key={item._id.$oid}>
						                    {this.state.scope &&
							                    <td>
							                    	{item._client.map((item1) => 
						                    			<span>
								                    		{item1.client_domain}
							                    		</span>
							                    	)}
							                    </td>
							                }

						                  	<td>{item.name}</td>
						                  	<td>{item.email}</td>
						                  	<td>{item.telephone}</td>
						                  	<td>{item._created}</td>
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
								          onPageChange={this.handlePageClickAccess}
								          containerClassName={'pagination'}
								          subContainerClassName={'pages pagination'}
								          activeClassName={'active'}
								        />
							        </div>

						          </section>
						        </section>
				  </Tab>

				  <Tab eventKey="contact-chat" title={
		            <React.Fragment>
		              <Icon.ChatQuote size={20}/> Contact Chat <Badge variant='warning'>9</Badge>
		            </React.Fragment>
		          }>
				  	<h2 className="title-page">Contact Chat</h2>
					<p>Last hits</p>
					<section>
				            <Table id="itemTable" striped bordered hover size="sm">
				              <thead>
				                <tr>
				                  {this.state.scope &&
				                  	<th>Client</th>
				                  }
				                  <th>Name</th>
				                  <th>Email</th>
				                  <th>Telephone</th>
				                  <th>Status</th>
				                  <th>Created</th>
				                  <th>Action</th>
				                </tr>
				              </thead>
				              <tbody>
				                {this.state.itemsContact.map((item) => 
				                  <tr key={item._id.$oid}>
				                    {this.state.scope &&
					                    <td>
					                    	{item._client.map((item1) => 
				                    			<span>
						                    		{item1.client_domain}
					                    		</span>
					                    	)}
					                    </td>
					                }

				                  	<td>{item._customer[0].name}</td>
				                  	<td>{item._customer[0].email}</td>
				                  	<td>{item._customer[0].telephone}</td>
				                  	<td>{item.status}</td>
				                  	<td>{item._created}</td>
				                  	<td>
				                  		<DropdownButton size="sm" as={ButtonGroup} title="Options" id="bg-nested-dropdown">
										    <Dropdown.Item eventKey="1" href={"contacts/" + item._id.$oid}>Detail</Dropdown.Item>
										    <Dropdown.Item eventKey="2">Asign</Dropdown.Item>
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
						          pageCount={this.state.perPageContact}
						          marginPagesDisplayed={2}
						          pageRangeDisplayed={5}
						          onPageChange={this.handlePageClickContact}
						          containerClassName={'pagination'}
						          subContainerClassName={'pages pagination'}
						          activeClassName={'active'}
						        />
					        </div>
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
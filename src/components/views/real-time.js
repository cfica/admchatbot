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

import DatePicker from "react-datepicker"; 
import "react-datepicker/dist/react-datepicker.css";



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
	      showModalToLearn: false,
	      itemsAccess: [],
	      patternSelected: [],
	      connectionSSE: null,
	      filter_from: '',
	      filter_to: '',
	      filter_user: '',
	      filters_active: [],
	      validated: false
	    };
	}

	async setConnectionSSE(value, _where){
		await this.setState({ connectionSSE: value });
		console.log(value, _where);
	}

	getRealTimeSSE(_close = null, _filters = null){
	    if(_close){
	    	  var sse = this.state.connectionSSE;
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
	          /*###*/
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
	    }
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
	    this.getRealTimeSSE();
	    this.loadAccess();
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

	
	_handleFilter = (e) =>{
		e.preventDefault();
		this._resetFilter();
		const form = e.currentTarget;
		if (form.checkValidity() === false) {
          e.stopPropagation();
          //console.log('aqui');
          this.setState({validated : true});
          //console.log('validated: true');
        }else{
          this.setState({validated : false});
          var _strFilter = '';
          if(this.state.filter_user !== ""){
          	_strFilter += '&user='+this.state.filter_user;
          	/*#*/
          	var _filters = this.state.filters_active;
          	_filters.push({label: 'User', 'value': this.state.filter_user});
          	this.setState({filters_active: _filters});
          }

          if(this.state.filter_from !== ""){
          	_strFilter += '&from='+moment(this.state.filter_from).format('DD/MM/YYYY');
          	/*#*/
          	var _filters = this.state.filters_active;
          	_filters.push({label: 'From', 'value': moment(this.state.filter_from).format('DD/MM/YYYY')});
          	this.setState({filters_active: _filters});
          }

          if(this.state.filter_to !== ""){
          	_strFilter +=  '&to='+moment(this.state.filter_to).format('DD/MM/YYYY');
          	/*#*/
          	var _filters = this.state.filters_active;
          	_filters.push({label: 'To', 'value': moment(this.state.filter_to).format('DD/MM/YYYY')});
          	this.setState({filters_active: _filters});
          }
          
          if(this.state.filters_active.length > 0) {
          	this.getRealTimeSSE(true);
          	this.getRealTimeSSE(false,_strFilter);
          }
        }
	}

	async _resetFilter(){
		await this.setState({filters_active: []});
	}

	_handleResetFilter = (e) =>{
		this.getRealTimeSSE(true);
        this.getRealTimeSSE(false,'');
        this.setState({filters_active: []});
	}

	
  render() {

    return (
        <div className="wrapper">
		    <SidebarMenu/>
		    <div id="content">
	            <SidebarAction/>

	            <Tabs defaultActiveKey="Messages" transition={false} id="noanim-tab-example">
				  <Tab eventKey="Messages" title="Messages">
				    		<h2>Real Time Chat</h2>
				            <p>Last messages</p>
				            <div className="line"></div>
				            
				            <section className="grup-filters">
				            	<Form noValidate validated={this.state.validated} onSubmit={this._handleFilter}>
						            	<InputGroup  size="sm" >
										    <InputGroup.Prepend>
										      <InputGroup.Text id="basic-addon1">User</InputGroup.Text>
										    </InputGroup.Prepend>
										    <FormControl
										      placeholder="Username"
										      aria-label="Username"
										      aria-describedby="basic-addon1"
										      value={this.state.filter_user}
										      onChange={(e) => this.setState({filter_user: e.target.value})}
										    />
										</InputGroup>

							            <InputGroup  size="sm" >
										    <InputGroup.Prepend>
										      <InputGroup.Text id="inputGroup-sizing-sm">From</InputGroup.Text>
										    </InputGroup.Prepend>
										    <DatePicker className="form-control"  dateFormat="dd/MM/yyyy" selected={this.state.filter_from} onChange={date => this.setState({filter_from: date})} />
										</InputGroup>

										<InputGroup  size="sm" >
										    <InputGroup.Prepend>
										      <InputGroup.Text id="inputGroup-sizing-sm">To</InputGroup.Text>
										    </InputGroup.Prepend>
										    <DatePicker className="form-control"  dateFormat="dd/MM/yyyy" selected={this.state.filter_to} onChange={date => this.setState({filter_to: date})} />
										</InputGroup>

										<Button  size="sm" variant="secondary" type="submit">
										    Filter
										</Button>

										{this.state.filters_active.length > 0 &&
											<Button  size="sm" onClick={this._handleResetFilter} variant="warning" type="button">
											    Reset
											</Button>
										}
								</Form>

								{this.state.filters_active.length > 0 &&
									<div className="filters_active">
										<ul>
											<li><strong>Filters Active: </strong></li>
											{this.state.filters_active.map((item) => 
												<li>{item.label} = {item.value}</li>
											)}
										</ul>
									</div>
								}
				            </section>

					          <section className="parent-cont-real-time">
					            
					            {this.state.items.map((item) =>
						            <div key={item._id.$oid}>
						            	<div className={item.type + " cont-real-time"}>
							                <div className="header">
							                	<Alert.Heading className="name_client">{item.name_client}</Alert.Heading>
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
											  		  <p>
													    {item._input.message}
													  </p>

													  <p>
													    {item.type == 'Text' && item._response}
													  </p>
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
				  

				  <Tab eventKey="access" title="Access Chat">
				    			<h2>Access Chat</h2>
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
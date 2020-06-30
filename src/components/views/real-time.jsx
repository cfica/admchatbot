import React, { Component } from "react";
import config from 'react-global-configuration';
import $ from "jquery";
import Mousewheel from "jquery-mousewheel";
import mCustomScrollbar from "malihu-custom-scrollbar-plugin";
import SidebarMenu from './sidebar-menu';
import SidebarAction from './sidebar-action';
import { Alert, Navbar, Nav, Tab, Modal, Badge, Tabs, InputGroup, Collapse, ButtonGroup,ListGroup, Form,NavDropdown,FormControl,Container, Row, Col,Media,Jumbotron, Button, Breadcrumbs, Table} from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import ModalToLearn from './components/modal-add-pattern';
import { browserHistory } from 'react-router';
import { bake_cookie, read_cookie, delete_cookie } from 'sfcookies';


export default class RealTime extends Component {
	constructor(props) {
	    super(props);
	    if(read_cookie('token') == ''){
	      browserHistory.push('/login');
	    }

	    this.state = {
	      error: null,
	      perPage: 10,
	      items: [],
	      offset: 0,
	      showModalToLearn: false,
	      itemsAccess: [],
	      patternSelected: [],
	      token: read_cookie('token')
	    };
	}

	loadWords() {
		axios.get(config.get('baseUrlApi')+'/api/v1/real-time?limit='+this.state.perPage+'&offset='+this.state.offset, 
    		{headers: {'Content-Type': 'application/json;charset=UTF-8', 'Authorization' : 'Bearer ' + this.state.token}})
	    .then(res => {
	    	this.setState({
	          items: res.data.data.items,
	          pageCount: Math.ceil(res.data.data.total_count / res.data.data.limit),
	        });
	    }).catch(function (error) {
	    	if(error.response.status == 401){
	    		delete_cookie('token');
	    		browserHistory.push('/login');
	    	}
		});
	}

	loadAccess() {
		axios.get(config.get('baseUrlApi')+'/api/v1/access-chat?limit='+this.state.perPage+'&offset='+this.state.offset, 
    		{headers: {'Content-Type': 'application/json;charset=UTF-8', 'Authorization' : 'Bearer ' + this.state.token}})
	    .then(res => {
	    	this.setState({
	          itemsAccess: res.data.data.items,
	          pageCount: Math.ceil(res.data.data.total_count / res.data.data.limit),
	        });
	    }).catch(function (error) {
	    	/*if(error.response.status == 401){
	    		delete_cookie('token');
	    		browserHistory.push('/login');
	    	}*/
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
	    this.loadWords();
	    this.loadAccess();
	}


	handlePageClick = data => {
	    let selected = data.selected;
	    let offset = Math.ceil(selected * this.state.perPage);
	    this.setState({ offset: offset }, () => {
	      this.loadWords();
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

  render() {
    return (
        <div className="wrapper">
		    <SidebarMenu/>
		    <div id="content">
	            <SidebarAction/>

	            <Tabs defaultActiveKey="Messages" transition={false} id="noanim-tab-example">
				  <Tab eventKey="Messages" title="Messages">
				    		<h2>Real Time Chat</h2>
				            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
				            <div className="line"></div>
				            <section>
					          <section>
					            <Table id="itemTable" striped bordered hover size="sm">
					              <thead>
					                <tr>
					                  <th>Client</th>
					                  <th>Created</th>
					                  <th>Action on Input</th>
					                  <th>Input</th>
					                  <th>Response</th>
					                  <th>User Agent</th>
					                </tr>
					              </thead>
					              <tbody>
					                {this.state.items.map((item) => 
					                  <tr key={item._id.$oid}>
					                  	<td>www.acyr.cl</td>
					                  	<td>{item._created}</td>
					                    <td>
					                      {/* Here add the onClick for the action "remove it" on the span */}
					                      <a href="#" onClick={(e) => this.handleClickToLearn([item._id.$oid, item._input.message], e)}><span>To Learn</span></a> 
					                      {' '}/{' '} 
					                      <a href="#" onClick={(e) => this.handleClickToBlock([item._id.$oid, item._input.message], e)}><span>To Block</span></a>
					                    </td>
					                    <td>{item._input.message}</td>
					                    <td>{item._response}</td>
					                    <td>{item._input.info.ip} / {item._input.info.user_agent}</td>
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
				  </Tab>
				  <Tab eventKey="access" title="Access Chat">
				    			<h2>Access Chat</h2>
					            <p>Lorem ipsum dolor sit am lelit on proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
					            <div className="line"></div>
					            <section>
						          <section>
						            <Table id="itemTable" striped bordered hover size="sm">
						              <thead>
						                <tr>
						                  <th>Client Id</th>
						                  <th>Name</th>
						                  <th>Email</th>
						                  <th>Telephone</th>
						                  <th>Created</th>
						                </tr>
						              </thead>
						              <tbody>
						                {this.state.itemsAccess.map((item) => 
						                  <tr key={item._id.$oid}>
						                  	<td>{item.client_id}</td>
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
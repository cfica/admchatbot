import React, { Component } from "react";
import config from 'react-global-configuration';
import $ from "jquery";
import Mousewheel from "jquery-mousewheel";
import mCustomScrollbar from "malihu-custom-scrollbar-plugin";
import SidebarMenu from './components/sidebar-menu';
import SidebarAction from './components/sidebar-action';
import { Alert, Navbar, Nav, Tab, Modal, Badge, Tabs, InputGroup, Collapse, ButtonGroup,ListGroup, Form,NavDropdown,FormControl,Container, Row, Col,Media,Jumbotron, Button, Breadcrumbs, Table} from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import ModalToLearn from './components/modal-add-pattern';
import { browserHistory } from 'react-router';


export default class RealTime extends Component {
	constructor(props) {
	    super(props);
	    if(localStorage.getItem('tokenAdm') == undefined){
	      browserHistory.push('/login');
	    }

	    this.state = {
	      error: null,
	      perPage: 50,
	      items: [],
	      offset: 0,
	      showModalToLearn: false,
	      itemsAccess: [],
	      patternSelected: [],
	      token: localStorage.getItem('tokenAdm')
	    };
	}

	loadWords() {
		axios.get(config.get('baseUrlApi')+'/api/v1/real-time?limit='+this.state.perPage+'&offset='+this.state.offset, 
    		{headers: {'Content-Type': 'application/json;charset=UTF-8', 'Authorization' : 'Bearer ' + this.state.token}})
	    .then(res => {
	    	this.setState({
	          items: res.data.data.items,
	          pageCountWords: Math.ceil(res.data.data.total_count / res.data.data.limit),
	        });
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
				            <p>Last messages</p>
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
					                  <th>Type</th>
					                  <th>User Agent</th>
					                </tr>
					              </thead>
					              <tbody>
					                {this.state.items.map((item) => 
					                  <tr key={item._id.$oid}>
					                  	<td>
					                    	{item._client.map((item1) => 
				                    			<span>
						                    		{item1.client_domain}
					                    		</span>
					                    	)}
					                    </td>

					                  	<td>{item._created}</td>
					                    <td>
					                      {/* Here add the onClick for the action "remove it" on the span */}
					                      <a href="#" onClick={(e) => this.handleClickToLearn([item._id.$oid, item._input.message], e)}><span>To Learn</span></a> 
					                      {' '}/{' '} 
					                      <a href="#" onClick={(e) => this.handleClickToBlock([item._id.$oid, item._input.message], e)}><span>To Block</span></a>
					                    </td>
					                    <td>{item._input.message}</td>
					                    {item.type == 'Text' && 
					                    	<td>{item._response}</td>
					                    }

					                    {item.type != 'Text' && 
					                    	<td></td>
					                    }
					                    <td>{item.type}</td>
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
						                  <th>Client</th>
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
						                    <td>{item.client}</td>
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
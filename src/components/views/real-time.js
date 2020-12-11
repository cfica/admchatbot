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
					            
					            {this.state.items.map((item) =>
						            <Alert key={item._id.$oid} variant="info" className="cont-real-time">
						            	{this.state.scope &&
					                    	item._client.map((item1) => 
					                    		<Alert.Heading>{item1.client_domain}</Alert.Heading>
					                    	)
						                }

						                <DropdownButton variant="link" size="sm" as={ButtonGroup} title="Options" id="bg-nested-dropdown">
										    <Dropdown.Item eventKey="1" onClick={(e) => this.handleClickToLearn([item._id.$oid, item._input.message], e)}>To Learn</Dropdown.Item>
										    <Dropdown.Item eventKey="2" onClick={(e) => this.handleClickToBlock([item._id.$oid, item._input.message], e)}>To Lock</Dropdown.Item>
										</DropdownButton>

										  
										  <p>
										    {item._input.message}
										  </p>

										  <p>
										    {item.type == 'Text' && item._response}
										  </p>

										  <hr />


										  

										  <div className="_type">{item.type}</div>
										  <div className="_created">{item._created}</div>
										  <div className="_user_agent">{item._input.info.ip} / {item._input.info.user_agent}</div>
									</Alert>
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
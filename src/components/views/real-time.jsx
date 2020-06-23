import React, { Component } from "react";
import $ from "jquery";
import Mousewheel from "jquery-mousewheel";
import mCustomScrollbar from "malihu-custom-scrollbar-plugin";
import SidebarMenu from './sidebar-menu';
import SidebarAction from './sidebar-action';
import { Alert, Navbar, Nav, Tab, Modal, Badge, Tabs, InputGroup, Collapse, ButtonGroup,ListGroup, Form,NavDropdown,FormControl,Container, Row, Col,Media,Jumbotron, Button, Breadcrumbs, Table} from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import ModalToLearn from './modal-add-pattern';


export default class RealTime extends Component {
	constructor(props) {
	    super(props);
	    this.state = {
	      error: null,
	      perPage: 10,
	      items: [],
	      offset: 0,
	      showModalToLearn: false,
	      patternSelected: []
	    };
	}

	loadWords() {
	    $.ajax({
	      url: 'http://127.0.0.1:8082/api/v1/real-time',
	      data: { limit: this.state.perPage, offset: this.state.offset},
	      dataType: 'json',
	      type: 'GET',
	      success: data => {
	        this.setState({
	          items: data.items,
	          pageCount: Math.ceil(data.total_count / data.limit),
	        });
	      },

	      error: (xhr, status, err) => {
	        //console.error(this.props.url, status, err.toString()); // eslint-disable-line
	        this.setState({
	           error: err
	        });
	      },
	    });
	  }

	componentDidMount(){
	    this.loadWords();
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
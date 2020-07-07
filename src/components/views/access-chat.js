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


export default class AccessChat extends Component {
	constructor(props) {
	    super(props);
	    if(localStorage.getItem('tokenAdm') == ''){
	      browserHistory.push('/login');
	    }

	    this.state = {
	      perPage: 10,
	      itemsAccess: [],
	      offset: 0,
	      token: localStorage.getItem('tokenAdm')
	    };
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

	componentDidMount(){
	    this.loadAccess();
	}


	handlePageClickAccess = data => {
	    let selected = data.selected;
	    let offset = Math.ceil(selected * this.state.perPage);
	    this.setState({ offset: offset }, () => {
	      this.loadAccess();
	    });
	};



  render() {
    return (
        <div className="wrapper">
		    <SidebarMenu/>
		    <div id="content">
	            <SidebarAction/>
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
		                  <th>User Agent</th>
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
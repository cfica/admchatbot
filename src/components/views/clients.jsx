import React, { Component } from "react";
import $ from "jquery";
import Mousewheel from "jquery-mousewheel";
import mCustomScrollbar from "malihu-custom-scrollbar-plugin";
import SidebarMenu from './sidebar-menu';
import SidebarAction from './sidebar-action';
import { Alert, Navbar, Nav, Tab, Modal, Badge, Tabs, InputGroup, Collapse, ButtonGroup,ListGroup, Form,NavDropdown,FormControl,Container, Row, Col,Media,Jumbotron, Button, Breadcrumbs, Table} from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import ModalClient from './components/modal-client';
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
	      token: read_cookie('token')
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
		        <div className="line"></div>
		  		<p>You can generate question patterns that can be asked by chat.</p>
			    <section>
		          <section>
		           
		            <Table id="itemTable" striped bordered hover size="sm">
		              <thead>
		                <tr>
		                  <th>ID</th>
		                  <th>Tag</th>
		                  <th>Category</th>
		                  <th>Word</th>
		                  <th></th>
		                </tr>
		              </thead>
		              <tbody>
		                {this.state.items.map((item) => 
		                  <tr key={item._id.$oid}>
		                    <td>#{item.code}</td>
		                    <td>{item.tag}</td>
		                    <td>{item.category}</td>
		                    <td>{item.word}</td>
		                    <td>
		                      {/* Here add the onClick for the action "remove it" on the span 
		                      <a href="" ><span>Bloquear</span></a> / <a href="" ><span>Aprender</span></a>*/}
		                      Algo
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
		        </section>
	        </div>
	        <div className="overlay"></div>
		</div>
    );
  }
}
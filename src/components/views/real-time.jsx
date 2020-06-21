import React, { Component } from "react";
import $ from "jquery";
import Mousewheel from "jquery-mousewheel";
import mCustomScrollbar from "malihu-custom-scrollbar-plugin";
import SidebarMenu from './sidebar-menu';
import SidebarAction from './sidebar-action';
import { Alert, Navbar, Nav, Modal, Collapse,Form,NavDropdown,FormControl,Container, Row, Col,Media,Jumbotron, Button, Breadcrumbs, Table} from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
//https://github.com/AdeleD/react-paginate/blob/master/demo/js/demo.js

export default class RealTime extends Component {
	/*constructor(props){
	  	super(props);
		this.state = {
		      tableContent: []
		};

	    //this.handleChange = this.handleChange.bind(this);
	    //this.handleClick = this.handleClick.bind(this);
	}*/

	constructor(props) {
	    super(props);
	    this.state = {
	      error: null,
	      isLoaded: false,
	      perPage: 10,
	      items: [],
	      offset: 0
	    };
	}

	loadCommentsFromServer() {
	    $.ajax({
	      url: 'http://127.0.0.1:8082/api/v1/real-time',
	      data: { limit: this.state.perPage, offset: this.state.offset},
	      dataType: 'json',
	      type: 'GET',
	      success: data => {
	        this.setState({
	          isLoaded: true,
	          items: data.items,
	          pageCount: Math.ceil(data.total_count / data.limit),
	        });
	      },

	      error: (xhr, status, err) => {
	        //console.error(this.props.url, status, err.toString()); // eslint-disable-line
	        this.setState({
	           isLoaded: true,
	           err
	        });
	      },
	    });
	  }

	componentDidMount(){
	    this.loadCommentsFromServer();
	}



	handleClick() {
	  // Don't forget to check if the inputs are corrects

	  // Here i generate a random number for the key propriety that react need
	  let randomID = Math.floor(Math.random() * 999999);

	  // recreate a new object and stock the new line in
	  let newTab = this.state.items;
	  newTab.push({
	    key: randomID,
	    title: "SDFSDF",
	    amount: "3433" // Don't forget to get the value of the inputs here
	  });

	  this.setState({
	    items: newTab 
	  });

	  // Clear the content of the inputs

	  // the state has changed, so the tab is updated.
	}

	handleChange(event) {
	    this.setState({
	        [event.target.name]: event.target.value
	    });
	}

	handlePageClick = data => {
	    let selected = data.selected;
	    let offset = Math.ceil(selected * this.state.perPage);
	    this.setState({ offset: offset }, () => {
	      this.loadCommentsFromServer();
	    });
	};

  render() {
  	const { error, isLoaded, items } = this.state;
    return (
        <div className="wrapper">
		    <SidebarMenu/>
		    
		    <div id="content">
	            <SidebarAction/>

	            <h2>Real Time Chat</h2>
	            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
	            
	            <div className="line"></div>
	            
	            <section>
		          {/*<h1>Finances</h1>
		          <form>
		              <label htmlFor="name">Name</label>
		            <input type="text" name="title" onChange={this.handleChange}/>

		              <label htmlFor="amount">Amount</label>
		              <input type="text" name="amount" onChange={this.handleChange}/>

		            <button type="button" id="add" onClick={this.handleClick}>Add item</button>
		          </form>*/}

		          <section>
		            <Table id="itemTable" striped bordered hover size="sm">
		              <thead>
		                <tr>
		                  <th>Input</th>
		                  <th>Response</th>
		                  <th>User Agent</th>
		                </tr>
		              </thead>
		              <tbody>
		                {this.state.items.map((item) => 
		                  <tr key={item._id.$oid}>
		                    <td>{item._input.message}</td>
		                    <td>{item._response}</td>
		                    <td>{item._input.info.ip} / {item._input.info.user_agent}</td>
		                    <td>
		                      {/* Here add the onClick for the action "remove it" on the span */}
		                      <a href="" ><span>Bloquear</span></a> / <a href="" ><span>Aprender</span></a>
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
				          onPageChange={this.handlePageClick}
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
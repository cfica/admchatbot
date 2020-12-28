import React, { Component } from "react";
import axios from 'axios';
import config from 'react-global-configuration';
import * as moment from 'moment';
import {InputsTypeForm,ResponseForm,ResponseTopic,Validation} from './componentsUtils';
import {GetSlide} from './slide';
import {VarStorage} from './varsStorage';
import { Alert, Navbar, Nav, DropdownButton, Dropdown, Tab, Modal, Badge, Tabs, InputGroup, Collapse, ButtonGroup,ListGroup, Form,NavDropdown,FormControl,Container, Row, Col,Media,Jumbotron, Button, Breadcrumbs, Table} from 'react-bootstrap';
import DatePicker from "react-datepicker"; 
import "react-datepicker/dist/react-datepicker.css";
import * as Icon from 'react-bootstrap-icons';
import {Helper} from './helper';
import {Filters} from './filters';
import ReactPaginate from 'react-paginate';

export class ConnectionSSE extends Component{
	constructor(props) {
	    super(props);
	    this.props = props;
	    this.state = {
    	  scope: ['admin'].includes(localStorage.getItem('scope')),
          token: localStorage.getItem('tokenAdm'),
          user_id: localStorage.getItem('_id'),
          client: localStorage.getItem('client'),
	      connectionSSE: null,
	      perPage: 50,
	      items: [],
	      offset: 0,
	      pageCount: 0
	    };
	}

	componentDidMount(){
		this.connectionSSE();
	}

	async setConnectionSSE(value, _where){
		//await this.setState({connectionSSE: value });
		this.props._setConnectionSSE(this.props._this, value);
	}

	setItems = (items) =>{
		this.props._setItems(items);
	}

	setPageCount = (value) =>{
       this.props._setPageCount(value);
	}


	handlePageClick = data => {
	    let selected = data.selected;
	    let offset = Math.ceil(selected * this.state.perPage);
	    this.setState({offset: offset}, () => {
	      this.connectionSSE(true);
          this.connectionSSE(false);
	    });
	};

	connectionSSE = (_close = null, _filters = null) => {
	    if(_close){
	    	  var sse = this.props._getConnectionSSE(this.props._this);
		      if(sse){
		        sse.close();
		        async function updateSSE(_this, sse){
		        	await _this.setConnectionSSE(null, 'close connection state');
		        }
		        updateSSE(this, sse);
		      }
	    }else{
		      var _filters = _filters == null ? '' : _filters;
	          var _strUrl = config.get('baseUrlApi')+this.props._url+'?limit='+this.state.perPage+'&offset='+this.state.offset+'&t-dsi-restful='+this.state.token+_filters;
	          var sse = new Helper().requestSSE(_strUrl);
	          /*###*/
	          async function updateSSE(_this, sse){
	          	await _this.setConnectionSSE(sse, 'open connection state');
	          	
	          	sse.onmessage = function(event){
		            var _res = JSON.parse(event.data);
		            _this.setItems(_res.items);
		            _this.setPageCount(Math.ceil(_res.total_count / _this.state.perPage));
		            //_this.props._setItems(_res.items);


		            /*_this.setState({
			          items: _res.items,
			          pageCountWords: ,
			        });*/
		        };


		        sse.addEventListener('message', function(event) {
		        }, false);

		        sse.onerror = msg => {}
	          }
	          updateSSE(this, sse);
	    }
	}




	render() {
		return (
			<div>
				<Filters _handleSSE={this.connectionSSE}/>
				<div id="react-paginate">
		            <ReactPaginate
			          previousLabel={'Anterior'}
			          nextLabel={'Siguiente'}
			          breakLabel={'...'}
			          breakClassName={'break-me'}
			          pageCount={this.props._getPageCount}
			          marginPagesDisplayed={2}
			          pageRangeDisplayed={5}
			          onPageChange={this.handlePageClick}
			          containerClassName={'pagination'}
			          subContainerClassName={'pages pagination'}
			          activeClassName={'active'}
			        />
		        </div>
			</div>
		);
	}

}
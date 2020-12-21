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
	      offset: 0
	    };
	}

	componentDidMount(){
		this.getRealTimeSSE();
	}

	async setConnectionSSE(value, _where){
		await this.setState({connectionSSE: value });
	}

	setItems = (items) =>{
		this.props._setItems(items);
	}

	setPageCount = (value) =>{
       this.props._setPageCount(value);
	}

	getRealTimeSSE = (_close = null, _filters = null) => {
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
		            _this.setItems(_res.items);
		            _this.setPageCount(Math.ceil(_res.total_count / _res.limit));
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
		return (<Filters _handleSSE={this.getRealTimeSSE}/>);
	}

}
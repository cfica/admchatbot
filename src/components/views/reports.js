import React, { Component } from "react";
import config from 'react-global-configuration';
import $ from "jquery";
import Mousewheel from "jquery-mousewheel";
import mCustomScrollbar from "malihu-custom-scrollbar-plugin";
import SidebarMenu from './components/sidebar-menu';
import SidebarAction from './components/sidebar-action';
import { Alert, Navbar, Nav, DropdownButton, Dropdown, Accordion, Card, Tab, Modal, Badge, Tabs, InputGroup, Collapse, ButtonGroup,ListGroup, Form,NavDropdown,FormControl,Container, Row, Col,Media,Jumbotron, Button, Breadcrumbs, Table} from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import ModalToLearn from './components/modal-add-pattern';
import { browserHistory } from 'react-router';
import * as moment from 'moment';
import {Helper} from './components/helper';
import {Filters} from './components/filters';
import {ConnectionSSE} from './components/connectionSSE';

import DatePicker from "react-datepicker"; 
import "react-datepicker/dist/react-datepicker.css";
import * as Icon from 'react-bootstrap-icons';

import { Chart } from 'react-charts';




export default class Reports extends Component {
	constructor(props) {
	    super(props);
	    if(localStorage.getItem('tokenAdm') == undefined){
	      browserHistory.push('/login');
	    }

	    this.state = {};

	}

	getDataLinear(){
		const data =  [
		      {
		        label: 'Series 1',
		        data: [[0, 1], [1, 2], [2, 4], [3, 2], [4, 7]]
		      },
		      {
		        label: 'Series 2',
		        data: [[0, 3], [1, 1], [2, 5], [3, 6], [4, 4]]
		      }
		    ];

		return data;
	}

	getAxesLinear(){
		const axes =  [
	      { primary: true, type: 'linear', position: 'bottom' },
	      { type: 'linear', position: 'left' }
	    ];

		return axes;
	}

	render() {

		const axes = [
	      { primary: true, type: 'linear', position: 'bottom' },
	      { type: 'linear', position: 'left' }
	    ];

	    const data = [
	      {
	        label: 'Series 1',
	        data: [{ x: 1, y: 10 }, { x: 2, y: 10 }, { x: 3, y: 10 }]
	      },
	      {
	        label: 'Series 2',
	        data: [{ x: 1, y: 10 }, { x: 2, y: 10 }, { x: 3, y: 10 }]
	      },
	      {
	        label: 'Series 3',
	        data: [{ x: 1, y: 10 }, { x: 2, y: 10 }, { x: 3, y: 10 }]
	      }
	    ];

	    const axes2 = [
	      { primary: true, type: 'ordinal', position: 'bottom' },
	      { type: 'linear', position: 'left' ,stacked: false}
	    ];

	    const data2 = [
	      [[1, 10], [2, 10], [3, 10]],
	      [[1, 10], [2, 10], [3, 10]],
	      [[1, 10], [2, 10], [3, 10]]
	    ];

	    const series = ({
	      type: 'bar'
	    });

    	return (
    		<div className="wrapper">
			    <SidebarMenu/>
			    <div id="content">
			        <SidebarAction/>
			        <h1>sdffds</h1>
			        
			        <div
				      style={{
				        width: '400px',
				        height: '300px'
				      }}
				    >
				      <Chart data={this.getDataLinear()} tooltip axes={this.getAxesLinear()} />
				    </div>

				    <div
				      style={{
				        width: '400px',
				        height: '300px'
				      }}
				    >
				      <Chart data={data} axes={axes} tooltip />
				    </div>


				    <div
				      style={{
				        width: '400px',
				        height: '300px'
				      }}
				    >
				      <Chart data={data2} series={series}  tooltip axes={axes2} />
				    </div>

			    	<div className="overlay"></div>
				</div>
			</div>
    	);
	}
}
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



export default class Reports extends Component {
	constructor(props) {
	    super(props);
	    if(localStorage.getItem('tokenAdm') == undefined){
	      browserHistory.push('/login');
	    }

	    this.state = {
	    };
	}

	render() {
    	return (
    		<div className="wrapper">
			    <SidebarMenu/>
			    <div id="content">
			        <SidebarAction/>
			        <h1>sdffds</h1>
			    	<div className="overlay"></div>
				</div>
			</div>
    	);
	}
}
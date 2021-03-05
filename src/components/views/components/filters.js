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

export class Filters extends Component{
	constructor(props) {
	    super(props);
	    this.state = {
	      filter_from: '',
	      filter_to: '',
	      filter_user: '',
	      filter_status: '',
	      filter_domain: '',
	      filters_active: [],
	      validatedFilterForm: false,
	      __filters: this.props._filters
	    };
	}

	_handleFilter = (e) =>{
		e.preventDefault();
		const form = e.currentTarget;
		if (form.checkValidity() === false) {
          e.stopPropagation();
          //console.log('aqui');
          this.setState({validatedFilterForm : true});
        }else{
          this.setState({validatedFilterForm : false});
          //const __filters = this.props._filters;

          var _strFilter = '';
          if(this.state.filter_user !== ""){
          	_strFilter += '&user='+this.state.filter_user;
          	/*#*/
          	var _filters = this.state.filters_active;
          	_filters.push({label: 'User', 'value': this.state.filter_user});
          	this.setState({filters_active: _filters});
          }

          if(this.state.filter_from !== ""){
          	_strFilter += '&from='+moment(this.state.filter_from).format('DD/MM/YYYY');
          	/*#*/
          	var _filters = this.state.filters_active;
          	_filters.push({label: 'From', 'value': moment(this.state.filter_from).format('DD/MM/YYYY')});
          	this.setState({filters_active: _filters});
          }

          if(this.state.filter_status !== ""){
          	_strFilter += '&status='+this.state.filter_status;
          	/*#*/
          	var _filters = this.state.filters_active;
          	_filters.push({label: 'Status', 'value': this.state.filter_status});
          	this.setState({filters_active: _filters});
          }

          if(this.state.filter_to !== ""){
          	_strFilter +=  '&to='+moment(this.state.filter_to).format('DD/MM/YYYY');
          	/*#*/
          	var _filters = this.state.filters_active;
          	_filters.push({label: 'To', 'value': moment(this.state.filter_to).format('DD/MM/YYYY')});
          	this.setState({filters_active: _filters});
          }
          
          if(this.state.filters_active.length > 0) {
          	this.props._handleSSE(true);
          	this.props._handleSSE(false,_strFilter);
          }
        }
	}

	_resetFilter = (e)=>{
		this.setState({filters_active: []});
	}

	_handleResetFilter = (e) =>{
		this.props._handleSSE(true);
        this.props._handleSSE(false);
        this.setState({filters_active: []});
        this.setState({filter_from: ''});
        this.setState({filter_to: ''});
        this.setState({filter_user: ''});
        this.setState({filter_status: ''});
        this.setState({filter_domain: ''});
	}


	render() {
		const _filters = this.props._filters;
		//console.log(_filters);
		return (
			<section className="grup-filters">
            	<Form noValidate validated={this.state.validatedFilterForm} onSubmit={this._handleFilter}>
		            	{/*<InputGroup  size="sm" >
						    <InputGroup.Prepend>
						      <InputGroup.Text id="basic-addon1">User</InputGroup.Text>
						    </InputGroup.Prepend>
						    <FormControl
						      placeholder="Username"
						      aria-label="Username"
						      aria-describedby="basic-addon1"
						      value={this.state.filter_user}
						      onChange={(e) => this.setState({filter_user: e.target.value})}
						    />
						</InputGroup>*/}

						


						{_filters.map((item) =>{
							if(item.name == 'from'){
								return (
										<InputGroup  size="sm" >
								    <InputGroup.Prepend>
								      <InputGroup.Text id="inputGroup-sizing-sm">From</InputGroup.Text>
								    </InputGroup.Prepend>
								    <DatePicker className="form-control"  dateFormat="dd/MM/yyyy" selected={this.state.filter_from} onChange={date => this.setState({filter_from: date})} />
								</InputGroup>
								);
							}

							if(item.name == 'to'){
							   return (
							   		<InputGroup  size="sm" >
									    <InputGroup.Prepend>
									      <InputGroup.Text id="inputGroup-sizing-sm">To</InputGroup.Text>
									    </InputGroup.Prepend>
									    <DatePicker className="form-control"  dateFormat="dd/MM/yyyy" selected={this.state.filter_to} onChange={date => this.setState({filter_to: date})} />
									</InputGroup>
							   );
						    }


						    if(item.name == 'status'){
							    return (
								    <Form.Group controlId="status">
									    <Form.Control size="sm" as="select" onChange={(e) => this.setState({filter_status: e.target.value})}>
									      <option value="">Select..</option>
									      <option value="pending">Pending</option>
									      <option value="open">Open</option>
									      <option value="closed">Closed</option>
									    </Form.Control>
									</Form.Group>
								);
							}


						})}

			            

						
						<div className="action">
							<Button  size="sm" onClick={this._resetFilter} variant="secondary" type="submit">
							    Filter
							</Button>

							{this.state.filters_active.length > 0 &&
								<Button  size="sm" onClick={this._handleResetFilter} variant="warning" type="button">
								    Reset
								</Button>
							}
						</div>
				</Form>

				{this.state.filters_active.length > 0 &&
					<div className="filters_active">
						<ul>
							<li><strong>Filters Active: </strong></li>
							{this.state.filters_active.map((item) => 
								<li>{item.label} = {item.value}</li>
							)}
						</ul>
					</div>
				}
            </section>
		);
	}
}
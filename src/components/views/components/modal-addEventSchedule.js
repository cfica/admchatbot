import React, { Component } from "react";
import {Modal,Button,Table,Badge,ToggleButtonGroup,ListGroup,ToggleButton,Form,Col,InputGroup,FormControl,Row} from 'react-bootstrap';
import * as moment from 'moment';
import {Helper} from './helper';

export default class ModalAddEventSchedule extends Component {
  		constructor(props) {
		    super(props);
		    this.state = {
		      showModal : true,
		      repeatEvent: '',
		      nameEvent: '',
		      hourFrom: '',
	    	  hourTo: '',
	    	  validated: false,
	    	  daySelected: ''
		    };
		}

		handleClose = () => {
			this.setState({showModal: false});
			this.props.hiddenModal();
		}

		componentDidMount(){
			var _start = this.props.dayStart;
			//console.log(_start);
			var start = moment(_start).format('DD/MM/YYYY');
			this.setState({daySelected: start})
		}

		handleSubmitFormAddPattern = (event)=>{
			event.preventDefault();
			event.stopPropagation();
			const form = event.currentTarget;
			if (form.checkValidity() === false) {
				this.setState({validated : true});
			}else{
				this.setState({validated : false});
				this.props.handleConfirm({
					nameEvent: this.state.nameEvent,
					repeatEvent: this.state.repeatEvent,
					hourFrom: this.state.hourFrom,
					hourTo: this.state.hourTo,
					daySelected: this.state.daySelected
				});

				this.setState({showModal: false});
				this.props.hiddenModal();
			}
		}

		changeRepeatEvent = (event) =>{
			this.setState({repeatEvent: event.target.value});
		}

		returnHourFrom = (hour)=>{
			this.setState({hourFrom: hour});
		}

		returnHourTo = (hour)=>{
			this.setState({hourTo: hour});
		}

		handleHourFrom = (event) =>{
			this.setState({hourFrom: event.target.value});
		}

		handleHourTo =(event) =>{
			this.setState({hourTo: event.target.value});
		}

  		render() {
				return (
				  	<div className="modal-confirm">
				  			<Modal show={this.state.showModal} onHide={this.handleClose}>
				  			  <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmitFormAddPattern}>
						        <Modal.Header closeButton>
						          <Modal.Title>Add Event</Modal.Title>
						        </Modal.Header>
						        
						        <Modal.Body>
						        	<Form.Row>
							  			<Col xs={12}>
							  			   Selected date:&nbsp;<strong>{this.state.daySelected}</strong>
							  			   <div className="divide"></div>
							  			</Col>
							  		</Form.Row>

							  		<Form.Row>
							  			<Col xs={12}>
										  

							                {new Helper().getInput(
												'nameEvent',
										        (e) => this.setState({nameEvent: e.target.value}),
										        'Event Name',
										        true,
										        this.state.nameEvent,
										        'Event Name'
											)}

										</Col>
							  		</Form.Row>


							  		<Form.Row>
							  			<Col xs={12} >

							  			    {new Helper().getInputSelect(
	   											'repeatEvent',
										        this.changeRepeatEvent,
										        'Repeat event',
										        true,
										        this.state.repeatEvent,
										        null,
										        [
										         {value: 'Only-chosen-day', label: 'Only chosen day'},
										         {value: 'Everyday', label: 'Everyday'},
										         {value: 'Monday-to-Friday', label: 'Monday to Friday'},
										         {value: 'Monday-to-Saturday', label: 'Monday to Saturday'}
										        ]
	   										)}
									   </Col>
							  		</Form.Row>


							  		<Form.Row>
							  			<Col xs={12} >
							  			   <div className="divide"></div>
									  	   <div className="blockHourTo">
										  	    {new Helper().getInputHour(
										  	   		'hourFrom',
										  	   		this.handleHourFrom,
										  	   		true,
										  	   		this.state.hourFrom
										  	   	)}

										  	   <h3 className="to">to</h3>
										  	   {new Helper().getInputHour(
										  	   		'hourTo',
										  	   		this.handleHourTo,
										  	   		true,
										  	   		this.state.hourTo
										  	   	)}

									  	   </div>
										</Col>
							  		</Form.Row>
						        </Modal.Body>
						        
						        <Modal.Footer>
						          <Button variant="secondary" onClick={this.handleClose}>
						            Close
						          </Button>

						          <Button variant="primary" type="submit">
						            Confirm
						          </Button>
						        </Modal.Footer>
						      </Form>
						    </Modal>
				  	</div>
				);
  		}
}

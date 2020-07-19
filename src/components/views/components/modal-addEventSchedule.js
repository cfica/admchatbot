import React, { Component } from "react";
import {Modal,Button,Table,Badge,ToggleButtonGroup,ListGroup,ToggleButton,Form,Col,InputGroup,FormControl,Row} from 'react-bootstrap';
import {BlockHours} from './componentsUtils';

export default class ModalAddEventSchedule extends Component {
  		constructor(props) {
		    super(props);
		    this.state = {
		      showModal : true,
		      repeatEvent: '',
		      nameEvent: '',
		      hourFrom: '',
	    	  hourTo: '',
		    };
		}

		handleClose = () => {
			this.setState({showModal: false});
			//this.props.hiddenModal();
		}

		handleConfirm = () => {
			this.setState({showModal: false});
			//this.props.handleConfirm();
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

  		render() {
				return (
				  	<div className="modal-confirm">
				  			<Modal show={this.state.showModal} onHide={this.handleClose}>
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
										   <Form.Group  controlId="formAddOption">
											    <FormControl required value={this.state.nameEvent}
											      onChange={(e) => this.setState({nameEvent: e.target.value})} 
											      name="description"  size="sm"
											      placeholder="Add Event"
											      aria-label="Add Event"
											      aria-describedby="basic-addon2"
											    />
											    <Form.Label>Event</Form.Label>
							                 </Form.Group>
										</Col>
							  		</Form.Row>


							  		<Form.Row>
							  			<Col xs={12} >
									   		<Form.Control placeholder="Repeat event" onChange={this.changeRepeatEvent} size="sm" name="value" as="select">
										        <option value="">Repeat event...</option>
										        <option value="Only-chosen-day" selected>Only chosen day</option>
										        <option value="Everyday">Everyday</option>
										        <option value="Monday-to-Friday">Monday to Friday</option>
										        <option value="Monday-to-Saturday">Monday to Saturday</option>
										    </Form.Control>
										    <Form.Label>Repeat event...</Form.Label>
									   </Col>
							  		</Form.Row>


							  		<Form.Row>
							  			<Col xs={12} >
							  			   <div className="divide"></div>
									  	   <div className="blockHourTo">
										  	   <BlockHours returnHour={this.returnHourFrom}/>
										  	   <h3 className="to">to</h3>
										  	   <BlockHours returnHour={this.returnHourTo}/>
									  	   </div>
										</Col>
							  		</Form.Row>
						        </Modal.Body>
						        
						        <Modal.Footer>
						          <Button variant="secondary" onClick={this.handleClose}>
						            Close
						          </Button>
						          <Button variant="primary" onClick={this.handleConfirm}>
						            Confirm
						          </Button>
						        </Modal.Footer>
						    </Modal>
				  	</div>
				);
  		}
}

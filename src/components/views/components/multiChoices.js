import React, { Component } from "react";
import {Modal,Button,ToggleButtonGroup,ListGroup,ToggleButton,Form,Col,InputGroup,FormControl,Row} from 'react-bootstrap';

export default class MultiChoices extends Component {
  		constructor(props) {
		    super(props);
		    this.state = {
		    	optionType : 0,
		    	textAddOption: '',
		    	listOptions: [],
		    	textDescription: ''
		    };
		}

		handleClose = () => {
			this.setState({showModal: false});
			this.props.hiddenModal();
		}

		handleConfirm = () => {
			this.setState({showModal: false});
			this.props.handleConfirm();
		}

		handleChange = (val) => {
			//alert(val);
			this.setState({optionType: val});
			alert(this.state.optionType);
	    };

	    handleOption = (event) =>{
	    	this.setState({optionType: event.target.value});
	    }

	    _handleonAddPattern = (event)=>{    	
	    	if(this.state.textAddOption.length > 3){
	    		const _items = this.state.listOptions;
		    	_items.push(this.state.textAddOption);
		    	this.setState({textAddOption : ''});
				this.setState({listOptions : _items});
				//this.setState({valuePatternHidden : _items});
			}
		}

  		render() {
				return (
					<Row>
					    <Col xs={12}>
								  	<div className="contentMultiChoices">
								  	    <Form.Row>
											<Col xs={12}>
												<Form.Group controlId="formBasicEmail">
												    <Form.Label>Description Text</Form.Label>
												    <Form.Control type="text" value={this.state.textDescription} onChange={this.addOption = (event)=>{this.setState({textDescription: event.target.value});}} placeholder="Enter Description" />
												    <Form.Text className="text-muted">
												    	We'll never share your email with anyone else.
												    </Form.Text>
												</Form.Group>
										    </Col>
										</Form.Row>

								  	    <Form.Row>
											<Col xs={12}>
												<Form.Group  controlId="formBasic">
								                    <Form.Label >Add Option</Form.Label>
													<InputGroup className="mb-3">
													    <FormControl value={this.state.textAddOption} onChange={this.addOption = (event)=>{this.setState({textAddOption: event.target.value});}} size="sm"
													      placeholder="Add Option"
													      aria-label="Add Option"
													      aria-describedby="basic-addon2"
													    />
													    <InputGroup.Append>
													      <Button size="sm" onClick={this._handleonAddPattern} variant="outline-secondary">Add</Button>
													    </InputGroup.Append>
													</InputGroup>
								                    <Form.Text className="text-muted">
								                      Possible questions that the user will ask through the chat.
								                    </Form.Text>
								                 </Form.Group>
										    </Col>
										</Form.Row>

										{this.state.listOptions.map(item => (
								             <Form.Check 
										        type="checkbox"
										        className="checkOption"
										        label={item}
										    />
								        ))}
								  	</div>

					    </Col>
					</Row>
				);
  		}
}

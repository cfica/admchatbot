import React, { Component } from "react";
import {Modal,Button,ToggleButtonGroup,ToggleButton,Form,Col,InputGroup,FormControl,Row} from 'react-bootstrap';

export default class SingleOptions extends Component {
  		constructor(props) {
		    super(props);
		    this.state = {
		    	optionType : 0,
		    	textAddOption: '',
		    	listOptions: []
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

  		render() {
				return (
				  	<div className="contentSingleOptions">
				  	    <Form.Row>
							<Col xs={4}>
								<Form.Group  controlId="formBasic">
				                    <Form.Label >Add Option</Form.Label>
									<InputGroup className="mb-3">
									    <FormControl value={this.state.textAddOption} onChange={this.addOption = (event)=>{this.setState({textAddOption: event.target.value});}} size="sm"
									      placeholder="Add Option"
									      aria-label="Add Option"
									      aria-describedby="basic-addon2"
									    />
									    <InputGroup.Append>
									      <Button size="sm" onClick="" variant="outline-secondary">Add</Button>
									    </InputGroup.Append>
									</InputGroup>
				                    <Form.Text className="text-muted">
				                      Possible questions that the user will ask through the chat.
				                    </Form.Text>
				                 </Form.Group>
						    </Col>

							{this.state.optionType == 1 &&
								<div></div>
							}

							{this.state.optionType == 2 &&
								<div className="option-2">option2</div>
							}
						</Form.Row>

						{this.state.optionType == 1 &&
							<div className="contentYesNo">
							        <Row>
									    <Col xs={12}><p>Te gusta la cerveza?</p></Col>
									</Row>

									<Row>
									    <Col xs={4}>
									    	<Row>
									          <Col xs={12}>
									        	   <div className="dispFlex">
									        	   	    YES{' '}|{' '}
									        			<Form.Group className="selActionOptionSingle" controlId="exampleForm.ControlSelect1">
														    <Form.Control size="sm" as="select">
														      <option value="">Action</option>
														      <option>Add Form</option>
														      <option>Add Text Response</option>
														      <option>Add Dataset</option>
														    </Form.Control>
														</Form.Group>
									        	   </div>
									          </Col>
									        </Row>
									    </Col>

									    <Col xs={4}>
									        <Row>
									          <Col xs={12}>
									        			NOT | +
									          </Col>
									        </Row>
									    </Col>
									</Row>
							</div>
						}

				  	</div>
				);
  		}
}

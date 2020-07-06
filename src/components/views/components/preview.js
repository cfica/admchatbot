import React, { Component } from "react";
import {Modal,Button,ToggleButtonGroup,ListGroup,ToggleButton,Form,Col,InputGroup,FormControl,Row} from 'react-bootstrap';

export default class Preview extends Component {
  		constructor(props) {
		    super(props);
		    this.state = {};
		}

  		render() {
				return (
					<Row>
						<Col xs={12}>
						    	<h5>Preview</h5>
						  		<div className="contPreview">
								  		<div className="contChat">
											<div className="contentResponse">
											    <div className="contentMessageClient">
													<div>
														<div className="contentUser"><h5>You</h5></div>
														<div className="contentMsg"><span>Hello, I need information about ...</span></div>
													</div>
												</div>
												<div className="contentMessageChat">
													<div>
														<div className="contentUser"><h5>Belisa</h5></div>
														<div className="contentMsg">
														    <span>{this.props.textDescription}</span>
														    {this.props.listOptions.map(item => (
													             <Form.Check 
															        type="checkbox"
															        className="checkOption"
															        label={item}
															    />
													        ))}
														    <div className="additionalInfo" dangerouslySetInnerHTML={{__html: this.props.valueCode}}></div>
														</div>
													</div>
												</div>
											</div>
										</div>
						  		</div>
						</Col>
					</Row>
				);
  		}
}

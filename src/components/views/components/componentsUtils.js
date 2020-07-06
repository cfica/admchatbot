import React, { Component } from "react";
import {Modal,Button,ToggleButtonGroup,ListGroup,ToggleButton,Form,Col,InputGroup,FormControl,Row} from 'react-bootstrap';

export class InputsTypeForm extends Component {
  		constructor(props) {
		    super(props);
		    this.state = {
		    	listItemsMultiChoice: [],
		    	valueItemMultiChoice: ''
		    };
		}

		deleteInput(i){
			this.props.inputDelete(i);
		}

		handleInputChange(e, index) {
			this.props.inputChange(e, index);
		}

		addItemMultiChoice(value,index){
			const items = this.props.inputList[index].items;
			items.push(value);
			this.props.addItemToList(items, index);
		}


  		render() {
				return (
					<div className="contentInputsResponseForm">
					    {this.props.inputList.map((x, i) => {
					    	if(x.type == 'Text'){
								return (
									<div key={i}>
										<Form.Row>
											<Col xs={12}><Form.Label >Input Text</Form.Label></Col>
										</Form.Row>
										<Form.Row key={i} className="inputText">
											<Col xs={5}>
											    	<Form.Group controlId="formBasicText">
													    <Form.Control size="sm" name="label" type="text" value={x.label} onChange={e => this.handleInputChange(e, i)}  placeholder="Enter Label" />
													</Form.Group>
											</Col>
											<Col xs={6}>
										    	<Form.Control size="sm" name="validation" as="select" onChange={e => this.handleInputChange(e, i)}>
											        <option value="">Choose Validation...</option>
											        <option value="RUT">RUT</option>
											        <option value="String">String</option>
											        <option value="Email">Email</option>
											        <option value="Telephone">Telephone</option>
											        <option value="Number">Number</option>
											    </Form.Control>
											</Col>
											<Col xs={1}>
										    	<Button size="sm" onClick={() => this.deleteInput(i)} variant="secondary">X</Button>
											</Col>
										</Form.Row>
									</div>
								);
							}else if(x.type == 'TextArea'){
								return (
									<div key={i}>
										<Form.Row>
											<Col xs={12}><Form.Label >TextArea</Form.Label></Col>
										</Form.Row>
										<Form.Row key={i} className="inputTextArea">
											<Col xs={11}>
											    	<Form.Group controlId="formBasicTextArea">
													    <Form.Control size="sm" type="text" name="label" value={x.label}  onChange={e => this.handleInputChange(e, i)} placeholder="Enter Label" />
													</Form.Group>
											</Col>
											<Col xs={1}>
										    	<Button size="sm" onClick={(event) => this.deleteInput(i)}  variant="secondary">X</Button>
											</Col>
										</Form.Row>
									</div>
								);
							}else if(x.type == 'Multi-Choices' || x.type == 'Single-Option-Choice'){
								return (
									<div key={i}>
									    <Form.Row>
											<Col xs={12}><Form.Label >{x.type.replace('-',' ')}</Form.Label></Col>
										</Form.Row>
										<Form.Row className="inputMultiChoise">
									        <Col xs={11}>
									                <Form.Group  controlId="formAddOption">
														<InputGroup className="mb-3">
														    <FormControl value={x.label} name="label" onChange={(e)=>{ this.handleInputChange(e, i); this.setState({valueItemMultiChoice: e.target.value});}} size="sm"
														      placeholder="Add Option"
														      aria-label="Add Option"
														      aria-describedby="basic-addon2"
														    />
														    <InputGroup.Append>
														      <Button size="sm" onClick={() => {this.addItemMultiChoice(x.label, i); x.label = '';}} variant="outline-secondary">Add</Button>
														    </InputGroup.Append>
														</InputGroup>
									                 </Form.Group>
									        </Col>

									        <Col xs={1}>
										    	<Button size="sm" onClick={() => this.deleteInput(i)}  variant="secondary">X</Button>
											</Col>
									    </Form.Row>

									    <Form.Row className="inputMultiChoiseItems">
									        <Col xs={12} className="items">
									            <div>
									            	{this.props.inputList[i].items.map((x, i1) => {
										            	return (
										            		<p key={i1}>{x}</p>
										            	);
										            })} 
									            </div> 
									        </Col>
									    </Form.Row>
									</div>
								);
							}
						})}
				    </div>
				);
  		}
}

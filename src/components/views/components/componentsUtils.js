import React, { Component } from "react";
import {Modal,Button,ToggleButtonGroup,ListGroup,ToggleButton,Form,Col,InputGroup,FormControl,Row} from 'react-bootstrap';

export class ResponseForm extends Component {
	constructor(props) {
	    super(props);
	    this.state = {};
	}

	render() {
		return (
			<Form noValidate validated="" onSubmit="">
		    	<span>{this.props.messageData.textDescription}</span>
		    	<div className="contentForm">
		    		{this.props.messageData.inputs.map((x, i) => {
		    			if(x.type == 'Text'){
		    				return(
		    					<Form.Row key={i} className="inputText">
									<Col xs={12}>
									    	<Form.Group controlId="formBasicText">
											    <Form.Control size="sm" required name="label" type="text" value="" onChange=""  placeholder={x.label}  />
											    <Form.Label >{x.label}</Form.Label>
											</Form.Group>
									</Col>
								</Form.Row>
		    				);
		    			}else if(x.type == 'Multi-Choices'){
		    				return (
		    					<Form.Row key={i} className="Multi-Choices">
									<Col xs={12}>
									    {/*<div class="customCheckbox">
											<ul class="ks-cboxtags">*/}
												    {x.items.map((x1, i1) => {
												    	{/*return (
												    		<label className="containerCheckbox">{x1}
															  <input type="checkbox"/>
															  <span className="checkmark"></span>
															</label>
												    	);*/}

												    	{/*return (
															<li key={i1}><input type="checkbox" id={"checkbox"+ i+i1} value={x1}/><label for={"checkbox"+i +i1}>{x1}</label></li>
												    	);*/}

												    	return (
												    		  <div class="inputGroup">
															    <input id={"checkbox"+ i+i1} name={"option"+ i+i1} type="checkbox"/>
															    <label className="inputCheckbox" for={"checkbox"+ i+i1}>{x1}</label>
															  </div>
												    	);
												    	
												    })}
									    	{/*</ul>
										</div>*/}
									</Col>
								</Form.Row>
		    				);
		    			}else if(x.type == 'Single-Option-Choice'){
		    					return (
			    					<Form.Row key={i} className="Single-Option-Choice">
										<Col xs={12}>
										    {x.items.map((x1, i1) => {
										    	{/*return (
										    		<label class="containerRadio">{x1}
													  <input type="radio" checked="checked" name="radio"/>
													  <span class="checkmark"></span>
													</label>
										    	);*/}

										    	return (
										    		  <div class="inputGroup">
													    <input id={"radio"+ i+i1} name="radio" type="radio"/>
													    <label className="inputRadio" for={"radio"+ i+i1}>{x1}</label>
													  </div>
										    	);

										    })}
										</Col>
									</Form.Row>
			    				);
		    			}else if(x.type == 'TextArea'){	
		    				return (
		    					<Form.Row key={i} className="Single-Option-Choice">
									<Col xs={12}>
									    	<Form.Group controlId="formBasicText">
											    <Form.Control size="sm" as="textarea" rows="3" placeholder={x.label} />
											    <Form.Label >{x.label}</Form.Label>
											</Form.Group>
									</Col>
								</Form.Row>
		    				);
		    			}
		    		})}
		    	</div>
		    </Form>
		);
	}
}

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

import React, { Component } from "react";
import {Modal,Button,ToggleButtonGroup,ListGroup,ToggleButton,Form,Col,InputGroup,FormControl,Row} from 'react-bootstrap';
import Cookies from 'universal-cookie';
import axios from 'axios';
import config from 'react-global-configuration';

export class ResponseForm extends Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    	validated: false,
	    	errorSaveForm: '',
	    	showForm: true
	    };
	}

	handleSubmitForm = (event) =>{
		event.preventDefault();
		const form = event.currentTarget;
		if (form.checkValidity() === false) {
		      event.stopPropagation();
		      this.setState({errorSaveForm : ''});
		      this.setState({validated : true});
		}else{
			this.setState({validated : false});
			//var _dataPost = {"message" : this.state.inputMessage};
			console.log(this.props.messageData);
			console.log(this.props.index);
			this.setState({showForm: false});
            /*const cookies = new Cookies();
            axios.post(config.get('baseUrlApi')+'/api/v1/message-save-form',JSON.stringify(_dataPost), 
              {headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization' : 'Bearer ' + cookies.get('token'),
                'x-dsi-restful' : cookies.get('key_temp')
              }}
            ).then(res => {
              //this.setMessage('_res', res.data.data);
              form.reset();
            }).catch(function (error) {}).then(function () {});*/

		}
	}

	handleInputChange(e, index) {
		this.props.inputChange(e, index, this.props.index);
	}

	handleInputChangeOptions(e, indexItems, index, items, type){
		const item = items[index];
		//console.log(e.target.value);
		this.props.inputChangeOptions(e.target.value, item, indexItems, index, this.props.index,type);
	}

	render() {
		if(this.state.showForm){		
			return (
				<Form noValidate validated={this.state.validated} onSubmit={this.handleSubmitForm}>
			    	<span>{this.props.messageData.textDescription}</span>
			    	<div className="contentForm">
			    		{this.props.messageData.inputs.map((x, i) => {
			    			if(x.type == 'Text'){
			    				return(
			    					<Form.Row key={i} className="inputText">
										<Col xs={12}>
										    	<Form.Group controlId="formBasicText">
												    <Form.Control size="sm" required name="label" type="text" value={x.value} onChange={e => this.handleInputChange(e, i)}  placeholder={x.label}  />
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
																    <input id={"checkbox"+ i+i1} value={x1.value} checked={x1.value} onChange={e => this.handleInputChangeOptions(e, i1,i, x.items,'checkbox')} name={"option"+ i+i1} type="checkbox"/>
																    <label className="inputCheckbox" for={"checkbox"+ i+i1}>{x1.label}</label>
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
														    <input id={"radio"+ i+i1} value={x1.label} onChange={e => this.handleInputChangeOptions(e, i1, i, x.items, 'radio')} name="radio" type="radio"/>
														    <label className="inputRadio" for={"radio"+ i+i1}>{x1.label}</label>
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
												    <Form.Control required size="sm" value={x.value} onChange={e => this.handleInputChange(e, i)} as="textarea" rows="2" placeholder={x.label} />
												    <Form.Label >{x.label}</Form.Label>
												</Form.Group>
										</Col>
									</Form.Row>
			    				);
			    			}
			    		})}

			    		<div className="contentFormButton">
				    		<Button size="sm" variant="outline-primary" type="submit">Save</Button>
				    	</div>
			    	</div>
			    </Form>
			);
		}else{
			return(
				<span>Gracias, usted ya ha enviado un formulari..</span>
			);
		}
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
			items.push({label: value, value: false});
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
										            		<p key={i1}>{x.label}</p>
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

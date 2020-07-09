import React, { Component } from "react";
import {Modal,Button,ToggleButtonGroup,ListGroup,ToggleButton,Form,Col,InputGroup,FormControl,Row} from 'react-bootstrap';
import axios from 'axios';
import config from 'react-global-configuration';

export class Validation extends Component{
	constructor(props) {
	    super(props);
	    this.state = {};
	}

	rut(value){
		var Fn = {
	        // Valida el rut con su cadena completa "XXXXXXXX-X"
	        validaRut: function(rutCompleto) {
	            if (rutCompleto.length >= 9 && rutCompleto.length <= 10) {
	                if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rutCompleto))
	                    return false;
	                var tmp = rutCompleto.split('-');
	                var digv = tmp[1];
	                var rut = tmp[0];
	                if (digv == 'K') digv = 'k';
	                return (Fn.dv(rut) == digv);
	            } else {
	                return false
	            }
	        },
	        dv: function(T) {
	            var M = 0,
	                S = 1;
	            for (; T; T = Math.floor(T / 10))
	                S = (S + T % 10 * (9 - M++ % 6)) % 11;
	            return S ? S - 1 : 'k';
	        }
	    }
	    return Fn.validaRut(value) ? true : false;
	}

    telephoneCL(value) {
        //if (value.length) {
        return (/^((\+56)[0-9]{9})+$/).test(value);
        //}
        //return true;
    }

    telephoneCLv2(value) {
        //if (value.length) {
        return (/^([0-9]{9})+$/).test(value);
        //}
        //return true;
    }

    text2(value){
        if (value.length) {
            return (/^[A-Za-zñÑáéíóúÚÁÉÍÓÚ#\-0-9\s]+$/).test(value);
        }
        return true;
    }

    text(value){
        return (/^[ \w]{3,}([A-Za-z]\.)?([ \w]*\#\d+)?(\r\n| )[ \w]{3,}/).test(value);
        //$.mage.__('Please use only letters (a-z or A-Z), numbers (0-9), spaces and "#" in this field.')
    }

    numbers(value){
    	return (/^[0-9]*$/).test(value);
    }

    email(value){
    	//return /^((([a-z]|\d|[!#\$%&\u0027\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&\u0027\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\u0022)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\u0022)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)*(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(value); //eslint-disable-line max-len
        return /^([a-z0-9,!\#\$%&'\*\+\/=\?\^_`\{\|\}~-]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z0-9,!\#\$%&'\*\+\/=\?\^_`\{\|\}~-]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*@([a-z0-9-]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z0-9-]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*\.(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]){2,})$/i.test(value); //eslint-disable-line max-len
    }

    _validation(value, type){
		//console.log(this.props.messageData.inputs);
		if(value.length == 0 || type == ""){
			return {error: false, _class: 'form-control'};
		}

		if(type == 'RUT'){
			if(!this.rut(value)){
				return {error: true, _class: 'form-control is-invalid'};
			}else{
				return {error: false, _class: 'form-control is-valid'};
			}
		}

		if(type == 'String'){
			if(!this.text2(value)){
				return {error: true, _class: 'form-control is-invalid'};
			}else{
				return {error: false, _class: 'form-control is-valid'};
			}
		}

		if(type == 'Email'){
			if(!this.email(value)){
				return {error: true, _class: 'form-control is-invalid'};
			}else{
				return {error: false, _class: 'form-control is-valid'};
			}
		}

		if(type == 'Telephone'){
			if(!this.telephoneCLv2(value)){
				return {error: true, _class: 'form-control is-invalid'};
			}else{
				return {error: false, _class: 'form-control is-valid'};
			}
		}

		if(type == 'Number'){
			if(!this.numbers(value)){
				return {error: true, _class: 'form-control is-invalid'};
			}else{
				return {error: false, _class: 'form-control is-valid'};
			}
		}
	}
}

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
			var _dataPost = {"form" : this.props.messageData};
            axios.post(config.get('baseUrlApi')+'/api/v1/message-save-form',JSON.stringify(_dataPost), 
              {headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization' : 'Bearer ' + localStorage.getItem('token'),
                'x-dsi-restful' : localStorage.getItem('key_temp')
              }}
            ).then(res => {
              //this.setMessage('_res', res.data.data);
              this.props.setMessage('_res',{response: 'Acción guardada correctamente!', type: 'Text'});
              this.setState({showForm: false});
              form.reset();
            }).catch(function (error) {}).then(function () {});
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
		return (
			<Form noValidate validated={this.state.validated} onSubmit={this.handleSubmitForm}>
		    	<span>{this.props.messageData.textDescription}</span>
		    	<div className="contentForm">
		    		{this.props.messageData.inputs.map((x, i) => {
		    			if(x.type == 'Text'){
		    				return(
		    					<Form.Row key={"inputText"+i} className="inputText">
									<Col key={i} xs={12}>
									    	<Form.Group controlId="formBasicText">
											    <Form.Control  className={x.classValidation ? x.classValidation : "form-control"} placeholder={x.label} size="sm" required name="label" type="text" value={x.value} onChange={e => this.handleInputChange(e, i)}/>
											    <Form.Label >{x.label}</Form.Label>
											</Form.Group>
									</Col>
								</Form.Row>
		    				);
		    			}else if(x.type == 'Multi-Choices'){
		    				return (
		    					<Form.Row key={i} className="Multi-Choices">
									<Col key={i} xs={12}>
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
												    		  <div key={i1} className="inputGroup">
															    <Form.Control id={"checkbox"+ i+i1} value={x1.value} checked={x1.value} onChange={e => this.handleInputChangeOptions(e, i1,i, x.items,'checkbox')} name={"option"+ i+i1} type="checkbox"/>
															    <label className="inputCheckbox" htmlFor={"checkbox"+ i+i1}>{x1.label}</label>
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
			    					<Form.Row key={"Single-Option-Choice"+i} className="Single-Option-Choice">
										<Col key={i} xs={12}>
										    {x.items.map((x1, i1) => {
										    	{/*return (
										    		<label class="containerRadio">{x1}
													  <input type="radio" checked="checked" name="radio"/>
													  <span class="checkmark"></span>
													</label>
										    	);*/}

										    	return (
										    		  <div key={i1} className="inputGroup">
													    <Form.Control id={"radio"+ i+i1} value={x1.label} onChange={e => this.handleInputChangeOptions(e, i1, i, x.items, 'radio')} name="radio" type="radio"/>
													    <label className="inputRadio" htmlFor={"radio"+ i+i1}>{x1.label}</label>
													  </div>
										    	);

										    })}
										</Col>
									</Form.Row>
			    				);
		    			}else if(x.type == 'TextArea'){	
		    				return (
		    					<Form.Row key={i} className="Single-Option-Choice">
									<Col key={i} xs={12}>
									    	<Form.Group controlId="formBasicText">
											    <Form.Control required size="sm" placeholder={x.label} value={x.value} onChange={e => this.handleInputChange(e, i)} as="textarea" rows="2"/>
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
											<Col xs={12}><strong >Input Text</strong></Col>
										</Form.Row>
										<Form.Row key={i} className="inputText">
											<Col xs={4}>
											    	<Form.Group controlId="formBasicText">
													    <Form.Control size="sm" name="label" type="text" value={x.label} onChange={e => this.handleInputChange(e, i)}  placeholder="Enter Label" />
													    <Form.Label>Enter Label</Form.Label>
													</Form.Group>
											</Col>
											<Col xs={4}>
										    	<Form.Control placeholder="Choose Validation" size="sm" name="validation" as="select" onChange={e => this.handleInputChange(e, i)}>
											        <option value="">Choose Validation...</option>
											        <option value="RUT">RUT</option>
											        <option value="String">String</option>
											        <option value="Email">Email</option>
											        <option value="Telephone">Telephone</option>
											        <option value="Number">Number</option>
											    </Form.Control>
											    <Form.Label>Choose Validation</Form.Label>
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
											<Col xs={12}><strong>TextArea</strong></Col>
										</Form.Row>
										<Form.Row key={i} className="inputTextArea">
											<Col xs={4}>
											    	<Form.Group controlId="formBasicTextArea">
													    <Form.Control size="sm" type="text" name="label" value={x.label}  onChange={e => this.handleInputChange(e, i)} placeholder="Enter Label" />
													    <Form.Label>Enter Label</Form.Label>
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
											<Col xs={12}><strong>{x.type.replace('-',' ')}</strong></Col>
										</Form.Row>
										<Form.Row className="inputMultiChoise">
									        <Col xs={4}>
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
									        <Col xs={4} className="items">
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

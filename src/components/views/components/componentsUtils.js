import React, { Component } from "react";
import {Modal,Button,Table,Badge,ToggleButtonGroup,ListGroup,ToggleButton,Form,Col,InputGroup,FormControl,Row} from 'react-bootstrap';
import axios from 'axios';
import config from 'react-global-configuration';
//import Calendar from 'react-calendar';
//import 'react-calendar/dist/Calendar.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import * as moment from 'moment';
import ModalToConfirm from './confirm';
import ModalAddEventSchedule from './modal-addEventSchedule';

export class Status extends Component{
	constructor(props) {
	    super(props);
	    this.state = {};
	}

	render(){
       if(this.props.status == 'Active'){
       		return (<h5><Badge variant="success">Active</Badge></h5>);
       }else if(this.props.status == 'Inactive'){
       		return (<h5><Badge variant="secondary">Inactive</Badge></h5>);
       }else{
       	   return (<h5><Badge variant="secondary">Inactive</Badge></h5>);
       }
	}
}

export class BlockHours extends Component{
	constructor(props) {
	    super(props);
	    this.state = {
	    	hour: '06',
	    	min: '00'
	    };
	}

	selectHour = (event) =>{
		this.setState({hour: event.target.value});
		this.props.returnHour(event.target.value+':'+this.state.min);
	}

	selectMin = (event) =>{
		this.setState({min: event.target.value});
		this.props.returnHour(this.state.hour+':'+event.target.value);
	}

	render(){
       return(
       	  <div className="hoursBlock">
       	    <Form.Group controlId="formHour">
	       	  	<Form.Control required placeholder="Choose Hour" onChange={this.selectHour} size="sm" name="hour" as="select">
			        <option value="">--</option>
			        <option value="06">06</option>
			        <option value="07">07</option>
			        <option value="08">08</option>
			        <option value="09">09</option>
			        <option value="10">10</option>
			        <option value="11">11</option>
			        <option value="12">12</option>
			        <option value="13">13</option>
			        <option value="14">14</option>
			        <option value="15">15</option>
			        <option value="16">16</option>
			        <option value="17">17</option>
			        <option value="18">18</option>
			        <option value="19">19</option>
			        <option value="20">20</option>
			        <option value="21">21</option>
			        <option value="22">22</option>
			        <option value="23">23</option>
			    </Form.Control>
			     <Form.Label>H</Form.Label>
			</Form.Group>
			    <h2>:</h2>
			<Form.Group controlId="formMin">
			    <Form.Control required placeholder="Choose Min" onChange={this.selectMin} size="sm" name="min" as="select">
			        <option value="">--</option>
			        <option value="00" selected>00</option>
			        <option value="15">15</option>
			        <option value="30">30</option>
			        <option value="45">45</option>
			    </Form.Control>
			    <Form.Label>M</Form.Label>
		    </Form.Group>
       	  </div>
       );
	}
}


export class CalendarSchedule extends Component{
	constructor(props) {
	    super(props);
	    this.state = {
	    	localizer: momentLocalizer(moment),
	    	confirmDelEvent: false,
	    	eventId: '',
	    	modalAddEvent: false,
	    	events: [],
	    	dayStart: '',
	    	dayEnd: ''
	    };
	}

	/*onChange = date => {
		//this.setState({ dateSelected: moment(date).format('L')});
		//console.log(this.state.date);
	}

	onClickDay = (value, event)=>{
		const _date = moment(value).format('DD/MM/YYYY');
		this.props.onClick(_date);
	}*/

	onClickDay2 = (value)=>{
		//const _date = moment(value).format('DD/MM/YYYY');
		//this.props.onClick(_date);
		//console.log(value);
		const _date = moment(value).format('DD/MM/YYYY');
		//this.props.onClick(_date);
	}


	handleSelect = ({ start, end }) => {
	    //console.log(start);
	    //console.log(end);
	    this.setState({dayStart: start});
	    this.setState({dayEnd: end});
	    this.setState({modalAddEvent: true});
	}

	addEvent = (data)=>{
		//var _data = this.state;
		//console.log(data);
		var _events = this.state.events;
		if(data.repeatEvent == 'Only-chosen-day'){
			moment.defaultFormat = "DD/MM/YYYY HH:mm";
	  		var _d1 = moment(data.daySelected+' '+data.hourFrom, moment.defaultFormat).toDate();
	  		var _d2 = moment(data.daySelected+' '+data.hourTo, moment.defaultFormat).toDate();
			var _item = {
				start: _d1,
				end:_d2,
				title: data.nameEvent,
				date: data.daySelected,
				hours: data.hourFrom+' to '+data.hourTo,
				_schedule: {day: data.daySelected, hours: {from: data.hourFrom, to: data.hourTo}},
				event: data.nameEvent,
				status: ''
			};
			
			_events = this.addEventItem(_events, _item);

	    }else if(data.repeatEvent == 'Everyday'){
	    	_events = this.addEvents(_events, data);

	    }else if(data.repeatEvent == 'Monday-to-Friday'){
	    	_events = this.addEvents(_events,data, 'Monday-to-Friday');

	    }else if(data.repeatEvent == 'Monday-to-Saturday'){
	    	_events = this.addEvents(_events,data, 'Monday-to-Saturday');

		}
		this.setState({events: _events});
		this.setState({confirmDelEvent: false});
	}
	hiddenModalAddEvent = () => this.setState({modalAddEvent: false});

	addEvents(_events, data,cicle = null){
		moment.defaultFormat = "DD/MM/YYYY";
    	var start = moment(data.daySelected, moment.defaultFormat).toDate();
    	var end = moment(start, moment.defaultFormat).add(3, 'M').toDate();
    	//###
    	var _start = moment(start, moment.defaultFormat).subtract(1, 'days').toDate();
    	var loop = new Date(_start);
		while(loop <= end){        
		    var newDate = loop.setDate(loop.getDate() + 1);
		    loop = new Date(newDate);
		    var _loop = moment(loop).format('DD/MM/YYYY');
		    var _day = moment(loop).format('dddd');
		    
		    moment.defaultFormat = "DD/MM/YYYY HH:mm";
	  		var _d1 = moment(_loop+' '+data.hourFrom, moment.defaultFormat).toDate();
	  		var _d2 = moment(_loop+' '+data.hourTo, moment.defaultFormat).toDate();

		    var _item = {
		    	start: _d1,
				end: _d2,
				title: data.nameEvent,
				date: _loop,
				hours: data.hourFrom+' to '+data.hourTo,
				_schedule: {day: _loop, hours: {from: data.hourFrom, to: data.hourTo}},
				event: data.nameEvent,
				status: ''
			};

		    if(cicle != null){
		    	if(cicle == 'Monday-to-Friday'){
		    		if(_day != 'Saturday' && _day != 'Sunday'){
		        		_events = this.addEventItem(_events, _item);
		        	}
		        }else if(cicle == 'Monday-to-Saturday'){
		        	if(_day != 'Sunday'){
		        		_events = this.addEventItem(_events, _item);
		        	}
		    	}
		    }else{
		      _events = this.addEventItem(_events, _item);
		    }
		}
		return _events;
	}

	addEventItem(arr, item) {
	  var _count = 0;
	  var shedule = item._schedule;
	  var day = shedule.day; var _from = shedule.hours.from.split(':'); var _to = shedule.hours.to.split(':');
	  moment.defaultFormat = "DD/MM/YYYY HH:mm";
	  var d1 = moment(day+' '+shedule.hours.from, moment.defaultFormat).toDate();
	  var d2 = moment(day+' '+shedule.hours.to, moment.defaultFormat).toDate();
	  if(_from[0] == _to[0] || _to[0] < _from[0]){
	  	//console.log('error');
	  	_count++;
	  }

	  //##
	  var _res = arr.forEach(function(el){
	  	var shedule1 = el._schedule;
	  	var day1 = shedule1.day;
	 	var _from1 = shedule1.hours.from.split(':');
	  	var _to1 = shedule1.hours.to.split(':');
	  	moment.defaultFormat = "DD/MM/YYYY HH:mm";
	  	//####
	  	var d3 = moment(day1+' '+shedule1.hours.from, moment.defaultFormat).toDate();
	    var d4 = moment(day1+' '+shedule1.hours.to, moment.defaultFormat).toDate();
	    //####
	    //console.log(_from[0]+' - '+_from1[0]+' - '+day+' - '+day1);
	    if(_from[0] == _from1[0] && day == day1){
	    	//console.log('err2');
	    	_count++;
	    }
	  });
	  if (_count == 0) arr.push(item);
	  return arr;
	}

	handleModalConfirmDelete = ()=>{
		this.setState({confirmDelEvent: false});
		var _events = this.state.events;
		const idx = _events.indexOf(this.state.eventId)
		_events.splice(idx, 1);
		this.setState({events: _events});
	}
	onSelectEvent(pEvent) {
	   this.setState({confirmDelEvent: true});
	   this.setState({eventId: pEvent});
	}
	hiddenModalConfirmDelete = () => this.setState({confirmDelEvent: false});
	
	render(){
        return (
	        <div>
	        	<Calendar
		          popup={false}
		          /*onShowMore={(events, date) => this.setState({ showModal: true, events })}*/
		          selectable
		          localizer={this.state.localizer}
		          events={this.state.events}
		          defaultView='month'
		          defaultDate={new Date()}
		          style={{ height: 500 }}
		          /*views={{month: true}}*/
		          onSelectEvent={event => this.onSelectEvent(event)}
		          onDrillDown={this.onClickDay2}
		          onSelectSlot={this.handleSelect}
		        />

		        {this.state.modalAddEvent && 
		        	<ModalAddEventSchedule
		        	    hiddenModal = {this.hiddenModalAddEvent}
		        	    handleConfirm={this.addEvent}
		        		events={this.state.events}
		        		dayStart={this.state.dayStart}
		        		dayEnd={this.state.dayEnd}
		        	/>
		        }

		        {this.state.confirmDelEvent && 
	            	<ModalToConfirm
		        	 hiddenModal = {this.hiddenModalConfirmDelete}
		        	 message = "Are you sure to delete this event?"
		        	 handleConfirm={this.handleModalConfirmDelete}
		        	/>
		        }
	        </div>
	    );
	}
}



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
							}else if(x.type == 'Schedule'){
								return (
									<div key={i}>
											<Form.Row>
												<Col xs={12}><strong>Schedule</strong></Col>
												<Col xs={4}>
											    	<Form.Control placeholder="Choose type Schedule" size="sm" name="value" as="select" onChange={e => this.handleInputChange(e, i)}>
												        <option value="">Choose type Schedule...</option>
												        {/*<option value="CSV">CSV</option>
												        <option value="Integration">Integration</option>*/}
												        <option value="Manually">Manually</option>
												    </Form.Control>
												    <Form.Label>Source</Form.Label>
												</Col>

												<Col xs={1}>
											    	<Button size="sm" onClick={() => this.deleteInput(i)}  variant="secondary">X</Button>
												</Col>
											</Form.Row>

											{x.value == 'Manually' &&
												<ScheduleManually/>
										    }
									</div>
								);
							}
						})}
				    </div>
				);
  		}
}


export class ScheduleManually extends Component{
	constructor(props) {
	    super(props);
	    this.state = {};
	}

	render(){
       return(
       		<Form.Row>
			  <Col xs={12}>
			  		<div className="divide"></div>
			  		<CalendarSchedule/>
					{/*<div style={{ marginTop: 20 }}>{JSON.stringify(this.state)}</div>*/}
			  </Col>
			</Form.Row>
       );
	}
}
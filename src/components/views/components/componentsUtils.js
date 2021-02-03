import React, { Component } from "react";
import {Modal,Button,Table,Badge,Alert,Carousel,ButtonGroup,ToggleButtonGroup,ListGroup,ToggleButton,Form,Col,InputGroup,FormControl,Row} from 'react-bootstrap';
import axios from 'axios';
import config from 'react-global-configuration';
//import Calendar from 'react-calendar';
//import 'react-calendar/dist/Calendar.css';
import { Calendar, momentLocalizer,Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import * as moment from 'moment';
import ModalToConfirm from './confirm';
import ModalAddEventSchedule from './modal-addEventSchedule';
//import {ChatMessages} from './chat';
import {Helper} from './helper';

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


export class RequestAsync extends Component{
	async post(_url, _params, _header){
	      let result;
	      try{
	             const request = await axios.post(config.get('baseUrlApi')+_url,JSON.stringify(_params), 
	                    {headers: _header
	             });
	             const result = await request.data.data;
	             return result;
	      } catch(e){
	             if(e.response){
	               if(e.response.status == 403){
	                   //localStorage.removeItem('messages');
	                   //localStorage.removeItem('token');
	                   //localStorage.removeItem('key_temp');
	                   //localStorage.removeItem('client_id');
	                   return false;
	               }
	             } 
	             //throw e;
	      }
	}

	async get(_url, _header){
		let result;
	    try{
            const request = await axios.get(config.get('baseUrlApi')+_url,{headers: _header});
            const result = await request.data.data;
            return result;
	    } catch(e){
            if(e.response){
               if(e.response.status == 403){
                   //localStorage.removeItem('messages');
                   //localStorage.removeItem('token');
                   //localStorage.removeItem('key_temp');
                   //localStorage.removeItem('client_id');
                   return false;
               }
            } 
            //throw e;
	    }
	}
}

export class ResponseTopic extends Component{
	constructor(props) {
	    super(props);
	    this.state = {};
	}

	componentDidMount(){
		//console.log(this.props.messageData);
	}

	render(){
       return (
       		<div>
       			<p className="message">{this.props.messageData.text_response}</p>
				<div className="divide"></div>
				<ListGroup>
					    {this.props.messageData.topics.map((x, i) => {
					    	if(x.action == 'Link'){
				     	   		return (<a href={x.value} key={i} target="new" className="list-group-item list-group-item-action">{x.title}</a>);
					    	}else if(x.action == 'Pattern'){
					    		return (<ListGroup.Item key={i} action onClick={(e) => this.props.sendAction(x, i, this.props.index)}>{x.title}</ListGroup.Item>);
					    	}else if(x.action == 'Contact'){
					    		return (<ListGroup.Item key={i} action onClick={(e) => this.props.sendAction(x, i, this.props.index)}>{x.title}</ListGroup.Item>);
					    	}
					    })}
				</ListGroup>
       		</div>
       );
	}
}


export class CarouselSchedule extends Component{
	constructor(props) {
	    super(props);
	    this.state = {
	    	events: [],
	    	input: {},
	    	days: {
			 Mon: 'Lun',
			 Tue: 'Mar', 
			 Wed: 'Mié',
			 Thu: 'Jue',
			 Fri: 'Vie',
			 Sat: 'Sab',
			 Sun: 'Dom'
			},
			months:{
				January: 'Enero',
				February: 'Febrero',
				March: 'Marzo',
				April: 'Abril',
				May: 'Mayo',
				June: 'Junio',
				July: 'Julio',
				August: 'Agosto',
				September: 'Septiembre',
				October: 'Octubre',
				November: 'Noviembre',
				December: 'Diciembre'
			}
	    };
	}

	componentDidMount(){
		const _events = this.props.inputData.items;
		var temparray = this.groupsEvents(_events);
		this.setState({events: temparray});
	}

	groupsEvents (_events){
		// this gives an object with dates as keys
		const groups = _events.reduce((groups, item) => {
		  const date = item.start.split('T')[0];
		  if (!groups[date]) {
		    groups[date] = [];
		  }

		  groups[date].push(item);

		  return groups;
		}, {});

		// Edit: to add it in the array format instead
		const groupArrays = Object.keys(groups).map((date) => {
		  return {
		    date,
		    events: groups[date]
		  };
		});
		var i,j,chunk = 2;
		var temparray = [];
		for (i=0,j=groupArrays.length; i<j; i+=chunk) {
		    temparray.push(groupArrays.slice(i,i+chunk));
		    // do whatever
		}
		return temparray;
	}

	selectSchedule = (event) => {
		const items = this.props.inputData.items; //original array
		const items1 = this.props.inputData.items; //original array copy
		var _itemSelectd = {};
		items.forEach(function(el, i){
			var _item = el._schedule.day+'|'+el._schedule.hours.from+'|'+el._schedule.hours.to;
			if(event.target.value == _item){
				items1[i].status = 'Burned';
				_itemSelectd = items1[i];
			}else{
				items1[i].status = 'Active';
			}
		});
		this.props.updateSchedule(_itemSelectd, items1, this.props.indexInput);
		/**/
		var temparray = this.groupsEvents(items1);
		this.setState({events: temparray});
	}

	render(){
       return(
       	 	<Carousel interval={null}>
       	 	    {
       	 	    	this.state.events.map((item, i) =>
			       		<Carousel.Item key={i}>
						    <Row>
						    	<Col xs={12} className="year">
						    		<span>{this.state.months[moment(item[0].date).format('MMMM')]}{' '}{moment(item[0].date).format('YYYY')}</span>
						    	</Col>
						    </Row>

						    <Row>
						    	<Col xs={6} className="day">
						    		{this.state.days[moment(item[0].date).format('ddd')]}{' '}{moment(item[0].date).format('DD')}
						    	</Col>

						    	{typeof item[1] != 'undefined' && 
							    	<Col xs={6} className="day">
							    		{this.state.days[moment(item[1].date).format('ddd')]}{' '}{moment(item[1].date).format('DD')}
							    	</Col>
						    	}

						    </Row>

						    <Row>
								    	<Col xs={6}>
										    <div role="group" className="btn-group-vertical btn-group-toggle">
										          {
										          	item[0].events.map((item1, i1) =>
										          		<label className={item1.status == 'Burned' ? 'focus btn btn-secondary': 'btn btn-secondary'} key={i1}>
										    	    		<input name="radio" type="radio"
										    	    		       required
										    	    			   value={item1._schedule.day+'|'+item1._schedule.hours.from+'|'+item1._schedule.hours.to}
										    	    			   checked={item1.status == 'Burned' ? true: false}
										    	    			   onChange={this.selectSchedule}
										    	    			   />
										    	    		  {moment(item1.start).format('HH:mm')}{'/'}{moment(item1.end).format('HH:mm A')}
										    	    	</label>
										          	)
										          }
										    </div>
										</Col>

										{typeof item[1] != 'undefined' &&
											<Col xs={6}>
											    <div role="group" className="btn-group-vertical btn-group-toggle">
											          {
											          	item[1].events.map((item1, i1) =>
											          		<label className={item1.status == 'Burned' ? 'focus btn btn-secondary': 'btn btn-secondary'} key={i1}>
											    	    		<input name="radio" 
											    	    		       type="radio"
											    	    			   value={item1._schedule.day+'|'+item1._schedule.hours.from+'|'+item1._schedule.hours.to}
											    	    			   checked={item1.status == 'Burned' ? true: false}
											    	    			   onChange={this.selectSchedule}
											    	    			   />
											    	    				{moment(item1.start).format('HH:mm')}{'/'}{moment(item1.end).format('HH:mm A')}
											    	    	</label>
											          	)
											          }
											    </div>
											</Col>
										}

						    </Row>
						    <div className="divide"></div>
						    
						</Carousel.Item>
			        )
       	 	    }
			</Carousel>
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
	    	events: this.props.items,
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
	    //console.log(start);
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
				status: 'Active'
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
		this.props.collect(this.state.events);
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
				status: 'Active'
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

		        {/*<div style={{ marginTop: 20 }}>{JSON.stringify(this.state.collect)}</div>*/}
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


	_validationV2(value, type){
		if(value.length == 0 || type == ""){
			return true;
		}

		if(type == 'RUT'){
			if(!this.rut(value)){
				return false;
			}else{
				return true;
			}
		}

		if(type == 'String'){
			if(!this.text2(value)){
				return false;
			}else{
				return true;
			}
		}

		if(type == 'Email'){
			if(!this.email(value)){
				return false;
			}else{
				return true;
			}
		}

		if(type == 'Telephone'){
			if(!this.telephoneCLv2(value)){
				return false;
			}else{
				return true;
			}
		}

		if(type == 'Number'){
			if(!this.numbers(value)){
				return false;
			}else{
				return true;
			}
		}
	}

	validateForm(submitEvent) {
		/* Seriously, hold everything. */
	    submitEvent.preventDefault();
	    try{ submitEvent.stopImmediatePropagation(); } catch (error) {}
	    submitEvent.stopPropagation();
		
		if (!submitEvent.currentTarget.checkValidity()) {
		    var form     = submitEvent.currentTarget, elements = form.elements;
		    /* Loop through the elements, looking for an invalid one. */
		    for (var index = 0, len = elements.length; index < len; index++){
		      var element = elements[index];

		      var message = element.validationMessage,
		            parent  = element.parentNode,
		            div     = document.createElement('div');

		      //console.log(element.nodeName + ' - '+element.type+' - '+element.getAttribute('name'));

		      /*validation custom input*/
		      if(this.validationMessageForV2(element) == false){
		      	//console.log('aqui');
		      	parent.classList.add("is-invalid");
		      	parent.classList.remove("is-valid");
		      	//element.setAttribute("ivalid", "true");
		      	element.setCustomValidity('error-validation-input');
		      	element.focus();
		      	break;
		      }else{
		      	parent.classList.add("is-valid");
		      	parent.classList.remove("is-invalid");
		      	element.setCustomValidity('');
		      }

		        if (element.willValidate === true && element.validity.valid !== true) {
			      	var name = element.nodeName, type = element.type;
		      		//console.log('aqui2');
			        /* Add our message to a div with class 'validation-message' */
			        //div.appendChild(document.createTextNode(message));
			        //div.classList.add('validation-message');

			        /* Add our error message just after element. */
			        //parent.insertBefore(div, element.nextSibling);
			        
			        //var error = parent.getElementsByClassName("invalid-feedback");
			        //var x = parent.getElementsByClassName("invalid-feedback"); //invalid-feedback / valid-feedback
					//var i;
					//for (i = 0; i < x.length; i++) {
					//    x[i].style.display = 'block';
					//}
					parent.classList.add("is-invalid");
					parent.classList.remove("is-valid");
					element.setCustomValidity('error-input-required');
			
			        /* Focus on the element. */
			        element.focus();
			        /* break from our loop */
			        break;
			    } /* willValidate && validity.valid */
			      else{
			      	parent.classList.remove("is-invalid");
			      	parent.classList.add("is-valid");
			      	element.setCustomValidity('');
			    }


		    }
		} else {
		    return true; /* everything's cool, the form is valid! */
		}
	}


	validationMessageForV2(element) {
	    var name = element.nodeName, type = element.type;
	    //console.log(name); 
	    //console.log(type);
		/* Type mismatch. */
		if (name == 'INPUT' && type === 'email') {
	      return this._validationV2(element.getAttribute('value'), 'Email');
	    } else if (name == 'INPUT' && type === 'tel') {
	      return this._validationV2(element.getAttribute('value'), 'Telephone');
	    } else if(name == 'INPUT'){
	      return this._validationV2(element.getAttribute('value'), element.getAttribute('validation'));
	    }
		return true;
	}

	/*
		Determine the best message to return based on validity state.
	*/
	validationMessageFor(element) {
	    var name = element.nodeName,
	      type = element.type,
	
	      /* Custom, reused messages. */
	      emailMessage = "Please enter a valid email address.";
		
		/* Pattern is present but the input doesn't match. */
		if (element.validity.patternMismatch === true) {
		    if (element.pattern == '\\d*') {
		      return "Please only enter numbers.";
		    } else {
		      return element.validationMessage;
		    }
		
		/* Type mismatch. */
		} else if (element.validity.typeMismatch === true) {
		    if (name == 'INPUT' && type === 'email') {
		      return emailMessage;
		    } else if (name == 'INPUT' && type === 'tel') {
		      return "Please enter a valid phone number.";
		    } else {
		      return element.validationMessage;
		    }
		
		/* Required field left blank. */
		} else if (element.validity.valueMissing === true) {
		    if (name == 'SELECT' || (name == 'INPUT' && type === 'radio')) {
		      return "Please select an option from the list.";
		    } else if (name == 'INPUT' && type === 'checkbox') {
		      return "Please check the required box.";
		    } else if (name == 'INPUT' && type === 'email') {
		      return emailMessage;
		    } else {
		      return "Please fill out this field.";
		    }
		
		/* Input is out of range. */
		} else if (element.validity.rangeOverflow === true || element.validity.rangeUnderflow === true) {
		    var max = element.getAttribute('max'),
		        min = element.getAttribute('min');
		
		    return "Please input a value between " + min + " and " + max + ".";
		
		  /* Default message. */
		  } else {
		    return element.validationMessage;
		}
	}
}

export class ResponseForm extends Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    	validated: false,
	    	errorSaveForm: '',
	    	showForm: true,
	    	localizer: momentLocalizer(moment)
	    };
	}

	handleSubmitForm = (event) =>{
		event.preventDefault();
		const form = event.currentTarget;
		if (new Validation().validateForm(event) === undefined) {
		      this.setState({errorSaveForm : ''});
		      this.setState({validated : true});
		      event.stopPropagation();
		}else{
			this.setState({validated : false});
			var _dataPost1 = this.props.messageData;
			/*this.props.messageData.inputs.forEach(function(el, index){
				if(el.type == 'Schedule'){
					//delete _dataPost1.inputs[index].items;
					if(typeof el.itemSelected == 'undefined' || el.itemSelected == ''){
							this.setState({validated : true});
							event.stopPropagation();
					}
				}
			});*/
			
			var _dataPost = {"form" : _dataPost1, '_id': this.props.messageId.$oid};
		    async function _requestApi(_this, _dataPost, _form){
			    var _url = config.get('baseUrlApi')+'/api/v1/message-save-form';
		        const res = await new Helper().postRequest(_url, _dataPost, 'front');
		        //console.log(res);
		        _this.props.successSentForm(_this.props.index, res.code);
	            _this.setState({showForm: false});
	            _form.reset();
		    }
		    _requestApi(this, _dataPost, form);
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

	updateSchedule = (itemSelected,events, index) =>{
		this.props.updateScheduleEvents(itemSelected, events, index, this.props.index);
	}

	render() {	
		return (
			<Form noValidate validated={this.state.validated} onSubmit={this.handleSubmitForm}>
		    	<p className="message">{this.props.messageData.textDescription}</p>
		    	<div className="divide"></div>
		    	
		    	<div className="contentForm">
		    		{this.props.messageData.inputs.map((x, i) => {
		    			if(x.type == 'Text'){
		    				return(
		    					<Form.Row key={"inputText"+i} className="inputText">
									<Col key={i} xs={12}>
									    	<Form.Group controlId="formBasicText">
											    <Form.Control  placeholder={x.label} size="sm" 
											    			   required 
											    			   name="label" type="text"
											    			   validation={x.validation} 
											    			   value={x.value} onChange={e => this.handleInputChange(e, i)}/>
											    <Form.Label >{x.label}</Form.Label>
											   
											</Form.Group>
									</Col>
								</Form.Row>
		    				);
		    			}else if(x.type == 'Multi-Choices'){
		    				return (
		    					<Form.Row key={i} className="Multi-Choices">
									<Col key={i} xs={12}>
									    <div className="label-choices"><h2>{x.label_list}</h2></div>
									    <div>
										    {x.items.map((x1, i1) => {
											    	return (
											    		  <div key={i1} className="inputGroup">
														    <Form.Control id={"checkbox"+ i+i1} 
														                  value={x1.value == true ? 'OK': ''} 
														                  checked={x1.value} 
														                  onChange={e => this.handleInputChangeOptions(e, i1,i, x.items,'checkbox')} 
														                  name={"checkbox"+ i+i1} type="checkbox"/>
														    <label className="inputCheckbox" htmlFor={"checkbox"+ i+i1}>{x1.label}</label>
														  </div>
											    	);
										    })}
									    </div>
									</Col>
								</Form.Row>
		    				);
		    			}else if(x.type == 'Single-Option-Choice'){
		    					return (
			    					<Form.Row key={"Single-Option-Choice"+i} className="Single-Option-Choice">
										<Col key={i} xs={12}>
										    <div className="label-choices"><h2>{x.label_list}</h2></div>
										    <div>
											    {x.items.map((x1, i1) => {
											    	return (
											    		  <div key={i1} className="inputGroup">
														    <Form.Control id={"radio"+ i+i1} 
														                  value={x1.label} 
														                  required
														                  checked={x1.value}
														                  onChange={e => this.handleInputChangeOptions(e, i1, i, x.items, 'radio')} 
														                  name={'radio'+i} 
														                  type="radio"/>
														    <label className="inputRadio" htmlFor={"radio"+ i+i1}>{x1.label}</label>
														  </div>
											    	);

											    })}
											</div>
										</Col>
									</Form.Row>
			    				);
		    			}else if(x.type == 'TextArea'){	
		    				return (
		    					<Form.Row key={i} className="Single-Option-Choice">
									<Col key={i} xs={12}>
									    	<Form.Group controlId="formBasicText">
											    <Form.Control 
											                required size="sm"
											                name={'textarea'+i} 
											    			placeholder={x.label} value={x.value} 
											    			onChange={e => this.handleInputChange(e, i)} 
											    			as="textarea" rows="2"/>
											    <Form.Label >{x.label}</Form.Label>
											</Form.Group>
									</Col>
								</Form.Row>
		    				);
		    			}else if(x.type == 'Schedule'){
		    				return(
		    					<div className="selectSchedule" key={i}>
		    						<CarouselSchedule key={i} indexInput={i} inputData={x} updateSchedule={this.updateSchedule}/>
		    					</div>
		    				);
		    			}
		    		})}
		    		
		    		<div className="contentFormButton">
			    		<Button size="sm" variant="outline-secondary" type="submit">Save</Button>
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
		    	valueItemMultiChoice: '',
		    	eventsSchedule: []
		    };
		}

		componentDidMount(){
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

		setEventsSchedule = (data, index)=>{
			//console.log(data);
			//console.log(index);
			this.setState({eventsSchedule: data});

			//const items = this.props.inputList[index].items;
			//items.push({label: value, value: false});
			this.props.addItemToList(data, index);
		}


  		render() {
				if(this.props.id.length > 0){
					//console.log(this.props.inputList);
					//this.setState({eventsSchedule: data});
				}

				return (
					    <div className="contentInputsResponseForm">
							
						    {this.props.inputList.map((x, i) => {
						    	if(x.type == 'Text'){
									return (
										<div key={i}>
											<Form.Row>
												<Col xs={12}><h5 className="title"><Badge variant="secondary">{i+1}</Badge> Input Text</h5></Col>
											</Form.Row>
											
											<Form.Row key={i} className="inputText content">
												<Col xs={8}>

														{new Helper().getInput(
															'label',
													        e => this.handleInputChange(e, i),
													        'Input tag name',
													        true,
													        x.label,
													        'Input tag name'
														)}

												</Col>

												<Col xs={3}>

												    {new Helper().getInputSelect(
			   											'validation',
												        e => this.handleInputChange(e, i),
												        'Choose Validation',
												        false,
												        x.validation,
												        null,
												        [
												         {value: 'RUT', label: 'RUT'},
												         {value: 'String', label: 'String'},
												         {value: 'Email', label: 'Email'},
												         {value: 'Telephone', label: 'Telephone'},
												         {value: 'Number', label: 'Number'}
												        ]
			   										)}


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
												<Col xs={12}><h5 className="title"><Badge variant="secondary">{i+1}</Badge> TextArea</h5></Col>
											</Form.Row>
											
											<Form.Row key={i} className="inputTextArea content">
												<Col xs={11}>

														{new Helper().getTextarea(
															'label',
													        e => this.handleInputChange(e, i),
													        'Name Input',
													        true,
													        x.label,
													        'Name Input'
														)}

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
												<Col xs={12}><h5 className="title"><Badge variant="secondary">{i+1}</Badge>  {x.type.replace('-',' ')}</h5></Col>
											</Form.Row>

											<Form.Row className="content">
												<Col xs={11}>
													
													{new Helper().getInput(
														'label_list',
												        e => this.handleInputChange(e, i),
												        'Name List',
												        true,
												        x.label_list,
												        'Name List'
													)}

												</Col>
											</Form.Row>

											<Form.Row className="inputMultiChoise content">
										        <Col xs={11}>
										                <Form.Group  controlId="formAddOption">
															<InputGroup className="mb-3">
															    <FormControl value={x.label} name="label" onChange={(e)=>{ this.handleInputChange(e, i); this.setState({valueItemMultiChoice: e.target.value});}}
															      placeholder="Add Option"
															      aria-label="Add Option"
															      aria-describedby="basic-addon2"
															    />
															    <Form.Label>Add Option</Form.Label>

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

										    <Form.Row className="inputMultiChoiseItems content">
										        <Col xs={10} className="items">

										            <ListGroup className="listgroup-sm">
											              {this.props.inputList[i].items.map((x, i1) => {
																  return(
																  		<ListGroup.Item key={i1}>{x.label} <a href="#" className="close" itemID = {i1}><span>x</span></a></ListGroup.Item>
																  );
														  })} 
													</ListGroup>

										        </Col>
										    </Form.Row>
										</div>
									);
								
								}else if(x.type == 'Schedule'){
									return (
										<div key={i}>
												<Form.Row>
													<Col xs={12}><h5 className="title"><Badge variant="secondary">{i+1}</Badge> Schedule</h5></Col>
												</Form.Row>	

												<Form.Row className="content">
													
													
													<Col xs={11}>
												    	

													    {new Helper().getInputSelect(
				   											'value',
													        e => this.handleInputChange(e, i),
													        'Source',
													        true,
													        x.value,
													        null,
													        [
													         {value: 'Manually', label: 'Manually'},
													         /*{value: 'CSV', label: 'CSV'},
													         {value: 'Integration', label: 'Integration'}*/
													        ]
				   										)}

													</Col>

													<Col xs={1}>
												    	<Button size="sm" onClick={() => this.deleteInput(i)}  variant="secondary">X</Button>
													</Col>
												</Form.Row>

												
												{x.value == 'Manually' &&
												    <Form.Row className="content">
														<Col xs={11}>
														    <div className="divide"></div>
															<ScheduleManually index={i} collect={this.setEventsSchedule} items={x.items}/>
															{/*<div style={{ marginTop: 20 }}>{JSON.stringify(this.state.eventsSchedule)}</div>*/}
														</Col>
													</Form.Row>
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
	    this.state = {
	    	collect: []
	    };
	}

	setCollect = (data) => {
		this.setState({collect: data});
		//console.log(this.props.index);
		//console.log(data);
		this.props.collect(data, this.props.index);
	}

	render(){
       return(
	  		<CalendarSchedule collect={this.setCollect} items={this.props.items}/>
       );
	}
}
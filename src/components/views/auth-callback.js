import React, { Component } from "react";
import config from 'react-global-configuration';
import {Alert} from 'react-bootstrap';
import axios from 'axios';
import { browserHistory } from 'react-router';

export default class Contact extends Component {
    constructor(props){
    	super(props);
    	const _token = this.props.location.query.t;
    	if(_token.length < 50){
    		browserHistory.push('/login');
    	}
    	/*##*/
    	var _config = {headers: {'Content-Type': 'application/json;charset=UTF-8', 'Authorization' : 'Bearer ' + _token}};
    	axios.get(config.get('baseUrlApi')+'/api/v1/validate-auth',_config)
	    .then(res => {
	    	if(typeof res.data.data.status != 'undefined' && 
	    	   res.data.data.status == 'ok'){
	    	   localStorage.setItem('tokenAdm', _token);
	    	   /*GET CONFIG USER IN REQUEST*/
	    	   browserHistory.push('/dashboard');
	    	}
	    	browserHistory.push('/login');
	    }).catch(function (error) {
	    	browserHistory.push('/login');
	    });
    }
    
    render() {
       return ('');
    }
}
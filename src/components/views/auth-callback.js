import React, { Component } from "react";
import config from 'react-global-configuration';
import {Alert} from 'react-bootstrap';
import axios from 'axios';
import { browserHistory } from 'react-router';

export default class Contact extends Component {
    constructor(props){
    	super(props);
    	const _token = this.props.location.query.t;
    	if(typeof _token == 'undefined'){
    		browserHistory.push('/login');
    	}else{
    		if(_token.length < 50){
	    		browserHistory.push('/login');
	    		return false;
	    	}else{
		    	var _config = {headers: {'Content-Type': 'application/json;charset=UTF-8', 'Authorization' : 'Bearer ' + _token}};
		    	axios.get(config.get('baseUrlApi')+'/api/v1/validate-auth',_config)
			    .then(res => {
			    	//console.log(res.data.data);
			    	if(typeof res.data.data.scope != 'undefined'){
			    	   localStorage.setItem('tokenAdm', _token);
			    	   localStorage.setItem('_id', res.data.data._id);
			    	   localStorage.setItem('scope', res.data.data.scope);
			    	   localStorage.setItem('client', res.data.data.client);
			    	   browserHistory.push('/dashboard');
			    	}else{
			    		browserHistory.push('/login');
			    	}
			    }).catch(function (error) {
			    	browserHistory.push('/login');
			    });
	    	}
    	}
    }
    
    render() {
       return ('');
    }
}
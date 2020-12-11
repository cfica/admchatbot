import React, { Component } from "react";
import config from 'react-global-configuration';
import {Alert} from 'react-bootstrap';
import axios from 'axios';
import { browserHistory } from 'react-router';
import {VarStorage} from './components/varsStorage';

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
			    	//console.log(res.data.data.client);
			    	if(typeof res.data.data.scope != 'undefined'){
			    	   
			    	   new VarStorage().setTokenBack(_token);
			    	   new VarStorage().setUserId(res.data.data.user_id);
			    	   new VarStorage().setScope(res.data.data.scope);
			    	   new VarStorage().setSite(res.data.data.client);

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
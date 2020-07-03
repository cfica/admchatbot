import React, { Component } from "react";
import config from 'react-global-configuration';
import {Alert} from 'react-bootstrap';
//import { bake_cookie, read_cookie, delete_cookie } from 'sfcookies';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { browserHistory } from 'react-router';

export default class Contact extends Component {
    constructor(props){
    	super(props);
    	const _key = this.props.location.query.key;
    	axios.post(
    		config.get('baseUrlApi')+'/api/v1/validate-auth',JSON.stringify({}), 
    		{headers: {'Content-Type': 'application/json;charset=UTF-8', 'Authorization' : 'Bearer ' + _key}})
	    .then(res => {
	    	//console.log(res);
	    	if(typeof res.data.data.token != 'undefined'){
	    		const cookies = new Cookies();
	    		cookies.set('tokenAdm', res.data.data.token, {path: '/', sameSite: 'none', secure: true});
	    		browserHistory.push('/dashboard');
	    	}else if(typeof res.data.data.err != 'undefined'){
	    		browserHistory.push('/login');
	    	}
	    }).catch(function (error) {
	    	if(error.response.status == 401){
	    		const cookies = new Cookies();
	    		cookies.remove('tokenAdm');
	    		browserHistory.push('/login');
	    	}
		});
    }
    
    render() {
       return ('');
    }
}
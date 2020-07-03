import React, { Component } from "react";
import config from 'react-global-configuration';
import {Alert} from 'react-bootstrap';
//import { bake_cookie, read_cookie, delete_cookie } from 'sfcookies';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { browserHistory } from 'react-router';

export default class Logout extends Component {
    constructor(props){
    	super(props);
    }
    
    render() {
       //const _key = this.props.location.query.key;
       const cookies = new Cookies();
       cookies.remove('messages',{path: '/', sameSite: 'none', secure: true});
       cookies.remove('token',{path: '/', sameSite: 'none', secure: true});
       cookies.remove('key_temp',{path: '/', sameSite: 'none', secure: true});
       cookies.remove('confChatInit',{path: '/', sameSite: 'none', secure: true});
       return ('');
    }
}
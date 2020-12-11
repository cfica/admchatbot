import React, { Component } from "react";
import config from 'react-global-configuration';

export class VarStorage extends Component{
	constructor(props) {
	    super(props);
	    this.state = {};
	}

      setNameClient(value){
        return localStorage.setItem('name_client', value);
      }

      getNameClient(value){
          var _var = localStorage.getItem('name_client');
          if(_var != "undefined" && _var != null){
              return _var;
          }
          return false;
      }

      delNameClient(value){
        return localStorage.removeItem('name_client');
      }


       
       setMessages(value = []){
         return localStorage.setItem('messages', value);
       }

       setToken(value){
          return localStorage.setItem('token', value);
       }      

       setManualResponse(value){
              if(value){
                 localStorage.setItem('manual_response', value);
               }else{
                 this.delManualResponse();
               }
              return;
       }

       setKeyTemp(value){
        return localStorage.setItem('key_temp', value);
       }      

       setClientId(value){
        return localStorage.setItem('client_id', value);
       }

       /*get*/
       getMessages(){
          var _var = localStorage.getItem('messages');
          if(_var != "undefined" && _var != null){
              return _var;
          }
          return false;
       }

       getToken(){
          var token = localStorage.getItem('token');
          if(token != "undefined" && token != null){
              return token;
          }
          return false;
       }      

       getManualResponse(){
          var _var = localStorage.getItem('manual_response');
          if(_var != "undefined" && _var != null){
              return _var;
          }
          return false;
       }

       getKeyTemp(){
          var _var = localStorage.getItem('key_temp');
          if(_var != "undefined" && _var != null){
              return _var;
          }
          return false;
       }      

       getClientId(){
          var _var = localStorage.getItem('client_id');
          if(_var != "undefined" && _var != null){
              return _var;
          }
          return false;
       }

       /*remove*/
       delMessages(){
         return localStorage.removeItem('messages');
       }

       delToken(){
          return localStorage.removeItem('token');
       }      

       delManualResponse(){
          return localStorage.removeItem('manual_response');
       }

       delKeyTemp(){
        return localStorage.removeItem('key_temp');
       }      

       delClientId(){
        return localStorage.removeItem('client_id');
       }


       /*remove all*/
       delAll(){
          localStorage.removeItem('messages');
          localStorage.removeItem('token');
          localStorage.removeItem('manual_response');
          localStorage.removeItem('key_temp');
          localStorage.removeItem('client_id');
          localStorage.removeItem('name_client');
          return;    
       }



       /*Back*/
       setTokenBack(value){
        return localStorage.setItem('tokenAdm', value);
       }

       getTokenBack(value){
          var _var = localStorage.getItem('tokenAdm');
          if(_var != "undefined" && _var != null){
              return _var;
          }
          return false;
       }

       delTokenBack(value){
        return localStorage.removeItem('tokenAdm');
       }

       setUserId(value){
        return localStorage.setItem('_id', value);
       }

       getUserId(value){
          var _var = localStorage.getItem('_id');
          if(_var != "undefined" && _var != null){
              return _var;
          }
          return false;
       }

       delUserId(value){
        return localStorage.removeItem('_id');
       }

       setScope(value){
        return localStorage.setItem('scope', value);
       }

       getScope(value){
          var _var = localStorage.getItem('scope');
          if(_var != "undefined" && _var != null){
              return _var;
          }
          return false;
       }

       delScope(value){
        return localStorage.removeItem('scope');
       }


       setSite(value){
        return localStorage.setItem('client', value);
       }

       getSite(value){
          var _var = localStorage.getItem('client');
          if(_var != "undefined" && _var != null){
              return _var;
          }
          return false;
       }

       delSite(value){
        return localStorage.removeItem('client');
       }

	render(){return('');}
}
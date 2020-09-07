import React, { Component } from "react";
import axios from 'axios';
import config from 'react-global-configuration';
import * as moment from 'moment';

export class ChatMessages extends Component{
	constructor(props) {
	    super(props);
	    this.state = {};
	}

       setMessage(_type,message){
           const item = {
               _id: message._id,
               type : _type,
               msg : message.response, 
               type_resp: message.type, 
               status: '',
               _created: moment()
           };
           var oldItems = JSON.parse(localStorage.getItem('messages')) || [];
           const items = oldItems.slice();
           if(item.type_resp == 'Form'){
             items.forEach(function(el, index){
               if(el.type_resp == 'Form'){
                   items[index]['status'] = 'Form-Exists';
               }
             });
             item.status = 'Init';
           }
           //console.log(items);
           items.push(item);
           localStorage.setItem('messages', JSON.stringify(items));
           return JSON.parse(localStorage.getItem('messages'));
       }

       async sendMessage(_value, _type = null){
              let result;
              try{
                     if(_type){
                            var data = {"message" : _value, 'action': _type};
                     }else{
                            var data = {"message" : _value};   
                     }
                     const request = await axios.post(config.get('baseUrlApi')+'/api/v1/message',JSON.stringify(data), 
                            {headers: {
                              'Content-Type': 'application/json;charset=UTF-8',
                              'Authorization' : 'Bearer ' + localStorage.getItem('token'),
                              'x-dsi-restful' : localStorage.getItem('key_temp'),
                              'x-dsi2-restful' : localStorage.getItem('client_id')
                            }
                     });
                     const result = await request.data.data;
                     return result;
              } catch(e){
                     if(e.response){
                       if(e.response.status == 403){
                           localStorage.removeItem('messages');
                           localStorage.removeItem('token');
                           localStorage.removeItem('key_temp');
                           localStorage.removeItem('client_id');
                           return false;
                       }
                     } 
                     //throw e;
              }
       }
}
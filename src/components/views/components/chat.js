import React, { Component } from "react";
import axios from 'axios';
import config from 'react-global-configuration';
import * as moment from 'moment';
import {InputsTypeForm,ResponseForm,ResponseTopic,Validation} from './componentsUtils';
import {GetSlide} from './slide';

export class ChatMessages extends Component{
    	constructor(props){
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

      async loadMessages(_value, _type = null){
          let result;
          try{
             var data = {};
             const request = await axios.post(config.get('baseUrlApi')+'/api/v1/messages',JSON.stringify(data), 
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
             /*if(e.response){
               if(e.response.status == 403){
                   localStorage.removeItem('messages');
                   localStorage.removeItem('token');
                   localStorage.removeItem('key_temp');
                   localStorage.removeItem('client_id');
                   return false;
               }
             }*/ 
             //throw e;
          }
      }

      messageClien(index, item, listMessages, messagesEnd){
        return (
          <div key={index} className="contentMessageClient" ref={index == (listMessages.length - 1)  ? messagesEnd : ''}>
              <div>
                 <div className="contentUser">
                        <h5>You</h5>
                        <span>{moment(item._created).fromNow()}</span>
                 </div>
                 <div className="contentMsg">
                      <span>{item.msg}</span>
                 </div>
              </div>
          </div>
        );
      }

      messageResponse(
        index, 
        item, 
        listMessages, 
        messagesEnd,
        sendAction,
        setMessage,
        statusValidation,
        inputChange,
        inputChangeOptions,
        updateScheduleEvents,
        successSentForm,
        closeSession
      ){
        return(
              <div key={index} className="contentMessageChat" ref={index == (listMessages.length - 1)  ? messagesEnd : ''}>
                     <div>
                         <div className="contentUser">
                              <h5>Belisa</h5>
                              <span>{moment(item._created).fromNow()}</span>
                         </div>

                         <div className="contentMsg">
                            {item.type_resp == 'Text' && 
                                <span>{item.msg}</span>
                            }
                           
                            {item.type_resp == 'Html' &&
                              <div dangerouslySetInnerHTML={{__html: item.msg}}></div>
                            }

                            {item.type_resp == 'Topic' &&
                                  <ResponseTopic
                                      index = {index}
                                      messageData = {item.msg}
                                      messageId = {item._id}
                                      sendAction = {sendAction}
                                  />
                            }

                            {item.type_resp == 'Form' && item.status == 'Init' &&
                                  <ResponseForm
                                      setMessage = {setMessage}
                                      statusValidation = {statusValidation}
                                      index = {index}
                                      messageData = {item.msg}
                                      messageId = {item._id}
                                      inputChange = {inputChange}
                                      inputChangeOptions = {inputChangeOptions}
                                      updateScheduleEvents = {updateScheduleEvents}
                                      successSentForm = {successSentForm}
                                      closeSession = {closeSession}
                                  />
                            }

                            {item.type_resp == 'Form' && item.status == 'Form-Exists' &&
                               <div>Form disable.</div>
                            }

                            {item.type_resp == 'Form' && item.status == 'Form-Sent-Success' &&
                               <div>Form sent correctly.</div>
                            }

                            {item.type_resp == 'Form' && item.status == 'Form-Error-Saved' &&
                               <div className="is-invalid">
                                *The form could not be saved, the reasons are:<br/>
                                1.- You already made a reservation previously.<br/>
                                2.- The time is not available.
                               </div>
                            }

                            {item.type_resp == 'Slide' &&
                                  <div>
                                    <span>{item.msg.textResponse}</span>
                                    <GetSlide
                                          index = {index}
                                          messageData = {item.msg}
                                    />
                                  </div>
                            }
                         </div>
                     </div>
              </div>
        );
      }

      _validation(_value, _validation){
        return new Validation()._validation(_value, _validation);
      }
}
import React, { Component } from "react";
import axios from 'axios';
import config from 'react-global-configuration';
import * as moment from 'moment';
import {InputsTypeForm,ResponseForm,ResponseTopic,Validation} from './componentsUtils';
import {GetSlide} from './slide';
import {VarStorage} from './varsStorage';

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

          var oldItems = [];
          var items = [];
          if(new VarStorage().getMessages()){
            //console.log(oldItems);
            if(new VarStorage().getMessages().length > 0){
              oldItems = JSON.parse(new VarStorage().getMessages());
              items = oldItems.slice();
            }
          }
           
          if(item.type_resp == 'Form'){
             items.forEach(function(el, index){
               if(el.type_resp == 'Form'){
                   items[index]['status'] = 'Form-Exists';
               }
             });
             item.status = 'Init';
          }
           items.push(item);
           new VarStorage().setMessages(JSON.stringify(items));
           return JSON.parse(new VarStorage().getMessages());
      }

      setMessages(messages){
         if(typeof messages != "undefined" && messages.length > 0){
           new VarStorage().setMessages(JSON.stringify(messages));
           return JSON.parse(new VarStorage().getMessages());
         }
      }


      async sendMessage(_value, _type = null, _options = null){
              try{
                     if(new VarStorage().getManualResponse()){
                      _type = 'manual_response';
                     }

                     if(_type){
                          var data = {"message" : _value, 'action': _type};
                     }else{
                          var data = {"message" : _value};   
                     }

                     if(_options){
                      data.options = _options;
                     }

                     data.name_client = new VarStorage().getNameClient();

                     if(_type == 'Contact'){
                       /*Answer through executives*/
                       new VarStorage().setManualResponse(true);
                     }

                     if(_type == 'Contact_End'){
                       /*Answer through executives*/
                       new VarStorage().setManualResponse(false);
                     }

                     const request = await axios.post(config.get('baseUrlApi')+'/api/v1/message',JSON.stringify(data), 
                            {headers: {
                              'Content-Type': 'application/json;charset=UTF-8',
                              'Authorization' : 'Bearer ' + new VarStorage.getToken(),
                              'x-dsi-restful' : new VarStorage.getKeyTemp(),
                              'x-dsi2-restful' : new VarStorage.getClientId(),
                              'x-dsi3-restful' : ''
                            }
                     });
                     const result = await request.data.data;
                     return result;
              } catch(e){
                     if(e.response){
                       if(e.response.status == 403){
                           new VarStorage.delAll();
                           return false;
                       }
                     } 
                     //throw e;
              }
      }

      getDetailContact (_id){

      }

      async postRequest(_url, data, _header, options = null){
          try{
             if(_header == 'front'){
                var header = {headers: {
                  'Content-Type': 'application/json;charset=UTF-8',
                  'Authorization' : 'Bearer ' + new VarStorage.getToken(),
                  'x-dsi-restful' : new VarStorage.getKeyTemp(),
                  'x-dsi2-restful' : new VarStorage.getClientId(),
                  'x-dsi3-restful' : ''
                }};
             }else if(_header == 'auth'){
                var header = {headers: {
                  'Content-Type': 'application/json;charset=UTF-8', 
                  'x-dsi-restful-i' :  options.client_id,
                  'x-dsi-restful-init' : options.init,'x-dsi-time' : 2300
                }};
             }else if(_header == 'back'){
                var header = {headers: {
                  'Content-Type': 'application/json;charset=UTF-8',
                  'Authorization' : 'Bearer ' + new VarStorage.getTokenBack(),
                  'x-dsi-restful' : '',
                  'x-dsi2-restful' : new VarStorage.getSite(),
                  'x-dsi3-restful' : new VarStorage.getUserId()
                }};
             }
             const request = await axios.post(_url,JSON.stringify(data),header);
             const result = await request.data.data;
             return result;
          }catch(e){
           if(e.response){
             if(e.response.status == 403){
             }
           } 
          }
      }

      async putRequest(_url, data, _header){
          try{
             if(_header == 'front'){
                var header = {headers: {
                  'Content-Type': 'application/json;charset=UTF-8',
                  'Authorization' : 'Bearer ' + new VarStorage.getToken(),
                  'x-dsi-restful' : new VarStorage.getKeyTemp(),
                  'x-dsi2-restful' : new VarStorage.getClientId(),
                  'x-dsi3-restful' : ''
                }};
             }else if(_header == 'back'){
                var header = {headers: {
                  'Content-Type': 'application/json;charset=UTF-8',
                  'Authorization' : 'Bearer ' + new VarStorage.getTokenBack(),
                  'x-dsi-restful' : '',
                  'x-dsi2-restful' : new VarStorage.getSite(),
                  'x-dsi3-restful' : new VarStorage.getUserId()
                }};
             }
             const request = await axios.put(_url,JSON.stringify(data),header);
             const result = await request.data.data;
             return result;
          }catch(e){
           if(e.response){
             if(e.response.status == 403){
             }
           } 
          }
      }

      async getRequest(_url, _header, options = null){
          try{
             if(_header == 'front'){
                var header = {headers: {
                  'Content-Type': 'application/json;charset=UTF-8',
                  'Authorization' : 'Bearer ' + new VarStorage.getToken(),
                  'x-dsi-restful' : new VarStorage.getKeyTemp(),
                  'x-dsi2-restful' : new VarStorage.getClientId(),
                  'x-dsi3-restful' : ''
                }};
             }else if(_header == 'init'){
                var header = {headers: {
                  'Content-Type': 'application/json;charset=UTF-8',
                  'x-dsi-restful-i' : options.client_id,
                  'x-dsi-restful-init' : options.init
                }};
             }else if(_header == 'back'){
                var header = {headers: {
                  'Content-Type': 'application/json;charset=UTF-8',
                  'Authorization' : 'Bearer ' + new VarStorage.getTokenBack(),
                  'x-dsi-restful' : '',
                  'x-dsi2-restful' : new VarStorage.getSite(),
                  'x-dsi3-restful' : new VarStorage.getUserId()
                }};
             }
             const request = await axios.get(_url,header);
             const result = await request.data.data;
             return result;
          }catch(e){
           if(e.response){
             if(e.response.status == 403){
             }
           } 
          }
      }

      setMessageV2(_type,message){
          const item = {
               _id: message._id,
               type : _type,
               msg : message.response, 
               type_resp: message.type, 
               status: '',
               _created: moment()
          };

          var oldItems = [];
          var items = [];
          if(localStorage.getItem('m_messages') != 'undefined' && localStorage.getItem('m_messages') != null){
            if(localStorage.getItem('m_messages').length > 0){
                oldItems = JSON.parse(localStorage.getItem('m_messages')) || [];
                items = oldItems.slice();
            }
          }

           
          items.push(item);
          localStorage.setItem('m_messages', JSON.stringify(items));
          return JSON.parse(localStorage.getItem('m_messages'));
      }

      setMessagesV2(messages){
        if(typeof messages != "undefined" && messages.length > 0){
         localStorage.setItem('m_messages', JSON.stringify(messages));
         return JSON.parse(localStorage.getItem('m_messages'));
         }
      }

      async sendMessageV2(_value, _type = null, _id = null, _options = null){
          try{
             var data = {"message" : _value, 'action': _type, '_id' : _id};
             if(_options){
              if(_options.action == 'Contact_End'){
                data.action = _options.action;
                data.options = {id: _id};
              }
              //data.options = _options;
             }
             const request = await axios.post(config.get('baseUrlApi')+'/api/v1/message',JSON.stringify(data), 
                    {headers: {
                      'Content-Type': 'application/json;charset=UTF-8',
                      'Authorization' : 'Bearer ' + new VarStorage.getTokenBack(),
                      'x-dsi-restful' : '',
                      'x-dsi2-restful' : new VarStorage.getSite(),
                      'x-dsi3-restful' : new VarStorage.getUserId()
                    }
             });
             const result = await request.data.data;
             return result;
          }catch(e){
                 if(e.response){
                   if(e.response.status == 403){
                   }
                 } 
          }
      }

      async loadMessages(){
          let result;
          try{
             var data = {};
             const request = await axios.get(config.get('baseUrlApi')+'/api/v1/messages?limit=20', 
                    {headers: {
                      'Content-Type': 'application/json;charset=UTF-8',
                      'Authorization' : 'Bearer ' + new VarStorage.getToken(),
                      'x-dsi-restful' : new VarStorage.getKeyTemp(),
                      'x-dsi2-restful' : new VarStorage.getClientId(),
                      'x-dsi3-restful' : ''
                    }
             });
             const result = await request.data.data.items;
             return result;
          } catch(e){
          }
      }

      async loadMessagesV2(_id){
          let result;
          try{
             var data = {};
             const request = await axios.get(config.get('baseUrlApi')+'/api/v1/messages?id='+_id, 
                {headers: {
                  'Content-Type': 'application/json;charset=UTF-8',
                  'Authorization' : 'Bearer ' + new VarStorage.getTokenBack(),
                  'x-dsi-restful' : '',
                  'x-dsi2-restful' : new VarStorage.getSite(),
                  'x-dsi3-restful' : new VarStorage.getUserId()
                }
             });
             const result = await request.data.data.items;
             return result;
          } catch(e){
          }
      }


      loadMessagesSSE(_strUrl){
          var sse = new EventSource(config.get('baseUrlApi')+'/api/v1/messages?token='+_strUrl);
          return sse;
      }

      formatDate(date){
        var __date = date.split(" ");
        var _month = __date[0].split("/");
        var _hours = __date[1];
        //console.log(_month);
        //console.log(_hours);
        var _final = _month[2]+'-'+_month[1]+'-'+_month[0]+' '+_hours;
        //console.log(date);
        //console.log(moment(date).format('YYYY-DD-MM H:m:s'));
        //var _date = date;
        return date;
      }


      getNameClient(item){
        if(typeof item.name_client == "undefined"){
           return new VarStorage().getNameClient();
        }else{
            return item.name_client;
        }
      }


      /*getName(item){
        //console.log(item);
        if(typeof item.name_client == "undefined" || item.name_client.length == 0){
           if(item.user_id != ""){
              return item.user_name;
           }else if(new VarStorage().getTokenBack()){
            return 'user';
           }else{
            return new VarStorage().getNameClient();
           }
        }else{
            return item.name_client;
        }
      }*/


      messageClient(index, item, listMessages, messagesEnd){
        return (
          <div key={index} className="contentMessageClient" ref={index == (listMessages.length - 1)  ? messagesEnd : ''}>
              <div>
                 
                 <div className="contentUser">
                        <h5>{this.getNameClient(item)}</h5>

                        {item.user_id != "" &&
                          <h5>{item.user_name}</h5>
                        }

                        <span>{moment(this.formatDate(item._created)).fromNow()}</span>
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
                              
                              {typeof item.user_id  == "undefined" &&
                                  <h5>Belisa</h5>
                              }

                              {item.user_id == "" &&
                                <h5>Belisa</h5>
                              }


                              {typeof item.user_name != "undefined" &&
                                <h5>{item.user_name}</h5>
                              }

                              <span>{moment(this.formatDate(item._created)).fromNow()}</span>
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
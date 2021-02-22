import React, { Component } from "react";
import {Modal,Button,ToggleButtonGroup,ListGroup,ToggleButton,Form,Col,InputGroup,FormControl,Row} from 'react-bootstrap';
import {Helper} from './helper';

export default class Preview extends Component {
  		constructor(props) {
		    super(props);
		    this.state = {
		    	listMessages: []
		    };
		}

		componentDidMount(){
		}

  		render() {
				
				return (
					<Row>
						<Col xs={1}>
						</Col>

						<Col xs={11}>
						    	<div className="fhgt45a4fgsl-cont-top" style={
						    		{backgroundColor: this.props.colorMain}
						    	}>  

						    		<div className="fhgt45a4fgsl-cont-top-title">
						    			{this.props.headerMessage && 
						    				<h1>{this.props.headerMessage}</h1>
						    			}

						    			{!this.props.headerMessage && 
						    				<h1>Virtual assistant</h1>
						    			}
						    		</div>            
						    		<div className="fhgt45a4fgsl-cont-top-action">              
						    			<ul>
						    				<li>
						    					<a href="#" className="minimize" title="Minimize"><span>-</span></a>
						    				</li>              
						    			</ul>            
						    		</div>          
						    	</div>

						    	{typeof this.props._type != "undefined" && this.props._type == "login" &&
							    	<div className="contPreview fhgt45a4fgsl-chat-popup">
									    	<div className="contHello">
				                                  <Form noValidate>
				                                    <div dangerouslySetInnerHTML={{__html: this.props.welcomeMessage}}></div>
				                                    <Form.Group controlId="formName">
				                                      <Form.Control autocomplete="off" required type="text" placeholder="Enter Name" />
				                                      <Form.Label >Enter Name</Form.Label>
				                                    </Form.Group>

					                                
					                                    {this.props._inputs.map((item, index) => {
						                                        if(item == 'Email'){
						                                          return (<Form.Group key={index} controlId="formEmail">
						                                                    <Form.Control autocomplete="off" required placeholder="Enter Email"/>
						                                                    <Form.Label >Enter Email</Form.Label>
						                                                  </Form.Group>);
						                                        }else if(item == 'Telephone'){
						                                          return (<Form.Group key={index} controlId="formTelephone">
						                                                    <Form.Control autocomplete="off" required placeholder="Enter Telephone"  type="text"/>
						                                                    <Form.Label >Enter Telephone</Form.Label>
						                                                  </Form.Group>);
						                                        }
					                                    })}

					                                

				                                    <div className="contentBtn">
				                                      <Button variant="outline-primary" type="submit">
				                                        Start Conversation
				                                      </Button>
				                                    </div>
				                                  </Form>
				                               	  <p className="termsRecaptcha">This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy">Privacy Policy</a> and <a href="https://policies.google.com/terms">Terms of Service</a> apply.</p>
				                           </div>
			                        </div>
			                    }


			                    {typeof this.props._type != "undefined" && this.props._type == "chat" &&
							  		<div className="contPreview">
									  		<div className="contChat">
												<div className="contentResponse">
												   
												    {this.props.listMessages.map((item, index) => {
				                                        if(item.type == '_req'){
				                                          return new Helper().messageClient(
				                                          		index, 
				                                          		item, 
				                                          		this.state.listMessages, 
				                                          		this.state.messagesEnd,
				                                          		this.props.styleConversation
				                                          );
				                                        }else if(item.type == '_res'){
				                                          return new Helper().messageResponse(
				                                            index, 
				                                            item, 
				                                            this.state.listMessages, 
				                                            this.state.messagesEnd, 
				                                            this.sendAction,
				                                            this.setMessage,
				                                            this.statusValidation,
				                                            this.inputChange,
				                                            this.inputChangeOptions,
				                                            this.updateScheduleEvents,
				                                            this.successSentForm,
				                                            this.closeSession
				                                          );
				                                        }
				                                    })}
												
												</div>
											</div>
							  		</div>
							    }
						</Col>
					</Row>
				);
  		}
}

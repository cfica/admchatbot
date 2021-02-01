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
						    	<div class="fhgt45a4fgsl-cont-top">  
						    		<div class="fhgt45a4fgsl-cont-top-title"><h1>Virtual assistant</h1></div>            
						    		<div class="fhgt45a4fgsl-cont-top-action">              
						    			<ul>
						    				<li>
						    					<a href="#" class="minimize" title="Minimize"><span>-</span></a>
						    				</li>              
						    			</ul>            
						    		</div>          
						    	</div>

						  		<div className="contPreview">
								  		<div className="contChat">
											<div className="contentResponse">
											   
											    {this.props.listMessages.map((item, index) => {
			                                        if(item.type == '_req'){
			                                          return new Helper().messageClient(
			                                          		index, 
			                                          		item, 
			                                          		this.state.listMessages, 
			                                          		this.state.messagesEnd
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
						</Col>
					</Row>
				);
  		}
}

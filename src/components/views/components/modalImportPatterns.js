import React, { Component } from "react";
import { Alert, Navbar, Nav, Tab, Modal, Badge, Tabs, InputGroup, Collapse, ButtonGroup,ListGroup, Form,NavDropdown,FormControl,Container, Row, Col,Media,Jumbotron, Button, Breadcrumbs, Table} from 'react-bootstrap';
import axios from 'axios';
import config from 'react-global-configuration';
import { browserHistory } from 'react-router';
import EditorHtml from './editorHtml';
import SingleOptions from './singleOptions';
import MultiChoices from './multiChoices';
import FormResponse from './formResponse';
import {Slide} from './slide';
import Preview from './preview';
import {Helper} from './helper';
import * as moment from 'moment';
import { CSVReader, CSVDownloader } from 'react-papaparse';
import * as Icon from 'react-bootstrap-icons';
/*https://icons.getbootstrap.com/#usage*/
import {VarStorage} from './varsStorage';

const buttonRef = React.createRef();
export default class ModalImportPatterns extends Component {
	constructor(props) {
		    super(props);

		    this.state = {
		    	showModal: true,
		    	patterns: [],
		    	client: '',
		    	scope: ['admin'].includes(new VarStorage().getScope()),
		    	validated: false
		    };
    }

    componentDidMount(){
		if(this.state.scope){
			//this.loadClients();
		}else{
			this.setState({client: new VarStorage().getSite()});
		}
	}


    handleClose = (e) => {
		this.closeModal();
    };

    closeModal(){
    	this.setState({showModal: false})
		this.props.hiddenModal();
    }


    handleOpenDialog = (e) => {
	    // Note that the ref is set async, so it might be null at some point
	    if (buttonRef.current) {
	      buttonRef.current.open(e)
	    }
	}

	handleOnFileLoad = (data) => {
	    var _items = [];
	    data.forEach(function(el, index){
	    	//console.log(el);
	    	if(el.data.length == 4 && !isNaN(el.data[0])){
	    		_items.push({
    				group: el.data[0], 
    				tag: el.data[1] ,
    				message: el.data[2], 
    				response: el.data[3]
	    		});
	    	}
	    });
		
		var groupBy = function groupBy(list, keyGetter) {
		    const map = new Map();
		    list.forEach((item) => {
		         const key = keyGetter(item);
		         const collection = map.get(key);
		         if (!collection) {
		             map.set(key, [item]);
		         } else {
		             collection.push(item);
		         }
		    });
		    return map;
		};

		const grouped = groupBy(_items, pet => pet.group);

        var _finalItems = [];
        grouped.forEach(function(el, i){
        	var _patterns = [];
        	var _responses = [];
        	var _tag = [];
        	
        	//console.log(el);

        	if(el.length > 0){
        		el.forEach(function(el1, i1){
        			//console.log(el1);
        			if(el1.message != ""){
        				_patterns.push(el1.message);
        			}

        			if(el1.response != ""){
        				_responses.push(el1.response);
        			}

        			if(el1.tag != ""){
        				_tag.push(el1.tag);
        			}
        		});
        	}else{
        		_patterns.push(el.message);
        		_responses.push(el.response);
        	}

        	_finalItems.push(
        		{tag: _tag, patterns: _patterns, responses: {type: 'Text', value: _responses}}
        	);
        });

        //console.log(_finalItems);
        this.setState({patterns: _finalItems});
	}

	handleOnError = (err, file, inputElem, reason) => {
	    console.log(err)
	}

	handleOnRemoveFile = (data) => {
	    //console.log('---------------------------')
	    //console.log(data)
	    //console.log('---------------------------')
		this.setState({patterns: []});
	}

	handleRemoveFile = (e) => {
	    // Note that the ref is set async, so it might be null at some point
	    if (buttonRef.current) {
	      buttonRef.current.removeFile(e)
	    }
	}

	submitImport = (event) =>{
		event.preventDefault();
		const form = event.currentTarget;
		if (form.checkValidity() === false) {
	      event.stopPropagation();
	      this.setState({validated : true});
	    }else{
	    	this.setState({validated : false});

	    	if(this.state.patterns.length > 0){
		    	async function _requestApi(_this, form, _url){
				    const res = await new Helper().postRequest(_url, {
				    	client: _this.state.client,
				    	items: _this.state.patterns,
				    	import: 'patterns'
				    }, 'back');

			    	form.reset();
			    	_this.setState({patterns: []});
			    	_this.closeModal();
				}

				_requestApi(this,form, config.get('baseUrlApi')+'/api/v1/import');
			}
	    }
	}


	render() {
	   return (
	   		<Modal show={this.state.showModal} dialogClassName="modal-70w" onHide={this.handleClose}>
	   		    <Form noValidate validated={this.state.validated} onSubmit={this.submitImport}>
	   				<Modal.Header closeButton>
			          <Modal.Title>Imports Patterns</Modal.Title>
			        </Modal.Header>

			        <Modal.Body>

			        	<Form.Row className="titleFragment">
						    <Col xs={6}><h2>Select File</h2></Col>
						    <Col xs={6} className="buttons options">
						    </Col>
						</Form.Row>

						<Form.Row>
							<Col xs={5}>	
								<CSVReader
							        ref={buttonRef}
							        onFileLoad={this.handleOnFileLoad}
							        onError={this.handleOnError}
							        noClick
							        noDrag
							        onRemoveFile={this.handleOnRemoveFile}
							      >
							        {({ file }) => (
							          <aside
							            style={{
							              display: 'flex',
							              flexDirection: 'row',
							              marginBottom: 15
							            }}
							          >
							            <Button
							              onClick={this.handleOpenDialog}
							              variant="outline-secondary"
							              size="sm"
							              style={{
							              	//width: '15%'
							              }}
							            >
							              Browse file
							            </Button>


							            <div
							              style={{
							                borderWidth: 1,
							                borderStyle: 'solid',
							                borderColor: '#ccc',
							                height: 45,
							                lineHeight: 2.5,
							                marginTop: 0,
							                marginBottom: 0,
							                paddingLeft: 13,
							                paddingTop: 3,
							                width: '70%'
							              }}
							            >
							              {file && file.name}
							            </div>


							            <Button
							              onClick={this.handleRemoveFile}
							              variant="outline-secondary"
							              size="sm"
							              style={{
							              	//width: '15%'
							              }}
							            >
							              <Icon.Trash size={20}/>
							            </Button>
							          </aside>
							        )}
							      </CSVReader>

							      <Alert size="sm" variant="info" style={{
							         marginTop: 10
							      }}>
							        <strong>USE ONLY FILE .CSV</strong><br/>
								    Not sure how to work with a CSV? See this <Alert.Link target="_blank" href="https://www.copytrans.net/support/how-to-open-a-csv-file-in-excel/">article</Alert.Link> for more details.
								  </Alert>

							</Col>

							<Col xs={6}>
								
								<CSVDownloader
						        data={[
						          {
						            "Group": "1",
						            "Pattern": "Hi! How are you?",
						            "Response": "Hello!"
						          },
						          {
						            "Group": "1",
						            "Pattern": "",
						            "Response": "I'm very good, thank you!"
						          },
						          {
						            "Group": "2",
						            "Pattern": "Where are you from?",
						            "Response": "I'm from chile!"
						          },
						          {
						            "Group": "3",
						            "Pattern": "Your name?",
						            "Response": "My name is Belisa! It is a pleasure to greet you."
						          },
						          {
						            "Group": "3",
						            "Pattern": "What's your name?",
						            "Response": ""
						          },
						        ]}
						        type="button"
						        filename={'filename'}
						        bom={true}
						        className="btn btn-outline-secondary"
						      >
						        <Icon.Download size={20}/> Download Format
						      </CSVDownloader>

							</Col>
						</Form.Row>


						<Form.Row className="titleFragment">
						    <Col xs={6}><h2>Preview</h2></Col>
						    <Col xs={6} className="buttons options">
						    </Col>
						</Form.Row>

						<Form.Row>
							<Col xs={12}>
								<Table striped bordered hover variant="dark">
								  <thead>
								    <tr>
								      <th>#</th>
								      <th>Tag</th>
								      <th>Message Pattern</th>
								      <th>Response</th>
								    </tr>
								  </thead>
								  <tbody>

								     {this.state.patterns.map((el, i) => {
										  return(
										  	  	<tr key={i}>
											      <td>{i}</td>

											      <td>
											      	<ol>
							                    		{el.tag}
							                    	</ol>
											      </td>

											      <td>
								                    	<ol>
								                    		{el.patterns.map((item1) => 
								                    			<li>
									                    			<span>{item1}</span>
									                    		</li>
									                    	)}
								                    	</ol>
								                    

											      </td>
											      <td>
											      	<ol>
							                    		{el.responses.value.map((item1) => 
							                    			<li>
								                    			<span>{item1}</span>
								                    		</li>
								                    	)}
							                    	</ol>
											      </td>
											    </tr>
										  );
									  })} 

									    
								  </tbody>
								</Table>
							</Col>
						</Form.Row>

			        </Modal.Body>
			        <Modal.Footer>
			          <Button variant="secondary" onClick={this.handleClose}>
			            Close
			          </Button>
			          <Button variant="primary" type="submit">
			            <Icon.CheckSquare size={20}/> Save Pattern
			          </Button>
			        </Modal.Footer>
			    </Form>
	   		</Modal>
	   );
	}
}
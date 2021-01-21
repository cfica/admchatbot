import React, { Component } from "react";
import SidebarMenu from './components/sidebar-menu';
import SidebarAction from './components/sidebar-action';
import { Alert, Navbar, Nav, Tab, Modal, Accordion, Card, Badge, DropdownButton, Dropdown, Tabs, InputGroup, Collapse, ButtonGroup,ListGroup, Form,NavDropdown,FormControl,Container, Row, Col,Media,Jumbotron, Button, Breadcrumbs, Table} from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import ModalToLearn from './components/modal-add-pattern';
import ModalToConfirm from './components/confirm';
import config from 'react-global-configuration';
import { browserHistory } from 'react-router';
import {Helper} from './components/helper';
import {VarStorage} from './components/varsStorage';
import {ConnectionSSE} from './components/connectionSSE';
import * as moment from 'moment';

export default class BaseWords extends Component {
	constructor(props) {
	    super(props);
	    if(localStorage.getItem('tokenAdm') == undefined){
	      browserHistory.push('/login');
	    }

	    this.state = {
	      scope: ['admin'].includes(localStorage.getItem('scope')),
          token: localStorage.getItem('tokenAdm'),
          user_id: localStorage.getItem('_id'),
          client: localStorage.getItem('client'),
	      error: null,
	      perPage: 50,
	      items: [],
	      offset: 0,
	      listPatterns : [],
	      showModalAddPattern: false,
	      showModalConfirm: false,
	      idPattern: 0,
	      logTraining: [],
	      clients: [],
	      validated: false,
	      clientSelected: null
	    };
	}

	loadWords() {
	    axios.get(config.get('baseUrlApi')+'/api/v1/base-words?limit='+this.state.perPage+'&offset='+this.state.offset, 
    		{headers: {'Content-Type': 'application/json;charset=UTF-8', 'Authorization' : 'Bearer ' + this.state.token}})
	    .then(res => {
	    	console.log(res.data.data.items);

	    	this.setState({
	          items: res.data.data.items,
	          pageCountWords: Math.ceil(res.data.data.total_count / res.data.data.limit),
	        });
	    });
	}

	loadPatterns() {
	    axios.get(config.get('baseUrlApi')+'/api/v1/patterns?limit='+this.state.perPage+'&offset='+this.state.offset, 
    		{headers: {'Content-Type': 'application/json;charset=UTF-8', 'Authorization' : 'Bearer ' + this.state.token}})
	    .then(res => {
	    	//console.log(res.data.data.items);
	    	this.setState({
	          listPatterns: res.data.data.items,
	          pageCountPatterns: Math.ceil(res.data.data.total_count / res.data.data.limit),
	        });
	    }).catch(function (error) {});
	}


	handlePageClickPatterns = data => {
	    let selected = data.selected;
	    let offset = Math.ceil(selected * this.state.perPage);
	    this.setState({ offset: offset }, () => {
	      this.loadPatterns();
	    });
	};

	componentDidMount(){
	    this.loadWords();
	    this.loadPatterns();
	    this.getLogTrainSSE();


	    if(this.state.scope){
	    	this.loadClients();
	    }
	}

	handlePageClickWords = data => {
	    let selected = data.selected;
	    let offset = Math.ceil(selected * this.state.perPage);
	    this.setState({ offset: offset }, () => {
	      this.loadWords();
	    });
	};

	handleShowModalAddPattern = (event)=>{
		this.setState({showModalAddPattern : true});
	}

	handleHiddenModalAddPattern = data => {
	    this.setState({showModalAddPattern : false});
	};

	
	hiddenModalConfirm = data => this.setState({showModalConfirm : false});
	handleModalConfirm = data => {
		axios.post(config.get('baseUrlApi')+'/api/v1/del-pattern', JSON.stringify({id: this.state.idPattern}), 
			{headers: {'Content-Type': 'application/json;charset=UTF-8', 'Authorization' : 'Bearer ' + this.state.token}})
	    .then(res => {
	    	this.loadPatterns();
	    	this.loadWords();
	    });
	    this.setState({showModalConfirm : false});
	}
	handleClickDelPattern(_id){
		this.setState({showModalConfirm : true});
		this.setState({idPattern : _id});
	};



	loadClients() {
		async function _requestApi(_this){
		    var _url = config.get('baseUrlApi')+'/api/v1/clients';
		    const res = await new Helper().getRequest(_url,'back');
		    //console.log(res);
		    _this.setState({clients: res.items});
		}
		_requestApi(this);
	}

	submitTrain = (event)=>{
		event.preventDefault();
		const form = event.currentTarget;
	    if (form.checkValidity() === false) {
	      event.stopPropagation();
	      this.setState({validated : true});
	    }else{
	      	this.setState({validated : false});
	      	if(this.state.scope){
	      		var _id = this.state.clientSelected; //users_api -> client_id
	      	}else{
	      		var _id = new VarStorage().getClientIdApi();
	      		//console.log(_id);
	      	}
	      	
	      	//this.getLogTrainSSE();

	      	async function _requestApi(_this, _id){
			    var _url = config.get('baseUrlApi')+'/api/v1/train?id='+_id;
			    const res = await new Helper().getRequest(_url,'back');
			}
			_requestApi(this, _id);

			
	    }
	}


	getLogTrainSSE(){
		var _url = config.get('baseUrlApi')+'/api/v1/log-training?'+"t-dsi-restful="+new VarStorage().getTokenBack();
	    var connect = new ConnectionSSE().connectionSSEV2(this, _url, {});
	}

	/*handleTrain = (event) =>{
		//alert('training chat..');
		axios.get(config.get('baseUrlApi')+'/api/v1/train', 
			{headers: {'Content-Type': 'application/json;charset=UTF-8', 'Authorization' : 'Bearer ' + this.state.token}})
	    .then(res => {
	    	//algo
	    });
	    this.loadLogTraining();
	}*/


    render() {
      return (
        <div className="wrapper">
		    <SidebarMenu/>
		    <div id="content">
	            <SidebarAction/>
	            <h2>Words Base</h2>
	            <p>You can generate question patterns that can be asked by chat.</p>
	            
	            <div className="line"></div>
	            <Jumbotron className="content-form jumbotron-sm jumbotron-right">

	            	<Form className="form-inline-train" inline noValidate validated={this.state.validated} onSubmit={this.submitTrain}>
			             {this.state.scope &&
			             	<Form.Control
							    as="select"
							    custom
							    required
							    onChange={(e) => this.setState({clientSelected: e.target.value})}
							  >
							    <option value="">Choose Client...</option>
							    
							    {this.state.clients.map((item) =>{
							    	   if(typeof item._client[0] != "undefined"){
							    		return(<option value={item._client[0].client_id}>{item.domain}</option>);
							    	
							    	   }
							    	}
							    )}
							  </Form.Control>
			             }

						<Button variant="primary" type="submit">Train</Button>{'  '}
					</Form>


					<Button variant="primary">Import Patterns</Button>{'  '}

					<Button variant="secondary" onClick={this.handleShowModalAddPattern}>Add Pattern</Button>
					
		            
		            {this.state.showModalAddPattern && 
		            	<ModalToLearn
			        	 hiddenModal = {this.handleHiddenModalAddPattern} 
			        	 patternSelected = {[]}
			        	/>
		            }

		            {this.state.logTraining.length > 0 &&
			           <div>
				           <hr/>
				            <div className="log_training">
							    <ul>
							       {this.state.logTraining.map((item, i) =>
							       		<li key={i}>> {item.client} | {item.name_log} | {item._created}</li>
							       )}
							    </ul>
							</div>
			           </div>
					}
				</Jumbotron>
				
				<Tabs defaultActiveKey="patterns">
				  <Tab eventKey="patterns" title="Patterns">
				  			<br/>
						        <div className="line"></div>
						  		<p>Patterns and responses to display to users</p>
							    <section>
						          <section>

						                
						             <Accordion defaultActiveKey="">
						                {this.state.listPatterns.map((item, index) => 

						                  <Card key={item._id.$oid} className="cont-real-time">
										    <Card.Header className="header">
											   
											    <Accordion.Toggle className="name_client" as={Button} variant="link" eventKey={index}>
											      	
											      	<ol>
						                    		{item.words_origin.map((item1) => 
							                    		<li>
							                    			<span>
									                    		{item1.map((item2) => item2 + ' ')}
								                    		</span>
							                    		</li>
							                    	)}
						                    	</ol>
											    </Accordion.Toggle>

										        {/*<DropdownButton variant="link" className="options" size="sm" as={ButtonGroup} title="Options" id="bg-nested-dropdown">
												    <Dropdown.Item eventKey="1" href={"contacts/" + item._id}>Detail</Dropdown.Item>
										   			<Dropdown.Item eventKey="2">Asign</Dropdown.Item>
												</DropdownButton>*/}

												
												<Button onClick={(e) => this.handleClickDelPattern(item._id.$oid, e)} size="sm" variant="outline-secondary">Delete</Button>
												

							                	{this.state.scope &&
						                    	item._client.map((item1) => 
							                    		<div className="domain">{item1.domain}</div>
							                    	)
								                }

												<div className="_created">{moment(item._created).fromNow()}</div>

										    </Card.Header>

										    <Accordion.Collapse eventKey={index}>
										      <Card.Body>
										      	{item.responses.type}

										      	{item.tag}

						                    	{item.responses.type == 'Text' &&
								                    <div>
								                    	<ol>
								                    		{item.responses.value.map((item1) => 
								                    			<li>
									                    			<span>{item1}</span>
									                    		</li>
									                    	)}
								                    	</ol>
								                    </div>
								                }

								                {item.responses.type == 'Html' &&
								                	<div></div>
								                }

								                {item.responses.type == 'Form' &&
								                	<div></div>
								                }

								                {item.responses.type == 'Slide' &&
								                	<div></div>
								                }

										      </Card.Body>
										    </Accordion.Collapse>
										</Card>


						                )}

						             </Accordion>


						            <div id="react-paginate">
							            <ReactPaginate
								          previousLabel={'Anterior'}
								          nextLabel={'Siguiente'}
								          breakLabel={'...'}
								          breakClassName={'break-me'}
								          pageCount={this.state.pageCountPatterns}
								          marginPagesDisplayed={2}
								          pageRangeDisplayed={5}
								          onPageChange={this.handlePageClickPatterns}
								          containerClassName={'pagination'}
								          subContainerClassName={'pages pagination'}
								          activeClassName={'active'}
								        />
							        </div>

						          </section>
						        </section>
				  </Tab>
				  <Tab eventKey="words" title="Words Library">
				  		<br/>
				        <div className="line"></div>
				  		<p>You can generate question patterns that can be asked by chat.</p>
					    <section>
				          <section>
				            
				                
				              <Accordion defaultActiveKey="">
				                {this.state.items.map((item, index) => 
				                  

				                	<Card key={item._id.$oid} className="cont-real-time">
									    <Card.Header className="header">
										   
										    <Accordion.Toggle className="name_client" as={Button} variant="link" eventKey={index}>
										      	{item.word}
										    </Accordion.Toggle>

									        {/*<DropdownButton variant="link" className="options" size="sm" as={ButtonGroup} title="Options" id="bg-nested-dropdown">
											    <Dropdown.Item eventKey="1" href={"contacts/" + item._id}>Detail</Dropdown.Item>
									   			<Dropdown.Item eventKey="2">Asign</Dropdown.Item>
											</DropdownButton>*/}

											{/*
											<Button href={"contacts/" + item._id.$oid} size="sm" variant="outline-secondary">Detail</Button>
											*/}

						                	{this.state.scope &&
					                    	item._client.map((item1) => 
						                    		<div className="domain">{item1.domain}</div>
						                    	)
							                }

											<div className="_created">{moment(item._created).fromNow()}</div>

									    </Card.Header>

									    <Accordion.Collapse eventKey={index}>
									      <Card.Body>
									      {item.tag}
									      <br/>
									      {item.category}
									      </Card.Body>
									    </Accordion.Collapse>
									</Card>

				                )}

				             </Accordion>


				            <div id="react-paginate">
					            <ReactPaginate
						          previousLabel={'Anterior'}
						          nextLabel={'Siguiente'}
						          breakLabel={'...'}
						          breakClassName={'break-me'}
						          pageCount={this.state.pageCountWords}
						          marginPagesDisplayed={2}
						          pageRangeDisplayed={5}
						          onPageChange={this.handlePageClickWords}
						          containerClassName={'pagination'}
						          subContainerClassName={'pages pagination'}
						          activeClassName={'active'}
						        />
					        </div>

				          </section>
				        </section>
				  </Tab>
				</Tabs>
				
				{this.state.showModalConfirm && 
	            	<ModalToConfirm
		        	 hiddenModal = {this.hiddenModalConfirm}
		        	 message = "Are you sure to delete this records?"
		        	 handleConfirm={this.handleModalConfirm}
		        	/>
		        }

	        </div>

	        <div className="overlay"></div>
		</div>
    );
  }
}
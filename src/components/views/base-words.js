import React, { Component } from "react";
import SidebarMenu from './components/sidebar-menu';
import SidebarAction from './components/sidebar-action';
import { Alert, Navbar, Nav, Tab, Modal, Badge, Tabs, InputGroup, Collapse, ButtonGroup,ListGroup, Form,NavDropdown,FormControl,Container, Row, Col,Media,Jumbotron, Button, Breadcrumbs, Table} from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import ModalToLearn from './components/modal-add-pattern';
import ModalToConfirm from './components/confirm';
import config from 'react-global-configuration';
import { browserHistory } from 'react-router';

export default class BaseWords extends Component {
	constructor(props) {
	    super(props);
	    if(localStorage.getItem('tokenAdm') == undefined){
	      browserHistory.push('/login');
	    }

	    this.state = {
	      error: null,
	      perPage: 50,
	      items: [],
	      offset: 0,
	      listPatterns : [],
	      showModalAddPattern: false,
	      showModalConfirm: false,
	      idPattern: 0,
	      logTraining: [],
	      token: localStorage.getItem('tokenAdm')
	    };
	}

	loadWords() {
	    axios.get(config.get('baseUrlApi')+'/api/v1/base-words?limit='+this.state.perPage+'&offset='+this.state.offset, 
    		{headers: {'Content-Type': 'application/json;charset=UTF-8', 'Authorization' : 'Bearer ' + this.state.token}})
	    .then(res => {
	    	this.setState({
	          items: res.data.data.items,
	          pageCountWords: Math.ceil(res.data.data.total_count / res.data.data.limit),
	        });
	    }).catch(function (error) {
	    	//if(error.response.status == 401){
	    	//	delete_cookie('token');
	    	//	browserHistory.push('/login');
	    	//}
		});
	}

	loadPatterns() {
	    axios.get(config.get('baseUrlApi')+'/api/v1/patterns?limit='+this.state.perPage+'&offset='+this.state.offset, 
    		{headers: {'Content-Type': 'application/json;charset=UTF-8', 'Authorization' : 'Bearer ' + this.state.token}})
	    .then(res => {
	    	this.setState({
	          listPatterns: res.data.data.items,
	          pageCountPatterns: Math.ceil(res.data.data.total_count / res.data.data.limit),
	        });
	    }).catch(function (error) {
	    	//if(error.response.status == 401){
	    	//	delete_cookie('token');
	    	//	browserHistory.push('/login');
	    	//}
		});
	}

	loadLogTraining(){
	    axios.get(config.get('baseUrlApi')+'/api/v1/log-training', 
    		{headers: {'Content-Type': 'application/json;charset=UTF-8', 'Authorization' : 'Bearer ' + this.state.token}})
	    .then(res => {
	    	this.setState({logTraining : res.data.data.items});
	    }).catch(function (error) {
	    	//if(error.response.status == 401){
	    	//	delete_cookie('token');
	    	//	browserHistory.push('/login');
	    	//}
		});

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
	    this.loadLogTraining();
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
	    }).catch(function (error) {
	    	//if(error.response.status == 401){
	    	//	delete_cookie('token');
	    	//	browserHistory.push('/login');
	    	//}
		});
	    this.setState({showModalConfirm : false});
	}
	handleClickDelPattern(_id){
		this.setState({showModalConfirm : true});
		this.setState({idPattern : _id});
	};

	handleTrain = (event) =>{
		//alert('training chat..');
		axios.get(config.get('baseUrlApi')+'/api/v1/train', 
			{headers: {'Content-Type': 'application/json;charset=UTF-8', 'Authorization' : 'Bearer ' + this.state.token}})
	    .then(res => {
	    	//algo
	    }).catch(function (error) {
	    	//if(error.response.status == 401){
	    	//	delete_cookie('token');
	    	//	browserHistory.push('/login');
	    	//}
		});
	    this.loadLogTraining();
	}

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
		            <Button variant="primary" onClick="">Import Patterns</Button>{' '}
		            
		            <Button variant="primary" onClick={this.handleTrain}>Train</Button>{' '}

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
							       {this.state.logTraining.map((item) =>
							       		<li>> {item.client} | {item.name_log} | {item._created}</li>
							       )}
							    </ul>
							</div>
			           </div>
					}

				</Jumbotron>
				<Tabs defaultActiveKey="patterns" id="uncontrolled-tab-example">
				  <Tab eventKey="patterns" title="Patterns">
				  			<br/>
						        <div className="line"></div>
						  		<p>Patterns and responses to display to users</p>
							    <section>
						          <section>
						            <Table id="itemTable" striped bordered hover size="sm">
						              <thead>
						                <tr>
						                  <th>ID</th>
						                  <th>Tag</th>
						                  <th>Patterns</th>
						                  <th>Type Response</th>
						                  <th>Responses</th>
						                  <th>Action</th>
						                </tr>
						              </thead>
						              <tbody>
						                {this.state.listPatterns.map((item) => 
						                  <tr key={item._id.$oid}>
						                    <td>#{item.code}</td>
						                    <td>{item.tag}</td>
						                    <td>
						                    	<ol>
						                    		{item.words_origin.map((item1) => 
							                    		<li>
							                    			<span>
									                    		{item1.map((item2) => item2 + ' ')}
								                    		</span>
							                    		</li>
							                    	)}
						                    	</ol>
						                    	
						                    </td>

						                    
							                <td>{item.responses.type}</td>

							                {item.responses.type == 'Text' &&
							                    <td>
							                    	<ol>
							                    		{item.responses.value.map((item1) => 
							                    			<li>
								                    			<span>{item1}</span>
								                    		</li>
								                    	)}
							                    	</ol>
							                    </td>
							                }

							                {item.responses.type == 'Html' &&
							                	<td></td>
							                }

							                {item.responses.type == 'Form' &&
							                	<td></td>
							                }

							                {item.responses.type == 'Slide' &&
							                	<td></td>
							                }

						                    <td>
						                    	<a href="#" onClick={(e) => this.handleClickDelPattern(item._id.$oid, e)}><span>Delete</span></a>
						                    </td>
						                  </tr>
						                )}
						              </tbody>
						            </Table>

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
				  <Tab eventKey="words" title="Words">
				  		<br/>
				        <div className="line"></div>
				  		<p>You can generate question patterns that can be asked by chat.</p>
					    <section>
				          <section>
				            
				            <Table id="itemTable" striped bordered hover size="sm">
				              <thead>
				                <tr>
				                  <th>ID</th>
				                  <th>Tag</th>
				                  <th>Category</th>
				                  <th>Word</th>
				                  <th></th>
				                </tr>
				              </thead>
				              <tbody>
				                {this.state.items.map((item) => 
				                  <tr key={item._id.$oid}>
				                    <td>#{item.code}</td>
				                    <td>{item.tag}</td>
				                    <td>{item.category}</td>
				                    <td>{item.word}</td>
				                    <td>
				                      {/* Here add the onClick for the action "remove it" on the span 
				                      <a href="" ><span>Bloquear</span></a> / <a href="" ><span>Aprender</span></a>*/}
				                      Algo
				                    </td>
				                  </tr>
				                )}
				              </tbody>
				            </Table>

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
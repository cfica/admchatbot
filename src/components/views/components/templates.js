import React, { Component } from "react";
import {Modal,Button,Table,Carousel,DropdownButton,Jumbotron,Dropdown,ButtonGroup,ToggleButtonGroup,ListGroup,ToggleButton,Form,Col,InputGroup,FormControl,Row} from 'react-bootstrap';
import axios from 'axios';
import config from 'react-global-configuration';
import ReactPaginate from 'react-paginate';
import {Validation, Status, RequestAsync} from './componentsUtils';
import ModalToConfirm from './confirm';
import { browserHistory } from 'react-router';
import * as Icon from 'react-bootstrap-icons';
import {Helper} from './helper';
//import { Editor } from 'react-draft-wysiwyg';
//import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
//https://jpuri.github.io/react-draft-wysiwyg/#/docs?_k=jjqinp
import EditorHtml from './editorHtml';
import * as moment from 'moment';

export class TemplateForm extends Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    	scope: ['admin'].includes(localStorage.getItem('scope')),
            token: localStorage.getItem('tokenAdm'),
            user_id: localStorage.getItem('_id'),
            client: localStorage.getItem('client'),
	    	showModal: true,
	    	validated: false,
	    	collect: {},
	    	name: '',
	    	clients: [],
	    	typeUser: this.props.typeUser,
	    	itemSelected: '',
	    	header: {headers: {'Content-Type': 'application/json;charset=UTF-8', 'Authorization' : 'Bearer ' + localStorage.getItem('tokenAdm')}},
	    	topics: [],
	    	listTags: [],
	    	detailTopic: {},
	    	actionsTopic: [
	    		{value: 'Link', title: 'Link'},
	    		{value: 'Pattern', title: 'Pattern'},
	    		{value: 'Custom', title: 'Custom'},
	    		{value: 'Contact', title: 'Contact'},
	    	],
	    	valueUseDefault: false,
	    	editorState: '',
	    	responseTypeHtml: '',
	    	subject: '',
	    	showModalConfigChatbot : false,
	    };
	}

	hiddenModalConfigChatbot = data =>{
		this.setState({showModalConfigChatbot : false});
	}

	handleClose = () => {
		this.hiddenModal();
	}

	hiddenModal(){
		this.setState({showModal: false});
		this.props.hiddenModal();
	}

	componentDidMount(){
		if(this.state.scope){
		 	this.loadClients();
		}
		
		if(this.props.idTemplate){
	        this.loadTemplate(this.props.idTemplate);
	        //this.loadListTags();
		}
	}

	loadTemplate(_id){
		(async function(_this, _id){
	      var _url = config.get('baseUrlApi')+'/api/v1/template?_id='+_id;
	      const res = await new Helper().getRequest(
	      	_url,
	      	'back'
	      );
	      _this.setState({name: res.name});
	      _this.setState({responseTypeHtml: res.template});
	      _this.setState({valueUseDefault: res.use_default});
	      _this.setState({subject: res.subject});
	      //console.log(res);
	    })(this, _id);
	}

	handleSave = (event) => {
		event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
          event.stopPropagation();
          this.setState({validated : true});
        }else{
        	this.setState({validated : false});
        	var _url = config.get('baseUrlApi')+'/api/v1/template';
        	var _dataPost = {
        		client: this.state.client,
        		name : this.state.name,
        		template : this.state.responseTypeHtml,
        		use_default: this.state.valueUseDefault,
        		subject: this.state.subject,
            };
   		    
   		    if(this.props.idTemplate){
   		    	_url = config.get('baseUrlApi')+'/api/v1/template';
   		    	_dataPost._id = this.props.idTemplate;
   		    }


   		    (async function(_this, _url, _dataPost, form){
			    if(typeof _dataPost._id != "undefined"){
			    	const res = await new Helper().putRequest(
				      	_url,
				      	_dataPost,
				      	'back'
				    );
			    }else{
			    	const res = await new Helper().postRequest(
				      	_url,
				      	_dataPost,
				      	'back'
				    );
			    }

			    


		        //_this.setState({topics: []});
   		    	//_this.setState({name: ''});
   		    	//_this.setState({textResponse: ''});
		    	//form.reset();
		    	_this.hiddenModal();
		    	//_this.props.successTemplate();
		    })(this, _url, _dataPost, form);	
        }
	}

	loadClients() {
		(async function(_this){
	      var _url = config.get('baseUrlApi')+'/api/v1/clients?limit=50&offset=0';
	      const res = await new Helper().getRequest(
	      	_url,
	      	'back'
	      );
	      _this.setState({clients: res.items});
	    })(this);
	}

	/*loadListTags() {
	    axios.get(config.get('baseUrlApi')+'/api/v1/list-tags', this.state.header)
	    .then(res => {
	    	this.setState({listTags: res.data.data.items});
	    });
	}*/

	_handleSelectClient = (event) =>{
		this.setState({client: event.target.value});
		//if(this.props.idUser){
		//	this.getUser(this.props.idUser,event.target.value);
		//}
	}

	_handleSelectTemplate = (event) =>{
		this.setState({itemSelected: event.target.value});
	}

	btnAddNewTopic = (event) =>{
		const item = {
			title: '',
			action:'',
			value:''
		}
		const items = this.state.topics;
		items.push(item);
		this.setState({topics: items});
	}

	onchageTitle = (value, index)=>{
		const items = this.state.topics;
		items[index]['title'] = value;
		this.setState({topics: items});
	}

	useDefault = () =>{
		if(!this.state.valueUseDefault){
			this.setState({valueUseDefault: true});
		}else{
			this.setState({valueUseDefault: false});
		}
	}

	_handleSelectAction = (value, index)=>{
		const items = this.state.topics;
		items[index]['action'] = value;
		this.setState({topics: items});
		if(items[index]['action'] == 'Pattern'){
			this.loadListTags();
		}
	}

	onchageValueTopic = (value, index, action)=>{
		const items = this.state.topics;
		/*if(action == 'Pattern'){
			items[index]['value'] = {
				action: action,
				value: value
			};
		}else{*/
			items[index]['value'] = value;
		//}
		this.setState({topics: items});
	}

	deleteTopic = (index) =>{
		const items = this.state.topics;
		items.splice(index, 1);
		this.setState({topics: items});
	}


	/*onEditorStateChange: Function = (editorState) => {
	    this.setState({
	      editorState,
	    });
	}*/


	dataHtml = (code) => {
		this.setState({responseTypeHtml: code});
		if(code.length > 0){
			//this.setMessagePreview(code, '_res', 'Html');
		}
	}

	render(){
		return(
			<Modal show={this.state.showModal} onHide={this.handleClose} dialogClassName="modal-90w">
		        <Form noValidate validated={this.state.validated} onSubmit={this.handleSave}>
			        <Modal.Header closeButton>
			          <Modal.Title>{this.props.idTemplate ? 'Edit Template' : 'Add Template'}</Modal.Title>
			        </Modal.Header>
			        
			        <Modal.Body>
			        		<Form.Row>
			        	        <Col xs={12}>
					        		
					        		{this.state.typeUser != 'account' && this.state.scope &&
						        		<Form.Group required controlId="clients">
										    <Form.Control placeholder="Client" required as="select" onChange={this._handleSelectClient}>
										        <option value="">Select</option>
											    {this.state.clients.map((item) => 
											      <option key={item._id.$oid} value={item._id.$oid}>{item.name}</option>
								                )}
										    </Form.Control>
										    <Form.Label>Client</Form.Label>
										 </Form.Group>
					        		}

					        		<Form.Group controlId="name">
									    <FormControl required value={this.state.name} onChange={e => this.setState({name: e.target.value})} size="sm" placeholder="Fullname"/>
									    <Form.Label>Name Template</Form.Label>
									</Form.Group>

									<Form.Group controlId="subject">
									    <FormControl required value={this.state.subject} onChange={e => this.setState({subject: e.target.value})} size="sm" placeholder="Subject"/>
									    <Form.Label>Subject</Form.Label>
									</Form.Group>

									<Form.Group controlId="text_response">
						               					
											
											{/*<Editor
											  editorState={this.state.editorState}
											  toolbarClassName="toolbarClassName"
											  wrapperClassName="wrapperClassName"
											  editorClassName="editorClassName"
											  onEditorStateChange={this.onEditorStateChange}
											/>*/}

										<EditorHtml 
										   onChangeValue={this.dataHtml} 
										   valueCode={this.state.responseTypeHtml}
										/>

									</Form.Group>

									<Form.Group controlId="useDefault"
							        style={
							        	{
							        		textAlign: 'right'
							        	}
							        }
							        >
									    <Form.Check 
										    type="switch"
										    custom
										    id="useDefault"
										    label="Use as default answer"
										    onClick={this.useDefault}
										    checked={this.state.valueUseDefault}
										/>

										{/*`Value is ${this.state.valueUseDefault}`*/}
									</Form.Group>

					    		</Col>
						    </Form.Row>
			        </Modal.Body>

			        <Modal.Footer>
			          <Button variant="secondary" onClick={this.handleClose}>
			            Close
			          </Button>
			          <Button variant="primary" type="submit">
			            Confirm
			          </Button>
			        </Modal.Footer>
			    </Form>
		    </Modal>
		);
	}
}


export default class Templates extends Component {
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
	      inputLink: '',
	      inputDescription:'',
	      validated : false,
	      imageFile: '',
	      errorSaveForm: '',
	      collect: [{link: '', description: '', imageFile: '', 'namefile':''}],
	      items: [],
	      pageCount: 10,
	      offset: 0,
	      showModalTemplate: false,
	      perPage: 10,

	      idTemplate: '',
	      showDeleteConfirm: false,
	      detailTopic: {}
	    };
	}

	componentDidMount(){
		this.loadTemplates();
	}

	handlePageClick = (e)=>{

	}

	loadTemplates() {
		(async function(_this){
	      var _url = config.get('baseUrlApi')+'/api/v1/templates?limit='+_this.state.perPage+'&offset='+_this.state.offset;
	      const res = await new Helper().getRequest(
	      	_url,
	      	'back'
	      );
	      _this.setState({items: res.items,pageCount: Math.ceil(res.total_count / res.limit)});
	    })(this);
	}

	successTemplate = ()=>{
		this.setState({showModalTemplate : false});
		this.loadTemplates();
	}

	addTemplate = (event)=>{
		this.setState({showModalTemplate : true});
		this.setState({idTemplate : ''});
	}

	hiddenEditTopic = data => {
	    this.setState({showModalTemplate : false});
	};

	edit(item){
		this.setState({showModalTemplate : true});
		this.setState({idTemplate : item._id.$oid});
	}

	/*
	delete(item){
		this.setState({idTemplate : item._id.$oid});
		this.setState({showDeleteConfirm : true});
	}

	deleteConfirm = ()=>{
	    async function _requestApi(_this, x){
	      const res = await new RequestAsync().post(
	      	'/api/v1/delete/topic',
	      	{_id: _this.state.idTemplate},
	      	{'Content-Type': 'application/json;charset=UTF-8', 'Authorization' : 'Bearer ' + _this.state.token}
	      );
	      if(typeof res.code != 'undefined'){
	        if(res.code == 200) _this.loadTemplates();
	      }
	    }
	    _requestApi(this);
	}

	deleteModalClose = ()=>{
		this.setState({showDeleteConfirm : false});
	}*/
  	
  	render() {
				return (
							<section>
								<Form.Row className="titleFragment lg">
								    <Col xs={6}><h2>Templates Emails</h2></Col>
								    <Col xs={6} className="buttons options">
								    	<Button variant="link" onClick={this.addTemplate}>Add Template<Icon.Plus size={25}/></Button>
								    </Col>
								</Form.Row>

								{this.state.showModalTemplate && 
						        	<TemplateForm 
						        		hiddenModal = {this.hiddenEditTopic} 
						        		idTemplate={this.state.idTemplate}
						        		success={this.successTemplate}
						        	/>
						        }

						        {this.state.showDeleteConfirm && 
							        <ModalToConfirm
					                   handleConfirm={this.deleteConfirm}
					                   hiddenModal={this.deleteModalClose}
					                   message="Are you sure to delete this item?"
					                />
					            }


					            <Table id="itemTable" striped bordered hover variant="dark" size="sm">
					              <thead>
					                <tr>					                 
					                  <th>Template</th>
					                </tr>
					              </thead>
					              <tbody>
					                {this.state.items.map((item) => 
					                  <tr key={item._id.$oid}>
					                    
					                   

					                    <td
					                     style = {
					                     	{Display: 'flex'}
					                     }
					                    >{item.name}{' '}<Status status={item.status}/>{' '}


					                    	<div className="table-options">
					                    		<span className="_created">{moment(new Helper().formatDate(item._created)).fromNow()}</span>
						                    	<DropdownButton className="btn-3p" as={ButtonGroup} title="...">
													<Dropdown.Item eventKey="1" onClick={(e) => this.edit(item)}>Edit</Dropdown.Item>
													{/*<Dropdown.Item eventKey="2" onClick={(e) => this.delete(item)}>Delete</Dropdown.Item>*/}
												</DropdownButton>
					                    	</div>

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
							          pageCount={this.state.pageCount}
							          marginPagesDisplayed={2}
							          pageRangeDisplayed={5}
							          onPageChange={this.handlePageClick}
							          containerClassName={'pagination'}
							          subContainerClassName={'pages pagination'}
							          activeClassName={'active'}
							        />
						        </div>
					        </section>
		  );
  	}
}

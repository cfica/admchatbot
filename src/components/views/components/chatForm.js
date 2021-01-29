import React, { Component } from "react";
import {Modal,Button,ToggleButtonGroup,ListGroup,ToggleButton,Form,Col,InputGroup,FormControl,Row} from 'react-bootstrap';
import {InputsTypeForm} from './componentsUtils';
import {Helper} from './helper';
import config from 'react-global-configuration';

export default class ChatForm extends Component {
  		constructor(props) {
		    super(props);
		    //console.log(this.props.valueForm);
		    this.state = {
		      changeTypeInput: '',
		      inputs: [],
		      textDescription: '',
		      inputSelectAction: '',
		      collect: {inputs: [], textDescription: '', actionForm:''},
		      selectTypeResponse:''
		    };
		}

		componentDidMount(){
			if(this.props.id.length > 0){
				this.getPattern(this.props.id);
			}
		}

		getPattern(_id){
	    	async function _requestApi(_this,_id){
			    var _url = config.get('baseUrlApi')+'/api/v1/pattern?id='+_id;
			    const res = await new Helper().getRequest(_url,'back');
			    _this.setState({selectTypeResponse: res.data.response.type});
			    if(_this.state.selectTypeResponse == 'Form'){
			    	_this.setState({inputs: res.data.response.value.inputs});
			    	_this.setState({textDescription: res.data.response.value.textDescription});
			    	_this.setState({actionForm: res.data.response.value.actionForm});
			    }
			}
			_requestApi(this,_id);
	    }

		changeTypeInput = (event) =>{
		  this.setState({changeTypeInput: event.target.value});
		}

		deleteInput = (_index) =>{
			const list = this.state.inputs;
		    list.splice(_index, 1);
		    this.setState({inputs: list});
		}

		inputChange = (e, index) =>{
			const { name, value } = e.target;
		    const list = this.state.inputs;
		    list[index][name] = value;
		    this.setState({inputs: list});
		    /*#*/
			const _collect = this.state.collect;
			_collect['inputs'] = list; 
			this.setState({collect: _collect});
			this.props.dataForm(this.state.collect);
		}

		addItemToList = (items,index) =>{
			const list = this.state.inputs;
		    list[index]['items'] = items;
		    this.setState({inputs: list});
		    /*#*/
			const _collect = this.state.collect;
			_collect['inputs'] = list; 
			this.setState({collect: _collect});
			this.props.dataForm(this.state.collect);
		}

		btnAddInput = () => {
			const _type = this.state.changeTypeInput;
			const _items = this.state.inputs;
			let _item = {type: _type, label : '', value: '', validation: '', items: []};
			_items.push(_item);
			this.setState({inputs: _items});
			/*#*/
			const _collect = this.state.collect;
			_collect['inputs'] = _items; 
			this.setState({collect: _collect});
			this.props.dataForm(this.state.collect);
		}

		changeActionForm = (event) =>{
			const _collect = this.state.collect;
			_collect['actionForm'] = event.target.value;
			this.setState({collect: _collect});
			this.props.dataForm(this.state.collect);
		}

		changeTextDescription = (event) => {		
			this.setState({textDescription: event.target.value});
			/*#*/
			const _collect = this.state.collect;
			_collect['textDescription'] = event.target.value; 
			this.setState({collect: _collect});
			this.props.dataForm(this.state.collect);
		}

  		render() {
				


				return (
				 <Row>
				    <Col xs={12}>
				        <Form.Row>
							<Col xs={4}>
							    <Form.Group  controlId="formBasic">
									<InputGroup className="mb-3">
									    <Form.Control placeholder="Type Input" value={this.state.selectTypeResponse} as="select" onChange={this.changeTypeInput}>
									        <option value="">Choose...</option>
									        <option value="Text">Text</option>
									        <option value="Multi-Choices">Multi Choices</option>
									        <option value="Single-Option-Choice">Single Option Choice</option>
									        <option value="TextArea">TextArea</option>
									        <option value="Schedule">Schedule</option>
									    </Form.Control>
									    <Form.Label >Type Input</Form.Label>
									    <InputGroup.Append>
									      <Button size="sm" onClick={this.btnAddInput} variant="outline-secondary">Add</Button>
									    </InputGroup.Append>
									</InputGroup>
				                    <Form.Text className="text-muted">
				                      Possible questions that the user will ask through the chat.
				                    </Form.Text>
				                 </Form.Group>
							</Col>
						</Form.Row>

						<InputsTypeForm 
							inputList={this.state.inputs} 
							inputChange={this.inputChange} 
							inputDelete={this.deleteInput}
							addItemToList={this.addItemToList}
							id = {this.props.id}
						/>

						{/*<div style={{ marginTop: 20 }}>{JSON.stringify(this.state.inputs)}</div>*/}

						<Form.Row>
							<Col xs={4}>
								<Form.Group controlId="formBasicEmail">
								    <Form.Control required as="textarea"  value={this.state.textDescription} onChange={this.changeTextDescription} placeholder="Enter Description" rows={2} />
								    
								    <Form.Label>Description Text</Form.Label>
								    <Form.Text className="text-muted">
								    	We'll never share your email with anyone else.
								    </Form.Text>
								</Form.Group>
						    </Col>



						    <Col xs={4}>
								<Form.Group controlId="formBasicEmail">
								    <Form.Control placeholder="Action Form" value={this.state.actionForm} required as="select" defaultValue="Choose..." onChange={this.changeActionForm}>
								        <option value="">Choose...</option>
								        <option value="Save-Form">Save Form</option>
								        <option value="Send-Email">Send Email</option>
								        <option value="Integration">Integration</option>
								    </Form.Control>
								    <Form.Label>Action Form</Form.Label>
								</Form.Group>
						    </Col>
						</Form.Row>
				    </Col>
			     </Row>
				);
  		}
}

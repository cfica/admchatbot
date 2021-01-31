import React, { Component } from "react";
import {Modal,Button,ToggleButtonGroup,ListGroup,ToggleButton,Form,Col,InputGroup,FormControl,Row} from 'react-bootstrap';
import {InputsTypeForm} from './componentsUtils';
import {Helper} from './helper';
import config from 'react-global-configuration';

export default class  FormResponse extends Component {
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
			this.setState({changeTypeInput: ''});
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
				 <div>
				        

						<InputsTypeForm 
							inputList={this.state.inputs} 
							inputChange={this.inputChange} 
							inputDelete={this.deleteInput}
							addItemToList={this.addItemToList}
							id = {this.props.id}
						/>

						<div className="contentInputsResponseForm addInputType">
							    <Form.Group  controlId="formBasic">
									<InputGroup className="mb-3">
									    {new Helper().getInputSelect(
											'typeinput',
									        this.changeTypeInput,
									        'Type Input',
									        false,
									        this.state.changeTypeInput,
									        null,
									        [
									        	{value: 'Text', label: 'Text'},
									        	{value: 'Multi-Choices', label: 'Multi Choices'},
									        	{value: 'Single-Option-Choice', label: 'Single Option Choice'},
									        	{value: 'TextArea', label: 'TextArea'},
									        	{value: 'Schedule', label: 'Schedule'}
									        ],
									        true
										)}

									    <Form.Label >Select Input</Form.Label>
									    <InputGroup.Append>
									      <Button size="sm" onClick={this.btnAddInput} variant="outline-secondary">Add Input</Button>
									    </InputGroup.Append>
									</InputGroup>
				                 </Form.Group>
						</div>


						{/*<div style={{ marginTop: 20 }}>{JSON.stringify(this.state.inputs)}</div>*/}

						<div>
							    {new Helper().getTextarea(
									'description',
							        this.changeTextDescription,
							        'Response comment',
							        true,
							        this.state.textDescription,
							        'Response comment'
								)}
						</div>


						<div>
						        {new Helper().getInputSelect(
									'actionform',
							        this.changeActionForm,
							        'Action Form',
							        true,
							        this.state.actionForm,
							        null,
							        [
							        	{value: 'Save-Form', label: 'Save Form'},
							        	{value: 'Send-Email', label: 'Send Email'},
							        	{value: 'Integration', label: 'Integration'}
							        ]
								)}
						</div>
				  
			     </div>
				);
  		}
}

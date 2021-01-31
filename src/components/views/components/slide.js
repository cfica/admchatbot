import React, { Component } from "react";
import {Modal,Button,Table,Carousel,ToggleButtonGroup,ListGroup,ToggleButton,Form,Col,InputGroup,FormControl,Row} from 'react-bootstrap';
import axios from 'axios';
import config from 'react-global-configuration';
import {Helper} from './helper';

export class GetSlide extends Component {
	constructor(props) {
	    super(props);
	    this.state = {
	      inputLink: '',
	      inputDescription:'',
	      validated : false,
	      imageFile: '',
	      errorSaveForm: '',
	      collect: [{link: '', description: '', imageFile: '', 'namefile':''}]
	    };
	}

	componentDidMount(){

	}

	render() {
		return (
			<div>
			    <Carousel>
			        {this.props.messageData.items.map((item, i) => {
						  return(
						  		<Carousel.Item>
								    <a href={item.link} target="new">
									    <img
									      className="d-block w-100"
									      src={config.get('baseUrlApi')+'/'+item.file}
									      alt="First slide"
									    />
								    </a>
								    <Carousel.Caption>
								      <h3>{item.title}</h3>
								      <p>{item.description}</p>
								    </Carousel.Caption>
								</Carousel.Item>
						  );
				    })}
				</Carousel>
			</div>
		);
    }
}

export class Slide extends Component {
  		constructor(props) {
		    super(props);
		    this.state = {
		      inputLink: '',
		      inputDescription:'',
		      validated : false,
		      imageFile: '',
		      errorSaveForm: '',
		      collect: {
		      	textResponse: '', 
		      	items: [{'title': '', link: '', description: '', imageFile: '', 'namefile':''}]
		      },
		      inputMessage: ''
		    };
		}

		changeInputDescription = (e)=>{
			this.setState({inputDescription: e.target.value});
		}

		changeInputLink = (e)=>{
			this.setState({inputLink: e.target.value});
		}

		handleInputChange = (e,i)=>{
			const {name, value} = e.target;
			const _collect = this.state.collect;
			_collect['items'][i][name] = value;
			this.setState({collect: _collect});
			this.props.dataSlide(_collect);
		}

		handleFileChange = (e,i)=>{
			//console.log(e.target.files[0]);
			const value = e.target.files[0];
			const _collect = this.state.collect;
			_collect['items'][i]['imageFile'] = value;
			_collect['items'][i]['namefile'] = value.name;
			this.setState({collect: _collect});
			this.props.dataSlide(_collect);
		}

		add = (e) =>{
			const item = {'title': '', link: '', description: '', imageFile: '', 'namefile': ''};
			const _collect = this.state.collect;
			_collect['items'].push(item);
			this.setState({collect: _collect});
		}

		del = (i) =>{
			const _collect = this.state.collect;
		    _collect['items'].splice(i, 1);
		    this.setState({collect: _collect});
		}

		handleChangeMessage = (e)=>{
			const _collect = this.state.collect;
			this.setState({inputMessage: e.target.value});
			_collect['textResponse'] = e.target.value;
			this.setState({collect: _collect});
		}

  		render() {
				return (
				  	<div>
				  	   
			  	    	<div>

							{new Helper().getTextarea(
								'response',
						        this.handleChangeMessage,
						        'Enter Response comment',
						        true,
						        this.state.inputMessage,
						        'Enter Response comment'
							)}

			  	    	</div>
				  	    

				  	    {this.state.collect.items.map((x, i) => {
					  		return(
					  			<Row key={i}>
									<Col xs={5}>

										{new Helper().getInputFile(
   											'imageFile',
									        e => this.handleFileChange(e, i),
									        'Choose File',
									        true,
									        this.state.collect.items[i]['namefile'],
									        '*IMPORTANT: Images must be optimized for mobile devices only.'
   										)}

								    </Col>

								   	{/*<Col xs={2}>
										<Form.Group controlId="formDescription">
										    <Form.Control required type="text" value={x.inputTitle} name="title" onChange={e => this.handleInputChange(e, i)} placeholder="Enter Title" />
										    <Form.Label>Title</Form.Label>
										    
										    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
											<Form.Control.Feedback type="invalid">Please enter a valid data.</Form.Control.Feedback>
										</Form.Group>
								    </Col>

								    <Col xs={3}>
										<Form.Group controlId="formDescription">
										    <Form.Control required type="text" value={x.inputDescription} name="description" onChange={e => this.handleInputChange(e, i)} placeholder="Enter Description" />
										    <Form.Label>Description Text</Form.Label>
										    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
											<Form.Control.Feedback type="invalid">Please enter a valid data.</Form.Control.Feedback>
										</Form.Group>
								    </Col>*/}


								    <Col xs={6}>
   										{new Helper().getInput(
   											'link',
									        e => this.handleInputChange(e, i),
									        'Link Image',
									        true,
									        x.inputLink,
									        'Link'
   										)}
								    </Col>

								    <Col xs={1}>
								    	<Button variant="outline-primary" onClick={this.add} size="lg">+</Button>{' '}
								    	{i > 0 &&
								    		<Button variant="outline-secondary" onClick={(event) => this.del(i)} size="lg">-</Button>
								    	}
								    </Col>
								</Row>
					  		);
						})}
						<div className="line"></div>
				  	</div>
				);
  		}
}

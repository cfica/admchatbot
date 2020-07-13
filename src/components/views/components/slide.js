import React, { Component } from "react";
import {Modal,Button,Table,Carousel,ToggleButtonGroup,ListGroup,ToggleButton,Form,Col,InputGroup,FormControl,Row} from 'react-bootstrap';
import axios from 'axios';
import config from 'react-global-configuration';

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
								    <a href={item.link}>
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
				  	    <Row>
				  	    	<Col xs={4}>
				  	    		<Form.Group controlId="formMessage">
								    <Form.Control required type="text" value={this.state.inputMessage} name="response" onChange={this.handleChangeMessage} placeholder="Enter Response" />
								    <Form.Label>Response Text</Form.Label>
								</Form.Group>
				  	    	</Col>
				  	    </Row>

				  	    {this.state.collect.items.map((x, i) => {
					  		return(
					  			<Row key={i}>
									<Col xs={2}>
										<Form.File 
										    id="custom-file-translate-html"
										    label="To Choose"
										    data-browse="To Choose"
										    custom
										    required
										    accept="image/x-png,image/jpeg"
										    onChange={e => this.handleFileChange(e, i)}
										    name="imageFile"
										/>
										<Form.Text className="text-muted">
									    	*IMPORTANT: Images must be optimized for mobile devices only.
									    </Form.Text>
								    </Col>

								    <Col xs={2}>
										<Form.Group controlId="formDescription">
										    <Form.Control required type="text" value={x.inputTitle} name="title" onChange={e => this.handleInputChange(e, i)} placeholder="Enter Title" />
										    <Form.Label>Title</Form.Label>
										    <Form.Text className="text-muted">
										    	Well never share your email with anyone else.
										    </Form.Text>
										</Form.Group>
								    </Col>

								    <Col xs={3}>
										<Form.Group controlId="formDescription">
										    <Form.Control required type="text" value={x.inputDescription} name="description" onChange={e => this.handleInputChange(e, i)} placeholder="Enter Description" />
										    <Form.Label>Description Text</Form.Label>
										    <Form.Text className="text-muted">
										    	Well never share your email with anyone else.
										    </Form.Text>
										</Form.Group>
								    </Col>

								    <Col xs={3}>
										<Form.Group controlId="formLink">
										    <Form.Control required type="text" value={x.inputLink} name="link" onChange={e => this.handleInputChange(e, i)} placeholder="Link" />
										    <Form.Label>Link</Form.Label>
										    <Form.Text className="text-muted">
										    	We'll never share your email with anyone else.
										    </Form.Text>
										</Form.Group>
								    </Col>

								    <Col xs={2}>
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
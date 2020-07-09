import React, { Component } from "react";
import {Modal,Button,Table,ToggleButtonGroup,ListGroup,ToggleButton,Form,Col,InputGroup,FormControl,Row} from 'react-bootstrap';
import axios from 'axios';
import config from 'react-global-configuration';

export default class Slide extends Component {
  		constructor(props) {
		    super(props);
		    this.state = {
		      inputLink: '',
		      inputDescription:'',
		      validated : false,
		      imageFile: React.createRef(),
		      errorSaveForm: '',
		      collect: [{link: '', description: '', imageFile: React.createRef()}]
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
			const list = this.state.collect;
			list[i][name] = value;
			this.setState({collect: list});
			this.props.dataSlide(list);
		}

		add = (e) =>{
			const item = {link: '', description: '', imageFile: React.createRef()};
			const list = this.state.collect;
			list.push(item);
			this.setState({collect: list});
		}

		del = (i) =>{
			const list = this.state.collect;
		    list.splice(i, 1);
		    this.setState({collect: list});
		}


  		render() {
				return (
				  	<div>
				  	    {this.state.collect.map((x, i) => {
					  		return(
					  			<Row key={i}>
									<Col xs={3}>
										<Form.File 
										    id="custom-file-translate-html"
										    label="Image (PNG/JPG)"
										    data-browse="Image (PNG/JPG)"
										    custom
										    required
										    ref={x.imageFile}
										    onChange={e => this.handleInputChange(e, i)}
										    name="imageFile"
										/>
										<Form.Text className="text-muted">
									    	*IMPORTANT: Images must be optimized for mobile devices only.
									    </Form.Text>
								    </Col>

								    <Col xs={4}>
										<Form.Group controlId="formDescription">
										    <Form.Control required type="text" value={x.inputDescription} name="description" onChange={e => this.handleInputChange(e, i)} placeholder="Enter Description" />
										    <Form.Label>Description Text</Form.Label>
										    <Form.Text className="text-muted">
										    	We'll never share your email with anyone else.
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

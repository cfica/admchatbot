import React, { Component } from "react";
import { Alert, Navbar, Nav, Tab, Modal, Badge, Tabs, InputGroup, Collapse, ButtonGroup,ListGroup, Form,NavDropdown,FormControl,Container, Row, Col,Media,Jumbotron, Button, Breadcrumbs, Table} from 'react-bootstrap';
import axios from 'axios';
import config from 'react-global-configuration';
import { bake_cookie, read_cookie, delete_cookie } from 'sfcookies';
import { browserHistory } from 'react-router';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';

export default class ModalConfChat extends Component {
  		constructor(props) {
		    super(props);
		    if(read_cookie('token') == ''){
		      browserHistory.push('/login');
		    }

		    this.state = {
		      showModal : true,
		      validated : false,
		      errorSaveForm: "",
		      token: read_cookie('token'),
		      inputDomain : '',
		      inputName : '',
		      codeInitChat: ''
		    };
		}

		handleClose = () => {
			this.setState({showModal: false});
			this.props.hiddenModal();
		}	

		componentDidMount(){
			const id_client = this.props.idSelected;
			axios.post(config.get('baseUrlApi')+'/api/v1/user-api', JSON.stringify({id: id_client}), {headers: {'Content-Type': 'application/json;charset=UTF-8', 'Authorization' : 'Bearer ' + this.state.token}})
		    .then(res => {
		    	const client_id = res.data.data.result[0].client_id;
		    	this.setState({codeInitChat : this.codeInitChat(client_id,id_client, config.get('staticFrontChat'),config.get('baseUrlApp'), 'app.min')});
		    }).catch(function (error) {
		    	console.log(error);
		    	//if(error.response.status == 401){
		    	//}
			});
		}

		handleConfirm = () => {
			this.setState({showModal: false});
			this.props.handleConfirm();
		}

		codeInitChat(client_id,id_client,staticFrontChat,baseUrl, fileName){
			const code = `
			<script type="text/javascript">
			     (function(d) {
			        window.bElisa = {};
			        bElisa.client_id = '`+client_id+`';
			        bElisa.baseStatic = '`+staticFrontChat+'/'+id_client+`';
			        bElisa.fileName = '`+fileName+`';
			        bElisa.baseApp = '`+baseUrl+`';
			        var ref = d.getElementsByTagName('script')[0];
			        var app, appId = 'app-bElisa';
			        if (d.getElementById(appId)) return;
			        app = d.createElement('script');
			        app.id = appId;
			        app.async = true;
			        app.charset='UTF-8';
			        //app.setAttribute('crossorigin','*');
			        app.src = bElisa.baseStatic+"/"+bElisa.fileName+".js";
			        ref.parentNode.insertBefore(app, ref);
			     }(document));
			</script>
			`;
			return code;
		}

		render(){
			return(
				<div className="modal-client">
		  			<Modal 
		  			       show={this.state.showModal} 
		  			       dialogClassName="modal-90w"
		  			       onHide={this.handleClose}
		  			>
					        <Modal.Header closeButton>
					          <Modal.Title>Generate Configuration</Modal.Title>
					        </Modal.Header>

					        <Modal.Body>
					        		<p>Copy and paste this code into the header inside the <strong>body</strong> tag the website.</p>
						            <div className="line"></div>
					        		<Editor
								        value={this.state.codeInitChat}
								        onValueChange={code => this.setState({ code })}
								        highlight={code => highlight(code, languages.js)}
								        padding={10}
								        style={{
								          fontFamily: '"Fira code", "Fira Mono", monospace',
								          fontSize: 12,
								        }}
								    />
					        </Modal.Body>


					        <Modal.Footer>
					          <Button variant="secondary" onClick={this.handleClose}>
					            Close
					          </Button>
					        </Modal.Footer>
				    </Modal>
			  	</div>
			);
		}
}
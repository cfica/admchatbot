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
			axios.post(config.get('baseUrlApi')+'/api/v1/user-api', JSON.stringify({id: this.props.idSelected}), {headers: {'Content-Type': 'application/json;charset=UTF-8', 'Authorization' : 'Bearer ' + this.state.token}})
		    .then(res => {
		    	const client_id = res.data.data.result[0].client_id;
		    	var _fileCss = __dirname+'/base/chat-client.css';
		    	//const _fileJs = './../../../../public/base/chat-client.js';
		    	this.cpFile(_fileCss, __dirname+'/'+client_id+'/app.css');
		    	//this.cpFile(_fileJs, process.env.PUBLIC_URL+'/'+client_id+'/app.js');
		    	this.setState({codeInitChat : this.codeInitChat(client_id, config.get('baseUrlApp'))});
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

		cpFile(file_orig, file_dest){
			//const {fs} = require('fs');
			//const fsPromises = fs.promises;
			//const {promises: fsPromises,constants: {COPYFILE_EXCL}} = fs;

			//fsPromises.copyFile('source.txt', 'destination.txt', COPYFILE_EXCL)
		    //.then(() => console.log('source.txt was copied to destination.txt'))
		    //.catch(() => console.log('The file could not be copied'));


			//fs.copyFile('source.txt', 'destination.txt')
			//.then(() => console.log('source.txt was copied to destination.txt'))
			//.catch(() => console.log('The file could not be copied'));

			//console.log
			//const copyFileSync = require('fs-copy-file-sync');
			//console.log(__dirname);
			//const fs = require('fs');
			//const path = require('path');
			//const {promisify} = require('util');
			//const fs = require('fs-copy-file');
			// destination.txt will be created or overwritten by default.
			//this.fs.copyFile('modal-client.jsx', 'modal-client.jsxx');
			//const copyFileSync = require('fs-copy-file-sync');
			//const { COPYFILE_EXCL } = copyFileSync.constants;
			//promisify.copyFile('source.txt', 'destination.txt', (err) => {
			//});
		}

		codeInitChat(client_id, url){
			const code = `
			<script type="text/javascript">
			     (function(d) {
			        window.bElisa = {};
			        bElisa.client_id = '`+client_id+`';
			        bElisa.base_url = '`+url+`';
			        var ref = d.getElementsByTagName('script')[0];
			        var app, appId = 'app-bElisa';
			        if (d.getElementById(appId)) return;
			        app = d.createElement('script');
			        app.id = appId;
			        app.async = true;
			        app.charset='UTF-8';
			        //app.setAttribute('crossorigin','*');
			        app.src = bElisa.base_url+"/`+client_id+`/app.js";
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
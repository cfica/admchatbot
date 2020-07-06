import React, { Component } from "react";
import {Modal,Button,Container,Row,Col} from 'react-bootstrap';
/****/
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-markup';
require('prismjs/components/prism-jsx');
/****/

export default class EditorHtml extends Component {
  		constructor(props) {
		    super(props);
		    const htmlTest = `<p style="color:red;padding:0px;margin:0px">
Duis aliquam elit a mi imperdiet dictum. Aliquam vel elit faucibus, porta sem eget, ultricies tellus. Fusce accumsan hendrerit nulla et sodales. Ut vestibulum ac lorem et tempor. In feugiat eu eros vitae pulvinar. <a href="#">Link</a>
</p>
<ul style="margin:0px;padding:15px">
	<li>List 1</li>
	<li>List 2</li>
	<li>List 3</li>
</ul>`;
			this.props.onChangeValue(htmlTest);
		    this.state = {};
		}
        //this.changeDomain = (event)=>{this.setState({inputDomain: event.target.value});}
  		render() {
				return (
					  <Row>
						    <Col>
						    	<h5>Editor Html</h5>
							  	<div className="contentEditor container_editor_area">
							  			<Editor
							  			    placeholder="Type some code…"
									        value={this.props.valueCode}
									        onValueChange={code => this.props.onChangeValue(code)}
									        highlight={code => highlight(code, languages.js)}
									        padding={10}
									        style={{
									          fontFamily: '"Fira code", "Fira Mono", monospace',
									          fontSize: 12,
									        }}
									        className="container__editor"
									    />
							  	</div>
						    </Col>
					  </Row>
				);
  		}
}

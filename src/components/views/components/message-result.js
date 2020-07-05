import React, { Component } from "react";
import {Alert} from 'react-bootstrap';

export default class MessageResult extends Component {
  		constructor(props) {
		    super(props);
		}

		handleClose = () => {
		}

		handleConfirm = () => {
		}

		render() {
			if(this.props.status === false){
				return (<Alert key="success" variant="success">The configuration was successfully saved,</Alert>);
			}else if(this.props.status === true){
				return (<Alert key="danger" variant="danger">An error occurred while saving the configuration.</Alert>);
      }else{
        return ('');
			}
		}
}

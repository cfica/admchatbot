import React, { Component } from "react";
import {Modal,Button} from 'react-bootstrap';

export default class ModalToConfirm extends Component {
  		constructor(props) {
		    super(props);
		    this.state = {
		      showModal : true
		    };
		}

		handleClose = () => {
			this.setState({showModal: false});
			this.props.hiddenModal();
		}

		handleConfirm = () => {
			this.setState({showModal: false});
			this.props.handleConfirm();
		}

  		render() {
				return (
				  	<div className="modal-confirm">
				  			<Modal show={this.state.showModal} onHide={this.handleClose}>
						        <Modal.Header closeButton>
						          <Modal.Title>This action needs confirmation.</Modal.Title>
						        </Modal.Header>
						        <Modal.Body>{this.props.message}</Modal.Body>
						        <Modal.Footer>
						          <Button variant="secondary" onClick={this.handleClose}>
						            Close
						          </Button>
						          <Button variant="primary" onClick={this.handleConfirm}>
						            Confirm
						          </Button>
						        </Modal.Footer>
						    </Modal>
				  	</div>
				);
  		}
}

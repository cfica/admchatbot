import React, { Component } from 'react';
import { Alert, Navbar, Nav, Modal, Collapse,Form,NavDropdown,FormControl,Container, Row, Col,Media,Jumbotron, Button, Breadcrumbs, Table} from 'react-bootstrap';
import logo from './logo.svg';
import './App.css';
import Contacts from './components/contacts';
import { BrowserRouter, Route, Switch } from 'react-router-dom';


class App extends Component {
  state = {
    contacts: []
  }

  componentDidMount() {
    fetch('http://jsonplaceholder.typicode.com/users')
    .then(res => res.json())
    .then((data) => {
      this.setState({ contacts: data })
    })
    .catch(console.log)
  }

  GetModal() {
  const [show, setShow] = React.useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Launch demo modal
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

AlertDismissible() {
  const [show, setShow] = React.useState(true);

  return (
    <>
      <Alert show={show} variant="success">
        <Alert.Heading>How's it going?!</Alert.Heading>
        <p>
          Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget
          lacinia odio sem nec elit. Cras mattis consectetur purus sit amet
          fermentum.
        </p>
        <hr />
        <div className="d-flex justify-content-end">
          <Button onClick={() => setShow(false)} variant="outline-success">
            Close me ya'll!
          </Button>
        </div>
      </Alert>

      {!show && <Button onClick={() => setShow(true)}>Show Alert</Button>}
    </>
  );
}

BtnHiddenShow() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(!open)}
        aria-controls="example-collapse-text"
        aria-expanded={open}
      >
        click
      </Button>
      <Collapse in={open}>
        <div id="example-collapse-text">
          Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus
          terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer
          labore wes anderson cred nesciunt sapiente ea proident.
        </div>
      </Collapse>
    </>
  );
}

  render() {
    return (
                <div className="App">
                <Navbar bg="light" expand="lg">
              <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                  <Nav.Link href="#home">Home</Nav.Link>
                  <Nav.Link href="/about">About</Nav.Link>
                  <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                    <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                  </NavDropdown>
                </Nav>
                <Form inline>
                  <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                  <Button variant="outline-success">Search</Button>
                </Form>
              </Navbar.Collapse>
            </Navbar>

            <Contacts contacts={this.state.contacts} />

            <this.BtnHiddenShow />
                  <this.AlertDismissible />
                  
                  <this.GetModal/>
                  <Container>
                    {/* Stack the columns on mobile by making one full-width and the other half-width */}
                    <Row>
                      <Col xs={12} md={8}>
                        xs=12 md=8
                      </Col>
                      <Col xs={6} md={4}>
                        xs=6 md=4
                      </Col>
                    </Row>

                    {/* Columns start at 50% wide on mobile and bump up to 33.3% wide on desktop */}
                    <Row>
                      <Col xs={6} md={4}>
                        xs=6 md=4
                      </Col>
                      <Col xs={6} md={4}>
                        xs=6 md=4
                      </Col>
                      <Col xs={6} md={4}>
                        xs=6 md=4
                      </Col>
                    </Row>

                    {/* Columns are always 50% wide, on mobile and desktop */}
                    <Row>
                      <Col xs={6}>xs=6</Col>
                      <Col xs={6}>xs=6</Col>
                    </Row>
                  </Container>

                  <ul className="list-unstyled">
              <Media as="li">
                <img
                  width={64}
                  height={64}
                  className="mr-3"
                  src="holder.js/64x64"
                  alt="Generic placeholder"
                />
                <Media.Body>
                  <h5>List-based media object</h5>
                  <p>
                    Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque
                    ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at,
                    tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate
                    fringilla. Donec lacinia congue felis in faucibus.
                  </p>
                </Media.Body>
              </Media>

              <Media as="li">
                <img
                  width={64}
                  height={64}
                  className="mr-3"
                  src="holder.js/64x64"
                  alt="Generic placeholder"
                />
                <Media.Body>
                  <h5>List-based media object</h5>
                  <p>
                    Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque
                    ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at,
                    tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate
                    fringilla. Donec lacinia congue felis in faucibus.
                  </p>
                </Media.Body>
              </Media>

              <Media as="li">
                <img
                  width={64}
                  height={64}
                  className="mr-3"
                  src="holder.js/64x64"
                  alt="Generic placeholder"
                />
                <Media.Body>
                  <h5>List-based media object</h5>
                  <p>
                    Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque
                    ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at,
                    tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate
                    fringilla. Donec lacinia congue felis in faucibus.
                  </p>
                </Media.Body>
              </Media>
            </ul>
                </div>
    )
  };
}





export default App;
